import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="inline-flex w-fit items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1 text-sm font-medium text-emerald-200">
          Dashboard Preview
        </div>

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-950/20 backdrop-blur">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Welcome to YojnaMitrAI
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">
            This route is now wired up and ready for the next step of your
            product flow. From here, we can plug in scheme discovery, profile
            forms, and recommendation results.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              "User eligibility intake",
              "AI-based matching pipeline",
              "Actionable application guidance",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 text-sm text-slate-300"
              >
                {item}
              </div>
            ))}
          </div>

          <Link
            to="/"
            className="mt-8 inline-flex items-center rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Back to Home
          </Link>
        </section>
      </div>
    </main>
  );
}

export default Dashboard;
