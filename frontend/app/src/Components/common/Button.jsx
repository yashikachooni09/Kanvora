const Button = ({
  text,
  children,
  onClick,
  type = "button",
  className = "",
  variant = "primary",
  disabled = false,
  ...props
}) => {
  const variants = {
    primary:
      "bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed",
    secondary:
      "bg-slate-800 text-slate-100 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed",
    ghost: "bg-transparent text-slate-900 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex w-full items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
        variants[variant] || variants.primary
      } ${className}`}
      {...props}
    >
      {children || text}
    </button>
  );
};

export default Button;