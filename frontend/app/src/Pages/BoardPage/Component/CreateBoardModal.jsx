import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiClient from "../../../api/apiClient";

const colors = [
  "#4f46e5",
  "#9333ea",
  "#ec4899",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
];

const images = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  "https://wallpaperaccess.com/full/3274939.jpg",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  "https://img.freepik.com/free-vector/flower-memphis-line-art-abstract-background-vector_53876-154336.jpg?semt=ais_incoming&w=740&q=80",
  "https://img.freepik.com/free-photo/abstract-flowing-neon-wave-background_53876-101942.jpg",
];

const CreateBoardModal = ({ onClose, refreshBoards }) => {
  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedImage, setSelectedImage] = useState("");
  const [visibility, setVisibility] = useState("private");

  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!title.trim()) {
      alert("Board title is required.");
      return;
    }

    const res = await ApiClient.post("/boards", {
      title,
      color: selectedColor,
      image: selectedImage,
      visibility,
    });

    if (res.success) {
      refreshBoards();
      onClose();
      navigate(`/boards/${res.data._id}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[32px] border border-white/10 bg-slate-950/95 p-6 shadow-2xl shadow-cyan-500/20">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-100">Create new board</h2>
            <p className="mt-2 text-sm text-slate-400">Choose a background and name your next project board.</p>
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 px-4 text-sm text-slate-300 transition hover:bg-slate-800"
          >
            Close
          </button>
        </div>

        <div
          className="mb-6 flex h-28 items-center justify-center rounded-3xl bg-slate-900 text-slate-100"
          style={{
            background: selectedImage
              ? `linear-gradient(180deg, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0.9) 100%), url(${selectedImage}) center/cover`
              : selectedColor,
          }}
        >
          <span className="text-xl font-semibold text-white">{title || "Board preview"}</span>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Board Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          />

          <div>
            <p className="mb-3 text-sm text-slate-300">Background color</p>
            <div className="flex flex-wrap gap-3">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setSelectedColor(c);
                    setSelectedImage("");
                  }}
                  className={`h-10 w-10 rounded-full border-2 transition ${
                    selectedColor === c && !selectedImage
                      ? "border-white"
                      : "border-transparent"
                  }`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm text-slate-300">Or choose a background image</p>
            <div className="grid grid-cols-5 gap-3">
              {images.map((img) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`overflow-hidden rounded-3xl border-2 transition ${
                    selectedImage === img ? "border-white" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="theme" className="h-16 w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm text-slate-300">Visibility</p>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            >
              <option value="private">Private</option>
              <option value="workspace">Workspace</option>
              <option value="public">Public</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={onClose}
            className="rounded-3xl border border-slate-800 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="rounded-3xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:shadow-xl"
          >
            Create Board
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBoardModal;