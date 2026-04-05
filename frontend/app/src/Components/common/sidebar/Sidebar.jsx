import { useState } from "react";
import {
  FaStar,
  FaPlus,
  FaCog,
} from "react-icons/fa";
import { MdDashboard, MdViewKanban } from "react-icons/md";
import { HiMenuAlt2 } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { MdMessage } from "react-icons/md";

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

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
      {/* MOBILE BUTTON */}
      <div className="md:hidden p-3">
        <button onClick={() => setOpen(true)}>
          <HiMenuAlt2 className="text-2xl text-slate-700" />
        </button>
      </div>

      {/* SIDEBAR */}
      <div
        className={`fixed md:static top-0 left-0 h-full z-50
        bg-[#1e293b] border-r border-slate-700
        text-slate-200 shadow-xl transition-all duration-300
        ${open ? "w-64" : "w-16"}
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          {open && (
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 text-white p-2 rounded-lg shadow-md">
                <MdViewKanban />
              </div>

              <h1 className="text-lg font-semibold tracking-wide text-white">
                Kanvora
              </h1>
            </div>
          )}

          <button onClick={() => setOpen(!open)}>
            <HiMenuAlt2 className="text-xl text-slate-400 hover:text-white" />
          </button>
        </div>

        {/* MENU */}
        <ul className="mt-4 space-y-2 px-2">
          {menuItems.map((item, index) => (
            <li
              key={index}
              onClick={() => {
                navigate(item.path);
                setOpen(false); // mobile pe close
              }}
              className="flex items-center gap-3 p-3 rounded-xl cursor-pointer
              hover:bg-slate-700/60 transition-all duration-200 group"
            >
              {/* ICON */}
              <span className="text-lg text-slate-400 group-hover:text-indigo-400 transition">
                {item.icon}
              </span>

              {/* TEXT */}
              {open && (
                <span className="text-sm text-slate-300 group-hover:text-white font-medium transition">
                  {item.name}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 md:hidden"
        ></div>
      )}
    </>
  );
};

export default Sidebar;