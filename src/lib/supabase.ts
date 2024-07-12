import "server-only";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/db";

if (!process.env.SUPABASE_URL) throw new Error("Missing env.SUPABASE_URL");
if (!process.env.SUPABASE_ANON_KEY)
  throw new Error("Missing env.SUPABASE_ANON_KEY");

export const supabase = createClient<Database>(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);
