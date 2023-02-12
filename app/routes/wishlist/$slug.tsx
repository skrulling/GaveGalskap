import { redirect } from "@remix-run/node";
import { createNewClient } from "~/supabase.server";
import { isAuthenticated } from "~/utils/auth";
import type { LoaderArgs } from "@remix-run/node";

export const loader = async (args: LoaderArgs) => {
  const slug = args?.params?.slug;
  if (await isAuthenticated(args)) {
    const supabase = await createNewClient(args);
    let { data: wishlist, error: wishlistError } = await supabase
      .from("wishlist")
      .select("*")
      .eq("id", slug)
      .maybeSingle();
    const user = await supabase.auth.getUser();
    return user.data.user?.id === wishlist.owner ? redirect(`/wishlist/owner/${slug}`) : redirect(`/wishlist/visitor/${slug}`)
  } else {
    return redirect("/login");
  }
};


export default function WishlistRoute() {

  return (
    <>
      <h1>Loading</h1>
    </>
  );
}
