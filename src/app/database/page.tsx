"use client"

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Watch } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

const STORAGE_URL = "https://tiinckbwtmwrmmpuhfsy.supabase.co/storage/v1/object/public/watch-images"
const TYPES = ['All', 'RoyalOak', 'RoyalOak OffShore', 'RoyalOak Lady', 'Concept', 'Pocketwatch']
const PAGE_SIZE = 48

const imageUrl = (path: string) => `${STORAGE_URL}/${path.split('/').map(encodeURIComponent).join('/')}`

const decodeHtml = (str: string | null | undefined): string => {
  if (!str) return ''
  return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
}

const getReference = (w: Watch): string => {
  return w.model_id || '—'
}

type WatchWithExtras = Watch & { extraImages: string[] }

const NoImagePlaceholder = () => (
  <div className="w-16 h-16 opacity-10">
    <svg viewBox="0 0 200 200" fill="none"><polygon points="70,5 130,5 195,70 195,130 130,195 70,195 5,130 5,70" stroke="#C9A84C" strokeWidth="2" fill="none" /></svg>
  </div>
)

// Probeert `srcs` op volgorde; als de hoofdfoto ontbreekt of niet laadt (kapotte
// link, verkeerd bestand) valt hij terug op de volgende foto uit watch_images
// in plaats van meteen "geen foto" te tonen.
function WatchImage({ srcs, alt }: { srcs: string[], alt: string }) {
  const [index, setIndex] = useState(0)
  if (index >= srcs.length) return <NoImagePlaceholder />
  return (
    <Image src={srcs[index]} alt={alt} width={200} height={200}
      className="object-contain group-hover:scale-105 transition-transform duration-500"
      unoptimized onError={() => setIndex(i => i + 1)} />
  )
}

export default function DatabasePage() {
  const [watches, setWatches] = useState<WatchWithExtras[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeType, setActiveType] = useState('All')
  const [page, setPage] = useState(0)
  const [showNoImage, setShowNoImage] = useState(false)
  // Blijft false tot de URL is uitgelezen, zodat fetchWatches niet één keer met
  // de (mogelijk verkeerde) beginwaarden en daarna nog eens met de juiste
  // waarden vuurt — twee gelijktijdige fetches waarvan de verkeerde als laatste
  // kan terugkomen en de juiste data overschrijft.
  const [ready, setReady] = useState(false)

  // Filters + paginanummer uit de URL lezen bij binnenkomst (ook via terugknop
  // vanaf een detailpagina), zodat je niet weer bij pagina 1 begint.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const type = params.get('type')
    const q = params.get('q')
    const p = parseInt(params.get('page') || '1', 10)
    const noimage = params.get('noimage') === '1'
    if (type && TYPES.includes(type)) setActiveType(type)
    if (q) setSearch(q)
    if (noimage) setShowNoImage(true)
    if (p > 1) setPage(p - 1)
    setReady(true)
  }, [])

  // ...en andersom: huidige filters + pagina terugschrijven naar de URL, zonder
  // een nieuwe history-entry toe te voegen (replaceState, geen router.push).
  useEffect(() => {
    if (!ready) return
    const params = new URLSearchParams()
    if (activeType !== 'All') params.set('type', activeType)
    if (search) params.set('q', search)
    if (showNoImage) params.set('noimage', '1')
    if (page > 0) params.set('page', String(page + 1))
    const qs = params.toString()
    const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname
    window.history.replaceState(null, '', url)
  }, [ready, activeType, search, showNoImage, page])

  const fetchWatches = useCallback(async () => {
    if (!ready) return
    setLoading(true)
    let query = supabase.from('watches').select('*', { count: 'exact' })
    if (activeType !== 'All') query = query.eq('type', activeType)
    if (search) query = query.or(`modelnaam.ilike.%${search}%,model_id.ilike.%${search}%,type_uurwerk.ilike.%${search}%`)
    if (!showNoImage) query = query.not('image', 'is', null)
    const { data, count } = await query.order('model_id').range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)
    const rows = data || []

    // Extra foto's voor deze pagina ophalen, als fallback voor als de hoofdfoto
    // ontbreekt of niet laadt (zie WatchImage hieronder).
    const ids = rows.map(w => w.id)
    const extrasByWatch: Record<number, string[]> = {}
    if (ids.length > 0) {
      const { data: extras } = await supabase
        .from('watch_images')
        .select('watch_id, filename')
        .in('watch_id', ids)
        .order('sort_order', { ascending: true })
      for (const img of extras || []) {
        (extrasByWatch[img.watch_id] ||= []).push(img.filename)
      }
    }

    setWatches(rows.map(w => ({ ...w, extraImages: extrasByWatch[w.id] || [] })))
    setTotal(count || 0)
    setLoading(false)
  }, [search, activeType, page, showNoImage, ready])

  useEffect(() => { fetchWatches() }, [fetchWatches])

  return (
    <main className="min-h-screen bg-[#F8F6F2] text-[#1A1A1A]">

      {/* NAV */}
      <nav className="sticky top-0 z-50 px-6 md:px-10 py-5 flex justify-between items-center bg-white/95 backdrop-blur border-b border-[#E8E2D9]">
        <Link href="/" className="font-serif text-xl tracking-[0.15em] text-[#1A1A1A]">ROYAL OAK CLUB</Link>
        <span className="text-[11px] tracking-[0.2em] uppercase text-[#C9A84C]">Archive</span>
      </nav>

      <div className="px-6 md:px-10 py-12">
        {/* HEADER */}
        <div className="flex justify-between items-end mb-10 pb-8 border-b border-[#E8E2D9]">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#C9A84C] mb-2">The Archive</p>
            <h1 className="font-serif text-3xl md:text-5xl font-light">
              All References
              <span className="font-mono text-xl md:text-2xl text-[#CCC] ml-3 md:ml-4">{loading ? '...' : total.toLocaleString()}</span>
            </h1>
          </div>
        </div>

        {/* SEARCH + FILTERS */}
        <div className="mb-10 space-y-4">
          <div className="flex border border-[#D0C9BC] focus-within:border-[#C9A84C] transition-colors bg-white max-w-2xl">
            <span className="px-5 flex items-center text-[#CCC]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </span>
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0) }}
              placeholder="Search name, reference, caliber..."
              className="flex-1 bg-transparent py-4 font-serif text-lg font-light placeholder-[#CCC] outline-none text-[#1A1A1A]"
            />
            {search && <button onClick={() => { setSearch(''); setPage(0) }} className="px-4 text-[#CCC] hover:text-[#1A1A1A]">✕</button>}
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            {TYPES.map(t => (
              <button key={t} onClick={() => { setActiveType(t); setPage(0) }}
                className={`text-[10px] tracking-[0.15em] uppercase px-4 py-2 border transition-all rounded-sm ${activeType === t ? 'border-[#C9A84C] text-[#C9A84C] bg-[#C9A84C]/5' : 'border-[#D0C9BC] text-[#888] hover:border-[#C9A84C] bg-white'}`}>
                {t}
              </button>
            ))}
            <button onClick={() => { setShowNoImage(v => !v); setPage(0) }}
              title={showNoImage ? 'Toont nu ook horloges zonder foto — klik om ze weer te verbergen' : 'Toont alleen horloges met foto — klik om ook horloges zonder foto te tonen'}
              className={`text-[10px] tracking-[0.15em] uppercase px-4 py-2 border transition-all rounded-sm flex items-center gap-2 ${showNoImage ? 'border-[#C9A84C] text-[#C9A84C] bg-[#C9A84C]/5' : 'border-[#D0C9BC] text-[#888] hover:border-[#C9A84C] bg-white'}`}>
              <span>{showNoImage ? '●' : '○'}</span>
              Show no-image
            </button>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
                  <div className="aspect-square bg-[#F0EDE8]" />
                  <div className="p-5 space-y-2">
                    <div className="h-3 bg-[#F0EDE8] rounded w-3/4" />
                    <div className="h-2 bg-[#F0EDE8] rounded w-1/2" />
                  </div>
                </div>
              ))
            : watches.length === 0
            ? (
                <div className="col-span-4 text-center py-32 text-[#AAA]">
                  <p className="font-serif text-2xl mb-2">No references found</p>
                  <p className="text-sm">Try a different search term</p>
                </div>
              )
            : watches.map(w => (
                <Link key={w.id} href={`/watch/${w.id}`} className="group bg-white rounded-xl overflow-hidden hover:shadow-lg hover:shadow-black/8 transition-all duration-300">
                  <div className="aspect-square bg-[#F8F6F2] flex items-center justify-center p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#C9A84C]/0 group-hover:bg-[#C9A84C]/3 transition-colors" />
                    {(() => {
                      const srcs = [
                        ...(w.image ? [imageUrl(w.image)] : []),
                        ...w.extraImages.map(f => imageUrl(f)),
                      ]
                      return srcs.length > 0
                        ? <WatchImage srcs={srcs} alt={w.modelnaam || 'Royal Oak'} />
                        : <NoImagePlaceholder />
                    })()}
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-serif text-sm leading-tight text-[#1A1A1A] min-w-0 line-clamp-2">{decodeHtml(w.modelnaam) || '—'}</h3>
                      <span className="text-[8px] tracking-[0.1em] uppercase px-1.5 py-0.5 bg-[#F0EDE8] text-[#999] rounded-sm ml-2 flex-shrink-0">{w.type?.replace('RoyalOak ', '') || '—'}</span>
                    </div>
                    <p className="font-mono text-[10px] text-[#C9A84C] mb-3 break-all">{getReference(w)}</p>
                    <div className="flex flex-col gap-0.5 text-[10px] text-[#BBB] border-t border-[#F0EDE8] pt-3 md:flex-row md:justify-between">
                      <span>{w.jaar_geintroduceerd ? `Year: ${w.jaar_geintroduceerd}` : '—'}</span>
                      <span>{w.diameter_kast ? `${w.diameter_kast}mm` : ''}</span>
                    </div>
                    {w.limited_edition && (
                      <div className="mt-2">
                        <span className="text-[9px] tracking-[0.15em] uppercase px-2 py-1 bg-[#1A1A1A] text-[#C9A84C] rounded-sm">Limited — {w.limited_edition.toLocaleString()} pieces</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
        </div>

        {/* PAGINATION */}
        {total > PAGE_SIZE && (
          <div className="flex justify-center gap-3 mt-12">
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
