import { PlusIcon } from "@heroicons/react/24/solid";
import { redirect } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { Link, useLoaderData, useNavigation } from "@remix-run/react";
import React from "react";
import { IconButton } from "~/components/IconButton";
import { LoadingButton } from "~/components/loadingButton";
import { createSupabase } from "~/supabase.server";

export async function loader({ request }: LoaderArgs) {
  const { client: supabase } = createSupabase(request);
  const session = await supabase.auth.getSession();
  console.log(session.data);

  if (session.data.session !== null) {
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
    console.log("redirect to login");
    return redirect("/login");
  }
}

export default function Index() {
  const { yourWishlists, otherWishlists, error } = useLoaderData();
  const navigation = useNavigation();
  const Icon: React.FC = () => <PlusIcon className="h-5 w-5" />;
  return (
    <div className="flex justify-center p-6">
      <div>
        <h1 className="text-white text-2xl font-bold m-10">
          Velkommen til gavegalskap 🔥
        </h1>
        {error === null ? (
          <div>
            <ul className="mb-5">
              <h1 className="text-gray-500 text-xl mb-5">Dine ønskelister</h1>
              {yourWishlists?.length < 1 && <p>Du har ingen ønskelister 😥</p>}
              {yourWishlists.map((wishlist: any, idx: number) => (
                <li key={idx}>
                  <h1 className="text-white" key={`title-${wishlist.id}${idx}`}>
                    <Link
                      prefetch="intent"
                      to={`/wishlist/${wishlist.id}`}
                      className="font-bold text-lg  hover:underline"
                    >
                      {wishlist.title}
                    </Link>
                  </h1>
                </li>
              ))}
            </ul>
            <Link to={"wishlist/new"}>
              <IconButton
                isSubmitting={navigation.state === "submitting"}
                text="Lag en ny ønskeliste"
                isWide={false}
                Icon={Icon}
              />
            </Link>
            <ul>
              <h1 className="text-gray-500 text-xl mb-5 mt-10">
                Andre ønskelister
              </h1>
              {otherWishlists?.length < 1 && (
                <p>Finner ingen andre ønskelister 😥</p>
              )}
              {otherWishlists.map((wishlist: any, idx: number) => (
                <li key={idx}>
                  <h1 className="text-white" key={`title-${wishlist.id}${idx}`}>
                    <Link
                      prefetch="intent"
                      to={`/wishlist/${wishlist.id}`}
                      className="font-bold text-lg hover:underline"
                    >
                      {wishlist.title}
                    </Link>
                  </h1>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>{error ? error.message || "An unknown error occurred" : null}</p>
        )}
      </div>
    </div>
  );
}
