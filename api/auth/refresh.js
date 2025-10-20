import supabaseAnon from '../supabaseClient.js';
import supabaseServer from '../supabaseServer.js';
import cookie from 'cookie';

const supabase = supabaseAnon({auth: {persistSession: false}});

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    try {
        const cookies = cookie.parse(req.headers.cookie || '');
        const refresh_token = cookies['sb_refresh_token'];

        if (!refresh_token) {
            return res.status(401).json({error: 'NO_REFRESH_TOKEN'});
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

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 30, // 30 روز
        };

        res.setHeader('Set-Cookie', cookie.serialize('sb_refresh_token', newRefreshToken, cookieOptions));

        const userId = refreshData.session.user.id;

        const {data: profile} = await supabaseServer
            .from("user_profiles")
            .select('id, email, display_name, role')
            .eq("id", userId)
            .single()

        return res.status(200).json({
            ok: true,
            accessToken: newAccessToken,
            user: profile
        });
        // eslint-disable-next-line
    } catch (e) {
        return res.status(500).json({error: 'INTERNAL_ERROR'});
    }
}
