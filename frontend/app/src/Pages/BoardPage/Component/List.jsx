import Card from "./Card";
import AddCard from "./AddCard";

const List = ({ list }) => {
  return (
    <div className="w-72 bg-[#f1f2f4] rounded-xl p-3 flex flex-col max-h-[80vh]">

      {/* LIST TITLE */}
      <h3 className="font-semibold mb-2 capitalize">{list.title}</h3>

      {/* CARDS (SCROLLABLE) */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {list.cards?.map((card) => (
          <Card key={card._id} card={card} />
        ))}
      </div>

      {/* ADD CARD */}
      <AddCard listId={list._id} />
    </div>
  );
};

export default List;