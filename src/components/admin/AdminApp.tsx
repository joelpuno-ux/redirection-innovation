import { Loader2, ShieldAlert } from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';
import { useAdminSession } from '../../lib/adminAuth';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';

/** Gate ng #/admin route: config notice → loading → login → dashboard. */
export function AdminApp() {
  const { loading, user } = useAdminSession();

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-corporate-950 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-2xl">
          <ShieldAlert className="w-10 h-10 text-redirection-600 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-corporate-900 mb-2">Supabase is not configured</h1>
          <p className="text-sm text-corporate-600 leading-relaxed">
            Set <code className="font-mono text-xs bg-corporate-50 px-1.5 py-0.5 rounded">VITE_SUPABASE_URL</code> and{' '}
            <code className="font-mono text-xs bg-corporate-50 px-1.5 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code> in your
            environment, then run <code className="font-mono text-xs bg-corporate-50 px-1.5 py-0.5 rounded">supabase/admin_setup.sql</code> in
            the Supabase SQL Editor.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-corporate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-redirection-500 animate-spin" />
      </div>
    );
  }

  if (!user) return <AdminLogin />;
  return <AdminDashboard user={user} />;
}