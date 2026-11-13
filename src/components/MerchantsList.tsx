import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'
import { Loader2 } from 'lucide-react'

interface Merchant {
  id: string
  name?: string | null
  merchant_name?: string | null
  merchant_code?: string | null
  category_type?: string | null
  cuisine_type?: string | null
  barangay?: string | null
  address?: string | null
  rating?: number | string | null
  eta_minutes?: number | null
  is_open?: boolean | null
  is_active?: boolean | null
  created_at?: string | null
}

export function MerchantsList() {
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const client = supabase
    if (!client) {
      setLoading(false)
      setError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.')
      return
    }

    async function fetchMerchants(db: SupabaseClient) {
      setLoading(true)
      setError(null)
      try {
        const { data, error: supaError } = await db
          .from('merchants')
          .select('*')
          .order('created_at', { ascending: false })

        if (supaError) throw supaError
        setMerchants((data as Merchant[] | null) || [])
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error fetching merchants')
      } finally {
        setLoading(false)
      }
    }

    fetchMerchants(client)

    // Real-time subscription
    const channel = client
      .channel('merchants_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'merchants' },
        () => fetchMerchants(client)
      )
      .subscribe()

    return () => {
      client.removeChannel(channel)
    }
  }, [])

  return (
    <section className="py-12 bg-white">
      <div className="section-container max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Registered Merchants
          </h2>
          <p className="text-slate-600">Number of registered merchants: {merchants.length}</p>
        </div>

        {loading && (
          <div className="h-96 flex items-center justify-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p>Loading merchants...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-red-800 mb-8">
            <p>{error}</p>
          </div>
        )}

        {loading || error || merchants.length === 0 ? null : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left text-sm font-medium text-slate-600 py-3 px-4">Merchant</th>
                  <th className="text-left text-sm font-medium text-slate-600 py-3 px-4">Category</th>
                  <th className="text-left text-sm font-medium text-slate-600 py-3 px-4">Location</th>
                  <th className="text-left text-sm font-medium text-slate-600 py-3 px-4">Rating / ETA</th>
                  <th className="text-left text-sm font-medium text-slate-600 py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {merchants.map((m) => {
                  const displayName = m.name || m.merchant_name || 'Unknown merchant'
                  const category = m.category_type || m.cuisine_type || '—'
                  const location = [m.barangay, m.address].filter(Boolean).join(', ') || '—'
                  const ratingNum = typeof m.rating === 'number' ? m.rating : parseFloat(String(m.rating ?? '0')) || 0
                  const open = Boolean(m.is_open)
                  const active = Boolean(m.is_active)
                  return (
                    <tr key={m.id} className="border-b border-slate-100">
                      <td className="text-left py-3 px-4">
                        <p className="font-medium text-slate-900">{displayName}</p>
                        {m.merchant_code ? (
                          <p className="text-xs text-slate-400">{m.merchant_code}</p>
                        ) : null}
                      </td>
                      <td className="text-left py-3 px-4 text-slate-600">{category}</td>
                      <td className="text-left py-3 px-4 text-slate-600">{location}</td>
                      <td className="text-left py-3 px-4 text-slate-600">
                        ⭐ {ratingNum.toFixed(1)} · {m.eta_minutes ?? '—'} min
                      </td>
                      <td className="text-left py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            active && open
                              ? 'bg-green-100 text-green-700'
                              : active
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {active && open ? 'Open' : active ? 'Active · Closed' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
