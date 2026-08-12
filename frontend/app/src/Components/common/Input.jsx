import { useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

const Input = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  error,
  showPasswordToggle = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";
  const inputType = isPasswordField && showPassword ? "text" : type;

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-slate-100 mb-3">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        )}
        <input
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full rounded-2xl border bg-slate-800/80 px-4 py-3 text-slate-100 placeholder-slate-500 transition focus:outline-none focus:ring-2 focus:border-cyan-400 ${
            icon ? "pl-12" : ""
          } ${
            isPasswordField && showPasswordToggle ? "pr-12" : ""
          } ${
            error
              ? "border-rose-500 focus:ring-rose-500/30 focus:border-rose-400"
              : "border-slate-700 focus:ring-cyan-500/30 focus:border-cyan-500"
          }`}
        />
        
        {isPasswordField && showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-100 transition"
          >
            {showPassword ? (
              <MdVisibilityOff className="text-xl" />
            ) : (
              <MdVisibility className="text-xl" />
            )}
          </button>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-rose-400 font-medium">{error}</p>}
    </div>
  );
};

export default Input;