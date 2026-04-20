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
      refresh();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="mt-4 w-72">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="flex w-full items-center gap-3 rounded-3xl border border-dashed border-slate-700 bg-slate-900/80 px-4 py-4 text-left text-sm text-slate-300 transition hover:border-cyan-500 hover:bg-slate-900"
        >
          + Add a card
        </button>
      ) : (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/95 p-4 shadow-xl">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter a title or paste a link..."
            className="w-full min-h-[90px] resize-none rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          />
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={handleAdd}
              className="rounded-3xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Add Card
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

export default AddCard;