const Card = ({ card }) => {
  return (
    <div className="flex items-start gap-2 bg-white/90 backdrop-blur-md p-2 rounded-lg shadow hover:bg-white transition w-full">

      {/* LEFT BORDER */}
      <div className="w-[4px] bg-indigo-300 rounded-full self-stretch"></div>

      {/* CONTENT */}
      <div className="text-sm text-gray-800 font-medium min-w-0 w-full break-words whitespace-normal">
        {card.title}
      </div>

    </div>
  );
};

export default Card;