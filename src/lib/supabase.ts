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

/** Session storage lang ang auth persistence: kapag nagsara ang tab, automatic na
 * nawawala ang session (per-tab ang sessionStorage). Survive lang ito sa refresh
 * ng PAREHONG tab — protektado pa rin ng 5-min idle rule at leave-page sign-out.
 */
const safeSessionStorage = {
  getItem: (key: string) => {
    try {
      return window.sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      window.sessionStorage.setItem(key, value);
    } catch {
      /* ignore */
    }
  },
  removeItem: (key: string) => {
    try {
      window.sessionStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
};

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        storage: safeSessionStorage,
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null