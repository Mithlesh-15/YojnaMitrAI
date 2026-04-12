import { useEffect, useState, type FC } from "react";

type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

const icons: Record<ToastType, string> = {
  success: "✓",
  error: "✕",
  info: "ℹ",
};

const colors: Record<ToastType, string> = {
  success:
    "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-300",
  error:
    "from-red-500/20 to-rose-500/20 border-red-500/30 text-red-300",
  info: "from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-300",
};

const iconColors: Record<ToastType, string> = {
  success: "bg-emerald-500/20 text-emerald-400",
  error: "bg-red-500/20 text-red-400",
  info: "bg-blue-500/20 text-blue-400",
};

/**
 * Animated toast notification that slides in from the top-right.
 * Auto-dismisses after `duration` ms (default 5 s).
 */
export const Toast: FC<ToastProps> = ({
  message,
  type = "info",
  duration = 5000,
  onClose,
}) => {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // Tiny delay so the CSS transition is observable on mount
    const showTimer = setTimeout(() => setVisible(true), 10);
    const hideTimer = setTimeout(() => dismiss(), duration);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  const dismiss = () => {
    setLeaving(true);
    setTimeout(onClose, 400); // matches transition duration
  };

  return (
    <div
      style={{
        transform: visible && !leaving ? "translateX(0)" : "translateX(110%)",
        opacity: visible && !leaving ? 1 : 0,
        transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease",
      }}
      className={`
        fixed top-6 right-6 z-[9999] flex items-start gap-3 max-w-sm w-full
        rounded-2xl border bg-gradient-to-br backdrop-blur-xl shadow-2xl p-4
        ${colors[type]}
      `}
      role="alert"
      aria-live="polite"
    >
      {/* Icon badge */}
      <span
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${iconColors[type]}`}
      >
        {icons[type]}
      </span>

      {/* Message */}
      <p className="flex-1 text-sm leading-relaxed font-medium pt-1">
        {message}
      </p>

      {/* Close button */}
      <button
        onClick={dismiss}
        aria-label="Dismiss notification"
        className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity text-lg leading-none mt-0.5"
      >
        ×
      </button>
    </div>
  );
};
