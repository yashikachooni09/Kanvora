import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import ApiClient from "../../api/apiClient";

const useQuery = () => new URLSearchParams(useLocation().search);

const SearchResults = () => {
  const query = useQuery();
  const q = query.get("q") || "";
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({ boards: [], cards: [] });

  useEffect(() => {
    const fetch = async () => {
      if (!q.trim()) return;
      setLoading(true);
      try {
        const res = await ApiClient.get(`/search`, { q });
        if (res.success) setResults(res.data);
      } catch (err) {
        // handled in apiClient
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [q]);

  return (
    <div className="min-h-full bg-slate-900 text-slate-100 p-6">
      <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
        <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded"></div>
        Search results for "{q}"
      </h2>
      
      {loading && (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      )}

      {!loading && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Boards</h3>
            <span className="text-slate-400 text-sm">{results.boards.length} found</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.boards.map((b) => (
              <Link 
                key={b._id} 
                to={`/boards/${b._id}`} 
                className="block group cursor-pointer rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-6 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 hover:scale-105 hover:bg-slate-800 backdrop-blur"
              >
                <div
                  className="w-full h-2 rounded-full mb-4 opacity-75 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: b.color || "#4f46e5" }}
                />
                <h3 className="text-lg text-white font-semibold truncate group-hover:text-cyan-400 transition">{b.title}</h3>
                {b.description && <p className="text-sm text-slate-400 truncate mt-2">{b.description}</p>}
              </Link>
            ))}
            
            {results.boards.length === 0 && (
              <div className="col-span-full rounded-xl border-2 border-dashed border-slate-700 p-12 text-center bg-slate-800/30">
                <p className="text-slate-400 text-lg">No boards found matching "{q}"</p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default SearchResults;
