import cookie from 'cookie';
import supabaseAnon from '../supabaseClient.js';
import supabaseServer from '../supabaseServer.js';

function clearRefreshCookie() {
    return cookie.serialize('sb_refresh_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0
    });
}

function clearClientCookies() {
    return [clearRefreshCookie()];
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end();
    }

    const clearHeaders = clearClientCookies();

    try {
        const cookies = cookie.parse(req.headers.cookie || '');
        const refreshToken = cookies['sb_refresh_token'];
        if (!refreshToken) {
            res.setHeader('Set-Cookie', clearHeaders);
            return res.status(200).json({ok: true});
        }
        try {
            if (typeof supabaseAnon?.auth?.signOut === 'function') {
                await supabaseAnon.auth.signOut();
            }
            // eslint-disable-next-line
        } catch (e) {
        }
        try {
            if (supabaseServer) {
                try {
                    await supabaseServer
                        .from('auth.sessions')
                        .delete()
                        .eq('refresh_token', refreshToken);
                    // eslint-disable-next-line
                } catch (e) {
                    try {
                        const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/$/, '');
                        const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || null;
                        if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
                            const adminRevokeUrl = `${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`;
                            await fetch(adminRevokeUrl, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    apikey: SUPABASE_SERVICE_ROLE_KEY,
                                    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
                                },
                                body: JSON.stringify({refresh_token: refreshToken})
                            });
                        }
                        // eslint-disable-next-line
                    } catch (e2) {
                    }
                }
            }
            // eslint-disable-next-line
        } catch (e) {
        }
        res.setHeader('Set-Cookie', clearHeaders);
        return res.status(200).json({ok: true});
        // eslint-disable-next-line
    } catch (e) {
        res.setHeader('Set-Cookie', clearHeaders);
        return res.status(500).json({ok: false, error: 'INTERNAL_ERROR'});
    }
}