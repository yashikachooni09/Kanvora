const Card = ({ title, description }) => {
  return (
    <div className="bg-gray-700 p-3 rounded shadow">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-300">{description}</p>
    </div>
  );
};

export default Card;