import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

const hasRealConfig = Boolean(
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl !== 'https://placeholder-url.supabase.co' &&
  supabaseKey !== 'placeholder-anon-key'
);

export const hasSupabaseConfig = hasRealConfig;

export function getSupabaseClient(): SupabaseClient | null {
  if (!hasRealConfig || !supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey);
}
