import { HiOutlineSearch, HiOutlineBell } from "react-icons/hi";
import { MdOutlineLogout } from "react-icons/md";

const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col gap-4 px-5 py-4 border-b border-slate-800 bg-slate-950/95 shadow-sm backdrop-blur-sm md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white shadow-md">
          K
        </div>
        <div>
          <p className="text-sm text-slate-400">Welcome back</p>
          <h1 className="text-xl font-semibold text-slate-100">Your workspace overview</h1>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 md:max-w-xl md:flex-row md:items-center md:justify-end">
        <div className="relative w-full md:w-80">
          <HiOutlineSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search boards, tasks..."
            className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 py-3 pl-12 pr-4 text-sm text-slate-100 transition focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
          />
        </div>
        <button className="inline-flex items-center gap-2 rounded-2xl bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-700">
          <HiOutlineBell className="text-lg text-cyan-400" />
          Notifications
        </button>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-700"
        >
          <MdOutlineLogout className="text-lg text-cyan-400" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;