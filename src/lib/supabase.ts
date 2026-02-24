import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "⚠️ Missing Supabase environment variables. Please check your .env file.",
  );
  console.error("You need to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY");
  console.error("See DATABASE_README.md for setup instructions");
}

// Check if credentials look valid (not placeholders)
if (supabaseAnonKey && supabaseAnonKey.startsWith("sb_publishable__")) {
  console.error("⚠️ Your Supabase anon key appears to be a placeholder!");
  console.error(
    "Please replace it with your actual Supabase anon key from your project dashboard.",
  );
  console.error("Visit: https://supabase.com/dashboard/project/_/settings/api");
}

export const supabase = createClient<Database>(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  },
);
