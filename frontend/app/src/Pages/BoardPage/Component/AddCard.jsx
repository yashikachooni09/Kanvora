import { useState, useCallback } from "react";
import { FiPlus } from "react-icons/fi";
import ApiClient from "../../../api/apiClient";
import toast from "react-hot-toast";

const AddCard = ({ listId, refresh }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddCard = useCallback(async () => {
    if (!title.trim()) {
      toast.error("Card title is required");
      return;
    }

    setLoading(true);
    try {
      const res = await ApiClient.post("/cards", {
        title: title.trim(),
        listId: listId,
        description: "",
        image: "",
        labels: [],
        completed: false,
        starred: false,
      });

      if (res.success) {
        toast.success("Card created successfully");
        setTitle("");
        setIsAdding(false);
        if (refresh) refresh();
      }
    } catch (err) {
      toast.error("Failed to create card");
    } finally {
      setLoading(false);
    }
  }, [title, listId, refresh]);

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-700/50 transition group"
      >
        <FiPlus className="text-sm" />
        <span className="text-sm">Add a card</span>
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter card title..."
        className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
        autoFocus
        onKeyPress={(e) => {
          if (e.key === "Enter") handleAddCard();
        }}
      />
      <div className="flex gap-2">
        <button
          onClick={handleAddCard}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg bg-cyan-600 text-white text-sm font-medium hover:bg-cyan-700 transition disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Card"}
        </button>
        <button
          onClick={() => {
            setIsAdding(false);
            setTitle("");
          }}
          className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-300 text-sm hover:bg-slate-600 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddCard;