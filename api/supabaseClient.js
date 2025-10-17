import {createClient} from "@supabase/supabase-js";

const supabaseAnon = createClient(
    import.meta.env?.VITE_SUPABASE_URL,
    import.meta.env?.VITE_SUPABASE_ANON_KEY
)

export default supabaseAnon;