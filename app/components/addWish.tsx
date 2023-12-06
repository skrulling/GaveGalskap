import { useFetcher } from "@remix-run/react";
import { LoadingButton } from "./loadingButton";
import { useEffect, useRef } from "react";

interface AddWishProps {
  wishlistId: number;
}

export function AddWish({ wishlistId }: AddWishProps): JSX.Element {
  const formRef = useRef<HTMLFormElement>(null);
  const fetcher = useFetcher();
  const isLoading = fetcher.state === "loading" || fetcher.state === "submitting";

  useEffect(() => {
    if(fetcher.state === "submitting") {
      formRef.current?.reset();
    }
  }, [fetcher])

  return (
    <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700">
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
          Legg til ønske
        </h1>
        <fetcher.Form
          ref={formRef}
          className="space-y-4 md:space-y-6"
          method="post"
          action={`/wishlist/${wishlistId}`}
        >
          <p>
            <label className="block mb-2 text-sm font-medium text-white">
              Navn:
              <input
                type="text"
                name="name"
                placeholder="navn"
                className="border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </label>
          </p>
          <p>
            <label className="block mb-2 text-sm font-medium text-white">
              Beskrivelse:
              <input
                type="text"
                name="description"
                placeholder="beskrivelse"
                className="border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </label>
          </p>
          <p>
            <label className="block mb-2 text-sm font-medium text-white">
              Lenke:
              <input
                type="text"
                name="url"
                placeholder="lenke til butikk"
                className="border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </label>
          </p>
          <p>
            <label className="block mb-2 text-sm font-medium text-white">
              Bilde:
              <input
                type="text"
                name="imageUrl"
                placeholder="lenke til bilde"
                className="border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </label>
          </p>
          <button
            name="intent"
            value="add"
            disabled={fetcher.state === "submitting"}
            className="w-full text-white focus:ring-4 focus:outline-none font-medium rounded-lg px-5 py-2.5 text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800"
            type="submit"
          >
            {isLoading && <LoadingButton />}Legg til ønske
          </button>
        </fetcher.Form>
      </div>
    </div>
  );
}
