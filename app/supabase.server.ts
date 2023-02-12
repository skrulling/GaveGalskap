import type { LoaderArgs } from '@remix-run/node';
import { createClient } from '@supabase/supabase-js'
import { getTokens } from './utils/auth';

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseSecretKey = process.env.SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseSecretKey)

export async function createNewClient(args: LoaderArgs) {
    const { access_token } = await getTokens(args);
    return createClient(supabaseUrl, supabaseSecretKey, {global: {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    }});
}