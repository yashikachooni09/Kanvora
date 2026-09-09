import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { MdOutlineMail, MdLock } from "react-icons/md";
import Input from "../common/Input";
import Button from "../common/Button";
import ApiClient from "../../api/apiClient";
import toast from "react-hot-toast";

const LoginForm = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirectParam = searchParams.get("redirect");
  const emailParam = searchParams.get("email") || "";
  const targetUrl = redirectParam ? decodeURIComponent(redirectParam) : location.state?.from?.pathname || "/";

  const [email, setEmail] = useState(emailParam);
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
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
    setLoading(true);

    try {
      const res = await ApiClient.post("/api/auth/login", {
        email,
        password,
      });

      if (res.success) {
        localStorage.setItem("token", res.token);
        if (remember) localStorage.setItem("remember", "true");

        toast.success("Welcome back!");
        setTimeout(() => navigate(targetUrl), 1000);
      } else {
        toast.error(res.message || "Invalid credentials");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="w-full max-w-md rounded-[32px] bg-slate-950/95 border border-slate-800 px-8 py-10 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
      
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-white">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to your Kanvora workspace.
          </p>
        </div>
        <span className="rounded-3xl bg-cyan-500/10 px-4 py-2 text-xs text-cyan-200 whitespace-nowrap font-medium">
          Secure
        </span>
      </div>

      {/* Email Input */}
      <Input
        label="Email address"
        name="email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={<MdOutlineMail className="text-xl text-slate-400" />}
        error={errors.email}
      />

      {/* Password Input */}
      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon={<MdLock className="text-xl text-slate-400" />}
        error={errors.password}
        showPasswordToggle={true}
      />

      {/* Remember + Forgot */}
      <div className="mb-6 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <label className="inline-flex items-center gap-2 text-slate-300 cursor-pointer hover:text-slate-100 transition">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500 accent-cyan-500 cursor-pointer"
          />
          <span className="font-medium">Remember me</span>
        </label>

        <Link
          to="/forgot-password"
          className="text-cyan-400 transition hover:text-cyan-300 font-medium"
        >
          Forgot password?
        </Link>
      </div>

      {/* Button */}
      <Button
        text={loading ? "Signing in..." : "Sign In to Kanvora"}
        onClick={handleLogin}
        disabled={loading}
      />

      {/* Signup Link */}
      <p className="mt-6 text-center text-sm text-slate-400">
        New here?{" "}
        <Link
          to={redirectParam ? `/signup?redirect=${encodeURIComponent(redirectParam)}` : "/signup"}
          className="font-semibold text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;