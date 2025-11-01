import formidable from 'formidable';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import supabaseServer from './config/supabaseServer.js';

const BUCKET = process.env.SUPABASE_BUCKET_IMAGE_PROPERTIES || 'public';
const MAX_BYTES = 3 * 1024 * 1024; // 3 MB

export const config = {api: {bodyParser: false}};

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({error: 'Method not allowed'});

    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    if (!token) return res.status(401).json({error: 'Missing token'});

    try {
        const form = new formidable.IncomingForm({maxFileSize: MAX_BYTES});

        const {fields, files} = await new Promise((resolve, reject) =>
            form.parse(req, (err, fields, files) => {
                if (err) return reject(err);
                return resolve({fields, files});
            })
        );

        // secondary validation: ensure each file is <= MAX_BYTES
        const allFiles = [];
        if (files.main_image) allFiles.push(...(Array.isArray(files.main_image) ? files.main_image : [files.main_image]));
        if (files.images) allFiles.push(...(Array.isArray(files.images) ? files.images : [files.images]));

        for (const f of allFiles) {
            const size = f.size || f.length || 0;
            if (size > MAX_BYTES) {
                // cleanup temp files
                try {
                    allFiles.forEach(ff => fs.unlinkSync(ff.filepath || ff.path));
                    // eslint-disable-next-line
                } catch (e) {}
                return res.status(413).json({error: 'FILE_TOO_LARGE', detail: `${f.originalFilename || f.name} exceeds 3 MB`});
            }
        }

        const s = supabaseServer(); // service role client for storage operations

        // Decode token safely
        const payload = jwt.decode(token);
        const userId = payload?.sub || payload?.user_id || null;
        if (!userId) return res.status(400).json({error: 'Invalid token payload'});

        const uploaded = [];

        async function uploadAndReturn(fileObj) {
            const tmpPath = fileObj.filepath || fileObj.path;
            const original = fileObj.originalFilename || fileObj.name || `file-${Date.now()}`;
            const ext = (original.split('.').pop() || 'jpg').toLowerCase();
            const prefix = `/properties${fields.property_id ? `/${fields.property_id}` : ''}`;
            const filename = `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
            const buffer = fs.readFileSync(tmpPath);

            const {error: upErr} = await s.storage.from(BUCKET).upload(filename, buffer, {
                contentType: fileObj.mimetype || undefined,
                upsert: false,
            });
            if (upErr) throw upErr;

            const {data: publicData} = s.storage.from(BUCKET).getPublicUrl(filename);
            if (publicData?.publicUrl) return {path: filename, url: publicData.publicUrl};

            const {data: signedData, error: signErr} = await s.storage.from(BUCKET).createSignedUrl(filename, 60 * 60);
            if (signErr) throw signErr;
            return {path: filename, url: signedData.signedUrl};
        }

        // handle main_image and images
        if (files.main_image) {
            const f = Array.isArray(files.main_image) ? files.main_image[0] : files.main_image;
            uploaded.push({field: 'main_image', ...(await uploadAndReturn(f))});
        }
        if (files.images) {
            const images = Array.isArray(files.images) ? files.images : [files.images];
            for (const img of images) uploaded.push({field: 'images', ...(await uploadAndReturn(img))});
        }

        // insert rows into image_records using user's JWT
        const rows = uploaded.map(u => ({
            property_id: fields.property_id || null,
            path: u.path,
            url: u.url,
            is_main: u.field === 'main_image',
            owner_id: userId
        }));

        const apiUrl = `${process.env.SUPABASE_URL}/rest/v1/image_records`;
        const resp = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(rows)
        });
        const respData = await resp.json();
        if (!resp.ok) {
            return res.status(resp.status).json({error: respData});
        }

        // cleanup temp files
        try {
            const all = [];
            if (files.main_image) all.push(...(Array.isArray(files.main_image) ? files.main_image : [files.main_image]));
            if (files.images) all.push(...(Array.isArray(files.images) ? files.images : [files.images]));
            all.forEach(f => {
                try {
                    fs.unlinkSync(f.filepath || f.path);
                    // eslint-disable-next-line
                } catch (e) {}
            });
            // eslint-disable-next-line
        } catch (e) {}

        return res.status(200).json({ok: true, uploaded: respData});
    } catch (err) {
        // formidable returns error.code === 'LIMIT_FILE_SIZE' on overflow
        if (err && (err.code === 'LIMIT_FILE_SIZE' || (err.message && err.message.includes('maxFileSize')))) {
            return res.status(413).json({error: 'FILE_TOO_LARGE', detail: 'Max file size is 3 MB'});
        }
        return res.status(500).json({error: err.message || 'upload failed'});
    }
}