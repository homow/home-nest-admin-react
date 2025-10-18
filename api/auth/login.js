import supabaseAnon from "../supabaseClient.js"
import cookie from 'cookie';

const supabase = supabaseAnon({auth: {persistSession: false}})
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    try {
        const { access_token, refresh_token } = req.body || {};
        if (!access_token || !refresh_token) return res.status(400).json({ error: 'MISSING_TOKENS' });

        // Validate access token and get user
        const { data, error: userErr } = await supabase.auth.getUser(access_token);
        if (userErr || !data?.user) return res.status(401).json({ error: 'INVALID_TOKEN' });

        const uid = data.user.id;

        // Fetch profile (ensure RLS allows this or use service role safely)
        const { data: profile, error: profileErr } = await supabase
            .from('user_profiles')
            .select('id, role, display_name, email')
            .eq('id', uid)
            .single();

        if (profileErr || !profile) {
            console.error('profile fetch error', profileErr);
            return res.status(500).json({ error: 'PROFILE_FETCH_FAILED' });
        }

        if (profile.role !== 'admin') return res.status(403).json({ error: 'ACCESS_DENIED' });

        // Set refresh token as HttpOnly secure cookie
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 30, // 30 days (adjust as needed)
        };
        res.setHeader('Set-Cookie', cookie.serialize('sb_refresh_token', refresh_token, cookieOptions));

        // Return user info and access token (access token kept in memory on client)
        return res.status(200).json({
            ok: true,
            user: { id: uid, email: profile.email || null, display_name: profile.display_name || null },
            access_token, // optional: return for client to store in memory
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'INTERNAL_ERROR' });
    }
}