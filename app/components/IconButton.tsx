import type { ComponentType } from "react";
import { LoadingButton } from "./loadingButton";

interface IconButtonProps {
  isSubmitting: boolean;
  text: string;
  isWide: boolean;
  Icon: ComponentType;
}

export function IconButton({
  isSubmitting,
  text,
  isWide,
  Icon,
}: IconButtonProps): JSX.Element {
  return (
    <button
      disabled={isSubmitting}
      type="submit"
      className={`${isWide && "w-full"} gap-2 px-5 py-2.5  text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
    >
      {isSubmitting ? <LoadingButton /> : <Icon />}
      {text}
    </button>
  );
}
