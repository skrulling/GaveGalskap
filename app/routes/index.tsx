import { redirect } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { isAuthenticated } from "~/utils/auth";
import { createNewClient } from "~/supabase.server";

export const loader = async (args: LoaderArgs) => {
  if (await isAuthenticated(args)) {
    const supabase = await createNewClient(args);
    let { data: gifts, error } = await supabase.from("gift").select("*");
    return { gifts, error };
  } else {
    return redirect("/login");
  }
};

export default function Index() {
  const { gifts, error } = useLoaderData();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to gavegalskap 🔥</h1>
      <Link to="/signup">Sign up</Link>
      <ul>
        {gifts.map((gift: any, idx: number) => (
          <div key={idx}>
            <h1 key={`title-${gift.id}${idx}`}>{gift.name}</h1>
            <h3 key={`desc-${gift.description}${idx}`}>{gift.description}</h3>
            <a key={`url-${gift.url}${idx}`} href={gift.url}>
              Prisguiden
            </a>
            <img key={`img-${gift.img}${idx}`} src={gift.image} alt="ps5" />
          </div>
        ))}
      </ul>
    </div>
  );
}
