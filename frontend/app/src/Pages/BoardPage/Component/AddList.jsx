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
        <button
          onClick={() => setOpen(true)}
          className="flex w-full items-center gap-3 rounded-3xl border border-dashed border-slate-700 bg-slate-900/80 px-4 py-4 text-left text-sm text-slate-300 transition hover:border-cyan-500 hover:bg-slate-900"
        >
          <FaPlus className="text-base text-cyan-300" />
          Add another list
        </button>
      ) : (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/95 p-4 shadow-xl">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter list title..."
            className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          />
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={handleAdd}
              className="rounded-3xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Add
            </button>
            <button
              onClick={() => setOpen(false)}
              className="text-sm text-slate-400 transition hover:text-slate-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddList;