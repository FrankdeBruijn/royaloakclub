"use client"

import { useState } from 'react'
import Image from 'next/image'

export default function GalleryClient({ images, modelName }: { images: string[], modelName: string }) {
  const [active, setActive] = useState(0)
  const [errors, setErrors] = useState<Set<number>>(new Set())

  const handleError = (index: number) => {
    setErrors(prev => new Set(prev).add(index))
    if (index === active) {
      const next = images.findIndex((_, i) => i !== index && !errors.has(i))
      if (next !== -1) setActive(next)
    }
  }

  const validImages = images.filter((_, i) => !errors.has(i))

  if (images.length === 0 || validImages.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg shadow-black/5 p-12 flex items-center justify-center aspect-square">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 opacity-10">
            <svg viewBox="0 0 200 200" fill="none"><polygon points="70,5 130,5 195,70 195,130 130,195 70,195 5,130 5,70" stroke="#C9A84C" strokeWidth="2" fill="none" /></svg>
          </div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#CCC]">No image available</p>
        </div>
      </div>
    )
  }

  const displayIndex = errors.has(active) ? validImages.indexOf(images[active]) : active

  return (
    <div>
      {/* Main image */}
      <div className="bg-white rounded-2xl shadow-lg shadow-black/5 p-8 flex items-center justify-center aspect-square relative overflow-hidden mb-3">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A84C]/3 to-transparent" />
        {images[active] && !errors.has(active) ? (
          <Image
            src={images[active]}
            alt={modelName}
            width={500}
            height={500}
            className="object-contain relative z-10 w-full h-full"
            unoptimized
            onError={() => handleError(active)}
          />
        ) : (
          <div className="w-24 h-24 opacity-10">
            <svg viewBox="0 0 200 200" fill="none"><polygon points="70,5 130,5 195,70 195,130 130,195 70,195 5,130 5,70" stroke="#C9A84C" strokeWidth="2" fill="none" /></svg>
          </div>
        )}
        {validImages.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/20 text-white text-[10px] tracking-[0.1em] px-2 py-1 rounded">
            {displayIndex + 1} / {validImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {images.map((img, i) => {
            if (errors.has(i)) return null
            return (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  active === i ? 'border-[#C9A84C]' : 'border-transparent hover:border-[#E8E2D9]'
                } bg-white p-1`}
              >
                <Image
                  src={img}
                  alt={`${modelName} ${i + 1}`}
                  width={64}
                  height={64}
                  className="object-contain w-full h-full"
                  unoptimized
                  onError={() => handleError(i)}
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
