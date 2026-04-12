import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Wraps any route that requires authentication.
 * - While session is loading → show a full-screen spinner (prevents flash).
 * - If no session → redirect to /login, preserving the intended destination.
 * - If session exists → render children normally.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060818]">
        <div className="flex flex-col items-center gap-4">
          {/* Animated spinner */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-purple-500/20" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin" />
          </div>
          <p className="text-slate-400 text-sm font-medium tracking-wide animate-pulse">
            Checking session…
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    // Save the tried path so we can redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
