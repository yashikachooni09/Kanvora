import { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { Link } from "react-router-dom";

const SignupForm = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = () => {
    console.log(form);
  };

  return (
    <div className="w-[420px] bg-white p-8 rounded-2xl shadow-lg">

      <h2 className="text-2xl font-semibold mb-2">Create your account</h2>
      <p className="text-gray-500 mb-6">
        Get started in under 2 minutes, for free.
      </p>

      {/* Name Fields */}
      <div className="flex gap-4">
        <Input
          label="First Name"
          name="firstName"
          placeholder="Jane"
          value={form.firstName}
          onChange={handleChange}
        />
        <Input
          label="Last Name"
          name="lastName"
          placeholder="Doe"
          value={form.lastName}
          onChange={handleChange}
        />
      </div>

      <Input
        label="Work Email"
        name="email"
        type="email"
        placeholder="jane@company.com"
        value={form.email}
        onChange={handleChange}
      />

      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="Create a strong password"
        value={form.password}
        onChange={handleChange}
      />

      <Input
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        placeholder="Repeat password"
        value={form.confirmPassword}
        onChange={handleChange}
      />

      {/* Terms */}
      <div className="flex items-center gap-2 text-sm mb-4">
        <input type="checkbox" />
        <span>
          I agree to Terms & Privacy Policy
        </span>
      </div>

      <Button text="Create Free Account" onClick={handleSignup} />

      <p className="text-sm text-gray-500 mt-4 text-center">
        Already have an account? 
        <span className="text-indigo-600 cursor-pointer ml-1">
        <Link to="/login">Sign in </Link>
        </span>
      </p>

    </div>
  );
};

export default SignupForm;