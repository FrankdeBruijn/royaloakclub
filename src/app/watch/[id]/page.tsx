import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

const STORAGE_URL = "https://tiinckbwtmwrmmpuhfsy.supabase.co/storage/v1/object/public/watch-images"

export default async function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: watch } = await supabase.from('watches').select('*').eq('id', id).single()
  if (!watch) notFound()

  const imageUrl = watch.image ? `${STORAGE_URL}/${encodeURIComponent(watch.image)}` : null

  const specs = [
    { label: 'Reference', value: watch.model_id },
    { label: 'Type', value: watch.type },
    { label: 'Gender', value: watch.geslacht },
    { label: 'Case Material', value: watch.materiaal },
    { label: 'Case Size', value: watch.diameter_kast ? `${watch.diameter_kast}mm` : null },
    { label: 'Caliber', value: watch.type_uurwerk },
    { label: 'Movement', value: watch.movement },
    { label: 'Status', value: watch.productie_status },
    { label: 'Year Introduced', value: watch.jaar_geintroduceerd },
    { label: 'Price EU', value: watch.prijs_euro ? `€${parseInt(watch.prijs_euro).toLocaleString()}` : null },
    { label: 'Price USA', value: watch.prijs_dollar ? `$${parseInt(watch.prijs_dollar).toLocaleString()}` : null },
  ]

  return (
    <main className="min-h-screen bg-[#F8F6F2] text-[#1A1A1A]">
      <nav className="sticky top-0 z-50 px-6 md:px-10 py-5 flex justify-between items-center bg-white/95 backdrop-blur border-b border-[#E8E2D9]">
        <Link href="/" className="font-serif text-xl tracking-[0.15em] text-[#1A1A1A]">ROYAL OAK CLUB</Link>
        <Link href="/database" className="text-[11px] tracking-[0.2em] uppercase text-[#888] hover:text-[#C9A84C] transition-colors">← Back to Archive</Link>
      </nav>

      <div className="px-6 md:px-10 py-4 flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-[#BBB] border-b border-[#E8E2D9] bg-white">
        <Link href="/" className="hover:text-[#C9A84C] transition-colors">Home</Link>
        <span>/</span>
        <Link href="/database" className="hover:text-[#C9A84C] transition-colors">Database</Link>
        <span>/</span>
        <span className="text-[#C9A84C]">{watch.modelnaam}</span>
      </div>

      <div className="px-6 md:px-10 py-16 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">

          {/* IMAGE */}
          <div className="md:sticky md:top-28">
            <div className="bg-white rounded-2xl shadow-lg shadow-black/5 p-12 flex items-center justify-center aspect-square relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#C9A84C]/3 to-transparent" />
              {imageUrl ? (
                <Image src={imageUrl} alt={watch.modelnaam || 'Royal Oak'} width={500} height={500} className="object-contain relative z-10" unoptimized />
              ) : (
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 opacity-10">
                    <svg viewBox="0 0 200 200" fill="none"><polygon points="70,5 130,5 195,70 195,130 130,195 70,195 5,130 5,70" stroke="#C9A84C" strokeWidth="2" fill="none" /></svg>
                  </div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#CCC]">No image available</p>
                </div>
              )}
            </div>
          </div>

          {/* DETAILS */}
          <div>
            <div className="mb-8">
              <span className="text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 bg-[#C9A84C]/10 text-[#C9A84C] rounded-sm inline-block mb-4">{watch.type}</span>
              <h1 className="font-serif text-5xl font-light leading-tight mb-3">{watch.modelnaam}</h1>
              <p className="font-mono text-base text-[#C9A84C] tracking-wider">{watch.model_id}</p>
            </div>

            {/* DESCRIPTION */}
            {watch.description && (
              <div className="mb-8 p-6 bg-white rounded-xl border border-[#E8E2D9]">
                <div className="flex items-center gap-3 mb-3">
                  <span className="block w-4 h-px bg-[#C9A84C]" />
                  <h2 className="text-[10px] tracking-[0.3em] uppercase text-[#C9A84C]">About</h2>
                </div>
                <p className="text-sm leading-relaxed text-[#555]">{watch.description}</p>
              </div>
            )}

            {/* PRICE */}
            {(watch.prijs_euro || watch.prijs_dollar) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 p-6 bg-white rounded-xl border border-[#E8E2D9]">
                {watch.prijs_euro && (
                  <div>
                    <span className="text-[9px] tracking-[0.2em] uppercase text-[#AAA] block mb-1">Price EU</span>
                    <span className="font-serif text-2xl text-[#1A1A1A]">€{parseInt(watch.prijs_euro).toLocaleString()}</span>
                  </div>
                )}
                {watch.prijs_dollar && (
                  <div>
                    <span className="text-[9px] tracking-[0.2em] uppercase text-[#AAA] block mb-1">Price USA</span>
                    <span className="font-serif text-2xl text-[#1A1A1A]">${parseInt(watch.prijs_dollar).toLocaleString()}</span>
                  </div>
                )}
              </div>
            )}

            {/* SPECS */}
            <div className="bg-white rounded-xl border border-[#E8E2D9] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E8E2D9] flex items-center gap-3">
                <span className="block w-4 h-px bg-[#C9A84C]" />
                <h2 className="text-[10px] tracking-[0.3em] uppercase text-[#C9A84C]">Specifications</h2>
              </div>
              {specs.filter(s => s.value).map((spec, i) => (
                <div key={spec.label} className={`flex px-6 py-4 ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAF8]'} border-b border-[#F0EDE8] last:border-0`}>
                  <span className="text-[10px] tracking-[0.15em] uppercase text-[#AAA] w-40 flex-shrink-0 pt-0.5">{spec.label}</span>
                  <span className="text-sm text-[#1A1A1A] font-medium">{String(spec.value)}</span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link href="/database" className="inline-flex items-center gap-3 text-[11px] tracking-[0.2em] uppercase text-[#888] hover:text-[#C9A84C] transition-colors">
                <span>←</span> Back to Archive
              </Link>
            </div>
          </div>
        </div>
      </div>

      <footer className="px-6 md:px-10 py-8 bg-white border-t border-[#E8E2D9] flex justify-between items-center mt-16">
        <span className="font-serif text-sm tracking-[0.2em] text-[#1A1A1A]">ROYAL OAK CLUB</span>
        <span className="text-[10px] text-[#AAA]">© Royal Oak Club — Independent since 2012</span>
      </footer>
    </main>
  )
}
