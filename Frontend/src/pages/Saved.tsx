import Sidebar from "../components/SideBar";
import NavBar from "../components/Navbar";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { closeSidebar } from "../store/sidebarSlice";
import YojnaCard from "../components/YojnaCard";

// ─── Demo saved yojnas ─────────────────────────────────────────────────────────

const SAVED_YOJNAS = [
  {
    id: "1",
    title: "PM Yashasvi Yojana",
    description:
      "Scholarship for OBC/EBC/DNT students studying in Classes 9 and 11 in central/state schools. Aims to provide financial support to meritorious students from socially and educationally backward communities.",
    category: "Education",
    state: "All India",
    eligibility: "OBC/EBC students, income below ₹2.5L",
    ministry: "Ministry of Social Justice",
    benefit: "Up to ₹1.25L/year",
    ageRequirement: "13–17 years",
    qualification: "60% marks required",
    deadline: "Dec 31",
    applyLink: "https://scholarships.gov.in",
  },
  {
    id: "2",
    title: "PM Awas Yojana (Urban)",
    description:
      "Affordable housing for urban poor under EWS/LIG/MIG categories through credit-linked subsidy and in-situ slum redevelopment partnerships.",
    category: "Housing",
    state: "All India",
    eligibility: "Urban families without pucca house, income up to ₹18L",
    ministry: "Ministry of Housing & Urban Affairs",
    benefit: "Interest subsidy up to ₹2.67L",
    ageRequirement: "18+ years",
    qualification: "No existing house ownership",
    deadline: "Mar 31",
    applyLink: "https://pmaymis.gov.in",
  },
  {
    id: "3",
    title: "PM Kisan Samman Nidhi",
    description:
      "Direct income support of ₹6,000 per year to landholding-farmer families in three equal instalments to supplement agricultural income.",
    category: "Agriculture",
    state: "All India",
    eligibility: "Small & marginal farmers with cultivable land",
    ministry: "Ministry of Agriculture",
    benefit: "₹6,000/year (₹2,000 × 3 instalments)",
    ageRequirement: "18+ years",
    deadline: "Ongoing",
    applyLink: "https://pmkisan.gov.in",
  },
  {
    id: "4",
    title: "Ayushman Bharat PM-JAY",
    description:
      "World's largest government-funded health assurance scheme providing coverage of ₹5 lakh per family per year for secondary and tertiary hospitalisation.",
    category: "Health",
    state: "All India",
    eligibility: "Families listed in SECC 2011 database",
    ministry: "Ministry of Health",
    benefit: "₹5L health cover/family/year",
    ageRequirement: "No age bar",
    deadline: "Ongoing",
    applyLink: "https://pmjay.gov.in",
  },
];

// ─── Bookmark icon ─────────────────────────────────────────────────────────────

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

// ─── Page component ────────────────────────────────────────────────────────────

function Saved() {
  const [activeNav, setActiveNav] = useState("saved");
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((state) => state.sidebar.sidebarOpen);

  const [savedMap, setSavedMap] = useState<Record<string, boolean>>(
    Object.fromEntries(SAVED_YOJNAS.map((y) => [y.id, true]))
  );

  const handleSave = (id: string, saved: boolean) => {
    setSavedMap((prev) => ({ ...prev, [id]: saved }));
  };

  const savedCount = Object.values(savedMap).filter(Boolean).length;

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
              <span className="mt-2 inline-flex h-7 items-center rounded-full border border-amber-500/25 bg-amber-500/10 px-3 text-xs font-semibold text-amber-400 sm:mt-0">
                {savedCount} saved
              </span>
            </div>

            {/* ── Cards grid ───────────────────────────────────────────── */}
            {savedCount === 0 ? (
              /* Empty state */
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
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
                {SAVED_YOJNAS.map((yojna) =>
                  savedMap[yojna.id] !== false ? (
                    <YojnaCard
                      key={yojna.id}
                      {...yojna}
                      isSaved={savedMap[yojna.id] ?? true}
                      onSave={handleSave}
                      onApply={(id) => console.log("Apply:", id)}
                    />
                  ) : null
                )}
              </div>
            )}
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
