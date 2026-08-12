import { MdGridView } from "react-icons/md";

const Logo = ({ variant = "full" }) => {
  if (variant === "icon-only") {
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer">
        <MdGridView className="text-xl" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 group cursor-pointer">
      {/* Icon */}
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-sm font-bold text-white shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
        <MdGridView className="text-xl" />
      </div>
      
      {/* Text */}
      <div>
        <p className="text-lg font-black bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          Kanvora
        </p>
        <p className="text-xs text-slate-400 font-medium -mt-1">Workspace</p>
      </div>
    </div>
  );
};

export default Logo;
