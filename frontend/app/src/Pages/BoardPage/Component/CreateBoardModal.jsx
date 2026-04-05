import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiClient from "../../../api/apiClient";

const colors = [
  "#4f46e5", "#9333ea", "#ec4899", "#ef4444",
  "#f97316", "#eab308", "#22c55e", "#06b6d4"
];

const images = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  "https://wallpaperaccess.com/full/3274939.jpg",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  "https://img.freepik.com/free-vector/flower-memphis-line-art-abstract-background-vector_53876-154336.jpg?semt=ais_incoming&w=740&q=80",
  "https://img.freepik.com/free-photo/abstract-flowing-neon-wave-background_53876-101942.jpg"
];

const CreateBoardModal = ({ onClose, refreshBoards }) => {
  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedImage, setSelectedImage] = useState("");
  const [visibility, setVisibility] = useState("private");

  const navigate = useNavigate();

  const handleCreate = async () => {
    try {
      if (!title.trim()) {
        alert("Board title is required");
        return;
      }

      const res = await ApiClient.post("/boards", {
        title,
        color: selectedColor,
        image: selectedImage,
        visibility
      });

      if (res.success) {
        refreshBoards();
        onClose();
        navigate(`/boards/${res.data._id}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      
      {/* Modal */}
      <div className="bg-[#0f172a] text-white w-[420px] p-6 rounded-2xl shadow-2xl">
        
        {/* Header */}
        <h2 className="text-xl font-semibold mb-4">
          Create New Board
        </h2>

        {/* Preview */}
        <div
          className="h-24 rounded-xl mb-4 flex items-center justify-center text-lg font-semibold"
          style={{
            background: selectedImage
              ? `url(${selectedImage}) center/cover`
              : selectedColor
          }}
        >
          {title || "Board Preview"}
        </div>

        {/* Title Input */}
        <input
          type="text"
          placeholder="Board Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-4 rounded-lg bg-slate-800 border border-slate-600 focus:outline-none"
        />

        {/* Color Picker */}
        <div className="mb-4">
          <p className="text-sm mb-2">Choose Background Color</p>
          <div className="flex gap-2 flex-wrap">
            {colors.map((c, i) => (
              <div
                key={i}
                onClick={() => {
                  setSelectedColor(c);
                  setSelectedImage("");
                }}
                className={`w-8 h-8 rounded cursor-pointer border-2 ${
                  selectedColor === c ? "border-white" : "border-transparent"
                }`}
                style={{ background: c }}
              />
            ))}
          </div>
        </div>

        {/* Image Picker */}
        <div className="mb-4">
          <p className="text-sm mb-2">Or Choose Background Image</p>
          <div className="flex gap-2">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="bg"
                onClick={() => {
                  setSelectedImage(img);
                }}
                className={`w-16 h-12 object-cover rounded cursor-pointer border-2 ${
                  selectedImage === img ? "border-white" : "border-transparent"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Visibility */}
        <div className="mb-4">
          <p className="text-sm mb-2">Visibility</p>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className="w-full p-2 rounded-lg bg-slate-800 border border-slate-600"
          >
            <option value="private">Private</option>
            <option value="workspace">Workspace</option>
            <option value="public">Public</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 cursor-pointer"
          >
            Create Board
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBoardModal;