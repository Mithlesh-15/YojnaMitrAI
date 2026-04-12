import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../utils/supabase";
import { useAuth } from "../contexts/AuthContext";
import { Toast } from "../components/Toast";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ToastConfig {
  message: string;
  type: "success" | "error" | "info";
}

// ─── Login Page ───────────────────────────────────────────────────────────────

const LoginPage = () => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [toast, setToast] = useState<ToastConfig | null>(null);
  const [linkSent, setLinkSent] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Fade-in on mount
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Redirect already-authenticated users
  useEffect(() => {
    if (!loading && session) {
      const from =
        (location.state as { from?: { pathname: string } })?.from?.pathname ||
        "/dashboard/chat";
      navigate(from, { replace: true });
    }
  }, [session, loading, navigate, location]);

  // ─── Helpers ────────────────────────────────────────────────────────────────

  const validateEmail = (value: string) => {
    if (!value.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "Please enter a valid email address.";
    return "";
  };

  const showToast = (message: string, type: ToastConfig["type"]) => {
    setToast({ message, type });
  };

  // ─── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const err = validateEmail(email);
    if (err) {
      setEmailError(err);
      return;
    }
    setEmailError("");
    setSending(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // After clicking the magic link, Supabase will redirect here
          emailRedirectTo: `${window.location.origin}/dashboard/chat`,

        },
      });

      if (error) {
        showToast(error.message, "error");
      } else {
        setLinkSent(true);
        showToast("Magic link sent! Check your inbox 📬", "success");
      }
    } catch {
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setSending(false);
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  if (loading) return null; // AuthProvider is still hydrating

  return (
    <>
      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* ── Background ────────────────────────────────────────────────────── */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#060818] px-4 py-12">
        {/* Ambient gradient orbs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -left-32 w-150 h-150 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -right-24 w-125 h-125 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        {/* Fine dot-grid pattern */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle, #a78bfa 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />

        {/* ── Card ────────────────────────────────────────────────────────── */}
        <div
          role="main"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
          className="relative w-full max-w-md"
        >
          {/* Glowing border ring */}
          <div
            aria-hidden
            className="absolute -inset-px rounded-3xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(139,92,246,0.5), rgba(59,130,246,0.3), rgba(139,92,246,0.1))",
            }}
          />

          {/* Card body */}
          <div
            className="relative rounded-3xl p-8 sm:p-10"
            style={{
              background:
                "linear-gradient(145deg, rgba(15,15,40,0.95) 0%, rgba(10,10,30,0.98) 100%)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              boxShadow:
                "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset",
            }}
          >
            {/* ── Brand ───────────────────────────────────────────────────── */}
            <div className="flex flex-col items-center mb-8">
              {/* Logo mark */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #3b82f6 100%)",
                  boxShadow: "0 8px 32px rgba(124,58,237,0.35)",
                }}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M16 4C9.37 4 4 9.37 4 16s5.37 12 12 12 12-5.37 12-12S22.63 4 16 4z"
                    fill="rgba(255,255,255,0.15)"
                  />
                  <path
                    d="M11 13h10M11 16h7M11 19h5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="22" cy="10" r="3" fill="#34d399" />
                </svg>
              </div>

              <h1
                className="text-2xl font-bold tracking-tight"
                style={{
                  background:
                    "linear-gradient(135deg, #e2d9f3 0%, #c4b5fd 40%, #a5b4fc 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                YojnaMitrAI
              </h1>
              <p className="text-slate-400 text-sm mt-1 tracking-wide">
                Your AI guide to government schemes
              </p>
            </div>

            {/* ── Divider ─────────────────────────────────────────────────── */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex-1 h-px bg-linear-to-r from-transparent via-slate-600/60 to-transparent" />
              <span className="text-slate-500 text-xs font-medium uppercase tracking-widest">
                Sign in
              </span>
              <div className="flex-1 h-px bg-linear-to-r from-transparent via-slate-600/60 to-transparent" />
            </div>

            {/* ── Heading ─────────────────────────────────────────────────── */}
            {!linkSent ? (
              <>
                <h2 className="text-white font-semibold text-lg mb-1">
                  Login to continue
                </h2>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  Enter your email and we'll send you a secure magic link — no
                  password needed.
                </p>

                {/* ── Form ──────────────────────────────────────────────── */}
                <form onSubmit={handleSubmit} noValidate>
                  {/* Email field */}
                  <div className="mb-5">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-300 mb-2"
                    >
                      Email address
                    </label>
                    <div className="relative">
                      {/* Envelope icon */}
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 20 20"
                          fill="none"
                          aria-hidden
                        >
                          <path
                            d="M2.5 6.667 10 11.667l7.5-5M2.5 5h15a.833.833 0 0 1 .833.833v9.167a.833.833 0 0 1-.833.834h-15a.833.833 0 0 1-.833-.834V5.833A.833.833 0 0 1 2.5 5z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (emailError) setEmailError("");
                        }}
                        disabled={sending}
                        aria-invalid={!!emailError}
                        aria-describedby={emailError ? "email-error" : undefined}
                        className={`
                          w-full pl-10 pr-4 py-3 rounded-xl text-sm
                          bg-white/5 border text-white placeholder-slate-500
                          outline-none transition-all duration-200
                          focus:bg-white/8 focus:shadow-[0_0_0_3px_rgba(124,58,237,0.25)]
                          disabled:opacity-50 disabled:cursor-not-allowed
                          ${
                            emailError
                              ? "border-red-500/60 focus:border-red-400"
                              : "border-white/10 hover:border-white/20 focus:border-purple-500/60"
                          }
                        `}
                        style={{ caretColor: "#a78bfa" }}
                      />
                    </div>
                    {emailError && (
                      <p
                        id="email-error"
                        role="alert"
                        className="mt-2 text-xs text-red-400 flex items-center gap-1.5"
                      >
                        <span>⚠</span>
                        {emailError}
                      </p>
                    )}
                  </div>

                  {/* Submit button */}
                  <button
                    id="send-magic-link-btn"
                    type="submit"
                    disabled={sending}
                    className="relative w-full py-3 px-6 rounded-xl font-semibold text-sm text-white overflow-hidden group transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70"
                    style={{
                      background:
                        "linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #3b82f6 100%)",
                      boxShadow: "0 4px 24px rgba(124,58,237,0.35)",
                    }}
                  >
                    {/* Shimmer on hover */}
                    <span
                      aria-hidden
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%)",
                      }}
                    />
                    {/* Scale on hover */}
                    <span
                      aria-hidden
                      className="absolute inset-0 group-hover:scale-[1.02] group-active:scale-95 transition-transform duration-200 rounded-xl"
                    />

                    <span className="relative flex items-center justify-center gap-2">
                      {sending ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            />
                          </svg>
                          Sending link…
                        </>
                      ) : (
                        <>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 20 20"
                            fill="none"
                            aria-hidden
                          >
                            <path
                              d="M17.5 2.5 2.5 10l5 2.5M17.5 2.5l-7.5 15-2.5-5M17.5 2.5l-10 10"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Send Magic Link
                        </>
                      )}
                    </span>
                  </button>
                </form>
              </>
            ) : (
              /* ── Success State ──────────────────────────────────────────── */
              <div className="flex flex-col items-center text-center py-4">
                {/* Animated checkmark */}
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(52,211,153,0.15), rgba(16,185,129,0.1))",
                    border: "1px solid rgba(52,211,153,0.25)",
                    boxShadow: "0 0 40px rgba(52,211,153,0.15)",
                  }}
                >
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M5 13l4 4L19 7"
                      stroke="#34d399"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        strokeDasharray: 24,
                        strokeDashoffset: 0,
                        animation: "draw-check 0.5s ease forwards",
                      }}
                    />
                  </svg>
                </div>
                <h2 className="text-white font-semibold text-lg mb-2">
                  Check your inbox!
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                  We sent a magic link to{" "}
                  <span className="text-purple-300 font-medium">{email}</span>.
                  Click it to sign in — it expires in 1 hour.
                </p>
                <p className="text-slate-500 text-xs mt-4">
                  Didn't receive it?{" "}
                  <button
                    onClick={() => {
                      setLinkSent(false);
                      setEmail("");
                    }}
                    className="text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors"
                  >
                    Try again
                  </button>
                </p>
              </div>
            )}

            {/* ── Footer note ─────────────────────────────────────────────── */}
            <p className="mt-8 text-center text-slate-600 text-xs">
              By continuing you agree to our{" "}
              <a
                href="#"
                className="text-slate-500 hover:text-slate-400 underline underline-offset-2 transition-colors"
              >
                Terms of Service
              </a>{" "}
              &{" "}
              <a
                href="#"
                className="text-slate-500 hover:text-slate-400 underline underline-offset-2 transition-colors"
              >
                Privacy Policy
              </a>
            </p>
          </div>

          {/* Subtle reflection below card */}
          <div
            aria-hidden
            className="mx-8 h-px mt-0"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)",
            }}
          />
        </div>
      </div>

      {/* ── Global styles for draw animation ─────────────────────────────── */}
      <style>{`
        @keyframes draw-check {
          from { stroke-dashoffset: 24; }
          to   { stroke-dashoffset: 0;  }
        }
      `}</style>
    </>
  );
};

export default LoginPage;