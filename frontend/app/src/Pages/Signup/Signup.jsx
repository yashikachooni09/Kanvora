import SignupForm from "../../Components/auth/SignupForm";

const Signup = () => {
  return (
    <div className="flex h-screen font-sans">
      
      {/* LEFT SIDE */}
      <div className="hidden md:flex flex-1 bg-gradient-to-br from-indigo-900 to-purple-800 text-white flex-col justify-center px-16">
        
        <h1 className="text-4xl font-bold mb-4">Kanvora</h1>
        <p className="text-lg opacity-80 mb-10">
          Join thousands of teams shipping faster with Kanvora.
        </p>

        <div className="bg-white/10 p-6 rounded-xl backdrop-blur">
          <h2 className="text-xl font-semibold mb-2">🚀 Start Free Today</h2>
          <p className="text-sm opacity-80 mb-4">
            No credit card required • Cancel anytime
          </p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>∞ Tasks</div>
            <div>10 Boards</div>
            <div>5 Members</div>
            <div>24/7 Support</div>
          </div>
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <SignupForm />
      </div>
    </div>
  );
};

export default Signup;