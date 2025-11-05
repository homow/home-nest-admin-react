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
    "image/svg+xml"
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
    api: {bodyParser: false},
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

                    // Reserve image record
                    const {data: reserveData, error: reserveErr} = await supabase.rpc("reserve_image_record", {p_hash: hash});
                    if (reserveErr) {
                        console.error("reserveErr:", reserveErr);
                        return res.status(500).json({error: "internal_error"});
                    }

                    const reserved = Array.isArray(reserveData) ? reserveData[0] : reserveData;
                    let imageRecordId = reserved.id;
                    let imagePath = reserved.path;
                    let imageUrl = reserved.url;
                    let reused = !reserved.created;

                    const originalName = (f.originalFilename || "file").toString();
                    const ext = (originalName.split(".").pop() || "bin").replace(/[^a-z0-9]/gi, "").toLowerCase();
                    const filename = `${hash}.${ext}`;
                    const path = `properties/${filename}`;

                    if (reserved.created) {
                        // Upload
                        const upload = await supabase.storage.from("img").upload(path, buffer, {cacheControl: "3600", upsert: false, contentType: mime});
                        if (upload.error) {
                            const msg = String(upload.error.message || upload.error);
                            if (!msg.includes("already exists") && !msg.includes("cannot overwrite")) {
                                console.error("Storage upload error:", upload.error);
                                return res.status(500).json({error: "upload_failed"});
                            }
                        }

                        // Get URL
                        const {data: signedData, error: signedErr} = await supabase.storage.from("img").createSignedUrl(path, 60 * 30);
                        if (!signedErr && signedData?.signedUrl) imageUrl = signedData.signedUrl;
                        else {
                            const {publicUrl} = supabase.storage.from("img").getPublicUrl(path);
                            imageUrl = publicUrl;
                        }

                        // Finalize with boolean check
                        const {data: finalizeSuccess, error: finErr} = await supabase.rpc("finalize_image_record_v2", {p_id: imageRecordId, p_path: path, p_url: imageUrl});
                        if (finErr) {
                            console.error("finalize RPC error:", finErr);
                            return res.status(500).json({error: "internal_error"});
                        }
                        if (!finalizeSuccess) {
                            console.error("finalize failed: record not updated", imageRecordId);
                            return res.status(500).json({error: "upload_finalize_failed"});
                        }
                        imagePath = path;
                    } else {
                        reused = true;
                        if (!imagePath) imagePath = path;
                        if (!imageUrl) {
                            const {data: signedData, error: signedErr} = await supabase.storage.from("img").createSignedUrl(path, 60 * 30);
                            if (!signedErr && signedData?.signedUrl) imageUrl = signedData.signedUrl;
                            else {
                                const {publicUrl} = supabase.storage.from("img").getPublicUrl(path);
                                imageUrl = publicUrl;
                            }
                        }
                    }

                    // Link to property_images
                    const {data: existingLink} = await supabase.from("property_images").select("id,is_main").match({property_id, image_record_id: imageRecordId}).limit(1).maybeSingle();

                    if (!existingLink) {
                        const shouldSetMain = entry.field === "main_image" || main_flag;
                        if (shouldSetMain) await supabase.from("property_images").update({is_main: false}).eq("property_id", property_id).eq("is_main", true);

                        const linkInsert = await supabase.from("property_images").insert({property_id, image_record_id: imageRecordId, is_main: shouldSetMain}).select().maybeSingle();
                        if (linkInsert.error) {
                            console.error("linkInsert.error:", linkInsert.error);
                            return res.status(500).json({error: "internal_error"});
                        }

                        results.push({id: linkInsert.data.id, image_record_id: imageRecordId, path: imagePath, url: imageUrl, is_main: linkInsert.data.is_main, reused});
                    } else {
                        const shouldSetMain = entry.field === "main_image" || main_flag;
                        if (shouldSetMain && !existingLink.is_main) {
                            await supabase.from("property_images").update({is_main: false}).eq("property_id", property_id).eq("is_main", true);
                            await supabase.from("property_images").update({is_main: true}).eq("id", existingLink.id);
                        }
                        results.push({id: existingLink.id, image_record_id: imageRecordId, path: imagePath, url: imageUrl, is_main: existingLink?.is_main || shouldSetMain, reused: true});
                    }
                }

                // Update properties.images and main_image
                const urls = results.map((r) => r.url);
                if (urls.length > 0) {
                    const {data: prop, error: propErr} = await supabase.from("properties").select("images").eq("id", property_id).maybeSingle();
                    if (propErr) {
                        console.error("properties select error:", propErr);
                        return res.status(500).json({error: "internal_error"});
                    }
                    if (!prop) return res.status(404).json({error: "property_not_found"});

                    const existingImages = Array.isArray(prop.images) ? prop.images : [];
                    const newImages = existingImages.concat(urls);
                    const main = results.find((r) => r.is_main);
                    const updatePayload = {images: newImages};
                    if (main) updatePayload.main_image = main.url;

                    const upd = await supabase.from("properties").update(updatePayload).eq("id", property_id);
                    if (upd.error) {
                        console.error("properties update error:", upd.error);
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
