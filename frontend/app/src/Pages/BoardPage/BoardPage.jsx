import { useEffect, useState } from "react";
import BoardCard from "./Component/BoardCard";
import CreateBoardModal from "./Component/CreateBoardModal";
import ApiClient from "../../api/apiClient"

const BoardsPage = () => {
  const [boards, setBoards] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const fetchBoards =  () => {
      const res =  ApiClient.get("/boards");
      if (res.success) {
        setBoards(res.data);
      }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Your Boards</h1>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-indigo-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          + Create Board
        </button>
      </div>

      {/* Boards Grid */}
      {boards.length === 0 ? (
        <p className="text-gray-500">No boards yet. Create one!</p>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {boards.map((board) => (
            <BoardCard key={board._id} board={board} />
          ))}
        </div>
      )}

      {/* Modal */}
      {openModal && (
        <CreateBoardModal
          onClose={() => setOpenModal(false)}
          refreshBoards={fetchBoards}
        />
      )}
    </div>
  );
};

export default BoardsPage;