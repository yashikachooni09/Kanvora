import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { FaStar, FaRegStar } from "react-icons/fa";
import { FiShare2, FiX, FiEye } from "react-icons/fi";
import ApiClient from "../../api/apiClient";
import List from "./Component/List";
import AddList from "./Component/AddList";
import BoardSwitcher from "./Component/BoardSwitcher";
import { DragDropContext } from "@hello-pangea/dnd";
import toast from "react-hot-toast";

const BoardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [isStarred, setIsStarred] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmails, setShareEmails] = useState([]);
  const [emailInput, setEmailInput] = useState("");
  const [shareRole, setShareRole] = useState("editor");
  const [sharingLoading, setSharingLoading] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  const userRole = board?.userRole || "owner";
  const isViewer = userRole === "viewer";
  const canShare = userRole === "owner" || userRole === "admin";

  const fetchLists = async () => {
    try {
      const res = await ApiClient.get(`/lists?boardId=${id}`);
      if (res.success) {
        setLists(res.data);
      }
    } catch (err) {
      console.error("Error fetching lists:", err);
    }
  };

  const fetchBoard = async () => {
    try {
      const searchParams = new URLSearchParams(location.search);
      const targetInviteEmail = searchParams.get("inviteEmail")?.toLowerCase();

      // Check current user identity to prevent session leaks
      const meRes = await ApiClient.get("/auth/me");
      const currentUserEmail = meRes?.data?.email?.toLowerCase();

      if (targetInviteEmail && currentUserEmail && currentUserEmail !== targetInviteEmail) {
        localStorage.removeItem("token");
        toast.error(`⚠️ Invitation is for ${targetInviteEmail}. Please sign in with that account.`);
        navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}&email=${encodeURIComponent(targetInviteEmail)}`, { replace: true });
        return;
      }

      const res = await ApiClient.get(`/boards/${id}`);
      if (res.success) {
        setBoard(res.data);
        setIsStarred(res.data.starred || false);
        setAccessDenied(false);
      } else {
        setAccessDenied(true);
      }
    } catch (err) {
      console.error("Error fetching board:", err);
      setAccessDenied(true);
    }
  };

  useEffect(() => {
    fetchBoard();
    fetchLists();
  }, [id, location.search]);

  const onDragEnd = async (result) => {
    if (isViewer) {
      toast.error("Viewers have read-only access");
      return;
    }
    const { source, destination, draggableId } = result;
    
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    try {
      const res = await ApiClient.put(`/cards/${draggableId}/move`, {
        listId: destination.droppableId,
        position: destination.index,
      });

      if (res.success) {
        setRefreshTrigger(prev => prev + 1);
        toast.success("Card moved successfully");
      }
    } catch (err) {
      console.error("Error moving card:", err);
      toast.error("Failed to move card");
      setRefreshTrigger(prev => prev + 1);
    }
  };

  const handleGlobalCardMove = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const toggleStar = async () => {
    try {
      const res = await ApiClient.put(`/boards/${id}/star`);
      if (res.success) {
        setIsStarred(res.data.starred);
      }
    } catch (err) {
      console.error("Error updating star:", err);
      toast.error("Failed to update star");
    }
  };

  const handleShareBoard = async () => {
    let emailsToSend = [...shareEmails];
    if (emailInput.trim()) {
      emailsToSend.push(emailInput.trim());
      setEmailInput("");
    }

    if (emailsToSend.length === 0) {
      toast.error("Please enter at least one email");
      return;
    }

    setSharingLoading(true);
    try {
      const res = await ApiClient.post(`/boards/${id}/invite`, {
        emails: emailsToSend,
        role: shareRole,
      });

      if (res.success) {
        toast.success("✅ Invitation email sent directly to recipient's inbox!");
        setShareEmails([]);
        setEmailInput("");
        setShowShareModal(false);
        setBoard(res.data);
      }
    } catch (err) {
      console.error("Error sharing board:", err);
      toast.error(err.response?.data?.message || "Failed to send invitation email");
    } finally {
      setSharingLoading(false);
    }
  };

  const handleEmailKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = emailInput.trim();
      if (val && !shareEmails.includes(val)) {
        setShareEmails([...shareEmails, val]);
        setEmailInput("");
      }
    } else if (e.key === "Backspace" && emailInput === "" && shareEmails.length > 0) {
      const newEmails = [...shareEmails];
      newEmails.pop();
      setShareEmails(newEmails);
    }
  };

  const removeEmail = (emailToRemove) => {
    setShareEmails(shareEmails.filter((email) => email !== emailToRemove));
  };

  const getBoardBackgroundStyle = () => {
    if (!board) return {};
    
    if (board.image && board.image.trim() !== "") {
      return {
        backgroundImage: `url(${board.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      };
    }
    
    if (board.color && board.color.trim() !== "") {
      return {
        backgroundColor: board.color,
      };
    }
    
    return {
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
    };
  };

  if (accessDenied) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 p-6">
        <div className="max-w-md w-full rounded-2xl bg-slate-900 border border-slate-800 p-8 text-center shadow-2xl space-y-6">
          <div className="h-16 w-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto text-3xl">
            🔒
          </div>
          <h2 className="text-2xl font-bold text-white">Access Denied</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            You do not have permission to view this board. Your current logged-in account has not been invited to this board.
          </p>
          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate(`/login?redirect=${encodeURIComponent(`/boards/${id}`)}`);
              }}
              className="w-full px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition"
            >
              Sign In with Invited Email
            </button>
            <button
              onClick={() => navigate("/boards")}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 transition"
            >
              Back to My Boards
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-slate-300">Loading board...</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={getBoardBackgroundStyle()}
    >
      {board.image && (
        <div className="fixed inset-0 bg-black/40 pointer-events-none" />
      )}
      
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 px-6 py-4 shadow-lg backdrop-blur-md">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/boards")}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
              title="Back to boards"
            >
              <IoArrowBack className="text-lg" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs uppercase tracking-wider text-cyan-400/80 font-semibold">Board Detail</p>
                {isViewer && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
                    <FiEye className="text-xs" /> Viewer (Read-only)
                  </span>
                )}
                {userRole === "editor" && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
                    Editor
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <h2 className="text-2xl md:text-3xl font-bold text-white">{board?.title}</h2>
                <button
                  onClick={toggleStar}
                  className="text-xl text-slate-400 hover:text-yellow-400 transition"
                >
                  {isStarred ? <FaStar className="text-yellow-400" /> : <FaRegStar />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {canShare && (
              <button
                onClick={() => setShowShareModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 text-green-400 border border-green-500/30 hover:border-green-500/50 transition-all font-medium"
                title="Share this board"
              >
                <FiShare2 className="text-lg" />
                <span className="hidden sm:inline">Share</span>
              </button>
            )}

            <div className="inline-flex items-center gap-3 rounded-xl bg-slate-800/50 px-4 py-3 text-sm text-slate-200 shadow-lg border border-slate-700">
              <span className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-cyan-400" />
                <span className="font-semibold">{lists.length} lists</span>
              </span>
              <span className="h-5 w-px bg-slate-600" />
              <span className="text-slate-400">{isViewer ? "Read-only view" : "Drag cards freely"}</span>
            </div>
          </div>
        </div>
        
        {board?.description && (
          <p className="mt-3 text-sm text-slate-400 max-w-2xl">{board.description}</p>
        )}
      </div>

      {/* Main Content */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="relative z-10" style={{ height: 'calc(100vh - 200px)' }}>
          <div className="flex gap-6 overflow-x-auto overflow-y-hidden pb-4 px-6 py-6 h-full">
            {lists.length === 0 ? (
              <div className="flex items-center justify-center w-full h-96">
                <div className="text-center">
                  <p className="text-slate-400 mb-4">{isViewer ? "No lists available" : "No lists yet"}</p>
                  {!isViewer && <AddList boardId={id} refresh={fetchLists} />}
                </div>
              </div>
            ) : (
              <>
                {lists.map((list) => (
                  <List
                    key={list._id}
                    list={list}
                    isViewer={isViewer}
                    userRole={userRole}
                    onListUpdate={fetchLists}
                    onListDelete={fetchLists}
                    refreshTrigger={refreshTrigger}
                    onGlobalCardMove={handleGlobalCardMove}
                  />
                ))}
                {!isViewer && (
                  <div className="w-80 flex-shrink-0">
                    <AddList boardId={id} refresh={fetchLists} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </DragDropContext>

      {/* Share Board Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl w-full max-w-md p-8 animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-slate-700 rounded-lg transition"
            >
              <FiX className="text-xl text-slate-400" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <FiShare2 className="text-green-400" />
              Share Board
            </h2>
            <p className="text-slate-400 mb-6">Invite someone to collaborate on "{board?.title}"</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Addresses</label>
                <div className="flex flex-wrap items-center gap-2 w-full p-2 rounded-lg bg-slate-700/50 border border-slate-600 min-h-[50px]">
                  {shareEmails.map((email, idx) => (
                    <div key={idx} className="flex items-center gap-1 bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-md text-sm border border-indigo-500/30">
                      <span>{email}</span>
                      <button type="button" onClick={() => removeEmail(email)} className="hover:text-red-400 transition ml-1">
                        <FiX />
                      </button>
                    </div>
                  ))}
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyDown={handleEmailKeyDown}
                    placeholder={shareEmails.length === 0 ? "colleague@example.com (Press Enter)" : "Add more..."}
                    className="flex-1 min-w-[150px] bg-transparent text-white placeholder-slate-500 focus:outline-none"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
                <select
                  value={shareRole}
                  onChange={(e) => setShareRole(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30 transition"
                >
                  <option value="viewer">Viewer (Read-only)</option>
                  <option value="editor">Editor (Can edit)</option>
                  <option value="admin">Full access</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleShareBoard}
                  disabled={sharingLoading}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium transition transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <FiShare2 />
                  {sharingLoading ? "Sending..." : "Send Invite"}
                </button>
              </div>

              {board?.members && board.members.length > 0 && (
                <div className="pt-4 border-t border-slate-700">
                  <p className="text-xs font-medium text-slate-400 mb-3">Shared with ({board.members.length})</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {board.members.map((member, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-700/30 border border-slate-700/50">
                        <div>
                          <p className="text-sm text-white">{member.email}</p>
                          <p className="text-xs text-slate-400">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Board Switcher */}
      <BoardSwitcher currentBoardId={id} />
    </div>
  );
};

export default BoardDetail;