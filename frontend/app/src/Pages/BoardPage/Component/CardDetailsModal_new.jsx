import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { 
  FiX, FiPlus, FiSave, FiEdit2, FiTrash2, FiArchive, FiImage, 
  FiRefreshCw, FiAlignLeft
} from "react-icons/fi";
import { FaCheckCircle, FaRegCheckCircle } from "react-icons/fa";
import ApiClient from "../../../api/apiClient";
import toast from "react-hot-toast";
import { getFullImageUrl } from "../../../config/environment";

const CardDetailsModal = ({ card, isOpen, onClose, onUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tempImageUrl, setTempImageUrl] = useState("");
  const [labelName, setLabelName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#6366f1");
  const [loading, setLoading] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [currentLabels, setCurrentLabels] = useState([]);
  const [currentCard, setCurrentCard] = useState(card);

  const colorOptions = [
    "#6366f1", "#0891b2", "#dc2626", "#ea580c", 
    "#22c55e", "#a855f7", "#f59e0b", "#ec4899"
  ];

  // Update state when card changes
  useEffect(() => {
    if (isOpen && card) {
      setCurrentCard(card);
      setEditTitle(card.title || "");
      setEditDescription(card.description || "");
      setImageUrl(card.image || "");
      setTempImageUrl(card.image || "");
      setIsCompleted(card.completed || false);
      setIsArchived(card.isArchived || false);
      setCurrentLabels(card.labels || []);
      setEditMode(false);
      setShowImageInput(false);
      
      // Lock body scroll
      document.body.style.overflow = "hidden";
      document.body.classList.add("modal-open");
    }
    
    return () => {
      if (!isOpen) {
        document.body.style.overflow = "";
        document.body.classList.remove("modal-open");
      }
    };
  }, [isOpen, card]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Save all changes (title, description, image)
  const handleSaveChanges = useCallback(async () => {
    if (!editTitle.trim()) {
      toast.error("Card title cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        title: editTitle,
        description: editDescription,
        image: imageUrl,
      };

      const res = await ApiClient.put(`/cards/${currentCard._id}`, updateData);

      if (res.success) {
        setCurrentCard(prev => ({ ...prev, ...updateData }));
        setEditMode(false);
        if (onUpdate) onUpdate();
        toast.success("Card updated successfully");
      } else {
        toast.error(res.message || "Failed to update card");
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to update card");
    } finally {
      setLoading(false);
    }
  }, [currentCard._id, editTitle, editDescription, imageUrl, onUpdate]);

  // Add image URL
  const handleAddImageUrl = useCallback(async () => {
    if (!tempImageUrl.trim()) {
      toast.error("Please enter a valid image URL");
      return;
    }

    setLoading(true);
    try {
      const res = await ApiClient.put(`/cards/${currentCard._id}`, {
        image: tempImageUrl,
      });

      if (res.success) {
        setImageUrl(tempImageUrl);
        setCurrentCard(prev => ({ ...prev, image: tempImageUrl }));
        setShowImageInput(false);
        if (onUpdate) onUpdate();
        toast.success("Image added successfully!");
      } else {
        toast.error("Failed to add image");
      }
    } catch (err) {
      console.error("Image add error:", err);
      toast.error("Failed to add image");
    } finally {
      setLoading(false);
    }
  }, [currentCard._id, tempImageUrl, onUpdate]);

  const handleRemoveImage = useCallback(async () => {
    setLoading(true);
    try {
      const res = await ApiClient.put(`/cards/${currentCard._id}`, {
        image: "",
      });

      if (res.success) {
        setImageUrl("");
        setTempImageUrl("");
        setCurrentCard(prev => ({ ...prev, image: "" }));
        if (onUpdate) onUpdate();
        toast.success("Image removed successfully");
      } else {
        toast.error("Failed to remove image");
      }
    } catch (err) {
      console.error("Image remove error:", err);
      toast.error("Failed to remove image");
    } finally {
      setLoading(false);
    }
  }, [currentCard._id, onUpdate]);

  // Add Label - FIXED VERSION
  const handleAddLabel = useCallback(async (e) => {
    e.preventDefault();

    if (!labelName.trim()) {
      toast.error("Label name required");
      return;
    }

    setLoading(true);
    try {
      const res = await ApiClient.post(`/cards/${currentCard._id}/label`, {
        name: labelName.trim(),
        color: selectedColor,
      });

      console.log("Add label response:", res); // Debug log

      if (res.success) {
        toast.success(`Label "${labelName}" added successfully!`);
        // Update local state with new labels from response
        if (res.data && res.data.labels) {
          setCurrentLabels(res.data.labels);
          setCurrentCard(prev => ({ ...prev, labels: res.data.labels }));
        }
        if (onUpdate) onUpdate();
        setLabelName("");
        setSelectedColor("#6366f1");
      } else {
        toast.error(res.message || "Failed to add label");
      }
    } catch (err) {
      console.error("Add label error:", err);
      const message = err.response?.data?.message || "Failed to add label";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [currentCard._id, labelName, selectedColor, onUpdate]);

  // Remove Label
  const handleRemoveLabel = useCallback(async (labelNameToRemove) => {
    setLoading(true);
    try {
      const res = await ApiClient.delete(`/cards/${currentCard._id}/label`, {
        data: { labelName: labelNameToRemove },
      });

      console.log("Remove label response:", res); // Debug log

      if (res.success) {
        toast.success(`Label "${labelNameToRemove}" removed`);
        if (res.data && res.data.labels) {
          setCurrentLabels(res.data.labels);
          setCurrentCard(prev => ({ ...prev, labels: res.data.labels }));
        }
        if (onUpdate) onUpdate();
      } else {
        toast.error(res.message || "Failed to remove label");
      }
    } catch (err) {
      console.error("Remove label error:", err);
      const message = err.response?.data?.message || "Failed to remove label";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [currentCard._id, onUpdate]);

  // Toggle complete status
  const handleToggleComplete = useCallback(async () => {
    try {
      const res = await ApiClient.put(`/cards/${currentCard._id}/complete`, {});
      if (res.success) {
        const newStatus = !isCompleted;
        setIsCompleted(newStatus);
        setCurrentCard(prev => ({ ...prev, completed: newStatus }));
        if (onUpdate) onUpdate();
        toast.success(newStatus ? "Marked as complete" : "Marked as incomplete");
      }
    } catch (err) {
      toast.error("Failed to update card status");
    }
  }, [currentCard._id, isCompleted, onUpdate]);

  // Archive/Unarchive card
  const handleArchive = useCallback(async () => {
    try {
      const res = await ApiClient.put(`/cards/${currentCard._id}/archive`, {});
      if (res.success) {
        setIsArchived(true);
        setCurrentCard(prev => ({ ...prev, isArchived: true }));
        toast.success("Card archived successfully");
        setTimeout(() => {
          handleClose();
          if (onUpdate) onUpdate();
        }, 500);
      }
    } catch (err) {
      toast.error("Failed to archive card");
    }
  }, [currentCard._id, onUpdate, handleClose]);

  const handleUnarchive = useCallback(async () => {
    try {
      const res = await ApiClient.put(`/cards/${currentCard._id}/archive`, {});
      if (res.success) {
        setIsArchived(false);
        setCurrentCard(prev => ({ ...prev, isArchived: false }));
        toast.success("Card unarchived successfully");
        if (onUpdate) onUpdate();
      }
    } catch (err) {
      toast.error("Failed to unarchive card");
    }
  }, [currentCard._id, onUpdate]);

  // Delete card
  const handleDelete = useCallback(() => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <span>Permanently delete this card?</span>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              try {
                const res = await ApiClient.delete(`/cards/${currentCard._id}`);
                if (res.success) {
                  toast.dismiss(t.id);
                  handleClose();
                  if (onUpdate) onUpdate();
                  toast.success("Card deleted successfully");
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
  }, [currentCard._id, onUpdate, handleClose]);

  const handleEnterEditMode = useCallback(() => {
    setEditTitle(currentCard.title || "");
    setEditDescription(currentCard.description || "");
    setImageUrl(currentCard.image || "");
    setTempImageUrl(currentCard.image || "");
    setEditMode(true);
  }, [currentCard]);

  if (!isOpen || !currentCard) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto"
      onClick={handleClose}
    >
      <div 
        className="w-full max-w-2xl my-8 rounded-2xl bg-slate-900 shadow-2xl border border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Removed Star Button */}
        <div className="sticky top-0 flex items-center justify-between bg-slate-800/90 px-6 py-4 border-b border-slate-700">
          <div className="flex-1">
            {editMode ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full text-xl font-bold text-white bg-slate-700/50 px-3 py-1 rounded-lg border border-slate-600 focus:outline-none focus:border-cyan-500"
                autoFocus
              />
            ) : (
              <h2 className={`text-xl font-bold text-white ${isCompleted ? "line-through opacity-50" : ""}`}>
                {currentCard.title}
              </h2>
            )}
          </div>

          <div className="flex items-center gap-3 ml-4">
            <button
              onClick={handleToggleComplete}
              className="text-slate-400 hover:text-green-400 transition"
              title={isCompleted ? "Mark incomplete" : "Mark complete"}
            >
              {isCompleted ? (
                <FaCheckCircle className="text-green-400 text-lg" />
              ) : (
                <FaRegCheckCircle className="text-lg" />
              )}
            </button>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-white transition"
            >
              <FiX className="text-2xl" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6 space-y-6">
          {/* Image Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-300 uppercase flex items-center gap-2">
                <FiImage /> Image
              </h3>
              {editMode && (
                <button
                  onClick={() => setShowImageInput(!showImageInput)}
                  className="text-xs px-3 py-1 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 transition"
                >
                  {showImageInput ? "Cancel" : "Add/Change"}
                </button>
              )}
            </div>

            {showImageInput && editMode && (
              <div className="flex gap-2 p-3 bg-slate-800/50 rounded-lg">
                <input
                  type="text"
                  value={tempImageUrl}
                  onChange={(e) => setTempImageUrl(e.target.value)}
                  placeholder="Paste image URL here..."
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={handleAddImageUrl}
                  disabled={loading}
                  className="px-3 py-2 rounded-lg bg-cyan-600 text-white text-sm font-medium hover:bg-cyan-700 transition disabled:opacity-50"
                >
                  {loading ? "Adding..." : "Add URL"}
                </button>
              </div>
            )}

            {imageUrl && imageUrl.trim() !== "" && (
              <div className="relative group rounded-lg overflow-hidden bg-slate-800/50 p-3">
                <img
                  src={getFullImageUrl(imageUrl)}
                  alt="Card image"
                  className="max-w-full max-h-64 object-contain rounded-lg cursor-pointer mx-auto"
                  onClick={() => window.open(getFullImageUrl(imageUrl), '_blank')}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    toast.error("Image failed to load");
                  }}
                />
                <div className="mt-2 text-xs text-slate-400 text-center">Click to open in new tab</div>
                {editMode && (
                  <button
                    onClick={handleRemoveImage}
                    disabled={loading}
                    className="mt-2 w-full px-3 py-1 text-xs rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition disabled:opacity-50"
                  >
                    Remove Image
                  </button>
                )}
              </div>
            )}

            {(!imageUrl || imageUrl.trim() === "") && (
              <div className="p-3 bg-slate-800/30 rounded-lg text-xs text-slate-400 text-center">
                No image yet {editMode && "- click Add/Change to add one"}
              </div>
            )}
          </div>

          {/* Description Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-300 uppercase flex items-center gap-2">
                <FiAlignLeft /> Description
              </h3>
            </div>
            {editMode ? (
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Add a more detailed description..."
                rows={6}
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition resize-y"
              />
            ) : (
              <div 
                className="p-4 bg-slate-800/50 rounded-lg min-h-[100px] cursor-pointer hover:bg-slate-800/70 transition"
                onClick={() => !editMode && handleEnterEditMode()}
              >
                {editDescription && editDescription.trim() !== "" ? (
                  <p className="text-slate-300 whitespace-pre-wrap">{editDescription}</p>
                ) : (
                  <p className="text-slate-400 italic">No description yet. Click to add...</p>
                )}
              </div>
            )}
          </div>

          {/* Labels Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-300 uppercase">Labels</h3>

            {currentLabels && currentLabels.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-slate-800/50 rounded-lg">
                {currentLabels.map((label, idx) => (
                  <div
                    key={`${label.name}-${idx}`}
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-white transition-all hover:shadow-lg"
                    style={{ backgroundColor: label.color }}
                  >
                    <span>{label.name}</span>
                    {editMode && (
                      <button
                        onClick={() => handleRemoveLabel(label.name)}
                        disabled={loading}
                        className="ml-1 hover:opacity-75 transition disabled:opacity-50"
                      >
                        <FiX className="text-sm" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {editMode && (
              <form onSubmit={handleAddLabel} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Add New Label
                  </label>
                  <input
                    type="text"
                    value={labelName}
                    onChange={(e) => setLabelName(e.target.value)}
                    placeholder="e.g., Urgent, In Progress..."
                    disabled={loading}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-2">
                    Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        disabled={loading}
                        className={`h-8 w-8 rounded-full border-2 transition ${
                          selectedColor === color
                            ? "border-white shadow-lg scale-110"
                            : "border-transparent hover:border-slate-400 hover:scale-105"
                        } disabled:opacity-50`}
                        style={{ backgroundColor: color }}
                        aria-label={`Select color ${color}`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-3 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <FiPlus className="text-sm" />
                  {loading ? "Adding..." : "Add Label"}
                </button>
              </form>
            )}

            {(!currentLabels || currentLabels.length === 0) && !editMode && (
              <p className="text-xs text-slate-400">No labels yet</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex flex-col gap-3 bg-slate-800/90 px-6 py-4 border-t border-slate-700">
          <div className="flex gap-2">
            <button
              onClick={editMode ? () => setEditMode(false) : handleClose}
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 transition disabled:opacity-50"
            >
              {editMode ? "Cancel" : "Close"}
            </button>
            {editMode ? (
              <button
                onClick={handleSaveChanges}
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <FiSave className="text-sm" />
                {loading ? "Saving..." : "Save Changes"}
              </button>
            ) : (
              <button
                onClick={handleEnterEditMode}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:shadow-lg transition flex items-center justify-center gap-2"
              >
                <FiEdit2 className="text-sm" />
                Edit Card
              </button>
            )}
          </div>

          {!editMode && (
            <div className="flex gap-2">
              {isArchived ? (
                <button
                  onClick={handleUnarchive}
                  disabled={loading}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-slate-200 bg-slate-700 hover:bg-green-600/50 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  title="Unarchive this card"
                >
                  <FiRefreshCw className="text-sm" />
                  Unarchive
                </button>
              ) : (
                <button
                  onClick={handleArchive}
                  disabled={loading}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-slate-200 bg-slate-700 hover:bg-blue-600/50 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  title="Archive this card"
                >
                  <FiArchive className="text-sm" />
                  Archive
                </button>
              )}
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-slate-200 bg-slate-700 hover:bg-red-600/50 transition disabled:opacity-50 flex items-center justify-center gap-2"
                title="Delete this card permanently"
              >
                <FiTrash2 className="text-sm" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CardDetailsModal;