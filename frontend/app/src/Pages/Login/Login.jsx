import LoginForm from "../../Components/auth/LoginForm";

const Login = () => {
  return (
    <div className="flex h-screen font-sans">
      
      {/* LEFT SIDE */}
      <div className="hidden md:flex flex-1 bg-gradient-to-br from-indigo-900 to-purple-800 text-white flex-col justify-center px-16">
        <h1 className="text-4xl font-bold mb-4">Kanvora</h1>
        <p className="text-lg opacity-80">
          The modern project management platform built for high-velocity teams.
        </p>

        <div className="mt-10 space-y-4">
          <p>✔ Drag & Drop Boards</p>
          <p>✔ Real-time Analytics</p>
          <p>✔ Team Collaboration</p>
          <p>✔ Smart Notifications</p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;