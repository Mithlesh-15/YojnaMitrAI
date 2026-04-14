import { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import NavBar from "../components/Navbar";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { closeSidebar } from "../store/sidebarSlice";
import YojnaCard from "../components/YojnaCard";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/api";

// ─── Types ────────────────────────────────────────────────────────────────────

type Scheme = {
  id: string;
  title: string;
  description: string;
  category: string;
  state: string;
  eligibility: string;
  ministry?: string;
  benefit?: string;
  age_requirement?: string;
  qualification?: string;
  deadline?: string;
  applyLink?: string;
};

type ApiResponse = {
  success: boolean;
  data: Scheme[];
};

// ─── Bookmark icon ────────────────────────────────────────────────────────────

const BookmarkIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth={0}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
  </svg>
);

// ─── Spinner ──────────────────────────────────────────────────────────────────

const Spinner = () => (
  <div className="flex flex-col items-center justify-center gap-4 py-24">
    <div
      className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-amber-400"
      role="status"
      aria-label="Loading"
    />
    <p className="text-sm text-slate-400">Fetching your saved schemes…</p>
  </div>
);

// ─── Page component ───────────────────────────────────────────────────────────

function Saved() {
  const [activeNav, setActiveNav] = useState("saved");
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((state) => state.sidebar.sidebarOpen);

  const { user } = useAuth();

  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 useEffect(() => {
  if (!user?.id) {
    setLoading(false);
    return;
  }

  const fetchSaved = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get(`/api/schemes/saved/${user.id}`);

      const json: ApiResponse = res.data;

      if (!json.success) {
        throw new Error("Failed to load saved schemes");
      }

      setSchemes(json.data);
      setSavedMap(
        Object.fromEntries(json.data.map((s) => [s.id, true]))
      );
    } catch (err) {
      console.error(err);
      setError("Failed to load saved schemes");
    } finally {
      setLoading(false);
    }
  };

  fetchSaved();
}, [user?.id]);

  const handleSave = (id: string, saved: boolean) => {
    setSavedMap((prev) => ({ ...prev, [id]: saved }));
  };

  const savedCount = Object.values(savedMap).filter(Boolean).length;

  // ── Render grid content based on state ───────────────────────────────────

  const renderContent = () => {
    if (loading) return <Spinner />;

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-rose-500/25 bg-rose-500/8 py-16 text-center">
          <p className="text-base font-semibold text-rose-400">{error}</p>
          <p className="text-sm text-slate-500">
            Make sure the backend is running and try refreshing.
          </p>
        </div>
      );
    }

    if (savedCount === 0) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-700/60 bg-slate-900/40 py-20 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-amber-400">
            <BookmarkIcon />
          </span>
          <div>
            <p className="text-base font-semibold text-slate-300">
              No saved yojnas yet
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Save a scheme from the chat to find it here quickly.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
        {schemes.map((scheme) =>
          savedMap[scheme.id] !== false ? (
            <YojnaCard
              key={scheme.id}
              id={scheme.id}
              title={scheme.title}
              description={scheme.description}
              category={scheme.category}
              state={scheme.state}
              eligibility={scheme.eligibility}
              ministry={scheme.ministry}
              benefit={scheme.benefit}
              ageRequirement={scheme.age_requirement}
              qualification={scheme.qualification}
              deadline={scheme.deadline}
              applyLink={scheme.applyLink}
              isSaved={savedMap[scheme.id] ?? true}
              userId={user?.id}
              onSave={handleSave}
              onApply={(id) => console.log("Apply:", id)}
            />
          ) : null
        )}
      </div>
    );
  };


  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 font-sans">
      {/* ── Background decoration ──────────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-blue-700/8 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-indigo-700/6 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* ── Sidebar ────────────────────────────────────────────────────── */}
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        isOpen={sidebarOpen}
        onClose={() => dispatch(closeSidebar())}
      />

      {/* ── Main column ────────────────────────────────────────────────── */}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <NavBar />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

            {/* ── Page header ──────────────────────────────────────────── */}
            <div className="mb-6 flex flex-col gap-1 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400">
                    <BookmarkIcon />
                  </span>
                  <h1 className="text-xl font-bold text-white sm:text-2xl">
                    Saved Yojnas
                  </h1>
                </div>
                <p className="text-sm text-slate-400">
                  Schemes you bookmarked for quick access
                </p>
              </div>
              {!loading && !error && (
                <span className="mt-2 inline-flex h-7 items-center rounded-full border border-amber-500/25 bg-amber-500/10 px-3 text-xs font-semibold text-amber-400 sm:mt-0">
                  {savedCount} saved
                </span>
              )}
            </div>

            {/* ── Content ──────────────────────────────────────────────── */}
            {renderContent()}

          </div>
        </main>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.28s ease-out both;
        }
        .font-display {
          font-family: 'Sora', 'DM Sans', system-ui, sans-serif;
        }
      `}</style>
    </div>
  );
}

export default Saved;
