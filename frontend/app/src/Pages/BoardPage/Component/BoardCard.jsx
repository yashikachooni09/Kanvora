import { useNavigate } from "react-router-dom";

const BoardCard = ({ board }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/boards/${board._id}`)}
      className="h-32 rounded-xl p-3 cursor-pointer shadow-md hover:scale-105 transition-all duration-200 text-white flex items-end"
      style={{
        background: board.image
          ? `url(${board.image}) center/cover`
          : board.color,
      }}
    >
      <h2 className="font-semibold text-lg bg-black/40 px-2 py-1 rounded capitalize">
        {board.title}
      </h2>
    </div>
  );
};

export default BoardCard;