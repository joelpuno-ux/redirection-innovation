import { supabase } from './supabase';

export type SalesTransaction = {
  id: string;
  order_code: string | null;
  merchant_name: string | null;
  barangay: string | null;
  gross_amount: number;
  commission_rate: number;
  commission_amount: number;
  net_amount: number;
  payment_method: string | null;
  status: string;
  transaction_date: string;
  created_at: string;
};

export type FinancialRecord = {
  id: string;
  entry_date: string;
  account_code: string;
  account_name: string;
  category: string;
  description: string | null;
  reference: string | null;
  debit: number;
  credit: number;
  created_at: string;
};

export type FetchResult<T> = { rows: T[]; error: string | null; missingTable: boolean };

function isMissingTable(error: { message?: string; code?: string } | null): boolean {
  if (!error) return false;
  return error.code === '42P01' || /does not exist/i.test(error.message ?? '');
}

/** Sales / transaction summaries (admin-only via RLS). */
export async function fetchSalesTransactions(): Promise<FetchResult<SalesTransaction>> {
  if (!supabase) return { rows: [], error: 'Supabase is not configured.', missingTable: false };
  const { data, error } = await supabase
    .from('sales_transactions')
    .select('*')
    .order('transaction_date', { ascending: false })
    .limit(2000);
  if (error) return { rows: [], error: error.message, missingTable: isMissingTable(error) };
  return { rows: (data ?? []) as SalesTransaction[], error: null, missingTable: false };
}

/** Book of Accounts ledger entries (admin-only via RLS). */
export async function fetchFinancialRecords(): Promise<FetchResult<FinancialRecord>> {
  if (!supabase) return { rows: [], error: 'Supabase is not configured.', missingTable: false };
  const { data, error } = await supabase
    .from('financial_records')
    .select('*')
    .order('entry_date', { ascending: false })
    .limit(2000);
  if (error) return { rows: [], error: error.message, missingTable: isMissingTable(error) };
  return { rows: (data ?? []) as FinancialRecord[], error: null, missingTable: false };
}

export const peso = (n: number) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(n || 0);

export const monthKey = (d: string) => (d ?? '').slice(0, 7);

export const monthLabel = (key: string) => {
  const [y, m] = key.split('-').map(Number);
  if (!y || !m) return key;
  return new Date(y, m - 1).toLocaleString('en-PH', { month: 'long', year: 'numeric' });
};

export const dateLabel = (d: string) => {
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
};

/** Client-side CSV export para sa mga dashboard tables. */
export function downloadCsv(filename: string, header: string[], rows: (string | number)[][]) {
  const esc = (v: string | number) => {
    const s = String(v ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [header.map(esc).join(','), ...rows.map((r) => r.map(esc).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}