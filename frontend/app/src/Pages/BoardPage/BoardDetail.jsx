import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ApiClient from "../../api/apiClient";
import List from "./Component/List";
import AddList from "./Component/AddList";
import { DragDropContext } from "@hello-pangea/dnd";

const BoardDetail = () => {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);

  const fetchLists = async () => {
    const res = await ApiClient.get(`/lists?boardId=${id}`);
    if (res.success) {
      setLists(res.data);
    }
  };

  const fetchBoard = async () => {
    const res = await ApiClient.get(`/boards/${id}`);
    if (res.success) {
      setBoard(res.data);
    }
  };

  useEffect(() => {
    fetchBoard();
    fetchLists();
  }, []);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceListIndex = lists.findIndex((l) => l._id === source.droppableId);
    const destListIndex = lists.findIndex((l) => l._id === destination.droppableId);
    const sourceList = lists[sourceListIndex];
    const destList = lists[destListIndex];
    const sourceCards = [...sourceList.cards];
    const destCards = sourceListIndex === destListIndex ? sourceCards : [...destList.cards];
    const [movedCard] = sourceCards.splice(source.index, 1);
    destCards.splice(destination.index, 0, movedCard);
    const newLists = [...lists];
    newLists[sourceListIndex].cards = sourceCards;
    newLists[destListIndex].cards = destCards;
    setLists(newLists);
  };

  return (
    <div className="h-screen overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/90 shadow-2xl shadow-slate-950/50">
      <div className="border-b border-slate-800 bg-slate-900/80 px-6 py-4 backdrop-blur-md">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Board detail</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-100">{board?.title || "Loading board..."}</h2>
            {board?.description && <p className="mt-2 text-slate-400">{board.description}</p>}
          </div>
          <div className="inline-flex items-center gap-3 rounded-3xl bg-slate-900 px-4 py-3 text-sm text-slate-200 shadow-lg">
            <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-cyan-200">{lists.length} lists</span>
            <span className="text-slate-400">Drag cards between lists</span>
          </div>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex min-h-[calc(100vh-8rem)] overflow-x-auto overflow-y-hidden p-6">
          <div className="flex gap-5 w-max items-start">
            {lists.map((list) => (
              <List key={list._id} list={list} />
            ))}
            <AddList boardId={id} refresh={fetchLists} />
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default BoardDetail;