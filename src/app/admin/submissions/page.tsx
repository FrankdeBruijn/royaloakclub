"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import Link from 'next/link'

type Submission = {
  id: number
  modelnaam: string | null
  model_id: string | null
  type: string | null
  geslacht: string | null
  materiaal: string | null
  movement: string | null
  type_uurwerk: string | null
  productie_status: string | null
  diameter_kast: string | null
  jaar_geintroduceerd: number | null
  prijs_euro: string | null
  prijs_dollar: string | null
  description: string | null
  image: string | null
  ingediend_door: string | null
  status: string
  created_at: string
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<number | null>(null)
  const supabase = createClient()

  useEffect(() => { loadSubmissions() }, [])

  async function loadSubmissions() {
    setLoading(true)
    const { data } = await supabase
      .from('submissions')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    setSubmissions(data || [])
    setLoading(false)
  }

  async function getImageUrl(filename: string) {
    const { data } = await supabase.storage.from('submissions').createSignedUrl(filename, 3600)
    return data?.signedUrl || null
  }

  async function handleApprove(submission: Submission) {
    setProcessing(submission.id)
    const res = await fetch('/api/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submission })
    })
    if (res.ok) {
      setSubmissions(prev => prev.filter(s => s.id !== submission.id))
    }
    setProcessing(null)
  }

  async function handleReject(id: number) {
    setProcessing(id)
    await supabase.from('submissions').update({ status: 'rejected' }).eq('id', id)
    setSubmissions(prev => prev.filter(s => s.id !== id))
    setProcessing(null)
  }

  return (
    <main className="min-h-screen bg-[#F8F6F2]">
      <nav className="sticky top-0 z-50 px-10 py-5 flex justify-between items-center bg-white/95 backdrop-blur border-b border-[#E8E2D9]">
        <Link href="/" className="font-serif text-xl tracking-[0.15em] text-[#1A1A1A]">ROYAL OAK CLUB</Link>
        <Link href="/admin" className="text-[11px] tracking-[0.2em] uppercase text-[#888] hover:text-[#C9A84C] transition-colors">← Back to Admin</Link>
      </nav>

      <div className="px-10 py-12 max-w-5xl">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#C9A84C] mb-2">Admin</p>
        <div className="flex items-end justify-between mb-10">
          <div>
            <h1 className="font-serif text-4xl font-light mb-2">Submissions</h1>
            <p className="text-[11px] text-[#AAA]">Beoordeel ingezonden horloges</p>
          </div>
          {!loading && (
            <div className="text-right">
              <p className="font-serif text-3xl text-[#C9A84C]">{submissions.length}</p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#AAA]">in afwachting</p>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-32">
            <p className="font-serif text-2xl text-[#CCC] mb-3">Geen inzendingen</p>
            <p className="text-[11px] text-[#AAA]">Nieuwe submissions verschijnen hier automatisch.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {submissions.map(s => (
              <SubmissionCard
                key={s.id}
                submission={s}
                processing={processing === s.id}
                onApprove={() => handleApprove(s)}
                onReject={() => handleReject(s.id)}
                getImageUrl={getImageUrl}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

function SubmissionCard({ submission: s, processing, onApprove, onReject, getImageUrl }: {
  submission: Submission
  processing: boolean
  onApprove: () => void
  onReject: () => void
  getImageUrl: (f: string) => Promise<string | null>
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    if (s.image) getImageUrl(s.image).then(url => setImageUrl(url))
  }, [s.image])

  const date = new Date(s.created_at).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="bg-white rounded-xl border border-[#E8E2D9] overflow-hidden">
      <div className="px-6 py-4 bg-[#FAFAF8] border-b border-[#E8E2D9] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="px-2 py-1 bg-amber-50 text-amber-600 text-[10px] tracking-[0.2em] uppercase rounded">Pending</span>
          <span className="text-sm font-medium text-[#1A1A1A]">{s.modelnaam || '—'}</span>
          <span className="font-mono text-sm text-[#C9A84C]">{s.model_id || '—'}</span>
        </div>
        <span className="text-[10px] text-[#AAA]">{date}</span>
      </div>

      <div className="p-6 grid grid-cols-4 gap-6">
        <div className="col-span-1">
          <div className="aspect-square bg-[#F8F6F2] rounded-lg overflow-hidden flex items-center justify-center">
            {imageUrl ? (
              <img src={imageUrl} alt="" className="object-contain p-3 w-full h-full" />
            ) : (
              <span className="text-[10px] text-[#DDD]">Geen foto</span>
            )}
          </div>
        </div>

        <div className="col-span-2 grid grid-cols-2 gap-3 content-start">
          {[
            ['Materiaal', s.materiaal],
            ['Geslacht', s.geslacht],
            ['Caliber', s.type_uurwerk],
            ['Movement', s.movement],
            ['Diameter', s.diameter_kast ? `${s.diameter_kast}mm` : null],
            ['Jaar', s.jaar_geintroduceerd],
            ['Status', s.productie_status],
            ['Prijs EU', s.prijs_euro ? `€${s.prijs_euro}` : null],
          ].filter(([, v]) => v).map(([label, value]) => (
            <div key={label as string}>
              <p className="text-[9px] tracking-[0.15em] uppercase text-[#AAA] mb-0.5">{label}</p>
              <p className="text-sm text-[#1A1A1A]">{String(value)}</p>
            </div>
          ))}
          {s.ingediend_door && (
            <div className="col-span-2">
              <p className="text-[9px] tracking-[0.15em] uppercase text-[#AAA] mb-0.5">Ingediend door</p>
              <p className="text-sm text-[#1A1A1A]">{s.ingediend_door}</p>
            </div>
          )}
        </div>

        <div className="col-span-1 flex flex-col justify-between">
          {s.description && (
            <div className="mb-4">
              <p className="text-[9px] tracking-[0.15em] uppercase text-[#AAA] mb-1">Beschrijving</p>
              <p className="text-xs text-[#555] leading-relaxed line-clamp-6">{s.description}</p>
            </div>
          )}
          <div className="flex flex-col gap-2 mt-auto">
            <button onClick={onApprove} disabled={processing} className="w-full py-2.5 bg-green-500 text-white text-[10px] tracking-[0.2em] uppercase hover:bg-green-600 transition-colors disabled:opacity-50 rounded-sm">
              {processing ? '...' : '✓ Goedkeuren'}
            </button>
            <button onClick={onReject} disabled={processing} className="w-full py-2.5 border border-red-200 text-red-400 text-[10px] tracking-[0.2em] uppercase hover:bg-red-50 transition-colors disabled:opacity-50 rounded-sm">
              {processing ? '...' : '✕ Afwijzen'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
