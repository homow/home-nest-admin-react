import {createClient} from "@supabase/supabase-js";

const supabaseServer = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

const s = (opt = {}) => {
    return createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {...opt}
    )
}

export default supabaseServer;