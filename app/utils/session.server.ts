import { supabase } from "~/supabase.server";

type LoginForm = {
    email: string;
    password: string;
}

export async function login({
    email,
    password,
}: LoginForm) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    })

    return { data, error }
}