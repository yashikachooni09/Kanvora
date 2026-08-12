import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { MdOutlinePerson, MdOutlineMail, MdLock } from "react-icons/md";
import Input from "../common/Input";
import Button from "../common/Button";
import ApiClient from "../../api/apiClient";
import toast from "react-hot-toast";

const SignupForm = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirectParam = searchParams.get("redirect");
  const emailParam = searchParams.get("email") || "";
  const loginUrl = redirectParam ? `/login?redirect=${encodeURIComponent(redirectParam)}` : "/login";

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: emailParam,
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const currentErrors = {};

    if (!form.firstName.trim()) currentErrors.firstName = "First name is required.";
    if (!form.lastName.trim()) currentErrors.lastName = "Last name is required.";
    if (!form.email.trim()) currentErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) currentErrors.email = "Enter a valid email address.";
    if (!form.password.trim()) currentErrors.password = "Password is required.";
    else if (form.password.length < 6) currentErrors.password = "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword) currentErrors.confirmPassword = "Passwords do not match.";

    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await ApiClient.post("/auth/signup", {
        fname: form.firstName,
        lname: form.lastName,
        email: form.email,
        password: form.password,
      });

      if (res.success) {
        toast.success("Account created successfully! Redirecting to login...");
        setTimeout(() => navigate(loginUrl), 1500);
      } else {
        toast.error(res.message || "Signup failed");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl rounded-[32px] bg-slate-950/95 border border-slate-800 px-8 py-10 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-white">Create your account</h2>
        <p className="mt-3 text-sm text-slate-400">Get started in under 2 minutes, for free.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="First Name"
          name="firstName"
          placeholder="Jane"
          value={form.firstName}
          onChange={handleChange}
          icon={<MdOutlinePerson className="text-xl" />}
          error={errors.firstName}
        />
        <Input
          label="Last Name"
          name="lastName"
          placeholder="Doe"
          value={form.lastName}
          onChange={handleChange}
          icon={<MdOutlinePerson className="text-xl" />}
          error={errors.lastName}
        />
      </div>

      <Input
        label="Work Email"
        name="email"
        type="email"
        placeholder="you@company.com"
        value={form.email}
        onChange={handleChange}
        icon={<MdOutlineMail className="text-xl" />}
        error={errors.email}
      />

      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="Create a strong password"
        value={form.password}
        onChange={handleChange}
        icon={<MdLock className="text-xl" />}
        error={errors.password}
        showPasswordToggle={true}
      />

      <Input
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        placeholder="Repeat password"
        value={form.confirmPassword}
        onChange={handleChange}
        icon={<MdLock className="text-xl" />}
        error={errors.confirmPassword}
        showPasswordToggle={true}
      />

      <div className="flex items-center gap-3 text-sm text-slate-400 mb-6">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500 accent-cyan-500 cursor-pointer"
        />
        <span className="text-slate-300">I agree to the Terms & Privacy Policy.</span>
      </div>

      <Button 
        text={loading ? "Creating account..." : "Create Free Account"} 
        onClick={handleSignup}
        disabled={loading}
      />

      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?
        <Link to={loginUrl} className="ml-2 font-semibold text-cyan-400 transition hover:text-cyan-300">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default SignupForm;