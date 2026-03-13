"use client"

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase-browser'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const PAGE_SIZE = 50

export default function AdminPage() {
  const [watches, setWatches] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/login')
      else setUser(user)
    })
  }, [])

  const fetchWatches = useCallback(async () => {
    setLoading(true)
    let query = supabase.from('watches').select('*', { count: 'exact' })
    if (search) query = query.or(`modelnaam.ilike.%${search}%,model_id.ilike.%${search}%,type_uurwerk.ilike.%${search}%`)
    const { data, count } = await query.order('id', { ascending: false }).range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)
    setWatches(data || [])
    setTotal(count || 0)
    setLoading(false)
  }, [search, page])

  useEffect(() => { setPage(0) }, [search])
  useEffect(() => { if (user) fetchWatches() }, [fetchWatches, user])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <main className="min-h-screen bg-[#F8F6F2]">
      <nav className="sticky top-0 z-50 px-10 py-5 flex justify-between items-center bg-white/95 backdrop-blur border-b border-[#E8E2D9]">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-serif text-xl tracking-[0.15em] text-[#1A1A1A]">ROYAL OAK CLUB</Link>
          <span className="text-[10px] tracking-[0.2em] uppercase px-3 py-1 bg-[#C9A84C]/10 text-[#C9A84C] rounded-sm">Admin</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-[11px] text-[#AAA]">{user?.email}</span>
          <button onClick={handleSignOut} className="text-[10px] tracking-[0.2em] uppercase text-[#888] hover:text-red-500 transition-colors">Sign out</button>
        </div>
      </nav>

      <div className="px-10 py-12">
        <div className="flex justify-between items-end mb-8 pb-8 border-b border-[#E8E2D9]">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#C9A84C] mb-2">Admin Dashboard</p>
            <h1 className="font-serif text-4xl font-light">
              Manage Watches <span className="font-mono text-2xl text-[#CCC] ml-3">{total}</span>
            </h1>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/duplicates" className="px-6 py-3 border border-[#E8E2D9] text-[#888] text-[11px] tracking-[0.2em] uppercase hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors rounded-sm">⊘ Find Duplicates</Link>
            <Link href="/admin/watch/new" className="px-6 py-3 bg-[#C9A84C] text-white text-[11px] tracking-[0.2em] uppercase hover:bg-[#B8973B] transition-colors rounded-sm">+ Add Watch</Link>
          </div>
        </div>
        {/* SEARCH */}
        <div className="flex border border-[#D0C9BC] focus-within:border-[#C9A84C] transition-colors bg-white max-w-xl mb-6">
          <span className="px-4 flex items-center text-[#CCC]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search model, reference, caliber..."
            className="flex-1 bg-transparent py-3 text-sm placeholder-[#CCC] outline-none text-[#1A1A1A]"
          />
          {search && <button onClick={() => setSearch('')} className="px-4 text-[#CCC] hover:text-[#1A1A1A]">✕</button>}
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl border border-[#E8E2D9] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E8E2D9]">
                {['ID', 'Model', 'Reference', 'Type', 'Year', 'Status', 'Image', ''].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-[9px] tracking-[0.2em] uppercase text-[#AAA]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} className="border-b border-[#F0EDE8]">
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j} className="px-6 py-4"><div className="h-3 bg-[#F0EDE8] rounded animate-pulse w-3/4" /></td>
                      ))}
                    </tr>
                  ))
                : watches.map((w, i) => (
                    <tr key={w.id} className={`border-b border-[#F0EDE8] hover:bg-[#FAFAF8] transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#FDFCFB]'}`}>
                      <td className="px-6 py-4 font-mono text-[11px] text-[#AAA]">{w.id}</td>
                      <td className="px-6 py-4 font-serif text-sm text-[#1A1A1A]">{w.modelnaam || '—'}</td>
                      <td className="px-6 py-4 font-mono text-[11px] text-[#C9A84C]">{w.model_id || '—'}</td>
                      <td className="px-6 py-4 text-[11px] text-[#888]">{w.type?.replace('RoyalOak ', '') || '—'}</td>
                      <td className="px-6 py-4 text-[11px] text-[#888]">{w.jaar_geintroduceerd || '—'}</td>
                      <td className="px-6 py-4 text-[11px] text-[#888]">{w.productie_status || '—'}</td>
                      <td className="px-6 py-4">
                        {w.image
                          ? <span className="text-[10px] text-green-500">✓</span>
                          : <span className="text-[10px] text-[#DDD]">—</span>}
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/admin/watch/${w.id}/edit`} className="text-[10px] tracking-[0.15em] uppercase text-[#C9A84C] hover:text-[#B8973B] transition-colors">Edit →</Link>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {total > PAGE_SIZE && (
          <div className="flex justify-center gap-3 mt-8">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              className="text-[10px] tracking-[0.2em] uppercase px-6 py-3 border border-[#D0C9BC] text-[#888] hover:border-[#C9A84C] hover:text-[#C9A84C] disabled:opacity-30 transition-all bg-white rounded-sm">
              ← Prev
            </button>
            <span className="text-[10px] px-6 py-3 text-[#AAA] font-mono bg-white border border-[#E8E2D9] rounded-sm">
              {page + 1} / {Math.ceil(total / PAGE_SIZE)}
            </span>
            <button onClick={() => setPage(p => p + 1)} disabled={(page + 1) * PAGE_SIZE >= total}
              className="text-[10px] tracking-[0.2em] uppercase px-6 py-3 border border-[#D0C9BC] text-[#888] hover:border-[#C9A84C] hover:text-[#C9A84C] disabled:opacity-30 transition-all bg-white rounded-sm">
              Next →
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
