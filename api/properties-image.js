import { formidable } from 'formidable';
import fs from 'fs';
import crypto from 'crypto';
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
        const form = formidable({ maxFileSize: MAX_BYTES });

        const {fields, files} = await new Promise((resolve, reject) =>
            form.parse(req, (err, fields, files) => {
                if (err) return reject(err);
                return resolve({fields, files});
            })
        );

        const allFiles = [];
        if (files.main_image) allFiles.push(...(Array.isArray(files.main_image) ? files.main_image : [files.main_image]));
        if (files.images) allFiles.push(...(Array.isArray(files.images) ? files.images : [files.images]));

        for (const f of allFiles) {
            const size = f.size || f.length || 0;
            if (size > MAX_BYTES) {
                try {
                    allFiles.forEach(ff => fs.unlinkSync(ff.filepath || ff.path));
                    // eslint-disable-next-line
                } catch (e) {}
                return res.status(413).json({error: 'FILE_TOO_LARGE', detail: `${f.originalFilename || f.name} exceeds 3 MB`});
            }
        }

        const s = supabaseServer(); // service role client for storage operations

        const payload = jwt.decode(token);
        const userId = payload?.sub || payload?.user_id || null;
        if (!userId) return res.status(400).json({error: 'Invalid token payload'});

        const uploaded = [];

        async function processFile(fileObj) {
            const tmpPath = fileObj.filepath || fileObj.path;
            const buffer = fs.readFileSync(tmpPath);
            const hash = crypto.createHash('sha256').update(buffer).digest('hex');

            // check existing by hash
            const apiUrl = `${process.env.SUPABASE_URL}/rest/v1/image_records?hash=eq.${encodeURIComponent(hash)}&select=path,url`;
            const lookup = await fetch(apiUrl, {
                method: 'GET',
                headers: {apikey: process.env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`}
            });
            if (!lookup.ok) throw new Error('IMAGE_LOOKUP_FAILED');
            const arr = await lookup.json();
            if (Array.isArray(arr) && arr.length > 0) {
                return {path: arr[0].path, url: arr[0].url, hash};
            }

            // upload new
            const original = fileObj.originalFilename || fileObj.name || `file-${Date.now()}`;
            const ext = (original.split('.').pop() || 'jpg').toLowerCase();
            const filename = `properties/${fields.property_id ? fields.property_id : 'shared'}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
            const {error: upErr} = await s.storage.from(BUCKET).upload(filename, buffer, {
                contentType: fileObj.mimetype || undefined,
                upsert: false,
            });
            if (upErr) throw upErr;

            const {data: publicData} = s.storage.from(BUCKET).getPublicUrl(filename);
            let url;
            if (publicData?.publicUrl) url = publicData.publicUrl;
            else {
                const {data: signedData, error: signErr} = await s.storage.from(BUCKET).createSignedUrl(filename, 60 * 60);
                if (signErr) throw signErr;
                url = signedData.signedUrl;
            }

            // insert record with hash
            const insertRes = await fetch(`${process.env.SUPABASE_URL}/rest/v1/image_records`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
                    apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify([{property_id: fields.property_id || null, path: filename, url, is_main: false, owner_id: userId, hash}])
            });
            if (!insertRes.ok) {
                // cleanup uploaded file
                await s.storage.from(BUCKET).remove([filename]).catch(() => {
                });
                const txt = await insertRes.text();
                throw new Error(`DB_INSERT_FAILED: ${txt}`);
            }

            return {path: filename, url, hash};
        }

        if (files.main_image) {
            const f = Array.isArray(files.main_image) ? files.main_image[0] : files.main_image;
            const resFile = await processFile(f);
            // update property main_image
            await fetch(`${process.env.SUPABASE_URL}/rest/v1/properties?id=eq.${encodeURIComponent(fields.property_id)}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
                    apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify({main_image: resFile.url})
            });
            uploaded.push({field: 'main_image', ...resFile});
        }

        if (files.images) {
            const images = Array.isArray(files.images) ? files.images : [files.images];
            // fetch current images
            const propResp = await fetch(`${process.env.SUPABASE_URL}/rest/v1/properties?id=eq.${encodeURIComponent(fields.property_id)}&select=images`, {
                method: 'GET',
                headers: {apikey: process.env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`}
            });
            const propArr = propResp.ok ? await propResp.json() : [];
            const currentImages = Array.isArray(propArr) && propArr[0] && Array.isArray(propArr[0].images) ? propArr[0].images : [];

            for (const img of images) {
                const resFile = await processFile(img);
                if (!currentImages.includes(resFile.url)) currentImages.push(resFile.url);
                uploaded.push({field: 'images', ...resFile});
            }

            // update images array
            await fetch(`${process.env.SUPABASE_URL}/rest/v1/properties?id=eq.${encodeURIComponent(fields.property_id)}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
                    apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify({images: currentImages})
            });
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

        return res.status(200).json({ok: true, uploaded});
    } catch (err) {
        if (err && (err.code === 'LIMIT_FILE_SIZE' || (err.message && err.message.includes('maxFileSize')))) {
            return res.status(413).json({error: 'FILE_TOO_LARGE', detail: 'Max file size is 3 MB'});
        }
        return res.status(500).json({error: err.message || 'upload failed'});
    }
}