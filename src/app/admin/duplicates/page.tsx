"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import Link from 'next/link'
import Image from 'next/image'

const STORAGE_URL = "https://tiinckbwtmwrmmpuhfsy.supabase.co/storage/v1/object/public/watch-images"

type Watch = {
  id: number
  modelnaam: string | null
  model_id: string | null
  materiaal: string | null
  image: string | null
  jaar_geintroduceerd: number | null
  type_uurwerk: string | null
  productie_status: string | null
}

type DuplicateGroup = {
  key: string
  watches: Watch[]
}

export default function DuplicatesPage() {
  const [groups, setGroups] = useState<DuplicateGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [deleted, setDeleted] = useState<Set<number>>(new Set())
  const supabase = createClient()

  useEffect(() => { loadDuplicates() }, [])

  async function loadDuplicates() {
    setLoading(true)
    const { data } = await supabase
      .from('watches')
      .select('id, modelnaam, model_id, materiaal, image, jaar_geintroduceerd, type_uurwerk, productie_status')
      .order('model_id')

    if (!data) { setLoading(false); return }

    const map = new Map<string, Watch[]>()
    for (const w of data) {
      const key = `${w.model_id ?? ""}|${w.modelnaam ?? ""}|${w.materiaal ?? ""}|${w.type_uurwerk ?? ""}|${w.geslacht ?? ""}`
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(w)
    }

    const dupes: DuplicateGroup[] = []
    map.forEach((watches, key) => {
      if (watches.length > 1) dupes.push({ key, watches })
    })

    dupes.sort((a, b) => b.watches.length - a.watches.length)
    setGroups(dupes)
    setLoading(false)
  }

  async function handleDelete(id: number) {
    setDeleting(id)
    await supabase.from('watches').delete().eq('id', id)
    setDeleted(prev => new Set([...prev, id]))
    setDeleting(null)
  }

  const totalDupes = groups.reduce((sum, g) => sum + g.watches.length - 1, 0)
  const visibleGroups = groups.map(g => ({
    ...g,
    watches: g.watches.filter(w => !deleted.has(w.id))
  })).filter(g => g.watches.length > 1)

  return (
    <main className="min-h-screen bg-[#F8F6F2]">
      <nav className="sticky top-0 z-50 px-10 py-5 flex justify-between items-center bg-white/95 backdrop-blur border-b border-[#E8E2D9]">
        <Link href="/" className="font-serif text-xl tracking-[0.15em] text-[#1A1A1A]">ROYAL OAK CLUB</Link>
        <Link href="/admin" className="text-[11px] tracking-[0.2em] uppercase text-[#888] hover:text-[#C9A84C] transition-colors">← Back to Admin</Link>
      </nav>

      <div className="px-10 py-12 max-w-6xl">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#C9A84C] mb-2">Admin</p>
        <div className="flex items-end justify-between mb-10">
          <div>
            <h1 className="font-serif text-4xl font-light mb-2">Duplicate Finder</h1>
            <p className="text-[11px] text-[#AAA]">Gebaseerd op zelfde Reference + Model + Materiaal</p>
          </div>
          {!loading && (
            <div className="text-right">
              <p className="font-serif text-3xl text-[#C9A84C]">{visibleGroups.length}</p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#AAA]">groepen • {totalDupes - deleted.size} duplicaten</p>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : visibleGroups.length === 0 ? (
          <div className="text-center py-32">
            <p className="font-serif text-2xl text-[#CCC] mb-3">Geen duplicaten gevonden</p>
            <p className="text-[11px] text-[#AAA]">De database ziet er schoon uit!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {visibleGroups.map(group => {
              const [modelId, modelnaam, materiaal, caliber, geslacht] = group.key.split('|')
              return (
                <div key={group.key} className="bg-white rounded-xl border border-[#E8E2D9] overflow-hidden">
                  <div className="px-6 py-4 bg-[#FAFAF8] border-b border-[#E8E2D9] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="px-2 py-1 bg-[#C9A84C]/10 text-[#C9A84C] text-[10px] tracking-[0.2em] uppercase rounded">
                        {group.watches.length}× duplicaat
                      </span>
                      <div>
                        <span className="text-sm font-medium text-[#1A1A1A]">{modelnaam || '—'}</span>
                        <span className="mx-2 text-[#DDD]">·</span>
                        <span className="font-mono text-sm text-[#C9A84C]">{modelId || '—'}</span>
                        <span className="mx-2 text-[#DDD]">·</span>
                        <span className="text-sm text-[#888]">{materiaal || '—'}</span>
                      </div>
                    </div>
                    <Link href={`/admin/watch/${group.watches[0].id}/edit`} className="text-[10px] tracking-[0.15em] uppercase text-[#AAA] hover:text-[#C9A84C] transition-colors">
                      Edit eerste →
                    </Link>
                  </div>

                  <div className="divide-y divide-[#F0EDE8]">
                    {group.watches.map((watch, i) => (
                      <div key={watch.id} className="flex items-center gap-6 px-6 py-4">
                        <div className="w-16 h-16 bg-[#F8F6F2] rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center">
                          {watch.image ? (
                            <Image src={`${STORAGE_URL}/${encodeURIComponent(watch.image)}`} alt="" width={64} height={64} className="object-contain p-1" unoptimized />
                          ) : (
                            <span className="text-[#DDD] text-[10px]">No img</span>
                          )}
                        </div>
                        <div className="flex-1 grid grid-cols-4 gap-4">
                          <div>
                            <p className="text-[9px] tracking-[0.15em] uppercase text-[#AAA] mb-1">ID</p>
                            <p className="text-sm font-mono text-[#1A1A1A]">#{watch.id}</p>
                          </div>
                          <div>
                            <p className="text-[9px] tracking-[0.15em] uppercase text-[#AAA] mb-1">Jaar</p>
                            <p className="text-sm text-[#1A1A1A]">{watch.jaar_geintroduceerd || '—'}</p>
                          </div>
                          <div>
                            <p className="text-[9px] tracking-[0.15em] uppercase text-[#AAA] mb-1">Caliber</p>
                            <p className="text-sm text-[#1A1A1A]">{watch.type_uurwerk || '—'}</p>
                          </div>
                          <div>
                            <p className="text-[9px] tracking-[0.15em] uppercase text-[#AAA] mb-1">Status</p>
                            <p className="text-sm text-[#1A1A1A]">{watch.productie_status || '—'}</p>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {watch.image ? <span className="text-[10px] text-green-500">✓ foto</span> : <span className="text-[10px] text-[#DDD]">geen foto</span>}
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {i === 0 && <span className="text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 bg-green-50 text-green-600 rounded">Bewaren</span>}
                          <Link href={`/admin/watch/${watch.id}/edit`} className="text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 border border-[#E8E2D9] text-[#888] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors rounded">Edit</Link>
                          <button onClick={() => handleDelete(watch.id)} disabled={deleting === watch.id} className="text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 border border-red-200 text-red-400 hover:bg-red-50 transition-colors rounded disabled:opacity-50">
                            {deleting === watch.id ? '...' : 'Verwijder'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
