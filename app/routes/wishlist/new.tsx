import { PlusIcon } from "@heroicons/react/24/solid";
import { type ActionArgs, type LoaderArgs, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import React from "react";
import { IconButton } from "~/components/IconButton";
import { LoadingButton } from "~/components/loadingButton";
import { createSupabase } from "~/supabase.server";
import { isAuthenticated } from "~/utils/auth";

export const loader = async (args: LoaderArgs) => {
  const { client: supabase } = createSupabase(args.request);
  if (await isAuthenticated(supabase)) {
    return null;
  } else {
    return redirect("/login");
  }
};

export const action = async (args: ActionArgs) => {
  const { client: supabase } = createSupabase(args.request);
  if (await isAuthenticated(supabase)) {
    const formData = await args.request.formData();
    const user = await supabase.auth.getUser();

    const name = formData.get("name");
    const { data, error } = await supabase
      .from("wishlist")
      .insert([{ title: name, owner: user.data.user?.id }])
      .select();
    if (data) {
      return redirect(`/wishlist/${data[0].id}`);
    } else {
      return error;
    }
  } else {
    return redirect("/login");
  }
};

export default function NewWishlist() {
  const navigation = useNavigation();
  const actionData = useActionData();
  const isSubmitting = navigation.formAction === "/wishlist/new";
  const PlussIcon: React.FC = () => (
    <PlusIcon className="h-5 w-5 text-white hover:text-gray-200" />
  );
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
            Lag en ny ønskeliste 🤑
          </h1>
          {actionData?.error && (
            <p>Error: {JSON.stringify(actionData.error)}</p>
          )}
          <Form className="space-y-4 md:space-y-6" method="post">
            <p>
              <label className="block mb-2 text-sm font-medium text-white">
                Navn på ønskeliste:
                <input
                  type="text"
                  name="name"
                  placeholder="navn"
                  className="border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                />
              </label>
            </p>
            <IconButton
              Icon={PlussIcon}
              isSubmitting={isSubmitting}
              text="Opprett ønskeliste"
              isWide={false}
            />
          </Form>
        </div>
      </div>
    </div>
  );
}
