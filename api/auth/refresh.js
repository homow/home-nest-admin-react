import supabaseAnon from '../config/supabaseClient.js';
import supabaseServer from '../config/supabaseServer.js';
import cookie from 'cookie';

const supabase = supabaseAnon({auth: {persistSession: false}});
const supabaseAdmin = supabaseServer()

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    try {
        const cookies = cookie.parse(req.headers.cookie || '');
        const refresh_token = cookies['sb_refresh_token'];

        if (!refresh_token) {
            return res.status(401).json({error: 'NO_REFRESH_TOKEN', fuck: true});
        }

        const {data: refreshData, error: refreshError} = await supabase.auth.refreshSession({
            refresh_token: String(refresh_token)
        });

        if (refreshError || !refreshData?.session?.access_token) {
            const clearCookie = cookie.serialize('sb_refresh_token', '', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 0
            });
            res.setHeader('Set-Cookie', clearCookie);
            return res.status(401).json({ok: false, error: 'REFRESH_FAILED'});
        }

        const {access_token: newAccessToken, refresh_token: newRefreshToken} = refreshData.session;
        const userId = refreshData.session.user.id;

        const {data: profile, error: profileErr} = await supabaseAdmin
            .from('user_profiles')
            .select('last_strict_login_at, session_remember, id, email, display_name, role')
            .eq('id', userId)
            .single();

        if (profileErr || !profile) {
            const clearCookie = cookie.serialize('sb_refresh_token', '', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 0
            });
            res.setHeader('Set-Cookie', clearCookie);
            return res.status(500).json({error: 'PROFILE_FETCH_FAILED'});
        }

        const rememberFlag = !!profile?.session_remember;
        const lastLogin = profile?.last_strict_login_at ? new Date(profile.last_strict_login_at) : null;
        const now = new Date();

        if (!rememberFlag) {
            if (!lastLogin || (now - lastLogin) > (8 * 60 * 60 * 1000)) {
                const clearCookie = cookie.serialize('sb_refresh_token', '', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 0
                });
                res.setHeader('Set-Cookie', clearCookie);
                return res.status(401).json({ok: false, error: 'SESSION_EXPIRED'});
            }
        }

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: rememberFlag ? 60 * 60 * 24 * 7 : 60 * 60 * 8,
        };

        res.setHeader('Set-Cookie', cookie.serialize('sb_refresh_token', newRefreshToken, cookieOptions));

        return res.status(200).json({
            ok: true,
            accessToken: newAccessToken,
            user: {
                id: profile?.id,
                email: profile?.email || null,
                display_name: profile?.display_name || null,
                role: profile?.role || null,
            }
        });
        // eslint-disable-next-line
    } catch (e) {
        return res.status(500).json({error: 'INTERNAL_ERROR'});
    }
}