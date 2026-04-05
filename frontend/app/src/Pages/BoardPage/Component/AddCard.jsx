import { useState } from "react";

const AddCard = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  return (
    <div>
      {!open ? (
        <p
          onClick={() => setOpen(true)}
          className="text-sm text-gray-600 cursor-pointer"
        >
          + Add a card
        </p>
      ) : (
        <div>
          <textarea
            className="w-full border rounded p-2"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <button className="bg-indigo-600 text-white px-3 py-1 rounded mt-1">
            Add Card
          </button>
        </div>
      )}
    </div>
  );
};

export default AddCard;