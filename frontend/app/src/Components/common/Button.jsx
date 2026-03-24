const Button = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition"
    >
      {text}
    </button>
  );
};

export default Button;