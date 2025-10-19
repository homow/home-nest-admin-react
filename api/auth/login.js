import supabaseAnon from '../supabaseClient.js';
import cookie from 'cookie';

const supabase = supabaseAnon({auth: {persistSession: false}});

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

        if (signInError || !signInData?.session?.access_token) {
            return res.status(401).json({error: 'INVALID_CREDENTIALS'});
        }

        const access_token = signInData.session.access_token;
        const refresh_token = signInData.session.refresh_token;

        const {data: userData, error: userError} = await supabase.auth.getUser(access_token);
        if (userError || !userData?.user) {
            return res.status(401).json({error: 'INVALID_SESSION'});
        }

        const uid = userData.user.id;

        const {data: profile, error: profileErr} = await supabase
            .from('user_profiles')
            .select('id, role, display_name, email')
            .eq('id', uid)
            .single()
            .auth(access_token);

        if (profileErr || !profile) {
            return res.status(500).json({error: 'PROFILE_FETCH_FAILED'});
        }

        if (profile.role !== 'admin') {
            return res.status(403).json({error: 'ACCESS_DENIED'});
        }

        // 3️⃣ ساخت کوکی امن برای refresh_token
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 8,
        };

        res.setHeader(
            'Set-Cookie',
            cookie.serialize('sb_refresh_token', refresh_token, cookieOptions)
        );

        return res.status(200).json({
            ok: true,
            user: {
                id: uid,
                email: profile.email || null,
                display_name: profile.display_name || null,
                role: profile.role || null,
            },
            accessToken: access_token,
        });
        // eslint-disable-next-line
    } catch (e) {
        return res.status(500).json({error: 'INTERNAL_ERROR'});
    }
}
