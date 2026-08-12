import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import BoardCard from "./Component/BoardCard";
import CreateBoardModal from "./Component/CreateBoardModal";
import ApiClient from "../../api/apiClient";

const BoardsPage = () => {
  const [boards, setBoards] = useState([]);
  const [starredBoards, setStarredBoards] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const fetchBoards = async () => {
    try {
      const res = await ApiClient.get("/boards");
      if (res.success) {
        console.log("Fetched boards:", res.data);
        setBoards(res.data);
        setStarredBoards(res.data.filter(b => b.starred));
      }
    } catch (err) {
      console.error("Error fetching boards:", err);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const handleBoardDelete = () => {
    fetchBoards();
  };

  const handleStarToggle = (boardId, starred) => {
    const updatedBoards = boards.map(b => 
      b._id === boardId ? { ...b, starred } : b
    );
    setBoards(updatedBoards);
    setStarredBoards(updatedBoards.filter(b => b.starred));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="min-h-[calc(100vh-2rem)] rounded-3xl border border-slate-800/50 bg-slate-950/80 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <p className="text-xs md:text-sm uppercase tracking-wider text-cyan-400/80 font-semibold">Workspace</p>
            <h1 className="mt-2 text-3xl md:text-4xl font-bold text-white">Your Boards</h1>
            <p className="mt-2 text-sm md:text-base text-slate-400">Browse and manage your project boards in one place.</p>
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition"
          >
            <FiPlus className="text-lg" />
            Create Board
          </button>
        </div>

        {/* Starred Boards */}
        {starredBoards.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <FaStar className="text-yellow-400" /> Starred Boards
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {starredBoards.map((board) => (
                <BoardCard 
                  key={board._id} 
                  board={board} 
                  onDelete={handleBoardDelete}
                  onFavoriteToggle={(starred) => handleStarToggle(board._id, starred)}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Boards Section */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">All Boards</h2>
          {boards.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900/40 p-12 text-center">
              <div className="space-y-4">
                <div className="text-5xl text-slate-600">📋</div>
                <h3 className="text-lg font-semibold text-slate-300">No boards yet</h3>
                <p className="text-slate-400">Create your first board to get started with Kanvora.</p>
                <button
                  onClick={() => setOpenModal(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-6 py-2 text-sm font-semibold text-white hover:bg-cyan-500 transition mt-4"
                >
                  <FiPlus />
                  Create Board
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {boards.map((board) => (
                <BoardCard 
                  key={board._id} 
                  board={board} 
                  onDelete={handleBoardDelete}
                  onFavoriteToggle={(starred) => handleStarToggle(board._id, starred)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {openModal && (
        <CreateBoardModal onClose={() => setOpenModal(false)} refreshBoards={fetchBoards} />
      )}
    </div>
  );
};

export default BoardsPage;