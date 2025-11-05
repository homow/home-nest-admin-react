import {IncomingForm} from "formidable";
import fs from "fs/promises";
import supabaseServer from "./config/supabaseServer.js";

const supabase = supabaseServer();

const MAX_FILE_SIZE = 3 * 1024 * 1024;
const ALLOWED_MIMES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
    "image/heic",
    "image/heif",
    "image/gif",
    "image/svg+xml",
];

function isUuid(v) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

async function sha256Hex(buffer) {
    const buf = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    const hash = await crypto.subtle.digest("SHA-256", buf);
    const arr = Array.from(new Uint8Array(hash));
    return arr.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function streamToBuffer(stream) {
    return new Promise((res, rej) => {
        const chunks = [];
        stream.on("data", (c) => chunks.push(Buffer.from(c)));
        stream.on("end", () => res(Buffer.concat(chunks)));
        stream.on("error", rej);
    });
}

export const config = {
    api: {
        bodyParser: false
    }
};

export default async function handler(req, res) {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({error: "method_not_allowed"});
        }

        const form = new IncomingForm({multiples: true, maxFileSize: MAX_FILE_SIZE});
        await form.parse(req, async (err, fields, files) => {
            try {
                if (err) return res.status(400).json({error: "invalid_form"});

                const property_id = String(fields?.property_id || "");
                const main_flag = String(fields?.is_main || "false") === "true";
                if (!property_id || !isUuid(property_id)) {
                    return res.status(400).json({error: "invalid_property_id"});
                }

                const fileEntries = [];
                if (files?.main_image) {
                    const f = Array.isArray(files.main_image) ? files.main_image[0] : files.main_image;
                    fileEntries.push({field: "main_image", file: f});
                }
                if (files?.images) {
                    const img = Array.isArray(files.images) ? files.images : [files.images];
                    for (const f of img) fileEntries.push({field: "images", file: f});
                }

                if (fileEntries.length === 0) {
                    return res.status(400).json({error: "no_files"});
                }

                const results = [];

                for (const entry of fileEntries) {
                    const f = entry.file;
                    const mime = f.mimetype || "application/octet-stream";
                    if (!ALLOWED_MIMES.includes(mime)) {
                        return res.status(400).json({error: "file_type_not_allowed"});
                    }

                    let buffer;
                    if (f.filepath) {
                        buffer = await fs.readFile(f.filepath);
                    } else if (f?._readable) {
                        buffer = await streamToBuffer(f._readable);
                    } else {
                        return res.status(400).json({error: "invalid_file_source"});
                    }

                    if (buffer.byteLength === 0 || buffer.byteLength > MAX_FILE_SIZE) {
                        return res.status(400).json({error: "file_size_invalid"});
                    }

                    const hash = await sha256Hex(new Uint8Array(buffer));

                    const {data: reserveData, error: reserveErr} = await supabase.rpc("reserve_image_record", {p_hash: hash});
                    if (reserveErr) {
                        console.error("reserve_image_record rpc error:", reserveErr);
                        if (reserveErr?.code === "P0001" || String(reserveErr?.message || "").toLowerCase().includes("permission")) {
                            return res.status(403).json({error: "forbidden"});
                        }
                        return res.status(500).json({error: "internal_error"});
                    }

                    // adapt to new RPC shape (out_id/out_path/out_url/created)
                    const reservedRow = Array.isArray(reserveData) ? reserveData[0] : reserveData;
                    if (!reservedRow || !reservedRow?.out_id) {
                        console.error("reserve_image_record returned unexpected:", reserveData);
                        return res.status(500).json({error: "reserve_failed"});
                    }

                    let imageRecordId = reservedRow.out_id;
                    let imagePath = reservedRow?.out_path || "";
                    let imageUrl = reservedRow?.out_url || "";
                    let reused = reservedRow?.created === false;
                    // if created is true then we need to upload; if false, it's reused

                    const originalName = (f.originalFilename || "file").toString();
                    const ext = (originalName.split(".").pop() || "bin").replace(/[^a-z0-9]/gi, "").toLowerCase();
                    const filename = `${hash}.${ext}`;
                    const path = `properties/${filename}`;

                    if (reservedRow.created === true) {
                        // Upload to storage
                        const upload = await supabase.storage.from("img").upload(path, buffer, {
                            cacheControl: "3600",
                            upsert: false,
                            contentType: mime,
                        });

                        if (upload.error) {
                            const msg = String(upload.error.message || upload.error || "");
                            if (msg.includes("already exists") || msg.includes("cannot overwrite")) {
                                reused = true;
                            } else {
                                console.error("Storage upload error:", upload.error);
                                return res.status(500).json({error: "upload_failed"});
                            }
                        }

                        // get URL
                        try {
                            const {data: signedData, error: signedErr} = await supabase.storage.from("img").createSignedUrl(path, 60 * 30);
                            if (!signedErr && signedData?.signedUrl) imageUrl = signedData.signedUrl;
                            else {
                                const {publicUrl} = supabase.storage.from("img").getPublicUrl(path);
                                imageUrl = publicUrl;
                            }
                        } catch (e) {
                            console.error("storage url error:", e);
                            const {publicUrl} = supabase.storage.from("img").getPublicUrl(path);
                            imageUrl = publicUrl;
                        }

                        // finalize in DB (assumes finalize_image_record_v2 updates path/url)
                        const {data: finalizeData, error: finErr} = await supabase.rpc("finalize_image_record_v2", {
                            p_id: imageRecordId,
                            p_path: path,
                            p_url: imageUrl,
                        });

                        if (finErr) {
                            console.error("finalize_image_record_v2 error:", finErr);
                            return res.status(500).json({error: "internal_error"});
                        }
                        if (!finalizeData) {
                            console.error("finalize returned falsy:", finalizeData);
                            return res.status(500).json({error: "upload_finalize_failed"});
                        }

                        imagePath = path;
                    } else {
                        // existing: ensure URL available
                        reused = true;
                        if (!imagePath) imagePath = path;
                        if (!imageUrl) {
                            try {
                                const {data: signedData, error: signedErr} = await supabase.storage.from("img").createSignedUrl(path, 60 * 30);
                                if (!signedErr && signedData?.signedUrl) imageUrl = signedData.signedUrl;
                                else {
                                    const {publicUrl} = supabase.storage.from("img").getPublicUrl(path);
                                    imageUrl = publicUrl;
                                }
                            } catch (e) {
                                console.error("storage get url error:", e);
                                const {publicUrl} = supabase.storage.from("img").getPublicUrl(path);
                                imageUrl = publicUrl;
                            }
                        }
                    }

                    // Link to property_images (ensure single insert)
                    const {data: existingLink, error: linkErr} = await supabase
                        .from("property_images")
                        .select("id,is_main")
                        .match({property_id, image_record_id: imageRecordId})
                        .limit(1)
                        .maybeSingle();

                    if (linkErr) {
                        console.error("property_images select error:", linkErr);
                        return res.status(500).json({error: "internal_error"});
                    }

                    const shouldSetMain = entry.field === "main_image" || main_flag;

                    if (!existingLink) {
                        if (shouldSetMain) {
                            const {error: unsetErr} = await supabase
                                .from("property_images")
                                .update({is_main: false})
                                .eq("property_id", property_id)
                                .eq("is_main", true);
                            if (unsetErr) {
                                console.error("failed to unset previous main:", unsetErr);
                                return res.status(500).json({error: "internal_error"});
                            }
                        }

                        const {data: linkInsertData, error: linkInsertErr} = await supabase
                            .from("property_images")
                            .insert({property_id, image_record_id: imageRecordId, is_main: shouldSetMain})
                            .select()
                            .maybeSingle();

                        if (linkInsertErr) {
                            console.error("linkInsert.error:", linkInsertErr);
                            return res.status(500).json({error: "internal_error"});
                        }

                        results.push({
                            id: linkInsertData.id,
                            image_record_id: imageRecordId,
                            path: imagePath,
                            url: imageUrl,
                            is_main: linkInsertData.is_main,
                            reused,
                        });
                    } else {
                        if (shouldSetMain && !existingLink.is_main) {
                            const {error: unsetErr} = await supabase
                                .from("property_images")
                                .update({is_main: false})
                                .eq("property_id", property_id)
                                .eq("is_main", true);
                            if (unsetErr) {
                                console.error("failed to unset previous main:", unsetErr);
                                return res.status(500).json({error: "internal_error"});
                            }
                            const {error: setErr} = await supabase.from("property_images").update({is_main: true}).eq("id", existingLink.id);
                            if (setErr) {
                                console.error("failed to set main:", setErr);
                                return res.status(500).json({error: "internal_error"});
                            }
                        }
                        results.push({
                            id: existingLink.id,
                            image_record_id: imageRecordId,
                            path: imagePath,
                            url: imageUrl,
                            is_main: existingLink?.is_main || shouldSetMain,
                            reused: true,
                        });
                    }
                } // end loop

                // Update properties.images and main_image
                const urls = results.map((r) => r.url).filter(Boolean);
                if (urls.length > 0) {
                    const {data: prop, error: propErr} = await supabase.from("properties").select("images").eq("id", property_id).maybeSingle();
                    if (propErr) {
                        console.error("properties select error:", propErr);
                        return res.status(500).json({error: "internal_error"});
                    }
                    if (!prop) return res.status(404).json({error: "property_not_found"});

                    const existingImages = Array.isArray(prop.images) ? prop.images : [];
                    // avoid duplicates
                    const newImages = existingImages.concat(urls).filter((v, i, a) => a.indexOf(v) === i);

                    const main = results.find((r) => r.is_main);
                    const updatePayload = {images: newImages};
                    if (main) updatePayload.main_image = main.url;

                    const {error: updErr} = await supabase.from("properties").update(updatePayload).eq("id", property_id);
                    if (updErr) {
                        console.error("properties update error:", updErr);
                        return res.status(500).json({error: "internal_error"});
                    }
                }

                return res.status(200).json({status: "ok", results});
            } catch (e) {
                console.error("Internal Error:", e);
                return res.status(500).json({error: "internal_error"});
            }
        });
    } catch (e) {
        console.error("Top-level Error:", e);
        return res.status(500).json({error: "internal_error"});
    }
}