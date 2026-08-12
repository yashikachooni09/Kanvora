import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdLock } from "react-icons/md";
import Input from "../../Components/common/Input";
import Button from "../../Components/common/Button";
import ApiClient from "../../api/apiClient";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!password || password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await ApiClient.put(`/auth/resetpassword/${token}`, { password });
      if (res.success) {
        setSuccess(true);
        toast.success("Password reset successfully.");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        toast.error(res.message || "Failed to reset password.");
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
                Set a strong, new password.
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md rounded-[32px] bg-slate-950/95 border border-slate-800 px-8 py-10 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold text-white">Reset Password</h2>
              <p className="mt-2 text-sm text-slate-400">
                Please enter your new password below.
              </p>
            </div>
          </div>

          {!success ? (
            <>
              <Input
                label="New Password"
                name="password"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<MdLock className="text-xl text-slate-400" />}
                error={errors.password}
                showPasswordToggle={true}
              />

              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={<MdLock className="text-xl text-slate-400" />}
                error={errors.confirmPassword}
                showPasswordToggle={true}
              />

              <div className="mt-6">
                <Button
                  text={loading ? "Resetting..." : "Reset Password"}
                  onClick={handleSubmit}
                  disabled={loading}
                />
              </div>
            </>
          ) : (
            <div className="rounded-2xl bg-emerald-900/20 p-6 text-center border border-emerald-800">
              <MdLock className="mx-auto text-4xl text-emerald-400 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Password Reset!</h3>
              <p className="text-sm text-slate-300">
                Your password has been successfully reset. Redirecting to login...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
