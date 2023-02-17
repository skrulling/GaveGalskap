import { redirect } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { isAuthenticated } from "~/utils/auth";
import { createNewClient } from "~/supabase.server";

export const loader = async (args: LoaderArgs) => {
  if (await isAuthenticated(args)) {
    const supabase = await createNewClient(args);
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userData) {
      const userId = userData.user?.id;
      let { data: wishlist, error: wishlistError } = await supabase
        .from("wishlist")
        .select("*");
      const yourWishlists = wishlist?.filter(
        (list: any) => list.owner === userId
      );
      const otherWishlists = wishlist?.filter(
        (list: any) => list.owner !== userId
      );
      return { yourWishlists, otherWishlists, error: wishlistError };
    }
    return { wishlists: null, error: userError };
  } else {
    return redirect("/login");
  }
};

export default function Index() {
  const { yourWishlists, otherWishlists, error } = useLoaderData();
  return (
    <div className="flex justify-center p-6">
      <div>
        <h1 className="text-gray-900 dark:text-white text-2xl font-bold m-10">
          Velkommen til gavegalskap 🔥
        </h1>
        {error === null ? (
          <div>
            <ul className="mb-5">
              <h1 className="text-gray-500 text-xl mb-5">Dine ønskelister</h1>
              {yourWishlists?.length < 1 && <p>Du har ingen ønskelister 😥</p>}
              {yourWishlists.map((wishlist: any, idx: number) => (
                <li key={idx}>
                  <h1 className="text-gray-900 dark:text-white" key={`title-${wishlist.id}${idx}`}>
                    <Link
                      prefetch="intent"
                      to={`/wishlist/${wishlist.id}`}
                      className="font-bold text-lg text-primary-50 hover:underline"
                    >
                      {wishlist.title}
                    </Link>
                  </h1>
                </li>
              ))}
            </ul>
            <Link to={"wishlist/new"}>
              <button className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                Lag en ny ønskeliste
              </button>
            </Link>
            <ul>
              <h1 className="text-gray-500 text-xl mb-5 mt-10">Andre ønskelister</h1>
              {otherWishlists?.length < 1 && (
                <p>Finner ingen andre ønskelister 😥</p>
              )}
              {otherWishlists.map((wishlist: any, idx: number) => (
                <li key={idx}>
                  <h1 className="text-gray-900 dark:text-white" key={`title-${wishlist.id}${idx}`}>
                    <Link
                      prefetch="intent"
                      to={`/wishlist/${wishlist.id}`}
                      className="font-bold text-lg text-primary-50 hover:underline"
                    >
                      {wishlist.title}
                    </Link>
                  </h1>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>{error}</p>
        )}
      </div>
    </div>
  );
}
