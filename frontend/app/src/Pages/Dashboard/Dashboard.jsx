import { FiPlus } from "react-icons/fi";
import Button from "../../Components/common/Button";

const Dashboard = () => {
  const boards = [
    { title: "Marketing Sprint", tasks: 24, team: 5 },
    { title: "Product Roadmap", tasks: 12, team: 3 },
    { title: "Release Plan", tasks: 18, team: 4 },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-white/10 bg-slate-950/90 p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-100">Your workspace at a glance</h1>
            <p className="mt-3 max-w-2xl text-slate-400">
              Track active boards, manage tasks, and launch projects with a clean, modern workspace.
            </p>
          </div>

          <Button
            onClick={() => window.location.assign("/boards")}
            className="max-w-xs"
            text="Create Board"
            variant="primary"
          >
            <FiPlus className="mr-2 text-lg" />
            Create Board
          </Button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {boards.map((board, index) => (
            <div
              key={index}
              className="group overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-cyan-500 p-6 shadow-2xl shadow-cyan-500/20 transition hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="rounded-3xl bg-white/10 p-4 text-slate-100">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-200/80">Board</p>
                  <h2 className="mt-3 text-2xl font-semibold">{board.title}</h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-white/10 p-4 text-slate-100">
                    <p className="text-sm text-slate-300">Tasks</p>
                    <p className="mt-2 text-xl font-semibold">{board.tasks}</p>
                  </div>
                  <div className="rounded-3xl bg-white/10 p-4 text-slate-100">
                    <p className="text-sm text-slate-300">Team</p>
                    <p className="mt-2 text-xl font-semibold">{board.team}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-100">Active boards</h2>
            <p className="mt-2 text-slate-400">A quick view of your latest boards and progress.</p>
          </div>
          <Button
            onClick={() => window.location.assign("/boards")}
            className="max-w-xs"
            variant="secondary"
          >
            Browse boards
          </Button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {boards.map((board, index) => (
            <div key={index} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 text-slate-100 shadow-lg">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold">{board.title}</h3>
                <span className="rounded-2xl bg-slate-800 px-3 py-1 text-xs text-cyan-300">Live</span>
              </div>
              <p className="mt-3 text-sm text-slate-400">Keep your team aligned with a fast, simple board layout.</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;