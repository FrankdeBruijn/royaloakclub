"use client"

import { useState } from 'react'
import Link from 'next/link'

export default function FeedbackPage() {
  const [message, setMessage] = useState('')
  const [context, setContext] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (honeypot) return
    if (!message.trim()) { setError('Vul even in wat je wilt melden.'); return }
    setSubmitting(true)
    setError('')
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, context, honeypot }),
    })
    if (res.ok) { setDone(true) } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Er ging iets mis, probeer het nog eens.')
    }
    setSubmitting(false)
  }

  if (done) return (
    <main className="min-h-screen bg-[#F8F6F2] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-50 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h1 className="font-serif text-3xl font-light mb-3">Bedankt!</h1>
        <p className="text-sm text-[#888] mb-8">We hebben je melding ontvangen en pakken hem op.</p>
        <Link href="/" className="text-[11px] tracking-[0.2em] uppercase text-[#C9A84C] hover:text-[#B8973B] transition-colors">← Terug naar de site</Link>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#F8F6F2] text-[#1A1A1A]">
      <nav className="sticky top-0 z-50 px-6 md:px-10 py-5 flex justify-between items-center bg-white/95 backdrop-blur border-b border-[#E8E2D9]">
        <Link href="/" className="font-serif text-xl tracking-[0.15em] text-[#1A1A1A]">ROYAL OAK CLUB</Link>
        <Link href="/" className="text-[11px] tracking-[0.2em] uppercase text-[#888] hover:text-[#C9A84C] transition-colors">← Terug</Link>
      </nav>

      <div className="px-6 md:px-10 py-12 max-w-xl mx-auto">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#C9A84C] mb-2">Feedback</p>
        <h1 className="font-serif text-4xl font-light mb-3">Iets gezien dat niet klopt?</h1>
        <p className="text-sm text-[#888] mb-10">Typ hieronder wat je opvalt — een verkeerde foto, iets dat niet werkt, een idee. Hoeft geen volledige zin te zijn.</p>

        <div className="bg-white rounded-xl border border-[#E8E2D9] p-6 md:p-8">
          <input type="text" value={honeypot} onChange={e => setHoneypot(e.target.value)} style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

          <label className="text-[10px] tracking-[0.2em] uppercase text-[#AAA] block mb-2">Wat wil je melden?</label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Bijv.: bij de Diver staat de achterkant als foto..."
            rows={6}
            autoFocus
            className="w-full px-4 py-3 border border-[#E8E2D9] focus:border-[#C9A84C] outline-none bg-[#FAFAF8] text-[#1A1A1A] transition-colors text-base resize-none mb-5"
          />

          <label className="text-[10px] tracking-[0.2em] uppercase text-[#AAA] block mb-2">Welke pagina of horloge? (optioneel)</label>
          <input
            type="text"
            value={context}
            onChange={e => setContext(e.target.value)}
            placeholder="Plak een link, of typ de referentie"
            className="w-full px-4 py-3 border border-[#E8E2D9] focus:border-[#C9A84C] outline-none bg-[#FAFAF8] text-[#1A1A1A] transition-colors text-sm mb-6"
          />

          {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

          <button onClick={handleSubmit} disabled={submitting}
            className="w-full py-4 bg-[#C9A84C] text-white text-[11px] tracking-[0.2em] uppercase hover:bg-[#B8973B] transition-colors disabled:opacity-50">
            {submitting ? 'Versturen...' : 'Versturen'}
          </button>
        </div>
      </div>
    </main>
  )
}
