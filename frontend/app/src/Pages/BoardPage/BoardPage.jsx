import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import BoardCard from "./Component/BoardCard";
import CreateBoardModal from "./Component/CreateBoardModal";
import ApiClient from "../../api/apiClient";

const BoardsPage = () => {
  const [boards, setBoards] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const fetchBoards = async () => {
    const res = await ApiClient.get("/boards");
    if (res.success) {
      setBoards(res.data);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  return (
    <div className="min-h-[calc(100vh-2rem)] rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Boards</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-100">Your boards</h1>
          <p className="mt-2 text-slate-400">Browse and manage your project boards in one place.</p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="inline-flex items-center gap-2 rounded-3xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
        >
          <FiPlus className="text-lg" />
          Create Board
        </button>
      </div>

      <div className="mt-8">
        {boards.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/70 p-8 text-center text-slate-400">
            No boards yet. Create one to get started.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {boards.map((board) => (
              <BoardCard key={board._id} board={board} />
            ))}
          </div>
        )}
      </div>

      {openModal && (
        <CreateBoardModal onClose={() => setOpenModal(false)} refreshBoards={fetchBoards} />
      )}
    </div>
  );
};

export default BoardsPage;