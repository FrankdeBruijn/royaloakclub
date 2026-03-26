"use client"

import { useState } from 'react'
import Image from 'next/image'

export default function GalleryClient({ images, modelName }: { images: string[], modelName: string }) {
  const [active, setActive] = useState(0)

  if (images.length === 0) {
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

  return (
    <div>
      {/* Main image */}
      <div className="bg-white rounded-2xl shadow-lg shadow-black/5 p-8 flex items-center justify-center aspect-square relative overflow-hidden mb-3">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A84C]/3 to-transparent" />
        <Image
          src={images[active]}
          alt={modelName}
          width={500}
          height={500}
          className="object-contain relative z-10 w-full h-full"
          unoptimized
        />
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/20 text-white text-[10px] tracking-[0.1em] px-2 py-1 rounded">
            {active + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {images.map((img, i) => (
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
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
