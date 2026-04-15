import React, { useEffect, useCallback, useState } from "react";
import { getSchemeSavedStatus, toggleSaveScheme } from "../api/api";
import { useAuth } from "../contexts/AuthContext";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Scheme {
  id: string;
  title: string;
  description: string;
  category: string;
  state: string;
  eligibility?: string;
  applyLink?: string;
  benefits?: string;
  documentsRequired?: string;
  lastDate?: string;
  ministry?: string;
}

interface SchemeDetailModalProps {
  scheme: Scheme | null;
  loading?: boolean;
  onClose: () => void;
}

// ─── Category badge colors ────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  Education:   { bg: "bg-blue-500/15",    text: "text-blue-300",    border: "border-blue-500/30",    glow: "shadow-blue-500/10" },
  student:     { bg: "bg-blue-500/15",    text: "text-blue-300",    border: "border-blue-500/30",    glow: "shadow-blue-500/10" },
  Agriculture: { bg: "bg-emerald-500/15", text: "text-emerald-300", border: "border-emerald-500/30", glow: "shadow-emerald-500/10" },
  farmer:      { bg: "bg-emerald-500/15", text: "text-emerald-300", border: "border-emerald-500/30", glow: "shadow-emerald-500/10" },
  Housing:     { bg: "bg-amber-500/15",   text: "text-amber-300",   border: "border-amber-500/30",   glow: "shadow-amber-500/10" },
  Health:      { bg: "bg-rose-500/15",    text: "text-rose-300",    border: "border-rose-500/30",    glow: "shadow-rose-500/10" },
  Women:       { bg: "bg-pink-500/15",    text: "text-pink-300",    border: "border-pink-500/30",    glow: "shadow-pink-500/10" },
  Finance:     { bg: "bg-violet-500/15",  text: "text-violet-300",  border: "border-violet-500/30",  glow: "shadow-violet-500/10" },
  Employment:  { bg: "bg-cyan-500/15",    text: "text-cyan-300",    border: "border-cyan-500/30",    glow: "shadow-cyan-500/10" },
};

const fallbackColors = { bg: "bg-slate-500/15", text: "text-slate-300", border: "border-slate-500/30", glow: "shadow-slate-500/10" };

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconClose: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconExternalLink: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const IconCheckCircle: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const IconMapPin: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconTag: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const IconBookmark: React.FC<{ className?: string; filled?: boolean }> = ({
  className,
  filled = false,
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
  </svg>
);

// ─── Modal Component ──────────────────────────────────────────────────────────

const SchemeDetailModal: React.FC<SchemeDetailModalProps> = ({ scheme, loading, onClose }) => {
  const { session } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  // ESC key handler
  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEsc);
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [handleEsc]);

  useEffect(() => {
    if (!scheme?.id) return;
    if (!session?.access_token) {
      setIsSaved(false);
      return;
    }

    let isActive = true;

    const fetchSavedStatus = async () => {
      setLoadingSave(true);

      try {
        const response = await getSchemeSavedStatus(scheme.id, session.access_token);
        if (!isActive) return;
        setIsSaved(Boolean(response.saved));
      } catch (error) {
        console.error("Failed to fetch saved status:", error);
        if (!isActive) return;
        setIsSaved(false);
      } finally {
        if (!isActive) return;
        setLoadingSave(false);
      }
    };

    void fetchSavedStatus();

    return () => {
      isActive = false;
    };
  }, [scheme?.id, session?.access_token]);

  useEffect(() => {
    if (!saveFeedback) return;

    const timer = window.setTimeout(() => {
      setSaveFeedback(null);
    }, 1600);

    return () => window.clearTimeout(timer);
  }, [saveFeedback]);

  const handleToggleSave = async () => {
    if (loadingSave || !scheme?.id) return;

    if (!session?.access_token) {
      setSaveFeedback("Login required");
      return;
    }

    const optimisticSaved = !isSaved;
    setIsSaved(optimisticSaved);
    setLoadingSave(true);

    try {
      const response = await toggleSaveScheme(scheme.id, session.access_token);

      if (!response.success) {
        throw new Error(response.message ?? "Failed to toggle save");
      }

      setIsSaved(response.saved);
      setSaveFeedback(response.saved ? "Saved" : "Removed");
    } catch (error) {
      console.error("Failed to toggle save:", error);
      setIsSaved(!optimisticSaved);
      setSaveFeedback("Failed to update");
    } finally {
      setLoadingSave(false);
    }
  };

  if (!scheme) return null;

  const colors = CATEGORY_COLORS[scheme.category] ?? fallbackColors;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-modalOverlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="scheme-modal-title"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal panel */}
      <div
        className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl shadow-black/40 animate-modalContent"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative gradient top bar */}
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-200 hover:scale-105"
          aria-label="Close modal"
        >
          <IconClose className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="p-6 pt-8 space-y-5">
          {/* Title */}
          <h2
            id="scheme-modal-title"
            className="text-xl md:text-2xl font-bold text-white leading-snug pr-8"
          >
            {scheme.title}
          </h2>

          {/* Badges row */}
          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold ${colors.bg} ${colors.text} ${colors.border}`}
            >
              <IconTag className="w-3 h-3" />
              {scheme.category}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-300">
              <IconMapPin className="w-3 h-3" />
              {scheme.state}
            </span>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Description
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {scheme.description}
            </p>
          </div>

          {/* Loading Skeleton OR Additional Details */}
          {loading ? (
            <div className="space-y-4 py-2 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                <span className="text-sm text-blue-400 font-medium">Fetching complete details...</span>
              </div>
              <div className="space-y-2">
               <div className="h-3 bg-slate-700/50 rounded w-1/4"></div>
               <div className="h-16 bg-slate-800/60 rounded-xl w-full"></div>
              </div>
              <div className="space-y-2">
               <div className="h-3 bg-slate-700/50 rounded w-1/3"></div>
               <div className="h-12 bg-slate-800/60 rounded-xl w-full"></div>
              </div>
            </div>
          ) : (
            <>
              {/* Eligibility */}
              {scheme.eligibility && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Eligibility
                  </h3>
                  <div className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-4">
                    <div className="flex items-start gap-2.5">
                      <IconCheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {scheme.eligibility}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Benefits */}
              {scheme.benefits && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Benefits
                  </h3>
                  <div className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-4">
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {scheme.benefits}
                    </p>
                  </div>
                </div>
              )}

              {/* Required Documents */}
              {scheme.documentsRequired && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Required Documents
                  </h3>
                  <div className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-4">
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {scheme.documentsRequired}
                    </p>
                  </div>
                </div>
              )}

              {/* Meta Info (Ministry & Last Date) */}
              {(scheme.ministry || scheme.lastDate) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  {scheme.ministry && (
                    <div className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-3.5 flex flex-col justify-center">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                        Ministry
                      </span>
                      <span className="text-sm text-slate-300 font-medium">
                        {scheme.ministry}
                      </span>
                    </div>
                  )}
                  {scheme.lastDate && (
                    <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3.5 flex flex-col justify-center">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-400/80 mb-1">
                        Last Date
                      </span>
                      <span className="text-sm text-rose-300 font-bold">
                        {scheme.lastDate}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          <div className="space-y-1.5">
            <div className="flex flex-col sm:flex-row gap-2">
              {scheme.applyLink && (
                <a
                  href={scheme.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-900/40 active:scale-[0.98]"
                >
                  Apply Now
                  <IconExternalLink className="w-4 h-4" />
                </a>
              )}
              <button
                type="button"
                onClick={handleToggleSave}
                disabled={loadingSave}
                aria-pressed={isSaved}
                className={`flex items-center justify-center gap-2 rounded-xl border text-sm font-semibold py-3 px-4 transition-all duration-200 ${
                  scheme.applyLink ? "sm:w-40" : "w-full"
                } ${
                  loadingSave
                    ? "cursor-not-allowed opacity-70 border-slate-600 bg-slate-800 text-slate-300"
                    : isSaved
                      ? "border-amber-500/40 bg-amber-500/15 text-amber-300 hover:bg-amber-500/20"
                      : "border-slate-700 bg-slate-800/90 text-slate-200 hover:border-amber-500/40 hover:text-amber-300"
                }`}
              >
                <IconBookmark className="w-4 h-4" filled={isSaved} />
                {loadingSave ? "Updating..." : isSaved ? "Unsave" : "Save"}
              </button>
            </div>
            {saveFeedback && (
              <p className="text-xs text-slate-400 pl-1">
                {saveFeedback}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes modalOverlay {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalContent {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modalOverlay {
          animation: modalOverlay 0.2s ease-out both;
        }
        .animate-modalContent {
          animation: modalContent 0.25s ease-out both;
        }
      `}</style>
    </div>
  );
};

export default SchemeDetailModal;
