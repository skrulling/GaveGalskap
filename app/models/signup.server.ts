import { supabase } from "~/supabase";
import type { UserSignup } from "~/types/userSignup";

export async function signUp(user: Pick<UserSignup, "email" | "password">) {
    const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
    })
    return data;
}