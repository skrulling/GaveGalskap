import { createCookie } from "@remix-run/node";
import type { CookieOptions} from "@remix-run/node";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  maxAge: 604_800,
  secrets: [sessionSecret],
  path: "/"
};

export const supabaseToken = createCookie("sb:token", {
  ...cookieOptions,
});

export const refreshToken = createCookie("sb:tokenrefresh", {
  ...cookieOptions,
});