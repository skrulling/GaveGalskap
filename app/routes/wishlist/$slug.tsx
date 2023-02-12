import { ActionArgs, json, redirect } from "@remix-run/node";
import { createNewClient } from "~/supabase.server";
import { isAuthenticated } from "~/utils/auth";
import type { LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

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
    return json({ gifts: gifts, error: giftsError, wishlist, wishlistError });
  } else {
    return redirect("/login");
  }
};

export const action = async (args: ActionArgs) => {
  if (await isAuthenticated(args)) {
    const supabase = await createNewClient(args);
    const formData = await args.request.formData();

    const name = formData.get("name");
    const description = formData.get("description");
    const url = formData.get("url");
    const imageUrl = formData.get("imageUrl");
    const { data, error } = await supabase.from('gift').insert([
      { name: name, description: description, url: url, image: imageUrl, taken: false, wishlist: args.params.slug }
    ])
    console.log(error)
    return redirect(`/wishlist/${args.params.slug}`);
  } else {
    return redirect("/login");
  }
};

export default function WishlistRoute() {
  const { gifts, error, wishlist, wishlistError } = useLoaderData();

  return (
    <>
      {error && <p>{error}</p>}
      <h1>{wishlist.title}</h1>
      {gifts.map((gift: any) => (
        <div key={gift.id}>
          <h3>{gift.name}</h3>
        </div>
      ))}
      <h1>Legg til et nytt ønske 🤑</h1>
      <Form method="post">
        <p>
          <label>
            Navn:
            <input type="text" name="name" placeholder="navn" />
          </label>
        </p>
        <p>
          <label>
            Beskrivelse:
            <input type="text" name="description" placeholder="beskrivelse" />
          </label>
        </p>
        <p>
          <label>
            Lenke:
            <input type="text" name="url" placeholder="lenke til butikk" />
          </label>
        </p>
        <p>
          <label>
            Bilde:
            <input type="text" name="imageUrl" placeholder="lenke til bilde" />
          </label>
        </p>
        <button type="submit">Legg til ønske</button>
      </Form>
    </>
  );
}
