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
      let { data: wishlist, error: wishlistError } = await supabase.from("wishlist").select("*").eq('owner', userId);
      return { wishlists: wishlist, error: wishlistError };
    }
    return { wishlists: null, error: userError };
  } else {
    return redirect("/login");
  }
};

export default function Index() {
  const { wishlists, error } = useLoaderData();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Velkommen til gavegalskap 🔥</h1>
      {error === null ? (
        <ul>
          {wishlists.map((wishlist: any, idx: number) => (
            <li key={idx}>
              <h1 key={`title-${wishlist.id}${idx}`}><Link to={`/wishlist/${wishlist.id}`}>{wishlist.title}</Link></h1>
            </li>
          ))}
        </ul>
      ) : (
        <p>{error}</p>
      )}
    </div>
  );
}
