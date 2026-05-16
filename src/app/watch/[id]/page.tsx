import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import GalleryClient from './GalleryClient'

const STORAGE_URL = "https://tiinckbwtmwrmmpuhfsy.supabase.co/storage/v1/object/public/watch-images"

const imageUrl = (path: string) => `${STORAGE_URL}/${path.split('/').map(encodeURIComponent).join('/')}`

const decodeHtml = (str: string | null | undefined): string => {
  if (!str) return ''
  return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
}

export default async function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: watch } = await supabase.from('watches').select('*').eq('id', id).single()
  if (!watch) notFound()

  const { data: extraImages } = await supabase
    .from('watch_images')
    .select('*')
    .eq('watch_id', id)
    .order('sort_order', { ascending: true })

  const mainImageUrl = watch.image ? imageUrl(watch.image) : null
  const allImages = [
    ...(mainImageUrl ? [mainImageUrl] : []),
    ...(extraImages || []).map(img => `${STORAGE_URL}/${encodeURIComponent(img.filename)}`)
  ]

  const fullReference = watch.image ? watch.image.replace(/\.[^.]+$/, '') : watch.model_id

  const specs = [
    { label: 'Reference', value: fullReference },
    { label: 'Type', value: decodeHtml(watch.type) },
    { label: 'Gender', value: decodeHtml(watch.geslacht) },
    { label: 'Case Material', value: decodeHtml(watch.materiaal) },
    { label: 'Case Size', value: watch.diameter_kast ? `${watch.diameter_kast}mm` : null },
    { label: 'Caliber', value: decodeHtml(watch.type_uurwerk) },
    { label: 'Movement', value: decodeHtml(watch.movement) },
    { label: 'Status', value: decodeHtml(watch.productie_status) },
    { label: 'Year Introduced', value: watch.jaar_geintroduceerd },
    { label: 'Price EU', value: watch.prijs_euro ? `€${parseInt(watch.prijs_euro).toLocaleString()}` : null },
    { label: 'Price USA', value: watch.prijs_dollar ? `$${parseInt(watch.prijs_dollar).toLocaleString()}` : null },
  ]

  return (
    <main className="min-h-screen bg-[#F8F6F2] text-[#1A1A1A]">
      <nav className="sticky top-0 z-50 px-6 md:px-10 py-5 flex justify-between items-center bg-white/95 backdrop-blur border-b border-[#E8E2D9]">
        <Link href="/" className="font-serif text-xl tracking-[0.15em] text-[#1A1A1A]">ROYAL OAK CLUB</Link>
        <Link href="/database" className="text-sm md:text-[11px] tracking-[0.2em] uppercase text-[#888] hover:text-[#C9A84C] transition-colors px-3 py-2 md:px-0 md:py-0">← Archive</Link>
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

          {/* GALLERY */}
          <div className="md:sticky md:top-28">
            <GalleryClient images={allImages} modelName={watch.modelnaam || 'Royal Oak'} />
          </div>

          {/* DETAILS */}
          <div>
            <div className="mb-8">
              <span className="text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 bg-[#C9A84C]/10 text-[#C9A84C] rounded-sm inline-block mb-4">{decodeHtml(watch.type)}</span>
              <h1 className="font-serif text-3xl md:text-5xl font-light leading-tight mb-3 break-words">{decodeHtml(watch.modelnaam)}</h1>
              <p className="font-mono text-base text-[#C9A84C] tracking-wider break-all">{fullReference}</p>
            </div>

            {watch.description && (
              <div className="mb-8 p-6 bg-white rounded-xl border border-[#E8E2D9]">
                <div className="flex items-center gap-3 mb-3">
                  <span className="block w-4 h-px bg-[#C9A84C]" />
                  <h2 className="text-[10px] tracking-[0.3em] uppercase text-[#C9A84C]">About</h2>
                </div>
                <p className="text-sm leading-relaxed text-[#555]">{decodeHtml(watch.description)}</p>
              </div>
            )}

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
