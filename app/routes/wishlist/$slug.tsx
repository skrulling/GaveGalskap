import { createNewClient, supabase } from "~/supabase.server";
import { isAuthenticated } from "~/utils/auth";
import { ActionArgs, LoaderArgs, redirect } from "@remix-run/node";
import type { Gift, SafeGift } from "~/types/gift";
import { json } from "react-router";
import { useLoaderData } from "@remix-run/react";
import { GiftOwner } from "~/components/giftOwner";
import { GiftVisitor } from "~/components/giftVisitor";
import { AddWish } from "~/components/addWish";
import Suggestions from "../suggestions";
import { WishlistTitleEditor } from "~/components/wishlistTitleEditor";
import { createServerClient, parse, serialize } from "@supabase/ssr";

export const loader = async (args: LoaderArgs) => {
  const cookies = parse(args.request.headers.get('Cookie') ?? '')
  const headers = new Headers()

  const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      get(key) {
        return cookies[key]
      },
      set(key, value, options) {
        headers.append('Set-Cookie', serialize(key, value, options))
      },
      remove(key, options) {
        headers.append('Set-Cookie', serialize(key, '', options))
      },
    },
  })
  const session = await supabase.auth.getSession()
  const slug = args?.params?.slug;
  const giftsPromise = supabase.from("gift").select("*").eq("wishlist", slug);

  const wishlistPromise = supabase
    .from("wishlist")
    .select("title, owner, id")
    .eq("id", slug)
    .maybeSingle();

  if (session.data.session !== null) {
    const user = await supabase.auth.getUser();
    let { data: wishlist, error: wishlistError } = await wishlistPromise;
    let { data: gifts, error: giftsError } = await giftsPromise;

    if (user?.data.user?.id === wishlist?.owner) {
      const safeGifts: SafeGift[] | undefined = gifts?.map((gift: Gift) => ({
        id: gift.id,
        name: gift.name,
        description: gift.description,
        image: gift.image,
        url: gift.url,
      }));
      return json({
        isOwner: true,
        isAuthenticated: true,
        userId: user?.data.user?.id,
        gifts: safeGifts,
        wishlist: wishlist,
      });
    } else {
      return json({
        isOwner: false,
        isAuthenticated: true,
        userId: user?.data.user?.id,
        gifts: gifts,
        wishlist: wishlist,
      });
    }
  } else {
    let { data: wishlist, error: wishlistError } = await wishlistPromise;
    let { data: gifts, error: giftsError } = await giftsPromise;
    const safeGifts: SafeGift[] | undefined = gifts?.map((gift: Gift) => ({
      id: gift.id,
      name: gift.name,
      description: gift.description,
      image: gift.image,
      url: gift.url,
    }));
    return json({
      isOwner: false,
      isAuthenticated: false,
      userId: undefined,
      gifts: safeGifts,
      wishlist: wishlist,
    });
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
      const { data, error } = await supabase.from("gift").insert([
        {
          name: name,
          description: description,
          url: url,
          image: imageUrl,
          taken: false,
          wishlist: args.params.slug,
        },
      ]);
      return null;
    }
    if (intent === "take") {
      const giftId = formData.get("id");
      const user = await supabase.auth.getUser();
      const { error } = await supabase
        .from("gift")
        .update({ taken: true, taken_by: user.data.user?.id ?? null })
        .eq("id", giftId);
      return null;
    }
    if (intent === "editTitle") {
      const newTitle = formData.get("newTitle");
      const wishlistId = formData.get("wishlistId");

      await supabase
        .from("wishlist")
        .update({ title: newTitle })
        .eq("id", wishlistId);
      return null;
    }
    if (intent === "undo") {
      const giftId = formData.get("id");
      const { error } = await supabase
        .from("gift")
        .update({ taken: false, taken_by: null })
        .eq("id", giftId);
      return null;
    } else {
      const id = formData.get("id");
      const { data, error } = await supabase.from("gift").delete().eq("id", id);
      return null;
    }
  } else {
    return redirect("/login");
  }
};

export default function WishlistRoute() {
  const { isOwner, isAuthenticated, gifts, wishlist, userId } =
    useLoaderData<typeof loader>();
  return (
    <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
      <div className="max-w-screen-md mb-8 lg:mb-16">
      <WishlistTitleEditor initialTitle={wishlist.title} wishlistId={wishlist.id} isOwner={isOwner} />
      </div>
      <div className="space-y-8 grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 md:gap-12 md:space-y-0">
        {isOwner && <AddWish wishlistId={wishlist.id} />}
        {isOwner && <Suggestions gifts={gifts} />}
        {gifts.map((gift: any) => {
          if (isOwner) {
            return (
              <GiftOwner
                gift={gift}
                wishlistId={wishlist.id}
                key={`${gift.id}`}
              />
            );
          } else {
            return (
              <GiftVisitor
                gift={gift}
                isAuth={isAuthenticated}
                userId={userId}
                key={`${gift.id}`}
              />
            );
          }
        })}
      </div>
    </div>
  );
}
