"use client"

import { useState } from 'react'
import Link from 'next/link'

const FIELDS = [
  { name: 'modelnaam', label: 'Model Name', placeholder: 'Royal Oak Date', span: true, required: true },
  { name: 'model_id', label: 'Reference Number', placeholder: '15500ST.OO.1220ST.01', required: true },
  { name: 'type', label: 'Type', placeholder: 'RoyalOak' },
  { name: 'geslacht', label: 'Gender', placeholder: 'Gent' },
  { name: 'materiaal', label: 'Case Material', placeholder: 'Steel' },
  { name: 'diameter_kast', label: 'Case Size (mm)', placeholder: '41' },
  { name: 'type_uurwerk', label: 'Caliber', placeholder: '4302' },
  { name: 'movement', label: 'Movement', placeholder: 'Automatic' },
  { name: 'productie_status', label: 'Status', placeholder: 'Current' },
  { name: 'jaar_geintroduceerd', label: 'Year Introduced', placeholder: '2021' },
  { name: 'prijs_euro', label: 'Price EU (€)', placeholder: '26500' },
  { name: 'prijs_dollar', label: 'Price USA ($)', placeholder: '28900' },
  { name: 'ingediend_door', label: 'Your Email (optional)', placeholder: 'your@email.com', span: true },
]

export default function SubmitPage() {
  const [form, setForm] = useState<Record<string, string>>({})
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [isHuman, setIsHuman] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  function handleFile(f: File) {
    setFile(f)
    const reader = new FileReader()
    reader.onload = e => setPreview(e.target?.result as string)
    reader.readAsDataURL(f)
  }

  async function handleSubmit() {
    if (honeypot) return
    if (!isHuman) { setError('Please confirm you are human.'); return }
    if (!form.modelnaam || !form.model_id) { setError('Model name and reference number are required.'); return }
    setSubmitting(true)
    setError('')

    const formData = new FormData()
    Object.entries(form).forEach(([k, v]) => formData.append(k, v))
    formData.append('description', description)
    if (file) formData.append('file', file)

    const res = await fetch('/api/submit', { method: 'POST', body: formData })
    const data = await res.json()
    if (res.ok) { setDone(true) } else { setError(data.error || 'Something went wrong.') }
    setSubmitting(false)
  }

  if (done) return (
    <main className="min-h-screen bg-[#F8F6F2] flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-50 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h1 className="font-serif text-3xl font-light mb-3">Thank you!</h1>
        <p className="text-sm text-[#888] mb-8">Your submission has been received and will be reviewed before being added to the archive.</p>
        <Link href="/" className="text-[11px] tracking-[0.2em] uppercase text-[#C9A84C] hover:text-[#B8973B] transition-colors">← Back to Archive</Link>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#F8F6F2] text-[#1A1A1A]">
      <nav className="sticky top-0 z-50 px-6 md:px-10 py-5 flex justify-between items-center bg-white/95 backdrop-blur border-b border-[#E8E2D9]">
        <Link href="/" className="font-serif text-xl tracking-[0.15em] text-[#1A1A1A]">ROYAL OAK CLUB</Link>
        <Link href="/database" className="text-[11px] tracking-[0.2em] uppercase text-[#888] hover:text-[#C9A84C] transition-colors">← Back to Archive</Link>
      </nav>

      <div className="px-6 md:px-10 py-12 max-w-5xl">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#C9A84C] mb-2">Community</p>
        <h1 className="font-serif text-4xl font-light mb-3">Submit a Watch</h1>
        <p className="text-sm text-[#888] mb-10">Know a Royal Oak that's missing from our archive? Submit it below and we'll review it for inclusion.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="col-span-1">
            <div className="bg-white rounded-xl border border-[#E8E2D9] p-6 flex flex-col items-center">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#AAA] mb-4">Photo</p>
              <div
                className="aspect-square w-full bg-[#F8F6F2] rounded-lg flex items-center justify-center overflow-hidden mb-4 cursor-pointer border-2 border-dashed border-transparent hover:border-[#C9A84C] transition-colors"
                onClick={() => document.getElementById('fileInput')?.click()}
                onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
                onDragOver={e => e.preventDefault()}
              >
                {preview ? (
                  <img src={preview} alt="Preview" className="object-contain p-4 w-full h-full" />
                ) : (
                  <div className="text-center p-4">
                    <div className="w-10 h-10 mx-auto opacity-20 mb-3">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    </div>
                    <p className="text-[10px] text-[#CCC]">Click or drag photo</p>
                    <p className="text-[9px] text-[#DDD] mt-1">Optional but recommended</p>
                  </div>
                )}
              </div>
              <input id="fileInput" type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
              <button onClick={() => document.getElementById('fileInput')?.click()} className="w-full py-2.5 border border-[#E8E2D9] text-[10px] tracking-[0.2em] uppercase text-[#888] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors">
                {file ? '✓ ' + file.name.substring(0, 20) : 'Choose Photo'}
              </button>
            </div>
          </div>

          <div className="col-span-2">
            <div className="bg-white rounded-xl border border-[#E8E2D9] overflow-hidden">
              <div className="px-8 py-5 border-b border-[#E8E2D9]">
                <h2 className="text-[10px] tracking-[0.3em] uppercase text-[#C9A84C]">Watch Information</h2>
              </div>
              <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                {/* Honeypot */}
                <input type="text" value={honeypot} onChange={e => setHoneypot(e.target.value)} style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
                {FIELDS.map(f => (
                  <div key={f.name} className={f.span ? 'col-span-2' : ''}>
                    <label className="text-[10px] tracking-[0.2em] uppercase text-[#AAA] block mb-2">
                      {f.label} {f.required && <span className="text-[#C9A84C]">*</span>}
                    </label>
                    <input
                      value={form[f.name] || ''}
                      onChange={e => setForm(prev => ({ ...prev, [f.name]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full px-4 py-3 border border-[#E8E2D9] focus:border-[#C9A84C] outline-none bg-[#FAFAF8] text-[#1A1A1A] transition-colors text-sm"
                    />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-[#AAA] block mb-2">Description</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Tell us something about this watch..." rows={4} className="w-full px-4 py-3 border border-[#E8E2D9] focus:border-[#C9A84C] outline-none bg-[#FAFAF8] text-[#1A1A1A] transition-colors text-sm resize-none" />
                </div>
              </div>
              {error && <p className="px-8 pb-4 text-sm text-red-400">{error}</p>}
              <div className="px-8 pt-4 border-t border-[#E8E2D9]">
                <label className="flex items-center gap-3 cursor-pointer mb-5" onClick={() => setIsHuman(!isHuman)}>
                  <div className={`w-5 h-5 border-2 flex items-center justify-center transition-colors flex-shrink-0 ${isHuman ? 'border-[#C9A84C] bg-[#C9A84C]' : 'border-[#DDD]'}`}>
                    {isHuman && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                  <span className="text-[11px] tracking-[0.1em] text-[#888]">I confirm I am a human and this information is correct to the best of my knowledge</span>
                </label>
              </div>
              <div className="px-8 pb-6">
                <button onClick={handleSubmit} disabled={submitting} className="px-8 py-3 bg-[#C9A84C] text-white text-[11px] tracking-[0.2em] uppercase hover:bg-[#B8973B] transition-colors disabled:opacity-50">
                  {submitting ? 'Submitting...' : 'Submit Watch'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
