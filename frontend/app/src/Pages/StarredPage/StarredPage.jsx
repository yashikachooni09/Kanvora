import React, { useState, useEffect, useCallback } from "react";
import { FaStar, FaArrowLeft, FaClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ApiClient from "../../api/apiClient";
import toast from "react-hot-toast";

const StarredPage = () => {
  const navigate = useNavigate();
  const [starredBoards, setStarredBoards] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStarredBoards = useCallback(async () => {
    try {
      setLoading(true);
      const res = await ApiClient.get("/boards/starred");
      console.log("Starred boards response:", res);
      
      if (res.success) {
        setStarredBoards(res.data || []);
      } else {
        toast.error(res.message || "Failed to fetch starred boards");
        setStarredBoards([]);
      }
    } catch (err) {
      console.error("Error fetching starred boards:", err);
      toast.error("Error fetching starred boards");
      setStarredBoards([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStarredBoards();
  }, [fetchStarredBoards]);

  const handleUnstar = useCallback(async (boardId, e) => {
    if (e) e.stopPropagation();
    
    try {
      const res = await ApiClient.put(`/boards/${boardId}/star`);
      console.log("Unstar response:", res);
      
      if (res.success) {
        // Remove the unstarred board from the list
        setStarredBoards(prevBoards => prevBoards.filter(board => board._id !== boardId));
        toast.success("Board unstarred");
      } else {
        toast.error(res.message || "Failed to unstar board");
      }
    } catch (err) {
      console.error("Error unstarring board:", err);
      toast.error("Error unstarring board");
    }
  }, []);

  const handleBoardClick = useCallback((board) => {
    navigate(`/boards/${board._id}`);
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-slate-300 text-lg">Loading starred boards...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <section className="rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 md:p-8 shadow-lg backdrop-blur">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 transition"
            >
              <FaArrowLeft className="text-lg" />
            </button>
            <div>
              <p className="text-xs uppercase tracking-wider text-yellow-400 font-semibold flex items-center gap-2">
                <FaStar className="text-yellow-400" /> Starred
              </p>
              <h1 className="mt-2 text-3xl md:text-4xl font-bold text-white">
                Starred Boards
              </h1>
              <p className="mt-2 text-slate-300">
                {starredBoards.length} starred board{starredBoards.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </section>

        {/* Starred Boards Grid */}
        <section className="rounded-2xl border border-slate-700 bg-slate-900/40 p-6 md:p-8 shadow-lg">
          {starredBoards.length === 0 ? (
            <div className="text-center py-12">
              <FaStar className="mx-auto text-6xl text-slate-600 mb-4" />
              <p className="text-slate-400 text-lg">No starred boards yet</p>
              <p className="text-slate-500 text-sm mt-2">
                Click the star icon on any board to add it to your starred collection
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {starredBoards.map((board) => (
                <div
                  key={board._id}
                  onClick={() => handleBoardClick(board)}
                  className="group relative h-32 rounded-xl shadow-md cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  style={{ backgroundColor: board.color || "#4f46e5" }}
                >
                  {board.image && (
                    <img
                      src={board.image}
                      alt={board.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />

                  {/* Content */}
                  <div className="relative p-4 h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-white font-bold text-lg truncate pr-8">
                        {board.title}
                      </h3>
                      {board.description && (
                        <p className="text-slate-200 text-sm truncate mt-1">
                          {board.description}
                        </p>
                      )}
                    </div>
                    


                    {/* Star Button - Always visible on starred boards */}
                    <button
                      onClick={(e) => handleUnstar(board._id, e)}
                      className="absolute top-4 right-4 text-yellow-400 hover:text-yellow-300 transition z-10"
                      title="Remove from starred"
                    >
                      <FaStar className="text-lg" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default StarredPage;
