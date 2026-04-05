import { useNavigate } from "react-router-dom";

const BoardCard = ({ board }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/board/${board._id}`)}
      className="h-28 rounded-xl p-4 cursor-pointer 
      bg-gradient-to-r from-indigo-500 to-purple-500
      text-white shadow-md hover:shadow-xl 
      transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Title */}
      <h2 className="text-lg font-semibold truncate">
        {board.title}
      </h2>

      {/* Footer (optional future use) */}
      <div className="mt-4 text-xs opacity-80">
        Click to open board
      </div>
    </div>
  );
};

export default BoardCard;