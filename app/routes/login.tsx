import { redirect } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { login } from "~/utils/session.server";
import { refreshToken, supabaseToken } from "~/utils/cookie";
import { Link } from "react-router-dom";

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();

  const email = formData.get("email");
  const password = formData.get("password");

  const { data, error } = await login({ email, password });
  if (data?.session) {
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
    return redirect("/", {
      headers: headers,
    });
  }
};

export default function Login() {
  return (
    <div>
      <h1>Logg deg inn 😎</h1>
      <form method="post">
        <div>
          <label htmlFor="email-input">Epost</label>
          <input type="text" id="email-input" name="email" />
        </div>
        <div>
          <label htmlFor="password-input">Passord</label>
          <input id="password-input" name="password" type="password" />
        </div>
        <button type="submit" className="button">
          Logg inn 💎
        </button>
      </form>
      <p>Om du ikke har en bruker enda, registrer deg <span><Link to={"/signup"}>HER</Link></span></p>
    </div>
  );
}
