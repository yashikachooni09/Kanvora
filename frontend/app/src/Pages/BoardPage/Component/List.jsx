import { useEffect, useState } from "react";
import ApiClient from "../../../api/apiClient";
import Card from "./Card";
import AddCard from "./AddCard";

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

     
 <h3 className="
  mb-3 px-3 py-2 rounded-lg 
  text-gray-200 font-semibold text-sm tracking-wide

  bg-black/40 backdrop-blur-md
  border border-gray-500/20

  shadow-[0_4px_20px_rgba(0,0,0,0.5)]

  hover:bg-black/50
  transition-all duration-200
">
  {formatTitle(list.title)}
</h3>

      <div className="flex-1 overflow-y-auto space-y-2">
        {cards.map((card) => (
          <Card key={card._id} card={card} />
        ))}
      </div>

      <AddCard listId={list._id} refresh={fetchCards} />
    </div>
  );
};

export default List;