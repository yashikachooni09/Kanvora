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
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-2">
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
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full rounded-2xl border px-4 py-3 text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            icon ? "pl-12" : ""
          } ${error ? "border-rose-500" : "border-slate-300"}`}
        />
      </div>
      {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
    </div>
  );
};

export default Input;