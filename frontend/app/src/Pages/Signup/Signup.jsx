import SignupForm from "../../Components/auth/SignupForm";

const Signup = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 md:flex-row">
      <div className="hidden md:flex flex-1 items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-cyan-950 px-12 py-20">
        <div className="max-w-xl space-y-8">
          <div className="inline-flex items-center gap-3 rounded-3xl bg-white/5 px-5 py-4 shadow-xl shadow-cyan-500/10 backdrop-blur">
            <div className="h-12 w-12 rounded-3xl bg-cyan-500/20 text-cyan-100 grid place-items-center font-semibold">
              K
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/75">
                Build better workflows
              </p>
              <h1 className="text-4xl font-semibold text-white">
                Create a workspace your team will love.
              </h1>
            </div>
          </div>
          <div className="grid gap-4 text-slate-200">
            <p className="rounded-3xl bg-white/5 px-6 py-5 shadow-inner shadow-slate-950/20">
              <span className="font-semibold text-cyan-300">✓</span> Unlimited boards and custom sections.
            </p>
            <p className="rounded-3xl bg-white/5 px-6 py-5 shadow-inner shadow-slate-950/20">
              <span className="font-semibold text-cyan-300">✓</span> Simple onboarding for new teams.
            </p>
            <p className="rounded-3xl bg-white/5 px-6 py-5 shadow-inner shadow-slate-950/20">
              <span className="font-semibold text-cyan-300">✓</span> Faster planning, easier tracking.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <SignupForm />
      </div>
    </div>
  );
};

export default Signup;