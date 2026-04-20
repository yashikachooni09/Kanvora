import { useEffect, useState } from "react";
import ApiClient from "../../../api/apiClient";
import Card from "./Card";
import AddCard from "./AddCard";
import { Droppable } from "@hello-pangea/dnd";

const List = ({ list }) => {
  const [cards, setCards] = useState([]);

  const fetchCards = async () => {
    const res = await ApiClient.get(`/cards?listId=${list._id}`);
    if (res.success) {
      setCards(res.data);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const formatTitle = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <div className="w-72 bg-white/20 backdrop-blur-md rounded-xl p-3 flex flex-col max-h-[80vh] border border-white/10">

      {/* TITLE */}
      <h3 className="mb-3 px-3 py-2 rounded-lg text-gray-200 font-semibold text-sm bg-black/40 backdrop-blur-md">
        {formatTitle(list.title)}
      </h3>

      {/* DROPPABLE AREA */}
      <Droppable droppableId={list._id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-1 overflow-y-auto space-y-2 pr-1"
          >
            {cards.map((card, index) => (
              <Card key={card._id} card={card} index={index} />
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* ADD CARD */}
      <AddCard listId={list._id} refresh={fetchCards} />
    </div>
  );
};

export default List;