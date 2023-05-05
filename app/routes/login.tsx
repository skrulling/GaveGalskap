import { redirect } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { login } from "~/utils/session.server";
import { Link, Form, useActionData } from "@remix-run/react";
import { setSession } from "~/utils/auth";

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();

  const email = formData.get("email");
  const password = formData.get("password");

  const { data, error } = await login({ email, password });
  if (data?.session) {
    const headers = await setSession(data);
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
      <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
            Logg deg inn tjommi 🥳
          </h1>
          {actionData?.error && (
            <p>Error: {JSON.stringify(actionData.error.message)}</p>
          )}
          <Form className="space-y-4 md:space-y-6" method="post">
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-white"
              >
                Din epost
              </label>
              <input
                type="email"
                name="email"
                id="email-input"
                className="border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="din@epost.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-white"
              >
                Passord
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <Link
                to={"#"}
                className="text-sm font-medium hover:underline text-primary-500"
              >
                Glemt passord?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800"
            >
              Logg inn
            </button>
            <p className="text-sm font-light text-gray-400">
              Har du ikke bruker enda?{" "}
              <Link
                to={"/signup"}
                prefetch="intent"
                className="font-medium hover:underline text-primary-500"
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
