import supabaseAnon from '../supabaseClient.js';
import supabaseServer from '../supabaseServer.js';
import cookie from 'cookie';

const supabase = supabaseAnon({auth: {persistSession: false}});
const supabaseSvr = supabaseServer(); // service role

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({error: 'METHOD_NOT_ALLOWED'});

    try {
        const payload = req.body || {};

        // Required fields:
        const required = ['title', 'category', 'price', 'description', 'province', 'city', 'features'];
        for (const f of required) {
            if (payload[f] === undefined || payload[f] === null) {
                return res.status(400).json({error: 'MISSING_FIELD', field: f});
            }
        }

        // features must be array with at least one item
        if (!Array.isArray(payload.features) || payload.features.length < 1) {
            return res.status(400).json({error: 'INVALID_FEATURES'});
        }

        // category validation
        if (!['rent', 'sale'].includes(payload.category)) {
            return res.status(400).json({error: 'INVALID_CATEGORY'});
        }

        // validate numeric fields
        const price = Number(payload.price);
        if (Number.isNaN(price) || price < 0) return res.status(400).json({error: 'INVALID_PRICE'});

        let discount_until = null;
        if (payload.discount_until) {
            const d = new Date(payload.discount_until);
            if (isNaN(d.getTime())) return res.status(400).json({error: 'INVALID_DISCOUNT_UNTIL'});
            discount_until = d.toISOString();
        }

        let discount_percentage = null;
        if (typeof payload.discount_percentage !== 'undefined' && payload.discount_percentage !== null) {
            const dp = Number(payload.discount_percentage);
            if (Number.isNaN(dp) || dp < 0 || dp > 100) return res.status(400).json({error: 'INVALID_DISCOUNT_PERCENTAGE'});
            discount_percentage = dp;
        }

        // Prepare insert object (whitelist)
        const insertObj = {
            title: String(payload.title),
            category: String(payload.category),
            price: price,
            description: String(payload.description),
            province: String(payload.province),
            city: String(payload.city),
            features: payload.features,
            main_image: payload.main_image || null,
            images: Array.isArray(payload.images) ? payload.images : undefined,
            tags: Array.isArray(payload.tags) ? payload.tags : undefined,
            metadata: payload.metadata || undefined,
            discount_until: discount_until,
            discount_percentage: discount_percentage
        };

        // Remove undefined keys
        Object.keys(insertObj).forEach(k => insertObj[k] === undefined && delete insertObj[k]);

        // Insert via service role
        const {data, error} = await supabaseSvr
            .from('properties')
            .insert([insertObj])
            .select()
            .single();

        if (error || !data) {
            return res.status(500).json({error: 'DB_INSERT_FAILED', detail: error?.message || null});
        }

        return res.status(200).json({ok: true, property: data});
    } catch (e) {
        return res.status(500).json({error: 'INTERNAL_ERROR'});
    }
}