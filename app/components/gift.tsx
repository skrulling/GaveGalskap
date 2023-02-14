import { Form } from "@remix-run/react";
import type { Gift } from "~/types/gift";

interface GiftProps {
    gift: Gift;
    isAuth: boolean;
    userId?: string;
}

export function Gift({ gift, isAuth, userId }: GiftProps): JSX.Element {
    return (
        <div key={gift.id}>
            <div className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
                <h3 className="mb-4 text-2xl font-semibold">{gift.name}</h3>
                <h5 className="font-light text-gray-500 sm:text-lg dark:text-gray-400 mb-5">
                    {gift.description}
                </h5>
                {gift.image && (
                    <>
                        <img src={gift.image} alt="gift" className="w-full rounded-lg" />
                        <br />
                    </>
                )}
                <a href={gift.url} target="_blank" className="mt-3 font-medium text-primary-600 hover:underline dark:text-primary-500">Lenke</a>
                {isAuth && gift.taken_by !== userId ? (
                    <p className="m-5">
                        {gift.taken ?
                            "Noen har kjøpt denne gaven 🙌"
                            : "Ingen har kjøpt denne gaven enda 🛒"}
                    </p>
                ) : (
                    <>
                        <p className="m-5">
                            Du har kjøpt denne gaven!
                        </p>
                        <Form method="post">
                            <input type="hidden" name="id" value={gift.id} />
                            <button
                                type="submit"
                                name="intent"
                                value="undo"
                                className="mt-5 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900"
                            >
                                Angre
                            </button>
                        </Form>
                    </>

                )}
                {(!gift.taken && isAuth) && (
                    <Form method="post">
                        <input type="hidden" name="id" value={gift.id} />
                        <button
                            type="submit"
                            name="intent"
                            value="take"
                            className="mt-5 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900"
                        >
                            Jeg har kjøpt denne
                        </button>
                    </Form>
                )}
            </div>
        </div>
    )
}