import { useState } from "react";
import { FaStar, FaPlus, FaCog } from "react-icons/fa";
import { MdDashboard, MdViewKanban, MdMessage } from "react-icons/md";
import { HiMenuAlt2 } from "react-icons/hi";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <MdDashboard />, path: "/" },
    { name: "Boards", icon: <MdViewKanban />, path: "/boards" },
    { name: "Create Board", icon: <FaPlus />, path: "/boards" },
    { name: "Inbox", icon: <MdMessage />, path: "/inbox" },
    { name: "Starred", icon: <FaStar />, path: "/starred" },
    { name: "Settings", icon: <FaCog />, path: "/settings" },
  ];

  return (
    <>
      <div className="md:hidden p-4">
        <button
          onClick={() => setOpen(true)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-slate-100 shadow-lg"
        >
          <HiMenuAlt2 className="text-2xl" />
        </button>
      </div>

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col rounded-r-3xl border-r border-slate-800 bg-slate-950/95 shadow-2xl backdrop-blur-xl transition-transform duration-300 md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white shadow-lg">
              K
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/75">
                Project hub
              </p>
              <h2 className="text-lg font-semibold text-white">Kanvora</h2>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-slate-200 shadow-lg md:hidden"
          >
            <HiMenuAlt2 className="text-xl" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-6">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const active = pathname === item.path;
              return (
                <li
                  key={index}
                  onClick={() => {
                    navigate(item.path);
                    setOpen(false);
                  }}
                  className={`flex cursor-pointer items-center gap-4 rounded-3xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-indigo-700 to-cyan-600 text-white shadow-lg"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/50 md:hidden"
        />
      )}
    </>
  );
};

export default Sidebar;