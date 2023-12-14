import { HomeIcon } from "@heroicons/react/24/solid";
import { Link, useNavigation } from "@remix-run/react";
import { Loading } from "./loading";

export function Navbar(): JSX.Element {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  return (
    <nav className="px-2 sm:px-4 py-2.5 bg-gray-900 border-t border-gray-400 md:border-t-0 fixed bottom-0 inset-x-0 z-50 md:relative">
      <div className="container flex flex-wrap items-center justify-center mx-auto">
        <Link
          prefetch="intent"
          to="/"
          className="flex items-center justify-center md:justify-start"
        >
          {isLoading ? (
            <span className="md:mr-2"><Loading /></span>
          ) : (
            <HomeIcon className="h-5 w-5 text-white md:mr-2" />
          )}
          <span className="self-center text-xl font-semibold whitespace-nowrap text-white hidden md:flex">
            GaveGalskap
          </span>
        </Link>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="flex flex-col p-4 mt-4 border rounded-lg md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 bg-gray-800 md:bg-gray-900 border-gray-700"></ul>
        </div>
      </div>
    </nav>
  );
}
