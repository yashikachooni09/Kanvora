import { useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlinePerson, MdOutlineMail, MdLock } from "react-icons/md";
import Input from "../common/Input";
import Button from "../common/Button";
import ApiClient from "../../api/apiClient";

const SignupForm = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

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
    if (form.password !== form.confirmPassword) currentErrors.confirmPassword = "Passwords do not match.";

    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;

    const res = await ApiClient.post("/auth/signup", {
      fname: form.firstName,
      lname: form.lastName,
      email: form.email,
      password: form.password,
    });

    if (res.success) {
      alert("Signup successful. You can now log in.");
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="w-full max-w-xl rounded-[32px] bg-slate-950/95 border border-slate-800 px-8 py-10 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-slate-100">Create your account</h2>
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
        placeholder="jane@company.com"
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
      />

      <div className="flex items-center gap-3 text-sm text-slate-400 mb-6">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
        />
        <span>I agree to the Terms & Privacy Policy.</span>
      </div>

      <Button text="Create Free Account" onClick={handleSignup} />

      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?
        <Link to="/login" className="ml-1 font-semibold text-cyan-300 transition hover:text-cyan-100">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default SignupForm;