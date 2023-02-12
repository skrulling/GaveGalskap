import type { ActionArgs, LoaderArgs } from "@remix-run/node";
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
) => {
  const token = await getToken(args);
  if (!token)
    return false;
  return true;
};

export async function getTokens(args: LoaderArgs): Promise<{ access_token: string, refresh_token: string }> {
  return { access_token: await getToken(args), refresh_token: await getRefreshToken(args) };
} 