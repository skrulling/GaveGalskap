import { json, redirect } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { login } from "~/utils/session.server";
import { refreshToken, supabaseToken } from "~/utils/cookie";
import { Link, Form, useActionData } from "@remix-run/react";

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
  console.log(error);
  return { error };
};

export default function Login() {
  const actionData = useActionData();
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Logg deg inn tjommi 🥳
          </h1>
          {actionData?.error && (
            <p>Error: {JSON.stringify(actionData.error.message)}</p>
          )}
          <Form className="space-y-4 md:space-y-6" method="post">
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Din epost
              </label>
              <input
                type="email"
                name="email"
                id="email-input"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="din@epost.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Passord
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <Link
                to={"#"}
                className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Glemt passord?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Logg inn
            </button>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Har du ikke bruker enda?{" "}
              <Link
                to={"/signup"}
                prefetch="intent"
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Registrer deg
              </Link>
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
}
