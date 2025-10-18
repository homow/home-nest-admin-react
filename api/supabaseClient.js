import {createClient} from "@supabase/supabase-js";

const supabaseAnon = (opt = {}) => {
    return createClient(
        import.meta.env?.VITE_SUPABASE_URL,
        import.meta.env?.VITE_SUPABASE_ANON_KEY,
        {...opt}
    )
}

export default supabaseAnon;