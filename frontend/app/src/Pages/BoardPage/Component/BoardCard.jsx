import { useNavigate } from "react-router-dom";

const BoardCard = ({ board }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/boards/${board._id}`)}
      className="relative overflow-hidden rounded-3xl p-6 text-white shadow-2xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
      style={{
        background: board.image
          ? `linear-gradient(180deg, rgba(15,23,42,0.18) 0%, rgba(15,23,42,0.72) 100%), url(${board.image}) center/cover`
          : `linear-gradient(180deg, rgba(15,23,42,0.18) 0%, rgba(15,23,42,0.72) 100%), ${board.color || "#0f172a"}`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
      <div className="relative z-10 flex h-full flex-col justify-between gap-4">
        <div className="space-y-2">
          <p className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-200">
            Board
          </p>
          <h2 className="text-2xl font-semibold">{board.title}</h2>
        </div>
        <p className="text-sm text-slate-200 line-clamp-2">
          {board.description || "Organize tasks, teams, and goals in one place."}
        </p>
      </div>
    </div>
  );
};

export default BoardCard;