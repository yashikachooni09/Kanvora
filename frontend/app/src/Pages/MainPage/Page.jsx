export const Page = () => {
  return (
    <div className="rounded-[32px] border border-white/10 bg-slate-950/90 p-8 shadow-2xl shadow-slate-950/50 backdrop-blur-xl">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Internal page</p>
        <h1 className="text-3xl font-semibold text-slate-100">Product details</h1>
        <p className="max-w-2xl text-slate-400">
          This page is styled with the same Tailwind design system used by the dashboard and board pages. The card layout, spacing, and interaction patterns are consistent across the app.
        </p>
      </div>
    </div>
  );
};
