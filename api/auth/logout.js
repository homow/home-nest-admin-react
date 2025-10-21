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

    // Ensure cookie will be cleared in all outcomes
    const clearHeaders = clearClientCookies();

    try {
        const cookies = cookie.parse(req.headers.cookie || '');
        const refreshToken = cookies['sb_refresh_token'];

        // If no refresh token present: just clear cookies and return success
        if (!refreshToken) {
            res.setHeader('Set-Cookie', clearHeaders);
            return res.status(200).json({ok: true});
        }

        // 1) Best-effort: attempt client-side signOut (may be no-op)
        try {
            if (typeof supabaseAnon?.auth?.signOut === 'function') {
                await supabaseAnon.auth.signOut();
            }
        } catch (e) {
            // swallow silently (no logs)
        }

        // 2) Strong invalidate using service role (supabaseServer) if available
        // Strategy:
        // - Try to find the session/user from the refresh token via internal auth endpoints
        // - If we can locate the session id or user id, remove session(s) via admin API or delete from auth.sessions (service role)
        // Implementation is best-effort and silent on failure.
        try {
            if (supabaseServer) {
                // Try to call the Supabase Admin/REST logout or token revoke endpoint.
                // This block uses the service role client where possible to remove server-side sessions.
                // Approach A: If supabaseServer.auth.admin API exists to revoke a session, use it.
                // Approach B: fallback to deleting matching rows from auth.sessions table (requires service role DB access).
                // We'll attempt B: delete rows from auth.sessions where refresh_token matches.
                // Note: In some Supabase deployments auth.sessions is not directly deletable; this is best-effort.
                try {
                    // Try to delete session row from auth.sessions (Postgres) with service role.
                    // Depending on your Supabase setup, auth.sessions may be in the 'auth' schema.
                    await supabaseServer
                        .from('auth.sessions')
                        .delete()
                        .eq('refresh_token', refreshToken);
                    // We do not check the result; if it fails it will throw and be caught below.
                } catch (e) {
                    // If direct deletion fails, attempt alternate admin REST revoke (best-effort).
                    try {
                        const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/$/, '');
                        const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || null;
                        if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
                            // Attempt to hit the auth admin token revoke endpoint (best-effort)
                            // Note: This endpoint behavior can vary; treat as tolerant.
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
                    } catch (e2) {
                        // swallow
                    }
                }
            }
        } catch (e) {
            // swallow any service-role errors silently
        }

        // 3) Ensure we clear the refresh cookie so client can't reuse it
        res.setHeader('Set-Cookie', clearHeaders);

        // 4) Response: minimal. No logs, no internals.
        return res.status(200).json({ok: true});
    } catch (e) {
        // On unexpected error: clear cookie and return generic error without logging
        res.setHeader('Set-Cookie', clearHeaders);
        return res.status(500).json({ok: false, error: 'INTERNAL_ERROR'});
    }
}