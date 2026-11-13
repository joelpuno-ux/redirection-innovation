import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  LogOut, Download, AlertTriangle, RefreshCw, Wallet, Receipt, TrendingUp, Store, BookOpen, Scale,
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { adminSignOut } from '../../lib/adminAuth';
import {
  fetchSalesTransactions,
  fetchFinancialRecords,
  peso,
  monthKey,
  monthLabel,
  dateLabel,
  downloadCsv,
  type SalesTransaction,
  type FinancialRecord,
} from '../../lib/adminData';

type Props = { user: User };

const statusClass = (s: string) => {
  const v = (s ?? '').toLowerCase();
  if (v === 'completed' || v === 'paid' || v === 'settled') return 'bg-green-100 text-green-700';
  if (v === 'pending' || v === 'processing') return 'bg-amber-100 text-amber-700';
  if (v === 'cancelled' || v === 'refunded' || v === 'failed') return 'bg-red-100 text-red-700';
  return 'bg-corporate-100 text-corporate-700';
};

function Kpi({ label, value, sub, icon }: { label: string; value: string; sub?: string; icon: ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-corporate-100 shadow-sm p-5 card-hover">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-corporate-500">{label}</p>
        <div className="w-9 h-9 rounded-xl bg-redirection-50 text-redirection-600 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-corporate-900 tracking-tight">{value}</p>
      {sub && <p className="text-xs text-corporate-400 mt-1">{sub}</p>}
    </div>
  );
}

export function AdminDashboard({ user }: Props) {
  const [tx, setTx] = useState<{ rows: SalesTransaction[]; error: string | null; missingTable: boolean } | null>(null);
  const [ledger, setLedger] = useState<{ rows: FinancialRecord[]; error: string | null; missingTable: boolean } | null>(null);
  const [month, setMonth] = useState('all');
  const [txQuery, setTxQuery] = useState('');
  const [ledgerQuery, setLedgerQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    setRefreshing(true);
    const [t, l] = await Promise.all([fetchSalesTransactions(), fetchFinancialRecords()]);
    setTx(t);
    setLedger(l);
    setRefreshing(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const months = useMemo(() => {
    const set = new Set((tx?.rows ?? []).map((r) => monthKey(r.transaction_date)));
    return Array.from(set).sort().reverse();
  }, [tx]);

  const filteredTx = useMemo(
    () =>
      (tx?.rows ?? []).filter((r) => {
        const inMonth = month === 'all' || monthKey(r.transaction_date) === month;
        const q = txQuery.trim().toLowerCase();
        const hit =
          !q ||
          [r.order_code, r.merchant_name, r.barangay, r.status, r.payment_method].some((v) =>
            (v ?? '').toLowerCase().includes(q),
          );
        return inMonth && hit;
      }),
    [tx, month, txQuery],
  );

  const filteredLedger = useMemo(
    () =>
      (ledger?.rows ?? []).filter((r) => {
        const q = ledgerQuery.trim().toLowerCase();
        return (
          !q ||
          [r.account_code, r.account_name, r.category, r.description, r.reference].some((v) =>
            (v ?? '').toLowerCase().includes(q),
          )
        );
      }),
    [ledger, ledgerQuery],
  );

  const kpi = useMemo(() => {
    const gross = filteredTx.reduce((a, r) => a + Number(r.gross_amount || 0), 0);
    const commission = filteredTx.reduce((a, r) => a + Number(r.commission_amount || 0), 0);
    const net = filteredTx.reduce((a, r) => a + Number(r.net_amount || 0), 0);
    const debits = filteredLedger.reduce((a, r) => a + Number(r.debit || 0), 0);
    const credits = filteredLedger.reduce((a, r) => a + Number(r.credit || 0), 0);
    return { gross, commission, net, debits, credits, balance: debits - credits, count: filteredTx.length };
  }, [filteredTx, filteredLedger]);

  const monthly = useMemo(() => {
    const map = new Map<string, { count: number; gross: number; commission: number; net: number }>();
    for (const r of tx?.rows ?? []) {
      const k = monthKey(r.transaction_date);
      const cur = map.get(k) ?? { count: 0, gross: 0, commission: 0, net: 0 };
      cur.count += 1;
      cur.gross += Number(r.gross_amount || 0);
      cur.commission += Number(r.commission_amount || 0);
      cur.net += Number(r.net_amount || 0);
      map.set(k, cur);
    }
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [tx]);

  const setupNeeded = Boolean(tx?.missingTable || ledger?.missingTable);
  const fetchError =
    (tx?.error && !tx.missingTable ? tx.error : null) ??
    (ledger?.error && !ledger.missingTable ? ledger.error : null);

  const scopeLabel = month === 'all' ? 'All time' : monthLabel(month);

  return (
    <div className="min-h-screen bg-corporate-50">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-corporate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <img src="/logo-mark.png" alt="ReDirection Innovations Inc" className="h-9 w-auto" />
            <div className="min-w-0">
              <h1 className="text-base font-bold text-corporate-900 leading-tight truncate">Admin Console</h1>
              <p className="text-[11px] text-corporate-500 leading-tight truncate">
                Book of Accounts · Sales &amp; Transaction Summaries
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-corporate-50 border border-corporate-200 text-xs font-medium text-corporate-700">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              {user.email}
            </span>
            <button
              type="button"
              onClick={() => void load()}
              aria-label="Refresh data"
              className="w-9 h-9 rounded-lg bg-corporate-50 border border-corporate-200 text-corporate-600 hover:text-redirection-600 hover:border-redirection-300 transition-colors flex items-center justify-center"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => void adminSignOut()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-corporate-900 text-white text-sm font-semibold hover:bg-redirection-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {setupNeeded && (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 flex items-start gap-3" role="alert">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800 leading-relaxed">
              <p className="font-bold mb-1">Database setup required</p>
              <p>
                The admin tables do not exist yet. Open your Supabase Dashboard → SQL Editor and run{' '}
                <code className="font-mono text-xs bg-amber-100 px-1.5 py-0.5 rounded">supabase/admin_setup.sql</code>, then
                register your login in <code className="font-mono text-xs bg-amber-100 px-1.5 py-0.5 rounded">admin_users</code> and
                refresh this page.
              </p>
            </div>
          </div>
        )}
        {fetchError && (
          <div className="rounded-2xl border border-red-300 bg-red-50 px-5 py-4 flex items-start gap-3" role="alert">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-sm text-red-800 leading-relaxed">
              <p className="font-bold mb-1">Could not load records</p>
              <p>{fetchError}</p>
              <p className="mt-1 text-xs">
                If this mentions row-level security or permissions, make sure your user is registered in the{' '}
                <code className="font-mono">admin_users</code> table (see supabase/admin_setup.sql step 4).
              </p>
            </div>
          </div>
        )}

        {/* KPI cards */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-corporate-900">Financial Overview</h2>
            <span className="text-xs font-semibold uppercase tracking-wider text-corporate-500">{scopeLabel}</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <Kpi label="Gross Sales" value={peso(kpi.gross)} sub={scopeLabel} icon={<TrendingUp className="w-4 h-4" />} />
            <Kpi label="Commission" value={peso(kpi.commission)} sub="Company earnings" icon={<Wallet className="w-4 h-4" />} />
            <Kpi label="Net Sales" value={peso(kpi.net)} sub="After commission" icon={<Receipt className="w-4 h-4" />} />
            <Kpi label="Transactions" value={String(kpi.count)} sub="Matching filter" icon={<Store className="w-4 h-4" />} />
            <Kpi label="Ledger Debits" value={peso(kpi.debits)} sub="Book of Accounts" icon={<BookOpen className="w-4 h-4" />} />
            <Kpi label="Net Position" value={peso(kpi.balance)} sub="Debits − Credits" icon={<Scale className="w-4 h-4" />} />
          </div>
        </section>

        {/* Period filter */}
        <section className="bg-white rounded-2xl border border-corporate-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <label className="flex items-center gap-3 text-sm font-semibold text-corporate-700">
            Period
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="rounded-xl border border-corporate-200 bg-corporate-50 px-3 py-2 text-sm font-medium text-corporate-900 focus:outline-none focus:ring-2 focus:ring-redirection-500"
            >
              <option value="all">All time</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {monthLabel(m)}
                </option>
              ))}
            </select>
          </label>
          <p className="text-xs text-corporate-400 sm:ml-auto">
            The overview cards and the transactions table follow this period filter.
          </p>
        </section>

        {/* Monthly summary */}
        <section className="bg-white rounded-2xl border border-corporate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-corporate-100">
            <h2 className="text-lg font-bold text-corporate-900">Monthly Sales Summary</h2>
            <p className="text-xs text-corporate-500 mt-0.5">Aggregated per month from sales_transactions (all time).</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-corporate-50 text-left text-xs uppercase tracking-wider text-corporate-500">
                  <th className="px-5 py-3 font-semibold">Month</th>
                  <th className="px-5 py-3 font-semibold text-right">Transactions</th>
                  <th className="px-5 py-3 font-semibold text-right">Gross</th>
                  <th className="px-5 py-3 font-semibold text-right">Commission</th>
                  <th className="px-5 py-3 font-semibold text-right">Net</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-corporate-100">
                {monthly.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-corporate-400">
                      No sales transactions recorded yet.
                    </td>
                  </tr>
                ) : (
                  monthly.map(([m, v]) => (
                    <tr key={m} className="hover:bg-corporate-50/60 transition-colors">
                      <td className="px-5 py-3 font-semibold text-corporate-900">{monthLabel(m)}</td>
                      <td className="px-5 py-3 text-right text-corporate-700">{v.count}</td>
                      <td className="px-5 py-3 text-right text-corporate-700">{peso(v.gross)}</td>
                      <td className="px-5 py-3 text-right text-redirection-600 font-semibold">{peso(v.commission)}</td>
                      <td className="px-5 py-3 text-right text-corporate-700">{peso(v.net)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
        {/* Transactions */}
        <section className="bg-white rounded-2xl border border-corporate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-corporate-100 flex flex-col sm:flex-row sm:items-center gap-3">
            <div>
              <h2 className="text-lg font-bold text-corporate-900">Sales Transactions</h2>
              <p className="text-xs text-corporate-500 mt-0.5">
                {filteredTx.length} record{filteredTx.length === 1 ? '' : 's'} · {scopeLabel}
              </p>
            </div>
            <div className="sm:ml-auto flex items-center gap-2">
              <input
                type="search"
                value={txQuery}
                onChange={(e) => setTxQuery(e.target.value)}
                placeholder="Search order, merchant, barangay…"
                className="rounded-xl border border-corporate-200 bg-corporate-50 px-3 py-2 text-sm text-corporate-900 placeholder-corporate-400 focus:outline-none focus:ring-2 focus:ring-redirection-500 w-full sm:w-64"
              />
              <button
                type="button"
                onClick={() =>
                  downloadCsv(
                    `sales-transactions-${month === 'all' ? 'all-time' : month}.csv`,
                    ['Date', 'Order Code', 'Merchant', 'Barangay', 'Gross', 'Commission', 'Net', 'Payment', 'Status'],
                    filteredTx.map((r) => [
                      r.transaction_date, r.order_code ?? '', r.merchant_name ?? '', r.barangay ?? '',
                      r.gross_amount, r.commission_amount, r.net_amount, r.payment_method ?? '', r.status,
                    ]),
                  )
                }
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-corporate-200 text-sm font-semibold text-corporate-700 hover:border-redirection-300 hover:text-redirection-600 transition-colors shrink-0"
              >
                <Download className="w-4 h-4" />
                CSV
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-corporate-50 text-left text-xs uppercase tracking-wider text-corporate-500">
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Order</th>
                  <th className="px-5 py-3 font-semibold">Merchant</th>
                  <th className="px-5 py-3 font-semibold text-right">Gross</th>
                  <th className="px-5 py-3 font-semibold text-right">Commission</th>
                  <th className="px-5 py-3 font-semibold text-right">Net</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-corporate-100">
                {filteredTx.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-corporate-400">
                      No transactions match the current filter.
                    </td>
                  </tr>
                ) : (
                  filteredTx.map((r) => (
                    <tr key={r.id} className="hover:bg-corporate-50/60 transition-colors">
                      <td className="px-5 py-3 whitespace-nowrap text-corporate-700">{dateLabel(r.transaction_date)}</td>
                      <td className="px-5 py-3 font-mono text-xs text-corporate-600">{r.order_code ?? '—'}</td>
                      <td className="px-5 py-3 text-corporate-900 font-medium">
                        {r.merchant_name ?? '—'}
                        {r.barangay && <span className="block text-xs text-corporate-400 font-normal">{r.barangay}</span>}
                      </td>
                      <td className="px-5 py-3 text-right text-corporate-700">{peso(r.gross_amount)}</td>
                      <td className="px-5 py-3 text-right text-redirection-600 font-semibold">{peso(r.commission_amount)}</td>
                      <td className="px-5 py-3 text-right text-corporate-700">{peso(r.net_amount)}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold capitalize ${statusClass(r.status)}`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Book of Accounts ledger */}
        <section className="bg-white rounded-2xl border border-corporate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-corporate-100 flex flex-col sm:flex-row sm:items-center gap-3">
            <div>
              <h2 className="text-lg font-bold text-corporate-900">Book of Accounts — General Ledger</h2>
              <p className="text-xs text-corporate-500 mt-0.5">
                {filteredLedger.length} entr{filteredLedger.length === 1 ? 'y' : 'ies'} · financial_records
              </p>
            </div>
            <div className="sm:ml-auto flex items-center gap-2">
              <input
                type="search"
                value={ledgerQuery}
                onChange={(e) => setLedgerQuery(e.target.value)}
                placeholder="Search account, code, reference…"
                className="rounded-xl border border-corporate-200 bg-corporate-50 px-3 py-2 text-sm text-corporate-900 placeholder-corporate-400 focus:outline-none focus:ring-2 focus:ring-redirection-500 w-full sm:w-64"
              />
              <button
                type="button"
                onClick={() =>
                  downloadCsv(
                    'book-of-accounts.csv',
                    ['Date', 'Account Code', 'Account', 'Category', 'Description', 'Reference', 'Debit', 'Credit'],
                    filteredLedger.map((r) => [
                      r.entry_date, r.account_code, r.account_name, r.category,
                      r.description ?? '', r.reference ?? '', r.debit, r.credit,
                    ]),
                  )
                }
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-corporate-200 text-sm font-semibold text-corporate-700 hover:border-redirection-300 hover:text-redirection-600 transition-colors shrink-0"
              >
                <Download className="w-4 h-4" />
                CSV
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-corporate-50 text-left text-xs uppercase tracking-wider text-corporate-500">
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Code</th>
                  <th className="px-5 py-3 font-semibold">Account</th>
                  <th className="px-5 py-3 font-semibold">Category</th>
                  <th className="px-5 py-3 font-semibold">Reference</th>
                  <th className="px-5 py-3 font-semibold text-right">Debit</th>
                  <th className="px-5 py-3 font-semibold text-right">Credit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-corporate-100">
                {filteredLedger.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-corporate-400">
                      No ledger entries recorded yet.
                    </td>
                  </tr>
                ) : (
                  filteredLedger.map((r) => (
                    <tr key={r.id} className="hover:bg-corporate-50/60 transition-colors">
                      <td className="px-5 py-3 whitespace-nowrap text-corporate-700">{dateLabel(r.entry_date)}</td>
                      <td className="px-5 py-3 font-mono text-xs text-corporate-600">{r.account_code}</td>
                      <td className="px-5 py-3 text-corporate-900 font-medium">
                        {r.account_name}
                        {r.description && <span className="block text-xs text-corporate-400 font-normal">{r.description}</span>}
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-corporate-100 text-corporate-700">
                          {r.category}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-mono text-xs text-corporate-600">{r.reference ?? '—'}</td>
                      <td className="px-5 py-3 text-right text-corporate-700">{r.debit ? peso(r.debit) : '—'}</td>
                      <td className="px-5 py-3 text-right text-corporate-700">{r.credit ? peso(r.credit) : '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
              {filteredLedger.length > 0 && (
                <tfoot>
                  <tr className="bg-corporate-50 font-bold text-corporate-900">
                    <td colSpan={5} className="px-5 py-3 text-right uppercase text-xs tracking-wider">Totals</td>
                    <td className="px-5 py-3 text-right">{peso(kpi.debits)}</td>
                    <td className="px-5 py-3 text-right">{peso(kpi.credits)}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </section>
      </main>

      <footer className="border-t border-corporate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-corporate-400">
          <p>Restricted area — Redirection Innovation Inc. All access is authenticated and logged by Supabase.</p>
          <p>Data source: Supabase · sales_transactions &amp; financial_records (RLS-protected)</p>
        </div>
      </footer>
    </div>
  );
}