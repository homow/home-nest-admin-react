import supabaseAnon from './config/supabaseClient.js';
import supabaseServer from './config/supabaseServer.js';

const supabase = supabaseAnon();
const supabaseAdmin = supabaseServer();

// helper: extract bearer token
function getBearerToken(req) {
    const auth = req.headers?.authorization || req.headers?.Authorization;
    if (!auth) return null;
    const m = auth.match(/^Bearer\s+(.+)$/i);
    return m ? m[1] : null;
}

async function isAdmin(req) {
    const token = getBearerToken(req);
    if (!token) return false;
    // verify session / get user session get user (use server client)
    const {data: {user}, error} = await supabase.auth.getUser(token);
    if (error || !user) return false;
    // check role in user_profiles table
    const {data: profile, error: profErr} = await supabaseAdmin
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single();
    if (profErr || !profile) return false;
    return profile?.role === 'admin';
}

export default async function handler(req, res) {
    // GET: public read
    if (req.method === 'GET') {
        try {
            const id = (req.query && req.query.id) || (new URL(req.url, 'http://localhost')).searchParams.get('id');
            const num = (req.query && req.query?.num) || (new URL(req.url, 'http://localhost')).searchParams.get('num');
            const seq = (req.query && req.query?.seq) || (new URL(req.url, 'http://localhost')).searchParams.get('seq');

            let qb = supabaseAdmin.from('properties').select('*');

            if (id) {
                qb = qb.eq('id', id).single();
            } else if (num) {
                qb = qb.eq('property_number', num).single();
            } else if (seq) {
                qb = qb.eq('property_seq', Number(seq)).single();
            } else {
                // return list (pagination optional)
                const page = Number((req.query && req.query.page) || 1);
                const per = Math.min(Number((req.query && req.query?.per) || 20), 100);
                const from = (page - 1) * per;
                const to = from + per - 1;
                qb = qb.order('created_at', {ascending: false}).range(from, to);
            }

            const {data, error} = await qb;
            if (error) return res.status(404).json({error: 'NOT_FOUND', detail: error.message});
            return res.status(200).json({ok: true, data});
            // eslint-disable-next-line
        } catch (err) {
            return res.status(500).json({error: 'INTERNAL_ERROR'});
        }
    }

    // POST: create (admin only)
    if (req.method === 'POST') {
        if (!(await isAdmin(req))) return res.status(403).json({error: 'FORBIDDEN'});

        try {
            const payload = req.body || {};

            const required = ['title', 'category', 'description', 'province_and_city', 'features', 'address'];
            for (const f of required) {
                if (payload[f] === undefined || payload[f] === null || (typeof payload[f] === 'string' && payload[f].trim() === '')) {
                    return res.status(400).json({error: 'MISSING_FIELD', field: f});
                }
            }

            if (!Array.isArray(payload.features) || payload.features.length < 1) {
                return res.status(400).json({error: 'INVALID_FEATURES'});
            }

            if (!['rent', 'sale'].includes(payload.category)) {
                return res.status(400).json({error: 'INVALID_CATEGORY'});
            }

            let price = undefined;
            if (payload.price !== undefined && payload.price !== null && payload.price !== "") {
                price = Number(payload.price);
                if (Number.isNaN(price) || price < 0) {
                    return res.status(400).json({error: 'INVALID_PRICE'});
                }
            }

            let discount_until = null;
            if (payload.discount_until) {
                const d = new Date(payload.discount_until);
                if (isNaN(d.getTime())) return res.status(400).json({error: 'INVALID_DISCOUNT_UNTIL'});
                discount_until = d.toISOString();
            }

            let price_with_discount = undefined;
            if (typeof payload.price_with_discount !== 'undefined' && payload.price_with_discount !== null) {
                const pwd = Number(payload.price_with_discount);
                if (Number.isNaN(pwd) || pwd < 0) return res.status(400).json({error: 'INVALID_PRICE_WITH_DISCOUNT'});
                price_with_discount = pwd;
            }

            // property_number optional (admin provided short id)
            const property_number = payload.property_number ? String(payload.property_number) : undefined;

            payload.images = Array.isArray(payload.images) ? payload.images : [];
            payload.tags = Array.isArray(payload.tags) ? payload.tags : [];

            const insertObj = {
                title: String(payload.title),
                category: String(payload.category),
                price: price,
                description: String(payload.description),
                province_and_city: payload.province_and_city ? String(payload.province_and_city).trim() : null,
                address: payload.address ? String(payload.address) : null,
                features: payload.features,
                main_image: payload.main_image || null,
                images: payload.images,
                tags: payload.tags,
                metadata: payload.metadata || undefined,
                discount_until: discount_until,
                price_with_discount: price_with_discount,
                property_number: property_number
            };

            Object.keys(insertObj).forEach(k => insertObj[k] === undefined && delete insertObj[k]);

            const {data, error} = await supabaseAdmin
                .from('properties')
                .insert([insertObj])
                .select()
                .single();

            if (error || !data) return res.status(500).json({error: 'DB_INSERT_FAILED', detail: error?.message || null});

            return res.status(200).json({ok: true, property: data});
            // eslint-disable-next-line
        } catch (err) {
            return res.status(500).json({error: 'INTERNAL_ERROR'});
        }
    }

    // PUT: update by uuid or property_number (admin only)
    if (req.method === 'PUT') {
        if (!(await isAdmin(req))) return res.status(403).json({error: 'FORBIDDEN'});

        try {
            const payload = req.body || {};
            const id = payload.id;
            const num = payload.property_number;

            if (!id && !num) return res.status(400).json({error: 'MISSING_IDENTIFIER', detail: 'id or property_number required'});

            const updateObj = {...payload};
            delete updateObj.id;

            // sanitize: don't allow changing property_seq
            delete updateObj?.property_seq;

            const target = id ? {id} : {property_number: num};

            const {data, error} = await supabaseAdmin
                .from('properties')
                .update(updateObj)
                .match(target)
                .select()
                .single();

            if (error || !data) return res.status(404).json({error: 'UPDATE_FAILED', detail: error?.message || null});

            return res.status(200).json({ok: true, property: data});
            // eslint-disable-next-line
        } catch (err) {
            return res.status(500).json({error: 'INTERNAL_ERROR'});
        }
    }

    // DELETE: delete by id or property_number (admin only)
    if (req.method === 'DELETE') {
        if (!(await isAdmin(req))) return res.status(403).json({error: 'FORBIDDEN'});

        try {
            const id = (req.query && req.query.id) || (req.body && req.body.id);
            const num = (req.query && req.query?.num) || (req.body && req.body.property_number);

            if (!id && !num) return res.status(400).json({error: 'MISSING_IDENTIFIER', detail: 'id or property_number required'});

            let qb = supabaseAdmin.from('properties');
            if (id) qb = qb?.eq('id', id);
            else qb = qb?.eq('property_number', num);

            const {data, error} = await qb.delete().select().single();
            if (error) return res.status(404).json({error: 'DELETE_FAILED', detail: error?.message || null});

            return res.status(200).json({ok: true, property: data});
            // eslint-disable-next-line
        } catch (err) {
            return res.status(500).json({error: 'INTERNAL_ERROR'});
        }
    }

    return res.status(405).json({error: 'METHOD_NOT_ALLOWED'});
}