const Card = ({ card }) => {
  return (
    <div className="bg-white p-2 rounded shadow hover:bg-gray-100 cursor-pointer">
      {card.title}
    </div>
  );
};

export default Card;