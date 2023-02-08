import { useLoaderData } from "@remix-run/react";
import { getGifts } from "./index.server";

export const loader = async () => {
  return getGifts();
};

export default function Index() {
  const gifts = useLoaderData();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to gaveguiden 🔥</h1>
      <ul>
        {gifts.map((gift: any) => (
          <>
          <h1 key={`title-${gift.id}`}>{gift.name}</h1>
          <h3 key={`desc-${gift.id}`}>{gift.description}</h3>
          <a key={`url-${gift.id}`} href={gift.url}>Prisguiden</a>
          <img key={`img-${gift.id}`} src={gift.image} alt="ps5"/>
          </>
        ))}
      </ul>
    </div>
  );
}
