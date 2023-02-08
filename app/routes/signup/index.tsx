import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { signUp } from "~/models/signup.server";

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();

  const email = formData.get("email");
  const password = formData.get("password");

  await signUp({ email, password });

  return redirect("/");
};

export default function Index() {
  return (
    <div>
      <h1>Sign up 💎</h1>
      <Form method="post">
        <p>
            <label>
                Email: 
                <input type="text" name="email" placeholder="email" />
            </label>
        </p>
        <p>
            <label>
                Password: 
                <input type="password" name="password" placeholder="password" />
            </label>
        </p>
        <button type="submit">Create user</button>
      </Form>
    </div>
  );
}
