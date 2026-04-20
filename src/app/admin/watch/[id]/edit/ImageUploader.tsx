"use client"

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

const STORAGE_URL = "https://tiinckbwtmwrmmpuhfsy.supabase.co/storage/v1/object/public/watch-images"

interface ExtraImage {
  id: number
  filename: string
  sort_order: number
}

interface Props {
  watchId: string
  currentImage: string | null
  currentFilename: string | null
}

export default function ImageUploader({ watchId, currentImage, currentFilename }: Props) {
  const [preview, setPreview] = useState<string | null>(currentImage)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [extraImages, setExtraImages] = useState<ExtraImage[]>([])
  const [uploadingExtra, setUploadingExtra] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const extraInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { loadExtraImages() }, [])

  async function loadExtraImages() {
    const res = await fetch(`/api/watch-images?watchId=${watchId}`)
    if (res.ok) setExtraImages(await res.json())
  }

  async function handleFile(file: File) {
    setUploading(true)
    setError('')
    setSuccess(false)
    const reader = new FileReader()
    reader.onload = e => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('watchId', watchId)
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const data = await res.json()
    if (res.ok) { setSuccess(true); setTimeout(() => setSuccess(false), 3000) }
    else setError(data.error || 'Upload failed')
    setUploading(false)
  }

  async function handleExtraFile(file: File) {
    setUploadingExtra(true)
    setError('')
    const formData = new FormData()
    formData.append('file', file)
    formData.append('watchId', watchId)
    const res = await fetch('/api/upload-extra', { method: 'POST', body: formData })
    if (res.ok) await loadExtraImages()
    else { const data = await res.json(); setError(data.error || 'Upload failed') }
    setUploadingExtra(false)
  }

  async function deleteExtraImage(id: number, filename: string) {
    const res = await fetch(`/api/watch-images?id=${id}&filename=${encodeURIComponent(filename)}`, { method: 'DELETE' })
    if (res.ok) setExtraImages(prev => prev.filter(img => img.id !== id))
  }

  return (
    <div className="bg-white rounded-xl border border-[#E8E2D9] p-6 flex flex-col items-center">
      <p className="text-[10px] tracking-[0.2em] uppercase text-[#AAA] mb-4">Hoofdfoto</p>
      <div
        className="aspect-square w-full bg-[#F8F6F2] rounded-lg flex items-center justify-center overflow-hidden mb-4 cursor-pointer border-2 border-dashed border-transparent hover:border-[#C9A84C] transition-colors relative"
        onClick={() => inputRef.current?.click()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith('image/')) handleFile(f) }}
        onDragOver={e => e.preventDefault()}
      >
        {preview ? (
          <Image src={preview} alt="Watch" fill className="object-contain p-4" unoptimized />
        ) : (
          <div className="text-center p-4">
            <div className="w-10 h-10 mx-auto opacity-20 mb-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </div>
            <p className="text-[10px] text-[#CCC]">Click or drag image</p>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} className="hidden" />
      <button onClick={() => inputRef.current?.click()} disabled={uploading}
        className="w-full py-2.5 border border-[#E8E2D9] text-[10px] tracking-[0.2em] uppercase text-[#888] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors disabled:opacity-50 mb-2">
        {uploading ? 'Uploading...' : 'Verander hoofdfoto'}
      </button>
      {success && <p className="text-[11px] text-green-500 mb-2">✓ Uploaded successfully</p>}
      {error && <p className="text-[11px] text-red-400 mb-2">{error}</p>}
      {currentFilename && !success && <p className="text-[9px] text-[#CCC] text-center break-all mb-2">{currentFilename}</p>}

      <div className="w-full border-t border-[#E8E2D9] pt-4 mt-2">
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#AAA] mb-3">Extra fotos ({extraImages.length})</p>
        {extraImages.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-3">
            {extraImages.map(img => (
              <div key={img.id} className="relative group aspect-square bg-[#F8F6F2] rounded overflow-hidden">
                <Image src={`${STORAGE_URL}/${encodeURIComponent(img.filename)}`} alt="Extra" fill className="object-contain p-1" unoptimized />
                <button onClick={() => deleteExtraImage(img.id, img.filename)}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  x
                </button>
              </div>
            ))}
          </div>
        )}
        <input ref={extraInputRef} type="file" accept="image/*" multiple onChange={e => { if (e.target.files) Array.from(e.target.files).forEach(handleExtraFile) }} className="hidden" />
        <button onClick={() => extraInputRef.current?.click()} disabled={uploadingExtra}
          className="w-full py-2.5 border border-dashed border-[#E8E2D9] text-[10px] tracking-[0.2em] uppercase text-[#AAA] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors disabled:opacity-50">
          {uploadingExtra ? 'Uploading...' : '+ Voeg extra foto toe'}
        </button>
      </div>
      <p className="text-[9px] text-[#DDD] mt-3">Auto-cropped to 800x800px</p>
    </div>
  )
}
