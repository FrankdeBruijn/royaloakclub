"use client"

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase-browser'
import Link from 'next/link'

type Feedback = {
  id: number
  message: string
  context: string | null
  status: string
  created_at: string
}

export default function FeedbackAdminPage() {
  const [items, setItems] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<number | null>(null)
  const supabase = createClient()

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  async function markDone(id: number) {
    setProcessing(id)
    await supabase.from('feedback').update({ status: 'done' }).eq('id', id)
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'done' } : i))
    setProcessing(null)
  }

  const pending = items.filter(i => i.status !== 'done')
  const done = items.filter(i => i.status === 'done')

  return (
    <main className="min-h-screen bg-[#F8F6F2]">
      <nav className="sticky top-0 z-50 px-10 py-5 flex justify-between items-center bg-white/95 backdrop-blur border-b border-[#E8E2D9]">
        <Link href="/" className="font-serif text-xl tracking-[0.15em] text-[#1A1A1A]">ROYAL OAK CLUB</Link>
        <Link href="/admin" className="text-[11px] tracking-[0.2em] uppercase text-[#888] hover:text-[#C9A84C] transition-colors">← Back to Admin</Link>
      </nav>

      <div className="px-10 py-12 max-w-3xl">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#C9A84C] mb-2">Admin</p>
        <div className="flex items-end justify-between mb-10">
          <div>
            <h1 className="font-serif text-4xl font-light mb-2">Feedback</h1>
            <p className="text-[11px] text-[#AAA]">Meldingen van klanten via het feedbackformulier</p>
          </div>
          {!loading && (
            <div className="text-right">
              <p className="font-serif text-3xl text-[#C9A84C]">{pending.length}</p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#AAA]">openstaand</p>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-32">
            <p className="font-serif text-2xl text-[#CCC] mb-3">Nog geen feedback</p>
          </div>
        ) : (
          <div className="space-y-4">
            {[...pending, ...done].map(item => (
              <div key={item.id} className={`bg-white rounded-xl border p-6 ${item.status === 'done' ? 'border-[#E8E2D9] opacity-50' : 'border-[#E8E2D9]'}`}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <span className={`text-[10px] tracking-[0.2em] uppercase px-2 py-1 rounded ${item.status === 'done' ? 'bg-[#F0EDE8] text-[#AAA]' : 'bg-amber-50 text-amber-600'}`}>
                    {item.status === 'done' ? 'Afgehandeld' : 'Nieuw'}
                  </span>
                  <span className="text-[10px] text-[#AAA] whitespace-nowrap">
                    {new Date(item.created_at).toLocaleString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-[#1A1A1A] leading-relaxed whitespace-pre-wrap mb-3">{item.message}</p>
                {item.context && <p className="text-xs text-[#888] mb-3">Context: {item.context}</p>}
                {item.status !== 'done' && (
                  <button onClick={() => markDone(item.id)} disabled={processing === item.id}
                    className="text-[10px] tracking-[0.2em] uppercase text-[#C9A84C] hover:text-[#B8973B] transition-colors disabled:opacity-50">
                    {processing === item.id ? '...' : '✓ Markeer als afgehandeld'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
