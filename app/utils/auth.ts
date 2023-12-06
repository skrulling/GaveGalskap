import type { SupabaseClient } from "@supabase/supabase-js";

export async function isAuthenticated(client: SupabaseClient): Promise<boolean> {
    const { data } = await client.auth.getSession()
    return data?.session !== null;
}