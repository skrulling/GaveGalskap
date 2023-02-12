import { ActionArgs, json, redirect } from "@remix-run/node";
import { createNewClient } from "~/supabase.server";
import { isAuthenticated } from "~/utils/auth";
import type { LoaderArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";

export const loader = async (args: LoaderArgs) => {
  const slug = args?.params?.slug;
  if (await isAuthenticated(args)) {
    const supabase = await createNewClient(args);
    let { data: gifts, error: giftsError } = await supabase
      .from("gift")
      .select("*")
      .eq("wishlist", slug);
    let { data: wishlist, error: wishlistError } = await supabase
      .from("wishlist")
      .select("*")
      .eq("id", slug)
      .maybeSingle();
    const user = await supabase.auth.getUser();
    if (user.data.user?.id === wishlist.owner)
      return redirect(`/wishlist/owner/${slug}`);
    return json({ gifts: gifts, error: giftsError, wishlist, wishlistError });
  } else {
    return redirect("/login");
  }
};

export const action = async (args: ActionArgs) => {
  if (await isAuthenticated(args)) {
    const supabase = await createNewClient(args);
    const formData = await args.request.formData();

    const giftId = formData.get("id");
    console.log(giftId);

    const { error } = await supabase
      .from("gift")
      .update({ taken: true })
      .eq('id', giftId);
    if(error) return error;
    return redirect(`/wishlist/visitor/${args.params.slug}`);
  } else {
    return redirect("/login");
  }
};

export default function WishListOwner() {
  const { gifts, error, wishlist, wishlistError } = useLoaderData();
  const actionData = useActionData();

  return (
    <>
      {error && <p>{error}</p>}
      {actionData?.error && <p>{JSON.stringify(actionData.error)}</p>}
      <h1>{wishlist.title}</h1>
      {gifts.map((gift: any) => (
        <div key={gift.id}>
          <h3>{gift.name}</h3>
          <p>Kjøpt: {gift.taken ? 'Noen har kjøpt denne gaven 🙌' : 'Ingen har kjøpt denne gaven enda 🛒'}</p>
          {!gift.taken && (
            <Form method="post">
              <input type="hidden" name="id" value={gift.id} />
              <button type="submit">Jeg har kjøpt denne</button>
            </Form>
          )}
        </div>
      ))}
    </>
  );
}
