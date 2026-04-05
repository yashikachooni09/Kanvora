import { useState } from "react";
import ApiClient from "../../../api/apiClient";

const AddCard = ({ listId, refresh }) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

const handleAdd = async () => {

  if (!text.trim()) return;

  try {
    await ApiClient.post("/cards", {
      title: text,
      listId,
    });

    setText("");
    setOpen(false);

    // 🔥 THIS IS IMPORTANT
    refresh(); 
  } catch (err) {
    console.log(err);
  }
};

  return (
    <div>
      {!open ? (
        <p
          onClick={() => setOpen(true)}
          className="text-sm text-gray-300 hover:text-white cursor-pointer transition"
        >
          + Add a card
        </p>
      ) : (
        <div className="mt-2">

          <input
            className="w-full p-2 rounded-lg bg-white/20 backdrop-blur-md text-white placeholder-gray-300 outline-none"
            placeholder="Enter a title or paste a link..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="flex gap-2 mt-2">
            <button
              onClick={handleAdd}
              className="bg-indigo-600 px-3 py-1 rounded-lg text-white hover:bg-indigo-500"
            >
              Add Card
            </button>

            <button
              onClick={() => setOpen(false)}
              className="text-white"
            >
              ✕
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default AddCard;