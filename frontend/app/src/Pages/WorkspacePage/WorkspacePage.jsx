import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import ApiClient from "../../api/apiClient";
import toast from "react-hot-toast";

const WorkspacePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState(null);
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");

  const fetchWorkspaceData = async () => {
    try {
      setLoading(true);
      const res = await ApiClient.get(`/workspace/${id}`);
      if (res.success) {
        setWorkspace(res.data);
        setBoards(res.data.boards || []);
      }
    } catch (err) {
      console.error("Error fetching workspace:", err);
      toast.error("Failed to load workspace");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaceData();
  }, [id]);

  const handleCreateBoard = async () => {
    if (!newBoardTitle.trim()) {
      toast.error("Board title is required");
      return;
    }

    try {
      const res = await ApiClient.post("/boards", {
        title: newBoardTitle,
        workspaceId: id,
      });

      if (res.success) {
        setBoards([res.data, ...boards]);
        setNewBoardTitle("");
        setShowCreateBoard(false);
        toast.success("Board created successfully");
      }
    } catch (err) {
      console.error("Error creating board:", err);
      toast.error("Failed to create board");
    }
  };

  const handleDeleteBoard = async (boardId) => {
    if (window.confirm("Are you sure you want to delete this board?")) {
      try {
        const res = await ApiClient.delete(`/boards/${boardId}`);
        if (res.success) {
          setBoards(boards.filter(b => b._id !== boardId));
          toast.success("Board deleted successfully");
        }
      } catch (err) {
        console.error("Error deleting board:", err);
        toast.error("Failed to delete board");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-slate-400">Loading workspace...</div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Workspace not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 md:p-8 shadow-lg backdrop-blur">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 transition"
          >
            <FiArrowLeft className="text-lg" />
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {workspace.icon} {workspace.name}
          </h1>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-slate-300">
            {boards.length} board{boards.length !== 1 ? "s" : ""} in this workspace
          </p>
          <button
            onClick={() => setShowCreateBoard(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:shadow-lg transition"
          >
            <FiPlus /> Add Board
          </button>
        </div>
      </section>

      {/* Create Board Modal */}
      {showCreateBoard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Create New Board</h3>
            <input
              type="text"
              placeholder="Board title..."
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 mb-4 focus:outline-none focus:border-cyan-500"
              onKeyPress={(e) => e.key === "Enter" && handleCreateBoard()}
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowCreateBoard(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBoard}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-500 text-white hover:shadow-lg transition"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Boards Grid */}
      <section>
        {boards.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-700 bg-slate-800/30 p-12 text-center">
            <div className="space-y-4">
              <div className="text-4xl">📭</div>
              <p className="text-slate-400">No boards in this workspace yet</p>
              <button
                onClick={() => setShowCreateBoard(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500 transition"
              >
                <FiPlus /> Create First Board
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {boards.map((board) => (
              <div
                key={board._id}
                className="group relative overflow-hidden rounded-xl border border-slate-700 bg-slate-800/40 p-5 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-slate-600"
              >
                <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition" />
                
                <div className="space-y-3">
                  <h3 className="font-semibold text-slate-100 line-clamp-1">{board.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {board.description || "No description provided"}
                  </p>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => navigate(`/boards/${board._id}`)}
                      className="flex-1 inline-flex items-center justify-center rounded-lg bg-slate-700/50 px-3 py-2 text-xs text-slate-200 hover:bg-slate-600 transition"
                    >
                      Open Board
                    </button>
                    <button
                      onClick={() => handleDeleteBoard(board._id)}
                      className="inline-flex items-center justify-center rounded-lg bg-slate-700/50 px-3 py-2 text-xs text-red-400 hover:bg-red-900/20 transition"
                      title="Delete board"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default WorkspacePage;
