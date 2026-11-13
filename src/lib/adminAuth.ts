import { useEffect, useRef, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';

/** 5 minutos ng kawalan ng aktibidad = automatic sign-out (safety net). */
export const ADMIN_IDLE_MS = 5 * 60 * 1000;
const LAST_ACTIVITY_KEY = 'ri_admin_last_activity';
const SIGNOUT_REASON_KEY = 'ri_admin_signout_reason';

function safeGet(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeSet(key: string, value: string): void {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}
function safeRemove(key: string): void {
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export function setSignOutReason(reason: string): void {
  safeSet(SIGNOUT_REASON_KEY, reason);
}

/** Binabasa at binubura ang dahilan ng huling automatic sign-out (para sa login banner). */
export function takeSignOutReason(): string | null {
  const r = safeGet(SIGNOUT_REASON_KEY);
  if (r) safeRemove(SIGNOUT_REASON_KEY);
  return r;
}

function touchActivity(): void {
  safeSet(LAST_ACTIVITY_KEY, String(Date.now()));
}

/**
 * Idle watchdog ng admin dashboard: kapag 5 minutos walang aktibidad
 * (click/keypress/scroll/mousemove/touch), automatic na magsa-sign-out.
 * May staleness check din sa mount (sakaling bumalik matapos ang mahabang pag-alis)
 * at sa visibilitychange (para sa mga background tab na na-throttle).
 */
export function useIdleSignOut(): void {
  const expiredRef = useRef(false);

  useEffect(() => {
    expiredRef.current = false;
    const stored = Number(safeGet(LAST_ACTIVITY_KEY) ?? Date.now());
    let last = Number.isFinite(stored) && stored > 0 ? stored : Date.now();

    const expire = () => {
      if (expiredRef.current) return;
      expiredRef.current = true;
      setSignOutReason('idle');
      void adminSignOut();
    };
    const check = () => {
      if (Date.now() - last > ADMIN_IDLE_MS) expire();
    };
    check(); // staleness check sa pag-mount
    touchActivity();

    const touch = () => {
      last = Date.now();
      touchActivity();
    };
    let mouseLast = 0;
    const onMouse = () => {
      const n = Date.now();
      if (n - mouseLast > 1000) {
        mouseLast = n;
        touch();
      }
    };
    const events = ['click', 'keydown', 'scroll', 'touchstart', 'wheel'] as const;
    events.forEach((e) => window.addEventListener(e, touch, { passive: true }));
    window.addEventListener('mousemove', onMouse, { passive: true });
    const onVis = () => {
      if (document.visibilityState === 'visible') check();
    };
    document.addEventListener('visibilitychange', onVis);
    const iv = window.setInterval(check, 10_000);

    return () => {
      events.forEach((e) => window.removeEventListener(e, touch));
      window.removeEventListener('mousemove', onMouse);
      document.removeEventListener('visibilitychange', onVis);
      window.clearInterval(iv);
    };
  }, []);
}

/** Fallback kapag walang VITE_ADMIN_EMAILS sa env — palitan sa .env / Netlify env vars. */
const DEFAULT_ADMIN_EMAILS = ['support@redirectioninnovation.com'];

/** Allow-list ng mga email na pwedeng mag-login sa admin console. */
export function adminEmails(): string[] {
  const raw = (import.meta.env.VITE_ADMIN_EMAILS as string | undefined) ?? '';
  const list = raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return list.length > 0 ? list : DEFAULT_ADMIN_EMAILS;
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return adminEmails().includes(email.trim().toLowerCase());
}

/** Live Supabase auth session para sa admin gate. */
export function useAdminSession(): { loading: boolean; session: Session | null; user: User | null } {
  const [state, setState] = useState<{ loading: boolean; session: Session | null }>({
    loading: true,
    session: null,
  });

  useEffect(() => {
    if (!supabase) {
      setState({ loading: false, session: null });
      return;
    }
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) setState({ loading: false, session: data.session });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setState({ loading: false, session });
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { loading: state.loading, session: state.session, user: state.session?.user ?? null };
}

/**
 * Admin sign-in with double gating:
 *  1) Supabase Auth password check
 *  2) allow-list check — kung hindi kasado ang email, agad na sina-sign-out
 * (Ang totoong enforcement ay nasa Supabase RLS policies — tingnan ang supabase/admin_setup.sql)
 */
export async function adminSignIn(email: string, password: string): Promise<{ error: string | null }> {
  if (!supabase) {
    return { error: 'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY first.' };
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) return { error: error.message };

  const user = data.user;
  if (!isAdminEmail(user?.email)) {
    await supabase.auth.signOut();
    return {
      error: 'This account is not authorized for admin access. Access is restricted to approved company emails only.',
    };
  }
  return { error: null };
}

export async function adminSignOut(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut();
}