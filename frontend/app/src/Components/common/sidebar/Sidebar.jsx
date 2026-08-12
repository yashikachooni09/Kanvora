import { useState } from "react";
import { FaStar, FaPlus, FaCog } from "react-icons/fa";
import { MdDashboard, MdViewKanban } from "react-icons/md";
import { HiMenuAlt2 } from "react-icons/hi";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../Logo";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <MdDashboard />, path: "/" },
    { name: "Boards", icon: <MdViewKanban />, path: "/boards" },
    { name: "Starred", icon: <FaStar />, path: "/starred" },
  ];

  const actionItems = [
    { name: "Create Board", icon: <FaPlus />, action: "/boards", highlight: true },
    { name: "Settings", icon: <FaCog />, action: "/settings" },
  ];

  return (
    <>
      <div className="md:hidden p-4">
        <button
          onClick={() => setOpen(true)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-slate-100 shadow-lg hover:bg-slate-700 transition"
        >
          <HiMenuAlt2 className="text-2xl" />
        </button>
      </div>

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col rounded-r-2xl border-r border-slate-800 bg-slate-950/95 shadow-2xl backdrop-blur-xl transition-transform duration-300 md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between px-6 h-[88px] shrink-0 border-b border-slate-800">
          <Logo variant="full" />
          <button
            onClick={() => setOpen(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-slate-200 shadow-lg md:hidden hover:bg-slate-700 transition"
          >
            <HiMenuAlt2 className="text-xl" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <div className="space-y-2">
            {menuItems.map((item, index) => {
              const active = pathname === item.path;
              return (
                <button
                  key={index}
                  onClick={() => {
                    navigate(item.path);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-indigo-700 to-cyan-600 text-white shadow-lg"
                      : "text-slate-300 hover:text-slate-100 hover:bg-slate-800"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="my-4 h-px bg-slate-800" />

          {/* Action Items */}
          <div className="space-y-2">
            {actionItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  navigate(item.action);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  item.highlight
                    ? "bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </nav>


      </aside>

      {/* Mobile Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/50 md:hidden backdrop-blur-sm"
        />
      )}
    </>
  );
};

export default Sidebar;