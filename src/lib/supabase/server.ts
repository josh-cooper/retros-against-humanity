import "server-only";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/db";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) throw new Error("Missing env.SUPABASE_URL");
if (!process.env.SUPABASE_SERVICE_ROLE_KEY)
  throw new Error("Missing env.SUPABASE_SERVICE_ROLE_KEY");

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
