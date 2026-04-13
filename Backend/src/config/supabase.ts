import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";


dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseAnonKey = process.env.SUPABASE_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables.\n" +
      "Set SUPABASE_URL and SUPABASE_KEY in your .env file."
  );
}

/**
 * Singleton Supabase client — import this wherever you need
 * database queries or auth operations.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);