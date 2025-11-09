import cookie from 'cookie';
import supabaseAnon from '../config/supabaseClient.js';
import supabaseServer from '../config/supabaseServer.js';

const supabase = supabaseAnon();
const supabaseAdmin = supabaseServer()

function clearRefreshCookie() {
    return cookie.serialize('sb_refresh_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0
    });
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
    }

    const clearHeaders = [clearRefreshCookie()];

    try {
        const cookies = cookie.parse(req.headers.cookie || '');
        const refreshToken = cookies['sb_refresh_token'];

        if (!refreshToken) {
            res.setHeader('Set-Cookie', clearHeaders);
            return res.status(200).json({ ok: true });
        }

        try {
            await supabase.auth.signOut?.();
            // eslint-disable-next-line
        } catch (_) {}

        try {
            if (supabaseAdmin) {
                try {
                    await supabaseAdmin
                        .from('auth.sessions')
                        .delete()
                        .eq('refresh_token', refreshToken);
                } catch {
                    const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/$/, '');
                    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
                    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
                        await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                apikey: SUPABASE_SERVICE_ROLE_KEY,
                                Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
                            },
                            body: JSON.stringify({ refresh_token: refreshToken })
                        });
                    }
                }
            }
            // eslint-disable-next-line
        } catch (_) {}

        // Clear cookie & disable cache
        res.setHeader('Set-Cookie', clearHeaders);
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

        return res.status(200).json({ ok: true });

    } catch {
        res.setHeader('Set-Cookie', clearHeaders);
        return res.status(500).json({ ok: false, error: 'INTERNAL_ERROR' });
    }
}
