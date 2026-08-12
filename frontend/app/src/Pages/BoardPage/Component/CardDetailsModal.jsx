import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import * as ReactDOM from "react-dom";

// Polyfill for ReactDOM.findDOMNode for newer React builds where it's not available.
// ReactQuill uses findDOMNode internally; without this, it throws on mount.
if (typeof ReactDOM.findDOMNode !== "function") {
  ReactDOM.findDOMNode = function (inst) {
    if (!inst) return null;
    if (inst.nodeType) return inst;
    if (inst.editor && inst.editor.root) return inst.editor.root;
    if (typeof inst.getEditor === "function") {
      try {
        const e = inst.getEditor();
        if (e && e.root) return e.root;
      } catch (err) {
        return null;
      }
    }
    return null;
  };
}

import { 
  FiX, FiPlus, FiTag, FiPaperclip, FiArchive, FiTrash2, 
  FiAlignLeft, FiCreditCard, FiChevronLeft, FiClock
} from "react-icons/fi";
import { FaCheckCircle, FaRegCheckCircle } from "react-icons/fa";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css'; 
import ApiClient from "../../../api/apiClient";
import environment, { getFullImageUrl } from "../../../config/environment";
import toast from "react-hot-toast";
import Zoom from "react-modal-image";

const CardDetailsModal = ({ card, isOpen, isViewer = false, boardId, onClose, onUpdate }) => {
  const [editTitle, setEditTitle] = useState(card?.title || "");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editDescription, setEditDescription] = useState(card?.description || "");
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  
  const [imageUrl, setImageUrl] = useState(card?.image || "");
  const [tempImageUrl, setTempImageUrl] = useState(card?.image || "");
  const [isCompleted, setIsCompleted] = useState(card?.completed || false);
  
  const [boardLabels, setBoardLabels] = useState([]);
  const [activePopover, setActivePopover] = useState(null); // 'labels' | 'createLabel' | 'attachment' | null
  const [showHistory, setShowHistory] = useState(false);
  const [labelSearch, setLabelSearch] = useState("");
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("#6366f1");
  const [loading, setLoading] = useState(false);

  const popoverRef = useRef(null);
  const fileInputRef = useRef(null);



  const colorOptions = [
    "#16a34a", // green
    "#eab308", // yellow
    "#f97316", // orange
    "#ef4444", // red
    "#8b5cf6", // purple
    "#3b82f6", // blue
    "#06b6d4", // cyan
    "#64748b", // slate
  ];

  const quillModules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  const fetchBoardLabels = async () => {
    if (!boardId) return;
    try {
      const res = await ApiClient.get(`/boards/${boardId}/labels`);
      if (res.success) setBoardLabels(res.data);
    } catch (err) {
      console.error("Failed to fetch board labels", err);
    }
  };

  useEffect(() => {
    if (isOpen && card) {
      setEditTitle(card.title || "");
      setEditDescription(card.description || "");
      setImageUrl(card.image || "");
      setTempImageUrl(card.image || "");
      setIsCompleted(card.completed || false);
      setIsEditingTitle(false);
      setIsEditingDescription(false);
      setActivePopover(null);
      setShowHistory(false);
      setLabelSearch("");
      fetchBoardLabels();
    }
  }, [isOpen, card, boardId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setActivePopover(null);
      }
    };
    if (activePopover) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activePopover]);

  const handleUpdateField = async (updates) => {
    if (isViewer) return;
    setLoading(true);
    try {
      const res = await ApiClient.put(`/cards/${card._id}`, updates);
      if (res.success) {
        if (onUpdate) onUpdate();
      }
    } catch (err) {
      toast.error("Failed to update card");
    } finally {
      setLoading(false);
    }
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (editTitle.trim() !== card.title) {
      if (!editTitle.trim()) {
        setEditTitle(card.title);
        toast.error("Title cannot be empty");
        return;
      }
      handleUpdateField({ title: editTitle });
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.target.blur();
    }
  };

  const handleSaveDescription = () => {
    setIsEditingDescription(false);
    if (editDescription !== card.description) {
      handleUpdateField({ description: editDescription });
    }
  };

  const handleAddImageUrl = async () => {
    if (isViewer) return;
    if (!tempImageUrl.trim()) {
      toast.error("Please enter an image URL");
      return;
    }
    await handleUpdateField({ image: tempImageUrl });
    setImageUrl(tempImageUrl);
    setActivePopover(null);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (isViewer) return;

    setLoading(true);
    try {
      const res = await ApiClient.postFormData(`/cards/${card._id}/attachment`, { file });
      if (res.success) {
        setImageUrl(res.data.image);
        setActivePopover(null);
        if (onUpdate) onUpdate();
        toast.success("File uploaded");
      }
    } catch (err) {
      toast.error("Failed to upload file");
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = async () => {
    if (isViewer) return;
    await handleUpdateField({ image: "" });
    setImageUrl("");
  };

  const handleCreateLabel = async (e) => {
    e.preventDefault();
    if (isViewer) return;
    if (!newLabelName.trim()) {
      toast.error("Label name cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const resBoard = await ApiClient.post(`/boards/${boardId}/labels`, {
        name: newLabelName.trim(),
        color: newLabelColor,
      });

      if (resBoard.success) {
        const newLabelId = resBoard.data._id;
        const resCard = await ApiClient.post(`/cards/${card._id}/label`, {
          labelId: newLabelId,
        });

        if (resCard.success) {
          setNewLabelName("");
          await fetchBoardLabels();
          if (onUpdate) onUpdate();
          setActivePopover("labels");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create label");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLabel = async (labelId) => {
    if (isViewer) return;
    setLoading(true);
    try {
      const isAttached = card.labels?.some(l => l._id === labelId);
      if (isAttached) {
        const res = await ApiClient.delete(`/cards/${card._id}/label`, { data: { labelId } });
        if (res.success) {
          if (onUpdate) onUpdate();
        }
      } else {
        const res = await ApiClient.post(`/cards/${card._id}/label`, { labelId });
        if (res.success) {
          if (onUpdate) onUpdate();
        }
      }
    } catch (err) {
      toast.error("Failed to toggle label");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async () => {
    if (isViewer) return;
    try {
      const res = await ApiClient.put(`/cards/${card._id}/complete`);
      if (res.success) {
        setIsCompleted(!isCompleted);
        if (onUpdate) onUpdate();
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleArchive = async () => {
    if (isViewer) return;
    try {
      const res = await ApiClient.put(`/cards/${card._id}/archive`);
      if (res.success) {
        onClose();
        if (onUpdate) onUpdate();
        toast.success(res.data.isArchived ? "Card archived" : "Card restored");
      }
    } catch (err) {
      toast.error("Failed to archive card");
    }
  };

  const handleDelete = () => {
    if (isViewer) return;
    toast((t) => (
      <div className="flex flex-col gap-2">
        <span className="text-sm">Delete this card permanently?</span>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              try {
                const res = await ApiClient.delete(`/cards/${card._id}`);
                if (res.success) {
                  toast.dismiss(t.id);
                  onClose();
                  if (onUpdate) onUpdate();
                  toast.success("Card deleted");
                }
              } catch (err) {
                toast.error("Failed to delete card");
              }
            }}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs font-medium"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-slate-600 text-white rounded hover:bg-slate-700 text-xs font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    ));
  };

  if (!isOpen || !card) return null;

  const filteredLabels = boardLabels.filter(l => 
    l.name.toLowerCase().includes(labelSearch.toLowerCase())
  );

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 pb-16 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-[768px] relative bg-slate-900 border border-slate-700 rounded-xl shadow-2xl text-slate-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-700 transition z-10 text-slate-400 hover:text-slate-200"
        >
          <FiX className="text-xl" />
        </button>

        {/* Modal Header */}
        <div className="px-6 pt-6 pb-2">
          <div className="flex items-start gap-4 pr-8">
            <FiCreditCard className="text-xl mt-1.5 text-slate-400" />
            <div className="w-full">
              {isEditingTitle && !isViewer ? (
                <textarea
                  autoFocus
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={handleTitleBlur}
                  onKeyDown={handleTitleKeyDown}
                  className="w-full text-xl font-bold bg-slate-800 border-2 border-cyan-500 rounded px-2 py-1 outline-none resize-none overflow-hidden text-slate-100"
                  rows={1}
                />
              ) : (
                <h2 
                  onClick={() => !isViewer && setIsEditingTitle(true)}
                  className={`text-xl font-bold cursor-pointer hover:bg-slate-800 px-2 py-1 -ml-2 rounded text-slate-100 ${isCompleted ? 'line-through opacity-60' : ''}`}
                >
                  {card.title}
                </h2>
              )}
            </div>
          </div>
        </div>

        {/* Main 2-Column Grid */}
        <div className="px-6 pb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* LEFT COLUMN: Main Content */}
          <div className="md:col-span-3 space-y-6">
            
            {showHistory ? (
              <div className="ml-10">
                <div className="flex items-center gap-3 mb-6 -ml-10">
                  <button onClick={() => setShowHistory(false)} className="p-1.5 text-slate-400 hover:text-slate-200 rounded-md hover:bg-slate-700 transition">
                    <FiChevronLeft className="text-xl" />
                  </button>
                  <FiClock className="text-xl text-cyan-500" />
                  <h3 className="text-lg font-bold text-slate-200">Activity History</h3>
                </div>
                
                {card.history && card.history.length > 0 ? (
                  <div className="space-y-6 border-l-2 border-slate-700 pl-6 ml-2 relative">
                    {card.history.map((event, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[43px] top-0 w-10 h-10 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center overflow-hidden">
                          {event.user?.avatar ? (
                            <img src={getFullImageUrl(event.user.avatar)} className="w-full h-full object-cover" alt="avatar" />
                          ) : (
                            <span className="text-sm font-bold text-slate-300">
                              {event.user?.fname ? event.user.fname[0].toUpperCase() : 'U'}
                            </span>
                          )}
                        </div>
                        <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/50 transition hover:bg-slate-800/60">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold text-slate-200 text-sm">
                              {event.user?.fname} {event.user?.lname}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">
                              {new Date(event.timestamp).toLocaleString(undefined, {
                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-slate-300 mt-1">
                            {event.details}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm italic ml-2">No history available for this card.</p>
                )}
              </div>
            ) : (
              <>
            {/* Inline Labels Display */}
            <div className="ml-10 flex flex-wrap gap-4">
              {card.labels && card.labels.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Labels</h3>
                  <div className="flex flex-wrap gap-2">
                    {card.labels.map(label => (
                      <span 
                        key={label._id} 
                        className="px-3 py-1 text-xs font-medium text-white rounded hover:opacity-80 cursor-pointer"
                        style={{ backgroundColor: label.color }}
                        onClick={() => !isViewer && setActivePopover('labels')}
                      >
                        {label.name}
                      </span>
                    ))}
                    {!isViewer && (
                      <button 
                        onClick={() => setActivePopover('labels')}
                        className="w-8 h-7 bg-slate-800 hover:bg-slate-700 flex items-center justify-center rounded text-slate-300"
                      >
                        <FiPlus />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Description Section */}
            <div className="ml-10">
              <div className="flex items-center gap-3 mb-3 -ml-10">
                <FiAlignLeft className="text-xl text-slate-400" />
                <h3 className="text-base font-semibold text-slate-200">Description</h3>
                {!isEditingDescription && !isViewer && card.description && (
                  <button 
                    onClick={() => setIsEditingDescription(true)}
                    className="px-3 py-1.5 ml-3 bg-slate-800 hover:bg-slate-700 rounded text-sm text-slate-200 font-medium transition"
                  >
                    Edit
                  </button>
                )}
              </div>
              
              {isEditingDescription && !isViewer ? (
                <div className="space-y-3">
                  <div className="rounded-lg overflow-hidden border border-slate-600 bg-slate-800 text-slate-200">
                    <ReactQuill
                      value={editDescription}
                      onChange={setEditDescription}
                      modules={quillModules}
                      theme="snow"
                      className="border-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleSaveDescription}
                      className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded transition"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => {
                        setEditDescription(card.description || "");
                        setIsEditingDescription(false);
                      }}
                      className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => !isViewer && setIsEditingDescription(true)}
                  className={`bg-slate-800/50 hover:bg-slate-800 rounded-lg p-3 min-h-[60px] cursor-pointer transition ${!card.description ? 'py-4 px-4 bg-slate-800' : ''}`}
                >
                  {card.description ? (
                    <div className="prose prose-sm prose-invert max-w-none break-words whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: card.description }} />
                  ) : (
                    <p className="text-slate-400 text-sm font-medium">Add a more detailed description...</p>
                  )}
                </div>
              )}
            </div>

            {/* Attachments Section */}
            {imageUrl && (
              <div className="ml-10">
                <div className="flex items-center gap-3 mb-3 -ml-10">
                  <FiPaperclip className="text-xl text-slate-400" />
                  <h3 className="text-base font-semibold text-slate-200">Attachments</h3>
                </div>
                <div className="group relative bg-slate-800 rounded-lg overflow-hidden border border-slate-700 p-2">
                  <Zoom
                    small={getFullImageUrl(imageUrl)}
                    large={getFullImageUrl(imageUrl)}
                    alt="Card attachment"
                    className="w-full max-h-80 object-contain rounded bg-slate-900 cursor-zoom-in"
                  />
                  {!isViewer && (
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-4 right-4 px-3 py-1.5 bg-slate-900/80 hover:bg-slate-900 text-slate-200 text-xs font-medium rounded opacity-0 group-hover:opacity-100 transition"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            )}
            </>
            )}
          </div>

          {/* RIGHT COLUMN: Sidebar Actions */}
          <div className="md:col-span-1 space-y-4">
            
            {/* Add to Card */}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Add to card</h4>
              <div className="space-y-2 relative">
                
                {/* Labels Button */}
                <button 
                  onClick={() => setActivePopover(activePopover === 'labels' ? null : 'labels')}
                  disabled={isViewer}
                  className="w-full flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded transition disabled:opacity-50"
                >
                  <FiTag className="text-slate-400" /> Labels
                </button>

                {/* Popover for Labels */}
                {activePopover === 'labels' && (
                  <div ref={popoverRef} className="absolute top-full left-0 mt-1 w-72 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="px-3 py-2 border-b border-slate-700 text-center relative">
                      <span className="text-sm font-semibold text-slate-200">Labels</span>
                      <button onClick={() => setActivePopover(null)} className="absolute right-2 top-2 p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-700">
                        <FiX />
                      </button>
                    </div>
                    <div className="p-3 space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                      <input 
                        type="text" 
                        placeholder="Search labels..." 
                        value={labelSearch}
                        onChange={(e) => setLabelSearch(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-sm text-slate-200 focus:border-cyan-500 outline-none"
                      />
                      <div className="space-y-1 mt-2">
                        <h5 className="text-xs font-semibold text-slate-400 mb-1">Labels</h5>
                        {filteredLabels.map(label => {
                          const isAttached = card.labels?.some(l => l._id === label._id);
                          return (
                            <div key={label._id} className="flex items-center gap-2">
                              <input 
                                type="checkbox" 
                                checked={isAttached} 
                                onChange={() => handleToggleLabel(label._id)}
                                disabled={loading}
                                className="w-4 h-4 rounded border-slate-600 bg-slate-900 cursor-pointer accent-cyan-500"
                              />
                              <div 
                                onClick={() => handleToggleLabel(label._id)}
                                className="flex-1 h-8 rounded px-3 flex items-center text-white text-sm font-medium cursor-pointer hover:opacity-90 transition"
                                style={{ backgroundColor: label.color }}
                              >
                                {label.name}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <button 
                        onClick={() => setActivePopover('createLabel')}
                        className="w-full py-1.5 mt-2 bg-slate-700 hover:bg-slate-600 rounded text-sm font-medium text-slate-200 transition"
                      >
                        Create a new label
                      </button>
                    </div>
                  </div>
                )}

                {/* Popover for Create Label */}
                {activePopover === 'createLabel' && (
                  <div ref={popoverRef} className="absolute top-full left-0 mt-1 w-72 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="px-3 py-2 border-b border-slate-700 text-center relative flex items-center justify-center">
                      <button 
                        onClick={() => setActivePopover('labels')} 
                        className="absolute left-2 top-2 p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-700"
                      >
                        <FiChevronLeft />
                      </button>
                      <span className="text-sm font-semibold text-slate-200">Create label</span>
                      <button 
                        onClick={() => setActivePopover(null)} 
                        className="absolute right-2 top-2 p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-700"
                      >
                        <FiX />
                      </button>
                    </div>
                    <form onSubmit={handleCreateLabel} className="p-3 space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-400 block mb-1">Title</label>
                        <input 
                          type="text" 
                          value={newLabelName}
                          onChange={(e) => setNewLabelName(e.target.value)}
                          disabled={loading}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-sm text-slate-200 focus:border-cyan-500 outline-none"
                          autoFocus
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-400 block mb-2">Select a color</label>
                        <div className="grid grid-cols-4 gap-2">
                          {colorOptions.map(color => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => setNewLabelColor(color)}
                              className={`h-8 rounded cursor-pointer transition ${newLabelColor === color ? 'ring-2 ring-white ring-offset-1 ring-offset-slate-800' : 'hover:opacity-80'}`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-sm font-medium transition disabled:opacity-50"
                      >
                        Create
                      </button>
                    </form>
                  </div>
                )}

                {/* Attachment Button */}
                <button 
                  onClick={() => setActivePopover(activePopover === 'attachment' ? null : 'attachment')}
                  disabled={isViewer}
                  className="w-full flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded transition disabled:opacity-50"
                >
                  <FiPaperclip className="text-slate-400" /> Attachment
                </button>

                {/* Popover for Attachment */}
                {activePopover === 'attachment' && (
                  <div ref={popoverRef} className="absolute top-full left-0 mt-1 w-72 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="px-3 py-2 border-b border-slate-700 text-center relative">
                      <span className="text-sm font-semibold text-slate-200">Attach from...</span>
                      <button onClick={() => setActivePopover(null)} className="absolute right-2 top-2 p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-700">
                        <FiX />
                      </button>
                    </div>
                    <div className="p-3 space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-400 block mb-1">Search or paste a link</label>
                        <input 
                          type="text" 
                          placeholder="Paste image URL here" 
                          value={tempImageUrl}
                          onChange={(e) => setTempImageUrl(e.target.value)}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-sm text-slate-200 focus:border-cyan-500 outline-none"
                          autoFocus
                        />
                      </div>
                      <button 
                        onClick={handleAddImageUrl}
                        disabled={loading}
                        className="w-full py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-sm font-medium text-slate-200 transition"
                      >
                        Insert
                      </button>
                      <div className="border-t border-slate-700 my-2 pt-2 text-center">
                        <span className="text-xs text-slate-400 block mb-2">Or</span>
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          className="hidden"
                          accept="image/*"
                        />
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          disabled={loading}
                          className="w-full py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-sm font-medium transition disabled:opacity-50"
                        >
                          {loading ? "Uploading..." : "Choose file"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
              </div>
            </div>

            {/* Actions */}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Actions</h4>
              <div className="space-y-2">
                <button 
                  onClick={() => setShowHistory(true)}
                  className="w-full flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded transition"
                >
                  <FiClock className="text-slate-400" /> See History
                </button>
                {!isViewer && (
                  <button 
                    onClick={handleToggleComplete}
                    className="w-full flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded transition"
                  >
                    {isCompleted ? <FaCheckCircle className="text-green-500" /> : <FaRegCheckCircle className="text-slate-400" />} 
                    {isCompleted ? "Completed" : "Mark Complete"}
                  </button>
                )}
                {!isViewer && (
                  <button 
                    onClick={handleArchive}
                    className="w-full flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded transition"
                  >
                    <FiArchive className="text-slate-400" /> Archive
                  </button>
                )}
                {!isViewer && (
                  <button 
                    onClick={handleDelete}
                    className="w-full flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-red-600/20 text-slate-200 hover:text-red-400 text-sm font-medium rounded transition"
                  >
                    <FiTrash2 className="text-slate-400" /> Delete
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>,
    document.body
  );
};

export default CardDetailsModal;
