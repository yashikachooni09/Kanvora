import { Draggable } from "@hello-pangea/dnd";

const Card = ({ card, index }) => {
  return (
    <Draggable draggableId={card._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="group flex items-start gap-3 rounded-3xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl transition hover:-translate-y-0.5 hover:bg-slate-900"
        >
          <div className="h-10 w-2 rounded-full bg-gradient-to-b from-indigo-500 to-cyan-400" />
          <div className="w-full">
            <p className="text-sm font-semibold text-slate-100">{card.title}</p>
            <p className="mt-2 text-xs text-slate-400">Drag to reorganize your workflow.</p>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Card;