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
      .eq("id", giftId);
    if (error) return error;
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
      <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
        <div className="max-w-screen-md mb-8 lg:mb-16">
          <h1 className="text-white text-2xl font-bold m-10">
            {wishlist.title}
          </h1>
        </div>
        {error && <p>{error}</p>}
        {actionData?.error && <p>{JSON.stringify(actionData.error)}</p>}
        <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
          {gifts.map((gift: any) => (
            <div key={gift.id}>
              <div className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
                <h3 className="mb-4 text-2xl font-semibold">{gift.name}</h3>
                <h5 className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
                  {gift.description}
                </h5>
                {gift.image && (
                  <>
                    <img src={gift.image} alt="gift" className="w-full rounded-lg" />
                    <br />
                  </>
                )}
                <a href={gift.url} className="mt-3 font-medium text-primary-600 hover:underline dark:text-primary-500">Lenke</a>
                <p className="m-5">
                  Kjøpt:{" "}
                  {gift.taken
                    ? "Noen har kjøpt denne gaven 🙌"
                    : "Ingen har kjøpt denne gaven enda 🛒"}
                </p>
                {!gift.taken && (
                  <Form method="post">
                    <input type="hidden" name="id" value={gift.id} />
                    <button
                      type="submit"
                      className="mt-5 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900"
                    >
                      Jeg har kjøpt denne
                    </button>
                  </Form>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
