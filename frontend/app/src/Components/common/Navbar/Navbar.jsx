import { useEffect, useState } from "react";
import { HiOutlineSearch, HiOutlineX } from "react-icons/hi";
import { MdOutlineLogout } from "react-icons/md";
import ApiClient from "../../../api/apiClient";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [userName, setUserName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await ApiClient.get("/auth/me");
        if (res.success) {
          setUserName(res.data.fname);
          setAvatar(res.data.avatar);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUserInfo();

    const handleStorageChange = () => {
      fetchUserInfo();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    toast((t) => (
      <div className="flex gap-2 items-center">
        <span>Sign out?</span>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            toast.dismiss(t.id);
            toast.success("Signed out successfully");
            setTimeout(() => {
              window.location.href = "/login";
            }, 500);
          }}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
        >
          Yes
        </button>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="px-3 py-1 bg-slate-600 text-white rounded hover:bg-slate-700 text-sm"
        >
          Cancel
        </button>
      </div>
    ));
  };

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      // navigate to search results page with query
      navigate(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="flex flex-col gap-4 px-5 py-4 border-b border-slate-800 bg-slate-950/95 shadow-lg backdrop-blur-sm md:flex-row md:items-center md:justify-between md:h-[88px] md:py-0">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full border-2 border-indigo-500 overflow-hidden bg-slate-700 flex items-center justify-center shrink-0">
          {avatar ? (
            <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
          ) : (
            <span className="text-lg font-bold text-slate-300">
              {userName ? userName[0].toUpperCase() : "U"}
            </span>
          )}
        </div>
        <div className="hidden sm:block ml-2">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Welcome</p>
          <h1 className="text-lg font-semibold text-slate-100">{userName || "User"}</h1>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 md:max-w-2xl md:flex-row md:items-center md:justify-end">
        <form onSubmit={handleSearch} className="relative w-full md:w-80">
          <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors z-10 flex items-center justify-center">
            <HiOutlineSearch className="text-lg" />
          </button>
          <input
            type="text"
            placeholder="Search boards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/80 py-2 pl-11 pr-10 text-sm text-slate-100 placeholder-slate-500 transition focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-400 transition-colors z-10 flex items-center justify-center p-1"
            >
              <HiOutlineX className="text-lg" />
            </button>
          )}
        </form>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-red-600/20 hover:text-red-400 border border-slate-700 hover:border-red-600/30"
        >
          <MdOutlineLogout className="text-lg" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;