import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ApiClient from "../../api/apiClient";
import List from "./Component/List";
import AddList from "./Component/AddList";

const BoardDetail = () => {
  const { id } = useParams();

  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);

const fetchLists = async () => {
  const res = await ApiClient.get(`/lists?boardId=${id}`);
  if (res.success) {
    setLists(res.data);
  }
};

  useEffect(() => {
    fetchBoard();
    fetchLists();
  }, []);

  const fetchBoard = async () => {
    const res = await ApiClient.get(`/boards/${id}`);
    if (res.success) {
      setBoard(res.data);
    }
  };

return (
  <div
    className="h-screen flex flex-col overflow-hidden"
    style={{
      background: board?.image
        ? `url(${board.image}) center/cover`
        : board?.color || "#1e293b",
    }}
  >

    {/* ✅ HEADER */}
    <div className="h-14 flex items-center justify-between px-6 bg-black/30 backdrop-blur-md text-white">

      {/* TITLE */}
      <h2 className="font-semibold text-lg capitalize">
        {board?.title}
      </h2>

      {/* RIGHT SIDE ICONS */}
      <div className="flex items-center gap-4">

        {/* ⭐ STAR */}
        <button className="text-xl hover:scale-110 transition">
          ⭐
        </button>

      </div>
    </div>

    {/* ✅ ONLY THIS SCROLLS */}
    <div className="flex-1 overflow-x-auto overflow-y-hidden p-4">
      <div className="flex gap-4 w-max">

        {lists.map((list) => (
          <List key={list._id} list={list} />
        ))}

        <AddList boardId={id} refresh={fetchLists} />

      </div>
    </div>

  </div>
);
};

export default BoardDetail;