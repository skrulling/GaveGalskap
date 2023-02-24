import { Link } from "@remix-run/react";

export function Navbar(): JSX.Element {
    return (
        <nav className="border-gray-200 px-2 sm:px-4 py-2.5 rounded bg-gray-900">
            <div className="container flex flex-wrap items-center justify-between mx-auto">
                <Link prefetch="intent" to="/" className="flex items-center">
                    <span className="self-center text-xl font-semibold whitespace-nowrap text-white">gavegalskap</span>
                </Link>
                <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                    <ul className="flex flex-col p-4 mt-4 border rounded-lg md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 bg-gray-800 md:bg-gray-900 border-gray-700">
                    </ul>
                </div>
            </div>
        </nav>
    )
}