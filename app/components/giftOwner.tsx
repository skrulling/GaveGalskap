import { useFetcher } from "@remix-run/react";
import type { Gift } from "~/types/gift";
import { Spinner } from "./spinner";

interface GiftOwnerProps {
    gift: Gift;
    wishlistId: number;
}

export function GiftOwner({ gift, wishlistId }: GiftOwnerProps): JSX.Element {
    const fetcher = useFetcher();
    return (
        <div key={gift.id}>
            <div className="flex flex-col p-6 mx-auto max-w-lg text-center rounded-lg border shadow border-gray-600 xl:p-8 bg-gray-800 text-white">
                <h3 className="mb-4 text-2xl font-semibold">{gift.name}</h3>
                <h5 className="sm:text-lg text-gray-400 mb-5">
                    {gift.description}
                </h5>
                {gift.image && (
                    <>
                        <img src={gift.image} alt="gift" className="w-full rounded-lg" />
                        <br />
                    </>
                )}
                <a href={gift.url} target="_blank" className="mt-3 font-medium hover:underline text-primary-500">Lenke</a>
                <fetcher.Form method="post" action={`/wishlist/${wishlistId}`}>
                    <input type="hidden" name="id" value={gift.id} />
                    <button
                        type="submit"
                        name="intent"
                        value="remove"
                        disabled={fetcher.state === "submitting"}
                        className="mt-5 bg-primary-600 hover:bg-primary-700 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center text-white  focus:ring-primary-900"
                    >
                        {fetcher.state === "submitting" ? <Spinner /> : "Ta vekk"}
                    </button>
                </fetcher.Form>
            </div>
        </div>
    )
}