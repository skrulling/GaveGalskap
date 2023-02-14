import { ActionArgs, json, redirect } from "@remix-run/node";
import { createNewClient, supabase } from "~/supabase.server";
import { isAuthenticated } from "~/utils/auth";
import type { LoaderArgs } from "@remix-run/node";
import { Link, useActionData, useLoaderData } from "@remix-run/react";
import { Gift } from "~/components/gift";

export const loader = async (args: LoaderArgs) => {
  const slug = args?.params?.slug;
  let giftsPromise = supabase
    .from("gift")
    .select("*")
    .eq("wishlist", slug);

  let wishlistPromise = supabase
    .from("wishlist")
    .select("title")
    .eq("id, owner", slug)
    .maybeSingle();

  if (await isAuthenticated(args)) {
    const supabase = await createNewClient(args);
    const user = await supabase.auth.getUser();
    let { data: wishlist, error: wishlistError } = await wishlistPromise;
    if (user.data.user?.id === wishlist?.owner)
      return redirect(`/wishlist/owner/${slug}`);

    let { data: gifts, error: giftsError } = await giftsPromise;
    return json({ gifts: gifts, error: giftsError, wishlist, wishlistError, isAuth: true, userId: user.data.user?.id });
  } else {
    let { data: wishlist, error: wishlistError } = await wishlistPromise;
    let { data: gifts, error: giftsError } = await giftsPromise;
    return json({ gifts, wishlist, giftsError, wishlistError, isAuth: false, userId: null });
  }
};

export const action = async (args: ActionArgs) => {
  if (await isAuthenticated(args)) {
    const supabase = await createNewClient(args);
    const formData = await args.request.formData();
    const user = await supabase.auth.getUser();

    const giftId = formData.get("id");
    const intent = formData.get("intent");
    if (intent === "take") {
      const { error } = await supabase
        .from("gift")
        .update({ taken: true, taken_by: user.data.user?.id ?? null })
        .eq("id", giftId);
      if (error) return error;
      return redirect(`/wishlist/visitor/${args.params.slug}`);
    } else {
      const { error } = await supabase
        .from("gift")
        .update({ taken: false, taken_by: null })
        .eq("id", giftId);
      if (error) return error;
      return redirect(`/wishlist/visitor/${args.params.slug}`);
    }
  } else {
    return redirect("/login");
  }
};

export default function WishListOwner() {
  const { gifts, error, wishlist, wishlistError, isAuth, userId } = useLoaderData();
  const actionData = useActionData();

  return (
    <>
      <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
        <div className="max-w-screen-md mb-8 lg:mb-16">
          <h1 className="text-white text-2xl font-bold m-10">
            {wishlist.title}
          </h1>
          {!isAuth && (
            <h3 className="text-white text-xl font-bold m-10">
              <span><Link to="/login" prefetch="intent" className="text-xl font-bold text-primary-600 hover:underline dark:text-primary-500">Logg inn</Link> for å se om en gave er kjøpt av noen andre</span>
            </h3>
          )}
        </div>
        {error && <p>{error}</p>}
        {actionData?.error && <p>{JSON.stringify(actionData.error)}</p>}
        <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
          {gifts.map((gift: any) => (
            <Gift gift={gift} isAuth={isAuth} userId={userId} />
          ))}
        </div>
      </div>
    </>
  );
}
