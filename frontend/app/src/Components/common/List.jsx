import Card from "./Card";
import Button from "./Button";

const List = ({ title }) => {
  const dummyCards = [
    { title: "Task 1", description: "Do something" },
    { title: "Task 2", description: "Do something else" },
  ];

  return (
    <div className="bg-gray-800 p-4 rounded w-64">
      <h2 className="mb-3 font-bold">{title}</h2>

      <div className="space-y-2">
        {dummyCards.map((card, i) => (
          <Card key={i} {...card} />
        ))}
      </div>

      <div className="mt-3">
        <Button>Add Card</Button>
      </div>
    </div>
  );
};

export default List;