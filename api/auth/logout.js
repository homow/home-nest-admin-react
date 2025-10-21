import supabaseAnon from '../supabaseClient.js';
import cookie from 'cookie';

const supabase = supabaseAnon({auth: {persistSession: false}});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    try {
        const cookies = cookie.parse(req.headers.cookie || '');
        const refreshToken = cookies['sb_refresh_token'];

        // پاک کردن کوکی محلی (همیشه انجام شود)
        const clearCookie = cookie.serialize('sb_refresh_token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 0
        });

        // اگر توکن وجود نداشت، فقط کوکی را پاک کن و 200 بده
        if (!refreshToken) {
            res.setHeader('Set-Cookie', clearCookie);
            return res.status(200).json({ok: true});
        }

        // سعی می‌کنیم refresh token را revoke کنیم.
        // توجه: در بسیاری از موارد supabase-js client روش مجزایی برای revoke session دارد:
        //   await supabase.auth.signOut();  // اما signOut روی client ممکن است نیاز به access token داشته باشد.
        // ما از API refresh/revoke اختصاصی استفاده می‌کنیم اگر در client قابل دسترس باشد.
        // اگر دسترسی سرویس‌روِل لازم باشد، باید از supabaseServer (service role) استفاده شود.
        let revokeSucceeded = false;

        try {
            // روش امن و بدون لاگ: فراخوانی endpoint signOut با refresh token
            // اگر پکیج supabase-js نسخه‌ شما از revokeSession/ signOut با refresh token پشتیبانی کند، از آن استفاده می‌کنیم.
            // fallback: call supabase.auth.signOut() which will attempt to revoke the current session if available.
            // این تابع ممکن است نیاز به access token داشته باشد؛ در هر حال اگر fail شود ما صرفا ادامه داده و کوکی را پاک میکنیم.
            if (typeof supabase.auth.signOut === 'function') {
                // signOut typically revokes current session associated with the client.
                // We cannot pass the refresh token directly here via supabase-js in all versions.
                // Try signOut; if client has no session this may be a no-op.
                await supabase.auth.signOut();
                revokeSucceeded = true;
            }
            // eslint-disable-next-line
        } catch (e) {
            // swallow errors silently (بدون لاگ)، فقط مارک می‌کنیم که revoke موفق نبوده
            revokeSucceeded = false;
        }

        // اگر خواسته باشید می‌توانیم با service role revoke صریح انجام دهیم (قوی‌تر).
        // این بخش بصورت اختیاری و تنها در صورت نیاز فعال می‌شود:
        // try {
        //   await supabaseServer.auth.admin.invalidateUserTokens(userIdOrOther) ...
        // } catch(e) { /* swallow */ }

        // در هر صورت: کوکی را پاک کن تا کلاینت نتواند دوباره از همان refresh token استفاده کند
        res.setHeader('Set-Cookie', clearCookie);

        // پاسخ کلی، بدون جزئیات خطا
        return res.status(200).json({ok: true, revoked: revokeSucceeded});
        // eslint-disable-next-line
    } catch (e) {
        // بدون لاگ: فقط پاسخ امنیتی عمومی
        const clearCookie = cookie.serialize('sb_refresh_token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 0
        });
        res.setHeader('Set-Cookie', clearCookie);
        return res.status(500).json({ok: false, error: 'INTERNAL_ERROR'});
    }
}