import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineMail, MdLock } from "react-icons/md";
import Input from "../common/Input";
import Button from "../common/Button";
import ApiClient from "../../api/apiClient";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const currentErrors = {};

    if (!email.trim()) {
      currentErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      currentErrors.email = "Enter a valid email address.";
    }

    if (!password.trim()) {
      currentErrors.password = "Password is required.";
    }

    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    const res = await ApiClient.post("/auth/login", {
      email,
      password,
    });

    if (res.success) {
      localStorage.setItem("token", res.token);
      if (remember) localStorage.setItem("remember", "true");
      navigate("/");
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="w-full max-w-md rounded-[32px] bg-slate-950/95 border border-slate-800 px-8 py-10 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-slate-100">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-400">Sign in to your Kanvora workspace.</p>
        </div>
        <span className="rounded-3xl bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200">Secure</span>
      </div>

      <Input
        label="Email address"
        name="email"
        type="email"
        placeholder="jane@kanvora.io"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={<MdOutlineMail className="text-xl" />}
        error={errors.email}
      />

      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon={<MdLock className="text-xl" />}
        error={errors.password}
      />

      <div className="mb-6 flex flex-col gap-3 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <label className="inline-flex items-center gap-2 text-slate-300">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
          />
          Remember me
        </label>
        <Link to="#" className="text-cyan-300 transition hover:text-cyan-100">
          Forgot password?
        </Link>
      </div>

      <Button text="Sign In to Kanvora" onClick={handleLogin} />

      <p className="mt-6 text-center text-sm text-slate-400">
        New here?{' '}
        <Link to="/signup" className="font-semibold text-cyan-300 transition hover:text-cyan-100">
          Create account
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;