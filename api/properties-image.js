export const config = {api: {bodyParser: false}};

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const EDGE_FUNCTION_URL = process.env.EDGE_FUNCTION_URL;
    const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!EDGE_FUNCTION_URL || !SERVICE_ROLE) return res.status(500).json({error: 'not configured'});

    // copy content-type exactly
    const contentType = req.headers['content-type'];
    const headers = {
        Authorization: `Bearer ${SERVICE_ROLE}`,
    };
    if (contentType) headers['Content-Type'] = contentType;

    // forward the raw request body stream using fetch (node 18+ global fetch)
    const response = await fetch(EDGE_FUNCTION_URL, {
        method: 'POST',
        headers,
        body: req, // forward the incoming stream directly
    });

    const respBuffer = await response.arrayBuffer();
    res.status(response.status);
    for (const [k, v] of response.headers) res.setHeader(k, v);
    res.send(Buffer.from(respBuffer));
}