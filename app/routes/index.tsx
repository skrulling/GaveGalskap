import { Link, useLoaderData } from "@remix-run/react";
import { getGifts } from "./index.server";

export const loader = async () => {
  return getGifts();
};

export default function Index() {
  const gifts = useLoaderData();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to gaveguiden 🔥</h1>
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
