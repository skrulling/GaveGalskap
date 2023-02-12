import { ActionArgs, LoaderArgs, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { createNewClient } from "~/supabase.server";
import { isAuthenticated } from "~/utils/auth";

export const loader = async (args: LoaderArgs) => {
  if (await isAuthenticated(args)) {
    return null;
  } else {
    return redirect("/login");
  }
};

export const action = async (args: ActionArgs) => {
  if (await isAuthenticated(args)) {
    const supabase = await createNewClient(args);
    const formData = await args.request.formData();
    const user = await supabase.auth.getUser();

    const name = formData.get("name");
    const { data, error } = await supabase.from('wishlist').insert([
      { title: name, owner: user.data.user?.id }
    ]).select();
    if(data) {
        return redirect(`/wishlist/owner/${data[0].id}`);
    } else {
        return error;
    }
  } else {
    return redirect("/login");
  }
};

export default function NewWishlist() {
    const actionData = useActionData();
  return (
    <>
      <h1>Lag en ny ønskeliste 🤑</h1>
      {actionData?.error && (
        <p>Error: {JSON.stringify(actionData.error)}</p>
      )}
      <Form method="post">
        <p>
          <label>
            Navn:
            <input type="text" name="name" placeholder="navn" />
          </label>
        </p>
        <button type="submit">Opprett ønskeliste</button>
      </Form>
    </>
  );
}
