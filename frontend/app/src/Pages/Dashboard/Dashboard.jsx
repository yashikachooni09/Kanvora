import { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ApiClient from "../../api/apiClient";
import toast from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [starredBoards, setStarredBoards] = useState([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    fetchBoards();
    getUserInfo();
  }, []);

  const fetchBoards = async () => {
    const res = await ApiClient.get("/boards");
    if (res.success) {
      setBoards(res.data.slice(0, 6));
      setStarredBoards(res.data.filter(b => b.starred).slice(0, 4));
    }
  };

  const getUserInfo = async () => {
    const res = await ApiClient.get("/auth/me");
    if (res.success) setUserName(res.data.fname);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Welcome Section */}
        <section className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/40 p-8 md:p-12 shadow-2xl backdrop-blur-xl">
          {/* Decorative background gradients */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-2">Kanvora Workspace</p>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Welcome back, <span className="text-cyan-400">{userName || "User"}</span> 👋
              </h1>
              <p className="text-slate-400 text-lg max-w-xl">
                Here's what's happening across your workspace today. Dive back into your recent boards or start something new.
              </p>
            </div>
            <button
              onClick={() => navigate('/boards')}
              className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl font-bold transition-all duration-200 transform hover:-translate-y-1 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              View All Boards
              <FiArrowRight className="text-xl" />
            </button>
          </div>
        </section>

        {/* Starred Boards */}
        {starredBoards.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-8 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <FaStar className="text-yellow-400" />
                Starred Boards
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {starredBoards.map(b => (
                <div
                  key={b._id}
                  onClick={() => navigate(`/boards/${b._id}`)}
                  className="group relative h-36 rounded-2xl shadow-lg cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/20 hover:-translate-y-1 border border-slate-700/50 hover:border-yellow-500/50"
                  style={{ backgroundColor: b.color || "#1e293b" }}
                >
                  {b.image && (
                    <img
                      src={b.image}
                      alt={b.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                  {/* Dark overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent group-hover:via-slate-950/50 transition-colors" />

                  {/* Content */}
                  <div className="absolute inset-0 p-5 flex flex-col justify-end">
                    <h3 className="text-white font-bold text-xl truncate pr-8 group-hover:text-yellow-400 transition-colors">
                      {b.title}
                    </h3>
                  </div>

                  <FaStar className="absolute top-4 right-4 text-yellow-400 drop-shadow-md text-lg" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recent Boards */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-8 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
            <h2 className="text-2xl font-bold text-white">Recent Boards</h2>
          </div>

          {boards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {boards.map(b => (
                <div
                  key={b._id}
                  onClick={() => navigate(`/boards/${b._id}`)}
                  className="group relative h-36 rounded-2xl shadow-lg cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20 hover:-translate-y-1 border border-slate-700/50 hover:border-cyan-500/50"
                  style={{ backgroundColor: b.color || "#1e293b" }}
                >
                  {b.image && (
                    <img
                      src={b.image}
                      alt={b.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                  {/* Dark overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent group-hover:via-slate-950/50 transition-colors" />

                  {/* Content */}
                  <div className="absolute inset-0 p-5 flex flex-col justify-end">
                    <h3 className="text-white font-bold text-xl truncate group-hover:text-cyan-400 transition-colors">
                      {b.title}
                    </h3>
                    {b.description && (
                      <p className="text-slate-300 text-sm truncate mt-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                        {b.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border-2 border-dashed border-slate-800 p-16 text-center bg-slate-900/30 backdrop-blur">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiArrowRight className="text-3xl text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No boards yet</h3>
              <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
                Create your first board to start tracking your tasks and boosting your productivity.
              </p>
              <button
                onClick={() => navigate('/boards')}
                className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all font-semibold"
              >
                Create Your First Board
              </button>
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default Dashboard;