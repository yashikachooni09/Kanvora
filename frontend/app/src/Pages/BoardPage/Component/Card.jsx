import { useState, useCallback, memo, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Draggable } from "@hello-pangea/dnd";
import CardDetailsModal from "./CardDetailsModal";
import ApiClient from "../../../api/apiClient";
import toast from "react-hot-toast";
import { FiMoreHorizontal, FiExternalLink, FiMove, FiChevronRight } from "react-icons/fi";
import { FaRegCircle, FaCheckCircle } from "react-icons/fa";
import { getFullImageUrl } from "../../../config/environment";

const Card = memo(({ card, index, isViewer = false, boardId, onUpdate, onDelete, onGlobalCardMove }) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showMoveOptions, setShowMoveOptions] = useState(false);
  const [lists, setLists] = useState([]);
  const [loadingLists, setLoadingLists] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current && !menuRef.current.contains(event.target) &&
        buttonRef.current && !buttonRef.current.contains(event.target)
      ) {
        setShowMenu(false);
        setShowMoveOptions(false);
      }
    };
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    if (!showMenu) {
      const rect = e.currentTarget.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 4, left: rect.right });
    }
    setShowMenu(!showMenu);
    setShowMoveOptions(false);
  };

  const handleOpenCardAction = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    setShowDetailsModal(true);
  };

  const handleMoveCardClick = async (e) => {
    e.stopPropagation();
    if (loadingLists) return;
    setLoadingLists(true);
    try {
      const res = await ApiClient.get(`/lists?boardId=${boardId}`);
      if (res.success) {
        setLists(res.data);
        setShowMoveOptions(true);
      }
    } catch (err) {
      toast.error("Failed to fetch lists");
    } finally {
      setLoadingLists(false);
    }
  };

  const handleMoveToSelectedList = async (listId, e) => {
    e.stopPropagation();
    try {
      const res = await ApiClient.put(`/cards/${card._id}/move`, {
        listId: listId,
        position: 0,
      });
      if (res.success) {
        toast.success("Card moved successfully");
        setShowMenu(false);
        setShowMoveOptions(false);
        if (onGlobalCardMove) onGlobalCardMove();
      }
    } catch (err) {
      toast.error("Failed to move card");
    }
  };

  const handleOpenModal = useCallback((e) => {
    e.stopPropagation();
    setShowDetailsModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowDetailsModal(false);
  }, []);

  const handleUpdate = useCallback(() => {
    if (onUpdate) onUpdate();
  }, [onUpdate]);

  const handleToggleComplete = async (e) => {
    e.stopPropagation();
    if (isViewer) return;
    try {
      const res = await ApiClient.put(`/cards/${card._id}/complete`);
      if (res.success) {
        if (onUpdate) onUpdate();
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (card.isArchived) return null;

  const stripHtml = (html) => {
    if (!html) return "";
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <>
      <Draggable draggableId={card._id} index={index} isDragDisabled={isViewer}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={handleOpenModal}
            className={`group relative flex flex-col rounded-lg border bg-slate-800/70 p-3 shadow transition-all duration-200 cursor-pointer min-h-[100px] ${
              snapshot.isDragging
                ? "shadow-2xl ring-2 ring-cyan-400 rotate-3"
                : "border-slate-700 hover:border-slate-600 hover:shadow-md hover:-translate-y-0.5"
            } ${card.completed ? "opacity-50 line-through" : ""}`}
          >
            <div className="absolute top-2 right-2 flex items-center gap-1 z-20">
              {card.labels && card.labels.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-end">
                  {card.labels.slice(0, 3).map((label, idx) => (
                    <span
                      key={`${label.name}-${idx}`}
                      className="inline-block rounded-full px-2 py-0.5 text-[10px] font-medium text-white shadow-sm"
                      style={{ backgroundColor: label.color }}
                      title={label.name}
                    >
                      {label.name.length > 10 ? label.name.slice(0, 10) + "..." : label.name}
                    </span>
                  ))}
                  {card.labels.length > 3 && (
                    <span className="inline-block rounded-full px-2 py-0.5 text-[10px] font-medium bg-slate-600 text-white">
                      +{card.labels.length - 3}
                    </span>
                  )}
                </div>
              )}

              {!isViewer && (
                <div className="relative">
                  <button
                    ref={buttonRef}
                    onClick={handleMenuToggle}
                    className="p-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 shadow-sm transition"
                  >
                    <FiMoreHorizontal className="text-sm" />
                  </button>
                  
                  {showMenu && createPortal(
                    <div 
                      ref={menuRef}
                      className="fixed w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden flex flex-col z-[9999] animate-in fade-in zoom-in-95"
                      style={{ top: menuPos.top, left: menuPos.left, transform: 'translateX(-100%)' }}
                    >
                      {!showMoveOptions ? (
                        <>
                          <button
                            onClick={handleOpenCardAction}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 transition w-full text-left"
                          >
                            <FiExternalLink className="text-slate-400" /> Open Card
                          </button>
                          <button
                            onClick={handleMoveCardClick}
                            disabled={loadingLists}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 transition w-full text-left justify-between disabled:opacity-50"
                          >
                            <span className="flex items-center gap-2"><FiMove className="text-slate-400" /> Move Card</span>
                            <FiChevronRight className="text-slate-500" />
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="px-3 py-2 border-b border-slate-700 text-xs font-semibold text-slate-400">
                            Move to List
                          </div>
                          <div className="max-h-48 overflow-y-auto custom-scrollbar">
                            {lists.map(list => (
                              <button
                                key={list._id}
                                onClick={(e) => handleMoveToSelectedList(list._id, e)}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 transition w-full text-left"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                                <span className="truncate">{list.title}</span>
                              </button>
                            ))}
                            {lists.length === 0 && (
                              <div className="px-3 py-2 text-sm text-slate-500">No lists found</div>
                            )}
                          </div>
                        </>
                      )}
                    </div>,
                    document.body
                  )}
                </div>
              )}
            </div>

            <div className="absolute top-0 left-0 h-0.5 w-8 bg-gradient-to-r from-indigo-500 to-cyan-400" />
            
            <div className="flex items-start gap-2 mt-2 pr-16">
              <button 
                onClick={handleToggleComplete}
                className="mt-0.5 shrink-0 text-slate-400 hover:text-cyan-400 transition"
              >
                {card.completed ? (
                  <FaCheckCircle className="text-green-500" />
                ) : (
                  <FaRegCircle />
                )}
              </button>
              <p className={`text-sm font-semibold line-clamp-3 break-words ${card.completed ? 'text-slate-500' : 'text-slate-100'}`}>
                {card.title}
              </p>
            </div>
            
            {card.image && card.image.trim() !== "" && (
              <div className="mt-2 h-20 w-full rounded overflow-hidden bg-slate-900">
                <img
                  src={getFullImageUrl(card.image)}
                  alt="card preview"
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
            

          </div>
        )}
      </Draggable>
      
      {showDetailsModal && (
        <CardDetailsModal
          card={card}
          isOpen={showDetailsModal}
          isViewer={isViewer}
          boardId={boardId}
          onClose={handleCloseModal}
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
});

Card.displayName = "Card";

export default Card;