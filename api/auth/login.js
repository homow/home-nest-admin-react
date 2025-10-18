import supabaseAnon from "../supabaseClient.js"

const supabase = supabaseAnon({auth: {persistSession: false}})

export default async function handler(req, res) {
    try {
        const authHeader = req.headers.authorization || ''
        const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null

        if (!token) {
            return res.status(401).json({ code: 'NO_TOKEN', message: 'توکن ارسال نشده' })
        }

        const { data: user, error: userErr } = await supabase.auth.getUser(token)

        if (userErr || !user) {
            return res.status(401).json({ code: 'INVALID_TOKEN', message: 'توکن نامعتبر یا کاربر یافت نشد' })
        }

        const uid = user.id

        const { data: profile, error: profileErr } = await supabase
            .from('user_profiles')
            .select('id, role, display_name, email')
            .eq('id', uid)
            .single()

        if (profileErr || !profile) {
            return res.status(500).json({ code: 'PROFILE_FETCH_FAILED', message: 'پروفایل یافت نشد یا خطا در دریافت' })
        }

        if (profile.role !== 'admin') {
            return res.status(403).json({ code: 'ACCESS_DENIED', message: 'دسترسی فقط برای ادمین‌هاست' })
        }

        return res.status(200).json({
            ok: true,
            isAdmin: true,
            user: {
                id: uid,
                email: profile.email || null,
                display_name: profile.display_name || null,
            },
        })
    } catch (e) {
        console.error(e)
        return res.status(500).json({ code: 'INTERNAL_ERROR', message: 'خطای داخلی سرور' })
    }
}