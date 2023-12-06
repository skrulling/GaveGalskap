import type { SupabaseClient } from "@supabase/supabase-js";
import type { UserSignup } from "~/types/userSignup";

export async function signUp(user: Pick<UserSignup, "email" | "password">, supabase: SupabaseClient) {
    const { data } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
    })
    return data;
}