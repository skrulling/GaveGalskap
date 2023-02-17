import { ActionArgs, json, redirect } from "@remix-run/node";
import { createNewClient } from "~/supabase.server";
import { isAuthenticated } from "~/utils/auth";
import type { LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { GiftOwner } from "~/components/giftOwner";

export const loader = async (args: LoaderArgs) => {
  const slug = args?.params?.slug;
  if (await isAuthenticated(args)) {
    const supabase = await createNewClient(args);
    const user = await supabase.auth.getUser();
    let { data: gifts, error: giftsError } = await supabase
      .from("gift")
      .select("*")
      .eq("wishlist", slug);
    let { data: wishlist, error: wishlistError } = await supabase
      .from("wishlist")
      .select("*")
      .eq("id", slug)
      .maybeSingle();

    if (user.data.user?.id !== wishlist?.owner)
      return redirect(`/wishlist/visitor/${slug}`);

    return json({ gifts: gifts, error: giftsError, wishlist, wishlistError });
  } else {
    return redirect("/login");
  }
};

export const action = async (args: ActionArgs) => {
  if (await isAuthenticated(args)) {
    const supabase = await createNewClient(args);
    const formData = await args.request.formData();
    const intent = formData.get("intent");
    if (intent === "add") {
      const name = formData.get("name");
      const description = formData.get("description");
      const url = formData.get("url");
      const imageUrl = formData.get("imageUrl");
      const { data, error } = await supabase.from('gift').insert([
        { name: name, description: description, url: url, image: imageUrl, taken: false, wishlist: args.params.slug }
      ])
      console.log(error)
      return redirect(`/wishlist/owner/${args.params.slug}`);
    } else {
      const id = formData.get("id");
      const { data, error } = await supabase
        .from('gift')
        .delete()
        .eq('id', id)
      console.log(error)
      return redirect(`/wishlist/owner/${args.params.slug}`);
    }
  } else {
    return redirect("/login");
  }
};

export default function WishListOwner() {
  const { gifts, error, wishlist, wishlistError } = useLoaderData();

  return (
    <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
      <div className="max-w-screen-md mb-8 lg:mb-16">
        {error && <p className="text-red">{error}</p>}
          <h1 className="text-gray-900 dark:text-white text-2xl font-bold m-10">
          {wishlist.title}
        </h1>
      </div>
      <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Legg til ønske
            </h1>
            <Form className="space-y-4 md:space-y-6" method="post">
              <p>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Navn:
                  <input type="text" name="name" placeholder="navn"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </label>
              </p>
              <p>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Beskrivelse:
                  <input type="text" name="description" placeholder="beskrivelse" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </label>
              </p>
              <p>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Lenke:
                  <input type="text" name="url" placeholder="lenke til butikk" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </label>
              </p>
              <p>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Bilde:
                  <input type="text" name="imageUrl" placeholder="lenke til bilde" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </label>
              </p>
              <button
                name="intent"
                value="add"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                type="submit">Legg til ønske</button>
            </Form>
          </div>
        </div>
        {gifts.map((gift: any) => (
          <GiftOwner gift={gift} />
        ))}
      </div>
    </div>
  );
}
