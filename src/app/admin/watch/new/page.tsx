"use client"

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const STORAGE_URL = "https://tiinckbwtmwrmmpuhfsy.supabase.co/storage/v1/object/public/watch-images"

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
  const [description, setDescription] = useState('')
  const [mainFile, setMainFile] = useState<File | null>(null)
  const [mainPreview, setMainPreview] = useState<string | null>(null)
  const [extraFiles, setExtraFiles] = useState<File[]>([])
  const [extraPreviews, setExtraPreviews] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [newId, setNewId] = useState<number | null>(null)
  const mainInputRef = useRef<HTMLInputElement>(null)
  const extraInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  function handleMainFile(file: File) {
    setMainFile(file)
    const reader = new FileReader()
    reader.onload = e => setMainPreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  function handleExtraFiles(files: File[]) {
    const imageFiles = files.filter(f => f.type.startsWith('image/'))
    setExtraFiles(prev => [...prev, ...imageFiles])
    imageFiles.forEach(f => {
      const reader = new FileReader()
      reader.onload = e => setExtraPreviews(prev => [...prev, e.target?.result as string])
      reader.readAsDataURL(f)
    })
  }

  function removeExtra(index: number) {
    setExtraFiles(prev => prev.filter((_, i) => i !== index))
    setExtraPreviews(prev => prev.filter((_, i) => i !== index))
  }

  async function handleSave() {
    setSaving(true)

    // Sla basisgegevens op
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
      description: description || null,
    }).select('id').single()

    if (error) {
      alert('Error: ' + error.message)
      setSaving(false)
      return
    }

    const watchId = data.id
    setNewId(watchId)

    // Upload hoofdfoto
    if (mainFile) {
      const formData = new FormData()
      formData.append('file', mainFile)
      formData.append('watchId', String(watchId))
      await fetch('/api/upload', { method: 'POST', body: formData })
    }

    // Upload extra foto's
    for (const file of extraFiles) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('watchId', String(watchId))
      await fetch('/api/upload-extra', { method: 'POST', body: formData })
    }

    setSaving(false)
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
          <div className="col-span-1 flex flex-col gap-4">
            {/* Hoofdfoto */}
            <div className="bg-white rounded-xl border border-[#E8E2D9] p-6 flex flex-col items-center">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#AAA] mb-4">Hoofdfoto</p>
              <div
                className="aspect-square w-full bg-[#F8F6F2] rounded-lg flex items-center justify-center overflow-hidden mb-4 cursor-pointer border-2 border-dashed border-transparent hover:border-[#C9A84C] transition-colors relative"
                onClick={() => mainInputRef.current?.click()}
                onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleMainFile(f) }}
                onDragOver={e => e.preventDefault()}
              >
                {mainPreview ? (
                  <img src={mainPreview} alt="Preview" className="object-contain p-4 w-full h-full" />
                ) : (
                  <div className="text-center p-4">
                    <div className="w-10 h-10 mx-auto opacity-20 mb-3">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    </div>
                    <p className="text-[10px] text-[#CCC]">Click or drag image</p>
                  </div>
                )}
              </div>
              <input ref={mainInputRef} type="file" accept="image/*" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleMainFile(f) }} />
              <button onClick={() => mainInputRef.current?.click()}
                className="w-full py-2.5 border border-[#E8E2D9] text-[10px] tracking-[0.2em] uppercase text-[#888] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors">
                {mainFile ? '✓ ' + mainFile.name.substring(0, 18) : 'Choose Image'}
              </button>
            </div>

            {/* Extra fotos */}
            <div className="bg-white rounded-xl border border-[#E8E2D9] p-6">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#AAA] mb-3">Extra fotos ({extraFiles.length})</p>
              {extraPreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {extraPreviews.map((p, i) => (
                    <div key={i} className="relative aspect-square bg-[#F8F6F2] rounded overflow-hidden group">
                      <img src={p} alt="" className="object-contain p-1 w-full h-full" />
                      <button onClick={() => removeExtra(i)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        x
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <input ref={extraInputRef} type="file" accept="image/*" multiple className="hidden"
                onChange={e => { if (e.target.files) handleExtraFiles(Array.from(e.target.files)) }} />
              <button onClick={() => extraInputRef.current?.click()}
                className="w-full py-2.5 border border-dashed border-[#E8E2D9] text-[10px] tracking-[0.2em] uppercase text-[#AAA] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors">
                + Voeg extra foto toe
              </button>
            </div>
          </div>

          <div className="col-span-2">
            <div className="bg-white rounded-xl border border-[#E8E2D9] overflow-hidden">
              <div className="px-8 py-5 border-b border-[#E8E2D9]">
                <h2 className="text-[10px] tracking-[0.3em] uppercase text-[#C9A84C]">Information</h2>
              </div>
              <div className="p-8 grid grid-cols-2 gap-5">
                {FIELDS.map(f => (
                  <div key={f.name} className={f.span ? 'col-span-2' : ''}>
                    <label className="text-[10px] tracking-[0.2em] uppercase text-[#AAA] block mb-2">{f.label}</label>
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
                  <textarea value={description} onChange={e => setDescription(e.target.value)}
                    placeholder="Describe this watch..." rows={4}
                    className="w-full px-4 py-3 border border-[#E8E2D9] focus:border-[#C9A84C] outline-none bg-[#FAFAF8] text-[#1A1A1A] transition-colors text-sm resize-y" />
                </div>
              </div>
              <div className="px-8 py-6 border-t border-[#E8E2D9] flex gap-4">
                <button onClick={handleSave} disabled={saving}
                  className="px-8 py-3 bg-[#C9A84C] text-white text-[11px] tracking-[0.2em] uppercase hover:bg-[#B8973B] transition-colors disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save Watch'}
                </button>
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
