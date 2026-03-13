"use client"

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const FIELDS = [
  { name: 'modelnaam', label: 'Model Name', placeholder: 'Royal Oak Date', span: true },
  { name: 'model_id', label: 'Reference Number', placeholder: '15500ST.OO.1220ST.01' },
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
]

export default function NewWatchPage() {
  const [form, setForm] = useState<Record<string, string>>({})
  const [image, setImage] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newId, setNewId] = useState<number | null>(null)
  const router = useRouter()
  const supabase = createClient()

  async function handleFile(file: File) {
    if (!newId) {
      alert('Sla eerst de basisgegevens op voordat je een foto uploadt.')
      return
    }
    setUploading(true)
    const reader = new FileReader()
    reader.onload = e => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('watchId', String(newId))

    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const data = await res.json()
    if (res.ok) setImage(data.filename)
    setUploading(false)
  }

  async function handleSave() {
    setSaving(true)
    const { data, error } = await supabase.from('watches').insert({
      modelnaam: form.modelnaam || null,
      model_id: form.model_id || null,
      type: form.type || null,
      geslacht: form.geslacht || null,
      materiaal: form.materiaal || null,
      movement: form.movement || null,
      type_uurwerk: form.type_uurwerk || null,
      productie_status: form.productie_status || null,
      diameter_kast: form.diameter_kast || null,
      jaar_geintroduceerd: form.jaar_geintroduceerd ? parseInt(form.jaar_geintroduceerd) : null,
      prijs_euro: form.prijs_euro || null,
      prijs_dollar: form.prijs_dollar || null,
    }).select('id').single()

    if (error) {
      alert('Error: ' + error.message)
      setSaving(false)
      return
    }
    setNewId(data.id)
    setSaving(false)
  }

  async function handleFinish() {
    router.push('/admin')
  }

  return (
    <main className="min-h-screen bg-[#F8F6F2]">
      <nav className="sticky top-0 z-50 px-10 py-5 flex justify-between items-center bg-white/95 backdrop-blur border-b border-[#E8E2D9]">
        <Link href="/" className="font-serif text-xl tracking-[0.15em] text-[#1A1A1A]">ROYAL OAK CLUB</Link>
        <Link href="/admin" className="text-[11px] tracking-[0.2em] uppercase text-[#888] hover:text-[#C9A84C] transition-colors">← Back to Admin</Link>
      </nav>
      <div className="px-10 py-12 max-w-5xl">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#C9A84C] mb-2">Admin</p>
        <h1 className="font-serif text-4xl font-light mb-10">Add New Watch</h1>

        <div className="grid grid-cols-3 gap-8 mb-8">
          {/* IMAGE */}
          <div className="col-span-1">
            <div className="bg-white rounded-xl border border-[#E8E2D9] p-6 flex flex-col items-center">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#AAA] mb-4">Image</p>
              <div
                className="aspect-square w-full bg-[#F8F6F2] rounded-lg flex items-center justify-center overflow-hidden mb-4 cursor-pointer border-2 border-dashed border-transparent hover:border-[#C9A84C] transition-colors relative"
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
                    <p className="text-[10px] text-[#CCC]">{newId ? 'Click or drag image' : 'Save first, then upload'}</p>
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <input id="fileInput" type="file" accept="image/*" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
              <button
                onClick={() => document.getElementById('fileInput')?.click()}
                disabled={uploading || !newId}
                className="w-full py-2.5 border border-[#E8E2D9] text-[10px] tracking-[0.2em] uppercase text-[#888] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors disabled:opacity-40 mb-2"
              >
                {uploading ? 'Uploading...' : 'Choose Image'}
              </button>
              {image && <p className="text-[10px] text-green-500">✓ Uploaded</p>}
              <p className="text-[9px] text-[#DDD] mt-2">Auto-cropped to 800×800px</p>
            </div>
          </div>

          {/* FORM */}
          <div className="col-span-2">
            <div className="bg-white rounded-xl border border-[#E8E2D9] overflow-hidden">
              <div className="px-8 py-5 border-b border-[#E8E2D9] flex justify-between items-center">
                <h2 className="text-[10px] tracking-[0.3em] uppercase text-[#C9A84C]">Information</h2>
                {newId && <span className="text-[10px] text-green-500 font-mono">✓ Saved as ID {newId}</span>}
              </div>
              <div className="p-8 grid grid-cols-2 gap-5">
                {FIELDS.map(f => (
                  <div key={f.name} className={f.span ? 'col-span-2' : ''}>
                    <label className="text-[10px] tracking-[0.2em] uppercase text-[#AAA] block mb-2">{f.label}</label>
                    <input
                      value={form[f.name] || ''}
                      onChange={e => setForm(prev => ({ ...prev, [f.name]: e.target.value }))}
                      placeholder={f.placeholder}
                      disabled={!!newId}
                      className="w-full px-4 py-3 border border-[#E8E2D9] focus:border-[#C9A84C] outline-none bg-[#FAFAF8] text-[#1A1A1A] transition-colors text-sm disabled:opacity-60"
                    />
                  </div>
                ))}
              </div>
              <div className="px-8 py-6 border-t border-[#E8E2D9] flex gap-4">
                {!newId ? (
                  <button onClick={handleSave} disabled={saving}
                    className="px-8 py-3 bg-[#C9A84C] text-white text-[11px] tracking-[0.2em] uppercase hover:bg-[#B8973B] transition-colors disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save Watch'}
                  </button>
                ) : (
                  <button onClick={handleFinish}
                    className="px-8 py-3 bg-[#1A1A1A] text-white text-[11px] tracking-[0.2em] uppercase hover:bg-[#C9A84C] transition-colors">
                    Finish → Back to Admin
                  </button>
                )}
                <Link href="/admin" className="px-8 py-3 border border-[#E8E2D9] text-[#888] text-[11px] tracking-[0.2em] uppercase hover:border-[#C9A84C] transition-colors">
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
