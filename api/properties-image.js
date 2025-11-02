// api/proxy-upload.js
export default async function handler(req, res) {
    try {
        if (req.method !== 'POST') return res.status(405).json({error: 'Method not allowed'});

        const contentType = req.headers['content-type'] || '';
        if (!contentType.includes('multipart/form-data')) {
            return res.status(400).json({error: 'Content-Type must be multipart/form-data'});
        }

        const EDGE_URL = process.env.UPLOAD_IMAGE_FUNCTION;
        const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!EDGE_URL) return res.status(500).json({error: 'Missing UPLOAD_IMAGE_FUNCTION on server'});
        if (!SERVICE_ROLE) return res.status(500).json({error: 'Missing SUPABASE_SERVICE_ROLE_KEY on server'});

        // read raw body buffer (works in Vercel Node runtime)
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        const body = Buffer.concat(chunks);

        const headers = {
            'Content-Type': contentType,
            'Authorization': `Bearer ${SERVICE_ROLE}`
        };

        const forwardRes = await fetch(EDGE_URL, {
            method: 'POST',
            headers,
            body,
        });

        const respText = await forwardRes.text();
        const respContentType = forwardRes.headers.get('content-type') || 'text/plain';

        res.status(forwardRes.status);
        res.setHeader('content-type', respContentType);
        return res.send(respText);
    } catch (err) {
        console.error(err);
        return res.status(500).json({error: err.message || String(err)});
    }
}