import { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"
import ApiClient from "../../api/apiClient";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const handleLogin = async () => {
  console.log("clicked");

  const res = await ApiClient.post("/auth/login", {
    email,
    password
  });

  console.log("Response:", res);

  if (res.success) {
    localStorage.setItem("token", res.token);
    navigate("/");
  } else {
    alert(res.message);
  }
};
  return (
    <div className="w-[380px] bg-white p-8 rounded-2xl shadow-lg">
      
      <h2 className="text-2xl font-semibold mb-2">Welcome back</h2>
      <p className="text-gray-500 mb-6">
        Sign in to your Kanvora workspace
      </p>

      <Input
        label="Email Address"
        type="email"
        placeholder="jane@kanvora.io"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="flex justify-between items-center mb-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" />
          Keep me signed in
        </label>
        <span className="text-indigo-600 cursor-pointer">
          Forgot password?
        </span>
      </div>

      <Button text="Sign In to Kanvora" onClick={handleLogin} />

      <p className="text-sm text-gray-500 mt-4 text-center">
        New here? <span className="text-indigo-600 cursor-pointer"><Link to="/signup">Create account</Link></span>
      </p>
    </div>
  );
};

export default LoginForm;