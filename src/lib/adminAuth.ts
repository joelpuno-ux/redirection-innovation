import { useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';

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