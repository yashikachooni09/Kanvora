import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiX, FiLayers } from "react-icons/fi";
import ApiClient from "../../../api/apiClient";
import toast from "react-hot-toast";

const BoardSwitcher = ({ currentBoardId }) => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    setLoading(true);
    try {
      const res = await ApiClient.get("/boards");
      if (res.success) {
        setBoards(res.data || []);
      }
    } catch (err) {
      console.error("Error fetching boards:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBoardClick = (boardId) => {
    if (boardId !== currentBoardId) {
      navigate(`/boards/${boardId}`);
      setIsModalOpen(false);
    }
  };

  if (loading || boards.length <= 1) return null; // hide if no other boards to switch to

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-xl shadow-cyan-500/20 font-semibold transition-all transform hover:scale-105"
        >
          <FiLayers className="text-xl" />
          Switch Board
        </button>
      </div>

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl max-h-[80vh] flex flex-col bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95">
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-cyan-500 rounded"></div>
                Switch Board
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {boards.map((board) => (
                  <button
                    key={board._id}
                    onClick={() => handleBoardClick(board._id)}
                    className={`text-left group relative rounded-xl border p-4 transition-all duration-300 hover:scale-[1.02] ${
                      currentBoardId === board._id
                        ? "border-cyan-500 bg-slate-800 shadow-lg shadow-cyan-500/10 cursor-default"
                        : "border-slate-700 bg-slate-800/50 hover:border-indigo-500/50 hover:bg-slate-800 cursor-pointer"
                    }`}
                  >
                    <div
                      className="w-full h-1.5 rounded-full mb-3 opacity-80"
                      style={{ backgroundColor: board.color || "#4f46e5" }}
                    />
                    <h3 className="text-lg font-semibold text-white truncate group-hover:text-cyan-400 transition">
                      {board.title}
                    </h3>
                    {currentBoardId === board._id && (
                      <span className="absolute top-4 right-4 text-xs font-semibold px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded">
                        Current
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BoardSwitcher;
