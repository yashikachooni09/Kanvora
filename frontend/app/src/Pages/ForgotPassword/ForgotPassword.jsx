import { useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineMail } from "react-icons/md";
import Input from "../../Components/common/Input";
import Button from "../../Components/common/Button";
import ApiClient from "../../api/apiClient";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await ApiClient.post("/auth/forgotpassword", { email });
      if (res.success) {
        setSuccess(true);
        toast.success("Password reset email sent.");
      } else {
        toast.error(res.message || "Failed to send reset email.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 md:flex-row">
      <div className="hidden md:flex flex-1 items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-cyan-900 px-12 py-20">
        <div className="max-w-xl space-y-8">
          <div className="inline-flex items-center gap-3 rounded-3xl bg-white/5 px-5 py-4 shadow-xl shadow-cyan-500/10 backdrop-blur">
            <div className="h-12 w-12 rounded-3xl bg-cyan-500/20 text-cyan-100 grid place-items-center font-semibold">
              K
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/75">
                Modern workspace
              </p>
              <h1 className="text-4xl font-semibold text-white">
                Regain access to your workflows.
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md rounded-[32px] bg-slate-950/95 border border-slate-800 px-8 py-10 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold text-white">Forgot Password</h2>
              <p className="mt-2 text-sm text-slate-400">
                Enter your email to receive a password reset link.
              </p>
            </div>
          </div>

          {!success ? (
            <>
              <Input
                label="Email address"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<MdOutlineMail className="text-xl text-slate-400" />}
              />

              <div className="mt-6">
                <Button
                  text={loading ? "Sending..." : "Send Reset Link"}
                  onClick={handleSubmit}
                  disabled={loading}
                />
              </div>
            </>
          ) : (
            <div className="rounded-2xl bg-cyan-900/20 p-6 text-center border border-cyan-800">
              <MdOutlineMail className="mx-auto text-4xl text-cyan-400 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Check your email</h3>
              <p className="text-sm text-slate-300">
                We've sent a password reset link to <strong>{email}</strong>.
              </p>
            </div>
          )}

          <p className="mt-6 text-center text-sm text-slate-400">
            Remember your password?{" "}
            <Link to="/login" className="font-semibold text-cyan-400 hover:text-cyan-300 underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
