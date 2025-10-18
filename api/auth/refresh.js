import supabaseAnon from '../supabaseClient.js';
import cookie from 'cookie';

const supabase = supabaseAnon({auth: {persistSession: false}});

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    try {
        // read token in header
        const cookies = cookie.parse(req.headers.cookie || '');
        const refresh_token = cookies['sb_refresh_token'];

        if (!refresh_token) {
            return res.status(401).json({error: 'NO_REFRESH_TOKEN'});
        }

        // Use the refresh token to get a new session
        const {data: refreshData, error: refreshError} = await supabase.auth.refreshSession({
            refresh_token: String(refresh_token)
        });

        if (refreshError || !refreshData?.session?.access_token) {
            // ممکن است refresh token منقضی یا ری‌ووک شده باشد
            // حذف cookie برای پاکسازی سمت کلاینت
            res.setHeader('Set-Cookie', cookie.serialize('sb_refresh_token', '', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 0
            }));
            return res.status(401).json({error: 'REFRESH_FAILED'});
        }

        const newAccessToken = refreshData.session.access_token;
        const newRefreshToken = refreshData.session.refresh_token;

        // به‌روزرسانی cookie با refresh جدید (طول عمر را مطابق نیاز شما تعیین کنید)
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 30, // مثال: 30 روز
        };

        res.setHeader('Set-Cookie', cookie.serialize('sb_refresh_token', newRefreshToken, cookieOptions));

        // بازگرداندن فقط access token و اطلاعات حداقلی
        return res.status(200).json({
            ok: true,
            access_token: newAccessToken
        });

        // eslint-disable-next-line
    } catch (e) {
        return res.status(500).json({error: 'INTERNAL_ERROR'});
    }
}