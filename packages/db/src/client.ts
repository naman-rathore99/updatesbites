import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Server-side client — uses service role key (bypasses RLS)
// Use this in API routes for full CRUD access
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Client-side client — uses anon key (respects RLS)
// Use this in browser components for read-only public data
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
