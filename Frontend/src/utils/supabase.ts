import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables.\n" +
      "Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your .env file."
  );
}

/**
 * Singleton Supabase client — import this wherever you need
 * database queries or auth operations.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Persists session across page refreshes via localStorage
    persistSession: true,
    // Automatically refresh the JWT before it expires
    autoRefreshToken: true,
    // Detect the session from the URL hash on magic-link callback
    detectSessionInUrl: true,
  },
});