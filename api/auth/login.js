import supabaseAnon from '../supabaseClient.js';
import cookie from 'cookie';

// ایجاد client ANON (بدون persistSession)
const supabase = supabaseAnon({auth: {persistSession: false}});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end(); // Method Not Allowed
    }

    try {
        const {email, password, remember} = req.body || {};

        if (!email || !password) {
            return res.status(400).json({error: 'MISSING_CREDENTIALS'});
        }

        // 1) Sign in with email & password
        const {data: signInData, error: signInError} = await supabase.auth.signInWithPassword({
            email: String(email),
            password: String(password)
        });

        if (signInError || !signInData?.session?.access_token) {
            // Don't leak details; return a generic auth error
            return res.status(401).json({error: 'INVALID_CREDENTIALS'});
        }

        const access_token = signInData.session.access_token;
        const refresh_token = signInData.session.refresh_token;

        // 2) Get user info using the access token
        const {data: userData, error: userError} = await supabase.auth.getUser(access_token);
        if (userError || !userData?.user) {
            return res.status(401).json({error: 'INVALID_SESSION'});
        }

        const uid = userData.user.id;

        // 3) Fetch profile from public.user_profiles filtered by id
        // Use the same client but set the auth token for this request to ensure RLS uses the user context.
        supabase.auth?.setAuth(access_token);

        const {data: profile, error: profileErr} = await supabase
            .from('user_profiles')
            .select('id, role, display_name, email')
            .eq('id', uid)
            .single();

        if (profileErr || !profile) {
            return res.status(500).json({error: 'PROFILE_FETCH_FAILED'});
        }

        if (profile?.role !== 'admin') {
            return res.status(403).json({error: 'ACCESS_DENIED'});
        }

        // 4) Set secure HttpOnly cookie for refresh token
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            // remember decides cookie maxAge
            maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 8, // 30 days vs 8 hours (example)
        };

        res.setHeader('Set-Cookie', cookie.serialize('sb_refresh_token', refresh_token, cookieOptions));

        // Clear auth on server client after use
        supabase.auth?.setAuth(null);

        // 5) Return minimal user info and access token to front-end
        // Access token is returned so front can call Supabase directly for authorized requests.
        return res.status(200).json({
            ok: true,
            user: {
                id: uid,
                email: profile?.email || null,
                display_name: profile?.display_name || null,
                role: profile?.role || null
            },
            access_token
        });

    // eslint-disable-next-line
    } catch (e) {
        // Do not expose internal error details
        return res.status(500).json({error: 'INTERNAL_ERROR'});
    }
}