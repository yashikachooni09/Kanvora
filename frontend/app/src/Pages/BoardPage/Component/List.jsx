import { useEffect, useState, useCallback, memo } from "react";
import ApiClient from "../../../api/apiClient";
import Card from "./Card";
import AddCard from "./AddCard";
import { Droppable } from "@hello-pangea/dnd";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";

const List = memo(({ list, isViewer = false, onListUpdate, onListDelete, refreshTrigger, onGlobalCardMove }) => {
  const [cards, setCards] = useState([]);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(list.title);

  const fetchCards = useCallback(async () => {
    try {
      const res = await ApiClient.get(`/cards?listId=${list._id}`);
      if (res.success) {
        setCards(res.data);
      }
    } catch (err) {
      console.error("Error fetching cards:", err);
    }
  }, [list._id]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards, refreshTrigger]);

  const formatTitle = useCallback((text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }, []);

  const handleUpdateListTitle = useCallback(async () => {
    if (isViewer) return;
    if (!newTitle.trim()) {
      toast.error("List title cannot be empty");
      setNewTitle(list.title);
      return;
    }

    try {
      const res = await ApiClient.put(`/lists/${list._id}`, {
        title: newTitle,
      });

      if (res.success) {
        setIsEditingTitle(false);
        if (onListUpdate) onListUpdate();
      }
    } catch (err) {
      toast.error("Failed to update list");
    }
  }, [isViewer, list._id, newTitle, list.title, onListUpdate]);

  const handleDeleteList = useCallback(() => {
    if (isViewer) return;
    toast((t) => (
      <div className="flex gap-2">
        <span>Delete this list? All cards will be deleted.</span>
        <button
          onClick={async () => {
            try {
              const res = await ApiClient.delete(`/lists/${list._id}`);
              if (res.success) {
                toast.dismiss(t.id);
                if (onListDelete) onListDelete();
                toast.success("List deleted successfully");
              }
            } catch (err) {
              toast.error("Failed to delete list");
            }
          }}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 whitespace-nowrap"
        >
          Delete
        </button>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="px-3 py-1 bg-slate-600 text-white rounded hover:bg-slate-700"
        >
          Cancel
        </button>
      </div>
    ));
  }, [isViewer, list._id, onListDelete]);

  const handleUpdate = useCallback(() => {
    fetchCards();
  }, [fetchCards]);

  return (
    <div className="w-80 flex-shrink-0 flex flex-col max-h-[calc(100vh-12rem)] bg-slate-800/60 rounded-2xl border border-slate-700 p-4 shadow-lg hover:shadow-xl transition">
      <div className="group mb-4 pb-4 border-b border-slate-700 flex items-center justify-between">
        {!isViewer && isEditingTitle ? (
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={handleUpdateListTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleUpdateListTitle();
              if (e.key === "Escape") {
                setIsEditingTitle(false);
                setNewTitle(list.title);
              }
            }}
            className="flex-1 rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-white border border-slate-600 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
            autoFocus
          />
        ) : (
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            {formatTitle(list.title)}
          </h3>
        )}

        {!isViewer && (
          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={() => setIsEditingTitle(!isEditingTitle)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-700 transition"
              title="Edit list"
            >
              <FiEdit2 className="text-sm" />
            </button>
            <button
              onClick={handleDeleteList}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-700 transition"
              title="Delete list"
            >
              <FiTrash2 className="text-sm" />
            </button>
          </div>
        )}
      </div>

      <Droppable droppableId={list._id} isDropDisabled={isViewer}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto overflow-x-hidden space-y-3 pr-2 rounded-lg transition ${
              snapshot.isDraggingOver ? "bg-slate-700/30" : ""
            }`}
          >
            {cards.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-8">No cards yet</p>
            )}
            {cards.map((card, index) => (
              <Card
                key={card._id}
                card={card}
                index={index}
                isViewer={isViewer}
                boardId={list.boardId}
                onUpdate={handleUpdate}
                onDelete={handleUpdate}
                onGlobalCardMove={onGlobalCardMove}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {!isViewer && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <AddCard listId={list._id} refresh={fetchCards} />
        </div>
      )}
    </div>
  );
});

List.displayName = "List";

export default List;