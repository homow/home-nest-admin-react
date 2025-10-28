import formidable from 'formidable';
import fs from 'fs';
import supabaseServer from '../supabaseServer.js';

export const config = {
    api: {
        bodyParser: false,
    },
};

const BUCKET = process.env.SUPABASE_BUCKET || 'public';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({error: 'Method not allowed'});

    try {
        const form = new formidable.IncomingForm();
        const {fields, files} = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => (err ? reject(err) : resolve({fields, files})));
        });

        const s = supabaseServer(); // service role client
        const propertyId = fields.property_id || null;

        // helper: upload one file to storage and return public URL (signed)
        const uploadOne = async (fileObj, opts = {}) => {
            const filepath = fileObj.filepath || fileObj.path;
            const originalName = fileObj.originalFilename || fileObj.name;
            const ext = originalName?.split('.').pop() || 'jpg';
            const keyPrefix = opts.property_id ? `properties/${opts.property_id}` : 'uploads';
            const filename = `${keyPrefix}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

            const fileStream = fs.createReadStream(filepath);
            const {data, error: upErr} = await s.storage.from(BUCKET).upload(filename, fileStream, {
                contentType: fileObj.mimetype || undefined,
                upsert: false,
            });
            if (upErr) throw upErr;

            // get public or signed URL (choose signed if bucket is private)
            // If bucket is public: use publicUrl; otherwise createSignedUrl
            const {data: pubData} = s.storage.from(BUCKET).getPublicUrl(filename) || {};
            // check if bucket is public by attempting public url; if private, create signed url
            const isPublic = !!pubData?.publicUrl;
            if (isPublic) {
                return {path: filename, url: pubData.publicUrl};
            } else {
                const {data: signedData, error: signErr} = await s.storage.from(BUCKET).createSignedUrl(filename, 60 * 60); // 1h
                if (signErr) throw signErr;
                return {path: filename, url: signedData.signedUrl};
            }
        };

        const results = [];

        // main_image (single)
        if (files.main_image) {
            const f = Array.isArray(files.main_image) ? files.main_image[0] : files.main_image;
            const r = await uploadOne(f, {property_id: propertyId, is_main: true});
            results.push({field: 'main_image', ...r});
        }

        // images (multiple)
        if (files.images) {
            const images = Array.isArray(files.images) ? files.images : [files.images];
            for (const img of images) {
                const r = await uploadOne(img, {property_id: propertyId, is_main: false});
                results.push({field: 'images', ...r});
            }
        }

        // remove temp files
        try {
            const all = [];
            if (files.main_image) all.push(...(Array.isArray(files.main_image) ? files.main_image : [files.main_image]));
            if (files.images) all.push(...(Array.isArray(files.images) ? files.images : [files.images]));
            all.forEach(f => fs.unlinkSync(f.filepath || f.path));

            // eslint-disable-next-line
        } catch (e) {}

        return res.status(200).json({ok: true, results});
    } catch (err) {
        console.error(err);
        return res.status(500).json({error: err.message || 'upload failed'});
    }
}