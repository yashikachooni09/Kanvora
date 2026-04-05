import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import ApiClient from "../../../api/apiClient";

const AddList = ({ boardId, refresh }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  const handleAdd = async () => {
    if (!title.trim()) return;

    const res = await ApiClient.post("/lists", {
      title,
      boardId,
    });

    if (res.success) {
      setTitle("");
      setOpen(false);
      refresh();
    }
  };

  return (
    <div className="w-72">

      {!open ? (
        <div
          onClick={() => setOpen(true)}
          className="backdrop-blur-md bg-white/20 hover:bg-white/30 
          text-white p-3 rounded-xl cursor-pointer flex items-center gap-2 transition"
        >
          <FaPlus />
          Add another list
        </div>
      ) : (
        <div
          className="backdrop-blur-md bg-white/20 border border-white/30
          p-3 rounded-xl shadow-xl text-white"
        >

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter list title..."
            className="w-full p-2 rounded bg-transparent border border-white/30 
            placeholder-gray-300 text-white mb-3 focus:outline-none"
          />

          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="bg-indigo-600 px-3 py-1 rounded hover:bg-indigo-500 cursor-pointer"
            >
              Add
            </button>

            <button
              onClick={() => setOpen(false)}
              className="px-2 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddList;