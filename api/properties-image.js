import {randomUUID} from "node:crypto";
import {IncomingForm} from "formidable";
import fs from "fs/promises";
import supabaseServer from "./config/supabaseServer.js";

const supabase = supabaseServer();

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp"];

function isUuid(v) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

async function sha256Hex(buffer) {
    const hash = await crypto.subtle.digest("SHA-256", buffer);
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

                    // check existing image_record by hash
                    const {data: existing, error: fetchErr} = await supabase
                        .from("image_records")
                        .select("id,path,url")
                        .eq("hash", hash)
                        .limit(1)
                        .maybeSingle();

                    if (fetchErr) return fetchErr;

                    let imageRecordId;
                    let imagePath;
                    let imageUrl;
                    let reused = false;

                    if (existing) {
                        reused = true;
                        imageRecordId = existing.id;
                        imagePath = existing.path;
                        imageUrl = existing.url;
                    } else {
                        const originalName = (f.originalFilename || "file").toString();
                        const ext = (originalName.split(".").pop() || "bin")
                            .replace(/[^a-z0-9]/gi, "")
                            .toLowerCase();
                        const filename = `${Date.now()}-${randomUUID()}.${ext}`;
                        const path = `properties/${property_id}/${filename}`;

                        const upload = await supabase.storage.from("img").upload(path, buffer, {
                            cacheControl: "3600",
                            upsert: false,
                            contentType: mime,
                        });
                        if (upload.error) return upload.error;

                        const {data: signedData, error: signedErr} = await supabase.storage
                            .from("img")
                            .createSignedUrl(path, 60 * 30);

                        if (signedErr || !signedData) {
                            const {publicUrl} = supabase.storage.from("img").getPublicUrl(path);
                            imageUrl = publicUrl;
                        } else {
                            imageUrl = signedData.signedUrl;
                        }

                        const ins = await supabase
                            .from("image_records")
                            .insert({hash, path, url: imageUrl})
                            .select()
                            .maybeSingle();

                        if (ins.error) {
                            await supabase.storage.from("img").remove([path]);
                            const {data: existing2} = await supabase
                                .from("image_records")
                                .select("id,path,url")
                                .eq("hash", hash)
                                .limit(1)
                                .maybeSingle();
                            if (!existing2) return ins.error;
                            imageRecordId = existing2.id;
                            imagePath = existing2.path;
                            imageUrl = existing2.url;
                            reused = true;
                        } else {
                            imageRecordId = ins.data.id;
                            imagePath = path;
                        }
                    }

                    // insert into property_images if not exists
                    const {data: existingLink} = await supabase
                        .from("property_images")
                        .select("id,is_main")
                        .match({property_id, image_record_id: imageRecordId})
                        .limit(1)
                        .maybeSingle();

                    if (!existingLink) {
                        const shouldSetMain = entry.field === "main_image" || main_flag;
                        if (shouldSetMain) {
                            await supabase
                                .from("property_images")
                                .update({is_main: false})
                                .eq("property_id", property_id)
                                .eq("is_main", true);
                        }

                        const linkInsert = await supabase
                            .from("property_images")
                            .insert({
                                property_id,
                                image_record_id: imageRecordId,
                                is_main: shouldSetMain,
                            })
                            .select()
                            .maybeSingle();

                        if (linkInsert.error) return linkInsert.error;

                        results.push({
                            id: linkInsert.data.id,
                            image_record_id: imageRecordId,
                            path: imagePath,
                            url: imageUrl,
                            is_main: linkInsert.data.is_main,
                            reused,
                        });
                    } else {
                        const shouldSetMain = entry.field === "main_image" || main_flag;
                        if (shouldSetMain && !existingLink.is_main) {
                            await supabase
                                .from("property_images")
                                .update({is_main: false})
                                .eq("property_id", property_id)
                                .eq("is_main", true);
                            await supabase
                                .from("property_images")
                                .update({is_main: true})
                                .eq("id", existingLink.id);
                        }

                        results.push({
                            id: existingLink.id,
                            image_record_id: imageRecordId,
                            path: imagePath,
                            url: imageUrl,
                            is_main: existingLink.is_main || shouldSetMain,
                            reused: true,
                        });
                    }
                }

                // Update properties.images and main_image
                const urls = results.map((r) => r.url);
                if (urls.length > 0) {
                    const {data: prop} = await supabase
                        .from("properties")
                        .select("images")
                        .eq("id", property_id)
                        .maybeSingle();

                    if (!prop) return res.status(404).json({error: "property_not_found"});

                    const existingImages = Array.isArray(prop.images) ? prop.images : [];
                    const newImages = existingImages.concat(urls);
                    const main = results.find((r) => r.is_main);
                    const updatePayload = {images: newImages};
                    if (main) updatePayload.main_image = main.url;

                    const upd = await supabase
                        .from("properties")
                        .update(updatePayload)
                        .eq("id", property_id);

                    if (upd.error) return upd.error;
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
