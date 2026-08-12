import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import ApiClient from "../../../api/apiClient";
import toast from "react-hot-toast";

const BoardCard = ({ board, onDelete, onFavoriteToggle }) => {
  const navigate = useNavigate();
  const [isStarred, setIsStarred] = useState(board.starred || false);

  const handleStarToggle = async (e) => {
    e.stopPropagation();
    try {
      await ApiClient.put(`/boards/${board._id}/star`);
      setIsStarred(!isStarred);
      if (onFavoriteToggle) onFavoriteToggle(!isStarred);
      toast.success(isStarred ? "Removed from starred" : "Added to starred");
    } catch (err) {
      toast.error("Failed to update star");
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    
    toast((t) => (
      <div className="flex gap-2 items-center">
        <span>Delete this board?</span>
        <button
          onClick={async () => {
            try {
              const res = await ApiClient.delete(`/boards/${board._id}`);
              if (res.success) {
                toast.dismiss(t.id);
                toast.success("Board deleted successfully");
                if (onDelete) onDelete();
              }
            } catch (err) {
              toast.error("Failed to delete board");
            }
          }}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
        >
          Delete
        </button>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="px-3 py-1 bg-slate-600 text-white rounded hover:bg-slate-700 text-sm"
        >
          Cancel
        </button>
      </div>
    ));
  };

  // Function to get background style based on image or color
  const getBackgroundStyle = () => {
    // If there's an image, use it as background
    if (board.image && board.image.trim() !== "") {
      return {
        backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0.7) 100%), url(${board.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: board.color || "#1e293b",
      };
    }
    
    // If there's a color but no image, use the color
    if (board.color && board.color.trim() !== "") {
      return {
        backgroundColor: board.color,
        backgroundImage: "linear-gradient(180deg, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0.3) 100%)",
      };
    }
    
    // Default fallback
    return {
      backgroundColor: "#1e293b",
      backgroundImage: "linear-gradient(180deg, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0.7) 100%)",
    };
  };

  return (
    <div
      onClick={() => navigate(`/boards/${board._id}`)}
      className="group relative overflow-hidden rounded-2xl p-6 text-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer border border-slate-700 hover:border-slate-600 min-h-48"
      style={getBackgroundStyle()}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
      
      {/* Star Button */}
      <button
        onClick={handleStarToggle}
        className="absolute top-3 right-3 text-xl text-slate-300 hover:text-yellow-400 transition z-10 opacity-0 group-hover:opacity-100"
      >
        {isStarred ? <FaStar className="text-yellow-400" /> : <FaRegStar />}
      </button>

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className="absolute top-3 right-12 text-lg text-slate-300 hover:text-red-400 transition z-10 opacity-0 group-hover:opacity-100"
      >
        <FiTrash2 />
      </button>

      <div className="relative z-10 flex h-full flex-col justify-between gap-4">
        <div className="space-y-2">
          <p className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-200 font-semibold backdrop-blur-sm">
            Board
          </p>
          <h2 className="text-2xl font-bold text-white line-clamp-2 drop-shadow-lg">
            {board.title}
          </h2>
          {board.description && (
            <p className="text-sm text-slate-200 line-clamp-2 opacity-90 drop-shadow-md">
              {board.description}
            </p>
          )}
        </div>
      </div>

      {/* Accent Border */}
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition" />
    </div>
  );
};

export default BoardCard;