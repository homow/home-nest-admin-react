import supabaseAnon from '../config/supabaseClient.js';
import supabaseServer from '../config/supabaseServer.js';
import cookie from 'cookie';

const supabase = supabaseAnon({auth: {persistSession: false}});
const supabaseAdmin = supabaseServer()

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    try {
        const {email, password, remember} = req.body || {};

        if (!email || !password) {
            return res.status(400).json({error: 'MISSING_CREDENTIALS'});
        }

        const {data: signInData, error: signInError} = await supabase.auth.signInWithPassword({
            email: String(email),
            password: String(password),
        });

        if (signInError) {
            if (
                signInError.message?.includes("fetch") ||
                signInError.message?.includes("network") ||
                signInError.message?.includes("Failed to fetch") ||
                signInError.status === 0
            ) {
                return res.status(503).json({error: 'NETWORK_ERROR'});
            }

            return res.status(401).json({error: 'INVALID_CREDENTIALS'});
        }

        if (!signInData?.session?.access_token) {
            return res.status(401).json({error: 'INVALID_SESSION'});
        }

        const access_token = signInData.session.access_token;
        const refresh_token = signInData.session.refresh_token;

        if (!refresh_token) {
            return res.status(401).json({error: 'INVALID_SESSION'});
        }

        const uid = signInData.session.user?.id;
        if (!uid) {
            return res.status(401).json({error: 'INVALID_SESSION'});
        }

        const {data: profile, error: profileErr} = await supabaseAdmin
            .from('user_profiles')
            .select('id, role, display_name, email')
            .eq('id', uid)
            .single();

        if (profileErr || !profile) {
            return res.status(500).json({error: 'PROFILE_FETCH_FAILED'});
        }

        try {
            await supabaseAdmin
                .from('user_profiles')
                .update({
                    last_strict_login_at: new Date().toISOString(),
                    session_remember: !!remember
                })
                .eq('id', uid);
            // eslint-disable-next-line
        } catch (e) {
        }

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 8,
        };

        res.setHeader('Set-Cookie', cookie.serialize('sb_refresh_token', refresh_token, cookieOptions));

        return res.status(200).json({
            ok: true,
            user: {
                id: uid,
                email: profile?.email || null,
                display_name: profile?.display_name || null,
                role: profile?.role || null,
            },
            accessToken: access_token,
        });
        // eslint-disable-next-line
    } catch (e) {
        return res.status(500).json({error: 'INTERNAL_ERROR'});
    }
}