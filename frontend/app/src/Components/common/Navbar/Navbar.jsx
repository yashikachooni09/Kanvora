const Navbar = () => {

  const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

  return (
    <div className="flex items-center justify-between px-6 py-3 
    bg-[#1e293b] border-b border-slate-700 shadow-sm">

      {/* LEFT - TITLE ONLY */}
      {/* <h1 className="text-lg font-semibold text-white tracking-wide">
        Kanvora
      </h1> */}

      {/* CENTER - SEARCH */}
      <div className="hidden md:block w-1/3">
        <input
          type="text"
          placeholder="Search boards, tasks..."
          className="w-full px-4 py-2 rounded-lg 
          bg-[#0f172a] text-slate-300 text-sm
          border border-slate-600
          placeholder:text-slate-500
          focus:outline-none focus:ring-2 focus:ring-indigo-500
          transition"
        />
      </div>

      {/* RIGHT - PROFILE + LOGOUT */}
      <div className="flex items-center gap-4">

        {/* Profile */}
        <div className="w-9 h-9 bg-indigo-600 rounded-full 
        flex items-center justify-center text-white font-medium shadow">
          Y
        </div>

        {/* Logout */}
        <button onClick={handleLogout} className="px-4 py-1.5 rounded-lg text-sm font-medium
        bg-[#334155] text-slate-200
        hover:bg-indigo-600 hover:text-white
        transition-all duration-200">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;