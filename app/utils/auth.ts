import { ActionArgs, LoaderArgs, redirect } from "@remix-run/node";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "~/supabase.server";
import { refreshToken, supabaseToken } from "./cookie";

const getToken = async (args: LoaderArgs): Promise<string> => {
  const cookieHeader =
    args.request.headers.get("Cookie");
  return await supabaseToken.parse(cookieHeader);
};

const getRefreshToken = async (args: LoaderArgs): Promise<string> => {
  const cookieHeader =
    args.request.headers.get("Cookie");
  return await refreshToken.parse(cookieHeader);
};


export const isAuthenticated = async (
  args: LoaderArgs | ActionArgs,
  redirectUrl?: string
) => {
  const { result, headers } = await refreshSession(args);
  if(result) {
    redirect(redirectUrl ?? "/", { headers: headers });
  }
  console.log("tried to refresh session, result:")
  console.log(result)
  const token = await getToken(args);
  if (!token){
    try {
      const result = await refreshSession(args);
      return result.result;
    } catch (error) {
      console.log(error)
      return false
    }
  }
  return true;
};

export async function getTokens(args: LoaderArgs): Promise<{ access_token: string, refresh_token: string }> {
  return { access_token: await getToken(args), refresh_token: await getRefreshToken(args) };
}

export const refreshSession = async (args: LoaderArgs): Promise<{result: boolean, headers: Headers | null}> => {
  const refresh_token = await getRefreshToken(args);
  const access_token = await getToken(args);

  // const { data, error } = await supabase.auth.setSession({ access_token, refresh_token })
  const { data, error } = await supabase.auth.refreshSession({refresh_token});
  if (error) {
    console.log("could not refresh sesssion")
    console.log(error.message)
    return { result: false, headers: null }
  } else {
    console.log("set new session")
    const headers = await setSession(data);
    return { result: true, headers }
  }
}

export async function setSession(data: { user: User | null, session: Session | null }): Promise<Headers> {
  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    await supabaseToken.serialize(data.session?.access_token, {
      expires: new Date(data?.session?.expires_at ?? 1),
      maxAge: data.session?.expires_in,
    })
  );
  headers.append(
    "Set-Cookie",
    await refreshToken.serialize(data.session?.refresh_token)
  );
  return headers;
}