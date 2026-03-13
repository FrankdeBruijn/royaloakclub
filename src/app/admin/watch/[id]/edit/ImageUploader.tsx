"use client"

import { useState, useRef } from 'react'
import Image from 'next/image'

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
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setUploading(true)
    setError('')
    setSuccess(false)

    // Lokale preview
    const reader = new FileReader()
    reader.onload = e => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('watchId', watchId)

    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const data = await res.json()

    if (res.ok) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } else {
      setError(data.error || 'Upload failed')
    }
    setUploading(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) handleFile(file)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="bg-white rounded-xl border border-[#E8E2D9] p-6 flex flex-col items-center">
      <p className="text-[10px] tracking-[0.2em] uppercase text-[#AAA] mb-4">Image</p>

      {/* Preview */}
      <div
        className="aspect-square w-full bg-[#F8F6F2] rounded-lg flex items-center justify-center overflow-hidden mb-4 cursor-pointer border-2 border-dashed border-transparent hover:border-[#C9A84C] transition-colors relative"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
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

      <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />

      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full py-2.5 border border-[#E8E2D9] text-[10px] tracking-[0.2em] uppercase text-[#888] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors disabled:opacity-50 mb-3"
      >
        {uploading ? 'Uploading...' : 'Choose Image'}
      </button>

      {success && <p className="text-[11px] text-green-500">✓ Uploaded successfully</p>}
      {error && <p className="text-[11px] text-red-400">{error}</p>}
      {currentFilename && !success && (
        <p className="text-[9px] text-[#CCC] text-center break-all mt-2">{currentFilename}</p>
      )}
      <p className="text-[9px] text-[#DDD] mt-2">Auto-cropped to 800×800px</p>
    </div>
  )
}
