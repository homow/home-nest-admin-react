import formidable from 'formidable';
import fs from 'fs';
import supabaseServer from '../supabaseServer.js';

const BUCKET = process.env.SUPABASE_BUCKET || 'public';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({error: 'Method not allowed'});

    try {
        const form = new formidable.IncomingForm();
        const {fields, files} = await new Promise((resolve, reject) =>
            form.parse(req, (err, fields, files) => (err ? reject(err) : resolve({fields, files})))
        );

        const s = supabaseServer(); // service role
        const propertyId = fields.property_id || null;

        const uploaded = [];

        async function uploadAndReturn(fileObj) {
            const tmpPath = fileObj.filepath || fileObj.path;
            const original = fileObj.originalFilename || fileObj.name || `file-${Date.now()}`;
            const ext = (original.split('.').pop() || 'jpg').toLowerCase();
            const basePrefix = 'img/public/properties';
            const prefix = propertyId ? `${basePrefix}/${propertyId}` : basePrefix;
            const filename = `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

            const stream = fs.createReadStream(tmpPath);

            const {error} = await s.storage.from(BUCKET).upload(filename, stream, {
                contentType: fileObj.mimetype || undefined,
                upsert: false,
            });
            if (error) throw error;

            const {data: publicData} = s.storage.from(BUCKET).getPublicUrl(filename);
            if (publicData && publicData.publicUrl) {
                return {path: filename, url: publicData.publicUrl};
            }

            const {data: signedData, error: signErr} = await s.storage.from(BUCKET).createSignedUrl(filename, 60 * 60);
            if (signErr) throw signErr;
            return {path: filename, url: signedData.signedUrl};
        }

        if (files.main_image) {
            const f = Array.isArray(files.main_image) ? files.main_image[0] : files.main_image;
            uploaded.push({field: 'main_image', ...(await uploadAndReturn(f))});
        }

        if (files.images) {
            const imgs = Array.isArray(files.images) ? files.images : [files.images];
            for (const img of imgs) {
                uploaded.push({field: 'images', ...(await uploadAndReturn(img))});
            }
        }

        // cleanup temp
        try {
            const all = [];
            if (files.main_image) all.push(...(Array.isArray(files.main_image) ? files.main_image : [files.main_image]));
            if (files.images) all.push(...(Array.isArray(files.images) ? files.images : [files.images]));
            all.forEach(f => {
                try {
                    fs.unlinkSync(f.filepath || f.path);
                } catch (e) {
                }
            });
        } catch (e) {
        }

        return res.status(200).json({ok: true, uploaded});
    } catch (err) {
        console.error(err);
        return res.status(500).json({error: err.message || 'upload failed'});
    }
}