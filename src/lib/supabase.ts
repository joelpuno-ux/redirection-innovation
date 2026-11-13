import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/** Supabase connection ng Kabyaw Eats merchant app.
 * Kapag inilipat na ito sa main Kabyaw Eats app, palitan lang ang file na ito
 * ng existing mong client (`supabaseUrl` + `supabaseAnonKey`).
 */

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? ''
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

export const isSupabaseConfigured =
  /^https?:\/\//.test(SUPABASE_URL) &&
  !SUPABASE_URL.includes('YOUR-PROJECT') &&
  SUPABASE_ANON_KEY.length > 20

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null