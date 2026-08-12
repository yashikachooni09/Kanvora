import { useState } from "react";
import { FiX, FiImage } from "react-icons/fi";
import { IoColorPalette } from "react-icons/io5";
import ApiClient from "../../../api/apiClient";
import toast from "react-hot-toast";

const CreateBoardModal = ({ onClose, refreshBoards }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#4f46e5"); // Default indigo color
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [visibility, setVisibility] = useState("private");

  const colorOptions = [
    { name: "Indigo", value: "#4f46e5" },
    { name: "Cyan", value: "#0891b2" },
    { name: "Emerald", value: "#10b981" },
    { name: "Rose", value: "#e11d48" },
    { name: "Amber", value: "#d97706" },
    { name: "Purple", value: "#9333ea" },
    { name: "Slate", value: "#475569" },
    { name: "Sky", value: "#0284c7" },
  ];

  const staticImages = [
    "https://images.unsplash.com/photo-1460500063983-994d4c27756c?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&q=80&w=800",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Board title is required");
      return;
    }

    setLoading(true);
    try {
      const boardData = {
        title: title.trim(),
        description: description.trim(),
        color: color,
        visibility: visibility,
      };

      // Only add image if it exists
      if (image) {
        boardData.image = image;
      }

      const res = await ApiClient.post("/boards", boardData);
      
      if (res.success) {
        toast.success("Board created successfully!");
        if (refreshBoards) refreshBoards();
        onClose();
      }
    } catch (err) {
      console.error("Error creating board:", err);
      toast.error(err.response?.data?.message || "Failed to create board");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setImage("");
    toast.success("Image removed");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl w-full max-w-md p-8 animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-700 rounded-lg transition"
        >
          <FiX className="text-xl text-slate-400" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-2">Create New Board</h2>
        <p className="text-slate-400 mb-6">Set up your workspace board</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Board Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Product Roadmap, Marketing Campaign..."
              className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition"
              autoFocus
              required
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this board about?"
              rows="3"
              className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition resize-none"
            />
          </div>

          {/* Visibility Option */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Visibility
            </label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition"
            >
              <option value="private">Private - Only you and invited members</option>
              <option value="public">Public - Anyone with the link</option>
            </select>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <IoColorPalette />
              Board Color
            </label>
            <div className="flex flex-wrap gap-3">
              {colorOptions.map((colorOption) => (
                <button
                  key={colorOption.value}
                  type="button"
                  onClick={() => setColor(colorOption.value)}
                  className={`h-12 w-12 rounded-xl transition-all transform ${
                    color === colorOption.value
                      ? "ring-4 ring-white shadow-xl scale-110"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: colorOption.value }}
                  title={colorOption.name}
                />
              ))}
            </div>
          </div>

          {/* Static Images Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-slate-300 flex items-center gap-2">
                <FiImage />
                Board Background (Optional)
              </label>
              {image && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-xs px-3 py-1 rounded-lg bg-red-600/90 text-white hover:bg-red-700 transition"
                >
                  Remove Image
                </button>
              )}
            </div>

            <div className="grid grid-cols-4 gap-3 mb-3">
              {staticImages.map((imgUrl, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setImage(imgUrl)}
                  className={`h-20 rounded-lg bg-cover bg-center transition-all transform ${
                    image === imgUrl
                      ? "ring-2 ring-indigo-500 shadow-xl scale-105"
                      : "hover:scale-105 opacity-80 hover:opacity-100 border border-slate-600"
                  }`}
                  style={{ backgroundImage: `url(${imgUrl})` }}
                />
              ))}
            </div>

            {/* Preview of current selection */}
            <div className="mt-3">
              <p className="text-xs text-slate-400 mb-2">Preview:</p>
              <div 
                className="h-20 rounded-lg flex items-center justify-center text-white text-sm font-medium"
                style={{ 
                  backgroundColor: image ? undefined : color,
                  backgroundImage: image ? `url(${image})` : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              >
                {title ? title.slice(0, 30) : "Board Preview"}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white font-medium transition transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? "Creating..." : "Create Board"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBoardModal;