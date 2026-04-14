import React, { useState } from "react";
import { Toast } from "./Toast";
import { toggleSaveScheme } from "../api/api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface YojnaCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  state: string;
  eligibility: string;
  ministry?: string;
  benefit?: string;
  ageRequirement?: string;
  qualification?: string;
  deadline?: string;
  applyLink?: string;
  isSaved?: boolean;
  /** Supabase user ID – required to call the toggle-save API */
  userId?: string;
  onSave?: (id: string, saved: boolean) => void;
  onApply?: (id: string) => void;
}

// ─── Category color map ───────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Education:   { bg: "bg-blue-500/10",    text: "text-blue-400",   border: "border-blue-500/30"   },
  Agriculture: { bg: "bg-emerald-500/10", text: "text-emerald-400",border: "border-emerald-500/30"},
  Housing:     { bg: "bg-amber-500/10",   text: "text-amber-400",  border: "border-amber-500/30"  },
  Health:      { bg: "bg-rose-500/10",    text: "text-rose-400",   border: "border-rose-500/30"   },
  Women:       { bg: "bg-pink-500/10",    text: "text-pink-400",   border: "border-pink-500/30"   },
  Finance:     { bg: "bg-violet-500/10",  text: "text-violet-400", border: "border-violet-500/30" },
  Employment:  { bg: "bg-cyan-500/10",    text: "text-cyan-400",   border: "border-cyan-500/30"   },
};

const CATEGORY_EMOJI: Record<string, string> = {
  Education: "📚", Agriculture: "🌾", Housing: "🏠",
  Health: "🏥", Women: "👩", Finance: "💰", Employment: "💼",
};

// ─── Icons ────────────────────────────────────────────────────────────────────

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor" strokeWidth={filled ? 0 : 1.8}
    strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const SpinnerIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"
    style={{ animation: "yc-spin 0.7s linear infinite" }}>
    <circle cx="12" cy="12" r="10" strokeOpacity={0.2} />
    <path d="M12 2a10 10 0 0 1 10 10" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s" }}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const GiftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" />
    <line x1="12" y1="22" x2="12" y2="7" />
    <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" />
    <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
  </svg>
);

// ─── YojnaCard Component ─────────────────────────────────────────────────────

const YojnaCard: React.FC<YojnaCardProps> = ({
  id, title, description, category, state, eligibility,
  ministry, benefit, ageRequirement, qualification, deadline,
  applyLink, isSaved = false, userId, onSave, onApply,
}) => {
  const [saved, setSaved] = useState(isSaved);
  const [saveLoading, setSaveLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [applied, setApplied] = useState(false);
  const [readMore, setReadMore] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);

  const colors = CATEGORY_COLORS[category] ?? {
    bg: "bg-slate-500/10", text: "text-slate-400", border: "border-slate-500/30",
  };
  const emoji = CATEGORY_EMOJI[category] ?? "📋";

  const DESC_LIMIT = 110;
  const isLong = description.length > DESC_LIMIT;
  const shownDesc = isLong && !readMore
    ? description.slice(0, DESC_LIMIT).trimEnd() + "…"
    : description;

  const hasExtra = !!(ageRequirement || qualification || ministry);

  const handleSave = async () => {
    if (saveLoading) return;

    // Optimistic update
    const optimisticSaved = !saved;
    setSaved(optimisticSaved);
    setSaveLoading(true);

    try {
      if (!userId) {
        // No API call if userId not provided – keep local toggle
        onSave?.(id, optimisticSaved);
        return;
      }

      const result = await toggleSaveScheme(userId, id);

      if (!result.success) {
        throw new Error("Failed to toggle save");
      }

      // Reconcile with server truth
      setSaved(result.saved);
      onSave?.(id, result.saved);
    } catch {
      // Roll back on error
      setSaved(!optimisticSaved);
      setToast({ message: "Action failed", type: "error" });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleApply = () => {
    if (applyLink) window.open(applyLink, "_blank", "noopener noreferrer");
    setApplied(true);
    onApply?.(id);
    setTimeout(() => setApplied(false), 2000);
  };

  // ── Star button shared style ──────────────────────────────────────────────

  const starClass = (fullWidth: boolean) => `
    flex ${fullWidth ? "h-11 w-full sm:h-10 sm:w-10" : "h-8 w-8 sm:h-9 sm:w-9"} shrink-0
    items-center justify-center rounded-${fullWidth ? "xl" : "lg"} border
    transition-all duration-200
    ${saveLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
    ${saved
      ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
      : "bg-slate-800 border-slate-700 text-slate-500 hover:text-amber-400 hover:border-amber-500/30"
    }
  `;

  return (
    <>
      {/* ── Keyframes injected once via style tag ─────────────────────── */}
      <style>{`
        @keyframes yc-spin { to { transform: rotate(360deg); } }
        @keyframes yc-pop  { 0%{transform:scale(1)} 40%{transform:scale(1.35)} 100%{transform:scale(1)} }
        .yc-star-pop { animation: yc-pop 0.3s ease; }
      `}</style>

      {/* ── Toast ─────────────────────────────────────────────────────── */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="
        flex w-full max-w-3xl flex-col bg-slate-900 border border-slate-700/60
        rounded-xl overflow-hidden transition-all duration-300 sm:rounded-2xl
        hover:-translate-y-1 hover:border-slate-600
        hover:shadow-xl hover:shadow-black/40
      ">
        {/* Top color strip */}
        <div className={`h-1 w-full ${
          category === "Education"   ? "bg-blue-500"   :
          category === "Agriculture" ? "bg-emerald-500":
          category === "Housing"     ? "bg-amber-500"  :
          category === "Health"      ? "bg-rose-500"   :
          category === "Women"       ? "bg-pink-500"   :
          category === "Finance"     ? "bg-violet-500" :
          category === "Employment"  ? "bg-cyan-500"   :
          "bg-slate-500"
        }`} />

        <div className="flex flex-col flex-1 gap-4 p-4 sm:gap-5 sm:p-5">

          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-base sm:h-10 sm:w-10 sm:rounded-xl sm:text-lg ${colors.bg} ${colors.border}`}>
                {emoji}
              </div>
              <div className="min-w-0">
                <h2 className="line-clamp-2 text-sm font-semibold leading-snug text-white sm:text-base">{title}</h2>
                {ministry && <p className="mt-0.5 truncate text-[11px] text-slate-500 sm:text-xs">{ministry}</p>}
              </div>
            </div>
            {/* Top-right star */}
            <button
              onClick={handleSave}
              disabled={saveLoading}
              aria-label={saved ? "Unsave scheme" : "Save scheme"}
              className={starClass(false)}
            >
              {saveLoading ? <SpinnerIcon /> : <StarIcon filled={saved} />}
            </button>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-medium sm:text-xs ${colors.bg} ${colors.text} ${colors.border}`}>
              {category}
            </span>
            <span className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-300 sm:text-xs">
              <MapPinIcon /> {state}
            </span>
            {deadline && (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/25 bg-rose-500/10 px-2.5 py-1 text-[11px] font-medium text-rose-400 sm:text-xs">
                <CalendarIcon /> {deadline}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-slate-400 text-sm leading-relaxed">
            {shownDesc}
            {isLong && (
              <button onClick={() => setReadMore(v => !v)}
                className="ml-1 text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors">
                {readMore ? "less" : "more"}
              </button>
            )}
          </p>

          {/* Benefit */}
          {benefit && (
            <div className="flex items-start gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-3 py-2.5">
              <span className="text-emerald-400 shrink-0 mt-0.5"><GiftIcon /></span>
              <p className="text-[11px] leading-relaxed text-emerald-300 sm:text-xs">{benefit}</p>
            </div>
          )}

          {/* Eligibility */}
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/60 px-3 py-2.5">
            <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-slate-500 sm:text-xs">Eligibility</p>
            <p className="text-[11px] leading-relaxed text-slate-300 sm:text-xs">{eligibility}</p>
          </div>

          {/* Expandable extra details */}
          {hasExtra && (
            <div>
              <button onClick={() => setExpanded(v => !v)}
                className="flex w-full items-center justify-between py-1 text-[11px] font-medium text-slate-500 transition-colors hover:text-slate-300 sm:text-xs">
                <span>More details</span>
                <ChevronIcon open={expanded} />
              </button>
              <div style={{
                maxHeight: expanded ? "200px" : "0",
                opacity: expanded ? 1 : 0,
                overflow: "hidden",
                transition: "max-height 0.3s ease, opacity 0.25s ease"
              }}>
                <div className="pt-2 border-t border-slate-700/40 space-y-2 mt-1">
                  {ageRequirement && (
                    <div>
                      <p className="text-[11px] font-medium text-slate-500 sm:text-xs">Age requirement</p>
                      <p className="mt-0.5 text-[11px] text-slate-300 sm:text-xs">{ageRequirement}</p>
                    </div>
                  )}
                  {qualification && (
                    <div>
                      <p className="text-[11px] font-medium text-slate-500 sm:text-xs">Qualification</p>
                      <p className="mt-0.5 text-[11px] text-slate-300 sm:text-xs">{qualification}</p>
                    </div>
                  )}
                  {ministry && (
                    <div>
                      <p className="text-[11px] font-medium text-slate-500 sm:text-xs">Ministry</p>
                      <p className="mt-0.5 text-[11px] text-slate-300 sm:text-xs">{ministry}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex-1" />

          {/* Action buttons */}
          <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center">
            <button onClick={handleApply}
              className={`flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 sm:flex-1 ${
                applied
                  ? "bg-emerald-500/15 border border-emerald-500/25 text-emerald-400"
                  : "bg-blue-600 hover:bg-blue-500 text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-900/30"
              }`}>
              {applied ? <><CheckIcon /> Opened!</> : <>Apply Now <ArrowIcon /></>}
            </button>
            {/* Bottom star */}
            <button
              onClick={handleSave}
              disabled={saveLoading}
              aria-label={saved ? "Unsave scheme" : "Save scheme"}
              className={starClass(true)}
            >
              {saveLoading ? <SpinnerIcon /> : <StarIcon filled={saved} />}
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default YojnaCard;
