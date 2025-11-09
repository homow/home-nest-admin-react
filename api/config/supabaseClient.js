import {createClient} from "@supabase/supabase-js";

const supabaseAnon = (opt = {}) => {
    return createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY,
        {...opt}
    )
}

export default supabaseAnon;