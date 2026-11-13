import { useState, type FormEvent } from 'react';
import { Lock, ShieldCheck, Loader2 } from 'lucide-react';
import { adminSignIn } from '../../lib/adminAuth';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await adminSignIn(email, password);
    if (res.error) {
      setError(res.error);
      setBusy(false);
    }
    // Kapag success, ang useAdminSession listener ang magpapalit ng view sa dashboard.
  };

  return (
    <div className="min-h-screen bg-corporate-950 relative overflow-hidden flex items-center justify-center p-4 sm:p-6">
      <div className="mesh-blob w-[600px] h-[600px] bg-redirection-500/10 top-[-10%] left-[-10%] rounded-full animate-float" />
      <div className="mesh-blob w-[700px] h-[700px] bg-corporate-800/70 bottom-[-15%] right-[-15%] rounded-full animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <img src="/logo-full.png" alt="ReDirection Innovations Inc" className="w-44 h-auto mx-auto mb-6" />
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-corporate-50 text-corporate-700 text-xs font-semibold border border-corporate-200">
              <Lock className="w-3.5 h-3.5 text-redirection-600" />
              Restricted Area
            </div>
            <h1 className="text-2xl font-bold text-corporate-900 mt-4">Admin Console</h1>
            <p className="text-sm text-corporate-500 mt-2">
              Book of Accounts, sales &amp; transaction summaries. Authorized personnel only.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-semibold text-corporate-800 mb-1.5">
                Company Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@redirectioninnovation.com"
                className="w-full rounded-xl border border-corporate-200 bg-corporate-50 px-4 py-3 text-sm text-corporate-900 placeholder-corporate-400 focus:outline-none focus:ring-2 focus:ring-redirection-500 focus:border-redirection-500 transition"
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="block text-sm font-semibold text-corporate-800 mb-1.5">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-corporate-200 bg-corporate-50 px-4 py-3 text-sm text-corporate-900 placeholder-corporate-400 focus:outline-none focus:ring-2 focus:ring-redirection-500 focus:border-redirection-500 transition"
              />
            </div>
            <button type="submit" disabled={busy} className="btn-primary w-full text-center disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              {busy ? 'Verifying…' : 'Sign In Securely'}
            </button>
          </form>

          <p className="text-xs text-corporate-400 text-center mt-6 leading-relaxed">
            Access is limited to approved company emails and is protected by Supabase
            row-level security. Need access? Contact support@redirectioninnovation.com.
          </p>
        </div>
      </div>
    </div>
  );
}