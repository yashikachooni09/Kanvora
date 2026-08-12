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
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";
  const inputType = isPasswordField && showPassword ? "text" : type;

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-slate-200 mb-3">
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
          className={`w-full rounded-2xl border bg-slate-800/50 px-4 py-3 text-slate-100 placeholder-slate-500 transition focus:outline-none focus:ring-2 focus:border-cyan-400 ${
            icon ? "pl-12" : ""
          } ${isPasswordField ? "pr-12" : ""} ${
            error
              ? "border-rose-500 focus:ring-rose-500/30"
              : "border-slate-700 focus:ring-cyan-500/30"
          }`}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
          >
            {showPassword ? (
              <MdVisibilityOff className="text-lg" />
            ) : (
              <MdVisibility className="text-lg" />
            )}
          </button>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-rose-400">{error}</p>}
    </div>
  );
};

export default Input;
