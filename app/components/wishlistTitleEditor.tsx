import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import { CheckIcon, PencilSquareIcon } from '@heroicons/react/24/solid'

interface WishlistTitleEditorProps {
  wishlistId: string;
  initialTitle: string;
  isOwner: boolean;
}

export function WishlistTitleEditor({
  wishlistId,
  initialTitle,
  isOwner,
}: WishlistTitleEditorProps) {
  const fetcher = useFetcher();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [tempTitle, setTempTitle] = useState(initialTitle); // Temporary state for editing

  const handleEdit = () => {
    setTempTitle(title); // Set tempTitle to current title for editing
    setIsEditing(true);
  };

  const handleSave = () => {
    setTitle(tempTitle); // Optimistically update the title
    setIsEditing(false);

    fetcher.submit(
      { newTitle: tempTitle, wishlistId, intent: "editTitle" },
      { method: "post" }
    );

    // If the update fails, you'll need to handle it, e.g., revert the title, show an error
    fetcher.data?.error && setTitle(initialTitle); // Revert to original title if there's an error
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTempTitle(event.target.value);
  };

  if(!isOwner) {
    return <h1 className="text-white text-2xl font-bold mr-4">{title}</h1>
  }

  if (isEditing) {
    return (
      <div className="flex items-center">
        <input
          type="text"
          value={tempTitle}
          onChange={handleChange}
          className="border sm:text-sm rounded-lg p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
        />
        <button onClick={handleSave} className="ml-4">
        <CheckIcon className="h-6 w-6 text-white hover:text-gray-200" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <h1 className="text-white text-2xl font-bold mr-4">{title}</h1>
      <button onClick={handleEdit} className="your-button-styles">
        <PencilSquareIcon className="h-5 w-5 text-white hover:text-gray-200"/>
      </button>
    </div>
  );
}
