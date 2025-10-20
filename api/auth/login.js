import supabaseAnon from '../supabaseClient.js';
import supabaseServer from '../supabaseServer.js';
import cookie from 'cookie';

// ایجاد client ANON (بدون persistSession)
const supabase = supabaseAnon({ auth: { persistSession: false } });

// سرور client با SERVICE_ROLE_KEY (برای چک نقش‌ها)
const supabaseAdmin = supabaseServer; // فرض: ../supabaseServer.js از قبل createClient را با SERVICE_ROLE_KEY ساخته و صادر می‌کند

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end(); // Method Not Allowed
    }

    try {
        const { email, password, remember } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({ error: 'MISSING_CREDENTIALS' });
        }

        // 1) Sign in with email & password (client ANON)
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: String(email),
            password: String(password),
        });

        if (signInError) {
            // ✅ تشخیص نوع خطا: اگر پیامش network یا fetch بود یعنی مشکل از اینترنت است نه credential
            if (
                signInError.message?.includes("fetch") ||
                signInError.message?.includes("network") ||
                signInError.message?.includes("Failed to fetch") ||
                signInError.status === 0
            ) {
                return res.status(503).json({ error: 'NETWORK_ERROR' });
            }

            return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
        }

        if (!signInData?.session?.access_token) {
            return res.status(401).json({ error: 'INVALID_SESSION' });
        }

        const access_token = signInData.session.access_token;
        const refresh_token = signInData.session.refresh_token;

        if (!refresh_token) {
            // اگر refresh_token گرفته نشد، از ورود جلوگیری کن
            return res.status(401).json({ error: 'INVALID_SESSION' });
        }

        // 2) Get user info from session (signInData.session.user) — بدون تماس اضافی
        const uid = signInData.session.user?.id;
        if (!uid) {
            return res.status(401).json({ error: 'INVALID_SESSION' });
        }

        // 3) Fetch profile from public.user_profiles using server client (service role)
        // استفاده از service role تا نیازی به setAuth نداشته باشیم
        const { data: profile, error: profileErr } = await supabaseAdmin
            .from('user_profiles')
            .select('id, role, display_name, email')
            .eq('id', uid)
            .single();

        if (profileErr || !profile) {
            return res.status(500).json({ error: 'PROFILE_FETCH_FAILED' });
        }

        if (profile.role !== 'admin') {
            return res.status(403).json({ error: 'ACCESS_DENIED' });
        }

        // 4) Set secure HttpOnly cookie for refresh token
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 8,
        };

        res.setHeader('Set-Cookie', cookie.serialize('sb_refresh_token', refresh_token, cookieOptions));

        // 5) Return minimal user info and access token to front-end
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
        // هیچ اطلاعات حساسی را برنگردان؛ فقط پیام عمومی
        return res.status(500).json({ error: 'INTERNAL_ERROR' });
    }
}