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

        const s = supabaseServer(); // service role client
        const propertyId = fields.property_id || null;

        const uploaded = [];

        async function uploadAndReturn(fileObj) {
            const path = fileObj.filepath || fileObj.path;
            const name = fileObj.originalFilename || fileObj.name || `file-${Date.now()}`;
            const ext = (name.split('.').pop() || 'jpg').toLowerCase();
            const keyPrefix = propertyId ? `properties/${propertyId}` : 'uploads';
            const filename = `${keyPrefix}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

            const stream = fs.createReadStream(path);

            // upload and check error strictly
            const { error} = await s.storage.from(BUCKET).upload(filename, stream, {
                contentType: fileObj.mimetype || undefined,
                upsert: false,
            });
            if (error) throw error;

            // get url: prefer public URL; if not available, create signed URL
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
            const r = await uploadAndReturn(f);
            uploaded.push({field: 'main_image', ...r});
        }

        if (files.images) {
            const images = Array.isArray(files.images) ? files.images : [files.images];
            for (const img of images) {
                const r = await uploadAndReturn(img);
                uploaded.push({field: 'images', ...r});
            }
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
        console.error(err);
        return res.status(500).json({error: err.message || 'upload failed'});
    }
}