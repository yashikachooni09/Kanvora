import { useEffect, useState } from "react";
import { FaStar, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ApiClient from "../../api/apiClient";
import toast from "react-hot-toast";

const StarredPage = () => {
  const navigate = useNavigate();
  const [starredCards, setStarredCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStarredCards = async () => {
    try {
      setLoading(true);
      const res = await ApiClient.get("/cards/starred");
      if (res.success) {
        setStarredCards(res.data);
      } else {
        toast.error(res.message || "Failed to fetch starred cards");
      }
    } catch (err) {
      console.error("Error fetching starred cards:", err);
      toast.error("Error fetching starred cards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStarredCards();
  }, []);

  const handleUnstar = async (cardId) => {
    try {
      const res = await ApiClient.put(`/cards/${cardId}/star`);
      if (res.success) {
        setStarredCards(starredCards.filter(card => card._id !== cardId));
        toast.success("Card unstarred");
      }+
    } catch (err) {
      console.error("Error unstarring card:", err);
      toast.error("Error unstarring card");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 md:p-8 shadow-lg backdrop-blur">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 transition"
          >
            <FaArrowLeft className="text-lg" />
          </button>
          <div>
            <p className="text-xs uppercase tracking-wider text-yellow-400 font-semibold flex items-center gap-2">
              <FaStar /> Starred
            </p>
            <h1 className="mt-2 text-3xl md:text-4xl font-bold text-white">
              Starred Cards
            </h1>
            <p className="mt-2 text-slate-300">
              {starredCards.length} starred card{starredCards.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </section>

      {/* Starred Cards Grid */}
      <section className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-400">Loading...</div>
          </div>
        ) : starredCards.length === 0 ? (
          <div className="rounded-2xl border border-slate-700 bg-slate-800/30 p-8 text-center">
            <FaStar className="mx-auto text-4xl text-slate-600 mb-4" />
            <p className="text-slate-400">No starred cards yet</p>
            <p className="text-slate-500 text-sm mt-2">
              Star cards to keep them organized and easy to find
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {starredCards.map((card) => (
              <div
                key={card._id}
                className="group rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-4 shadow-lg hover:shadow-xl hover:border-slate-600 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-white text-sm flex-1 break-words">
                    {card.title}
                  </h3>
                  <button
                    onClick={() => handleUnstar(card._id)}
                    className="ml-2 text-yellow-400 hover:text-yellow-300 transition"
                    title="Unstar"
                  >
                    <FaStar className="text-lg" />
                  </button>
                </div>

                {card.description && (
                  <p className="text-slate-400 text-xs mb-2">
                    {card.description.substring(0, 100)}
                    {card.description.length > 100 ? "..." : ""}
                  </p>
                )}

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  {card.completed && (
                    <span className="px-2 py-1 bg-green-900/30 text-green-300 rounded">
                      ✓ Completed
                    </span>
                  )}
                  {card.attachments && card.attachments.length > 0 && (
                    <span className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded">
                      📎 {card.attachments.length}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default StarredPage;
