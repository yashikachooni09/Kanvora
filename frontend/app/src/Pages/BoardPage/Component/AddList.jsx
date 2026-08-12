import { useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import ApiClient from "../../../api/apiClient";
import toast from "react-hot-toast";

const AddList = ({ boardId, refresh }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!title.trim()) {
      toast.error("List title cannot be empty");
      return;
    }

    setLoading(true);

    try {
      const res = await ApiClient.post("/lists", {
        title,
        boardId,
      });

      if (res.success) {
        setTitle("");
        setOpen(false);
        refresh();
        toast.success("List created successfully");
      }
    } catch (err) {
      toast.error("Failed to add list");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleAdd();
    if (e.key === "Escape") {
      setOpen(false);
      setTitle("");
    }
  };

  return (
    <div className="w-80 flex-shrink-0">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="flex w-full items-center gap-2 rounded-2xl border-2 border-dashed border-slate-700 bg-slate-800/40 px-4 py-4 text-left text-sm text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300 hover:bg-slate-800/60 font-semibold"
        >
          <FiPlus className="text-base" />
          Add another list
        </button>
      ) : (
        <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-lg">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter list title..."
            className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-400 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
            autoFocus
          />
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleAdd}
              disabled={loading}
              className="flex-1 rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-500 px-3 py-2 text-xs font-semibold text-white transition hover:from-cyan-500 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Adding..." : "Add List"}
            </button>
            <button
              onClick={() => {
                setOpen(false);
                setTitle("");
              }}
              className="rounded-lg bg-slate-700 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-600 transition"
              title="Cancel"
            >
              <FiX />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddList;