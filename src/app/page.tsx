import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

const STORAGE_URL = "https://tiinckbwtmwrmmpuhfsy.supabase.co/storage/v1/object/public/watch-images"

async function getStats() {
  const { count } = await supabase.from('watches').select('*', { count: 'exact', head: true })
  const { data: calibers } = await supabase.from('watches').select('type_uurwerk').not('type_uurwerk', 'is', null)
  const caliberCount = new Set(calibers?.map((c: { type_uurwerk: string }) => c.type_uurwerk)).size
  return { total: count || 0, calibers: caliberCount }
}

async function getRecentWatches() {
  const { data } = await supabase.from('watches').select('*').not('modelnaam', 'is', null).not('image', 'is', null).order('id', { ascending: false }).limit(6)
  return data || []
}

export default async function HomePage() {
  const [stats, recent] = await Promise.all([getStats(), getRecentWatches()])
  return (
    <main className="min-h-screen bg-[#F8F6F2] text-[#1A1A1A]">

      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 px-10 py-5 flex justify-between items-center bg-white/90 backdrop-blur border-b border-[#E8E2D9]">
        <span className="font-serif text-xl tracking-[0.15em] text-[#1A1A1A]">ROYAL OAK CLUB</span>
        <div className="flex gap-8 items-center">
          <Link href="/database" className="text-[11px] tracking-[0.2em] uppercase text-[#888] hover:text-[#C9A84C] transition-colors">Database</Link>
          <Link href="/submit" className="text-[11px] tracking-[0.2em] uppercase text-[#888] hover:text-[#C9A84C] transition-colors">Submit a Watch</Link>
          <Link href="/login" className="text-[11px] tracking-[0.2em] uppercase text-[#888] hover:text-[#C9A84C] transition-colors">Login</Link>
          <Link href="/database" className="text-[11px] tracking-[0.2em] uppercase px-5 py-2.5 bg-[#C9A84C] text-white hover:bg-[#B8973B] transition-colors">
            Explore →
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex items-center pt-20">
        <div className="w-full px-10 grid grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#C9A84C] mb-6 flex items-center gap-3">
              <span className="block w-8 h-px bg-[#C9A84C]" />Independent Archive — Est. 2012
            </p>
            <h1 className="font-serif text-[clamp(48px,5.5vw,80px)] font-light leading-[1.05] mb-8 text-[#1A1A1A]">
              The Complete<br />Royal Oak<br /><em className="italic text-[#C9A84C]">Reference Guide.</em>
            </h1>
            <p className="text-[15px] leading-relaxed text-[#666] max-w-md mb-10">
              The most comprehensive independent archive of Audemars Piguet Royal Oak references. Every model, every caliber, every edition — documented since 2012.
            </p>
            <div className="flex gap-4 mb-16">
              <Link href="/database" className="px-8 py-4 bg-[#1A1A1A] text-white text-[11px] tracking-[0.2em] uppercase hover:bg-[#C9A84C] transition-colors">
                Browse Archive
              </Link>
              <Link href="/database" className="px-8 py-4 border border-[#D0C9BC] text-[#666] text-[11px] tracking-[0.2em] uppercase hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors">
                Search →
              </Link>
            </div>
            <div className="flex gap-10 pt-8 border-t border-[#E8E2D9]">
              {[{ n: stats.total.toLocaleString(), l: 'References' }, { n: stats.calibers + '+', l: 'Calibers' }, { n: '50+', l: 'Years' }].map(({ n, l }) => (
                <div key={l}>
                  <span className="font-serif text-3xl font-light text-[#C9A84C] block">{n}</span>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#AAA] mt-1 block">{l}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-8 bg-[#C9A84C]/5 rounded-full" />
            <div className="relative bg-white rounded-2xl shadow-2xl shadow-black/10 p-12 flex items-center justify-center aspect-square">
              {recent[0]?.image ? (
                <Image
                  src={`${STORAGE_URL}/${encodeURIComponent(recent[0].image)}`}
                  alt={recent[0].modelnaam || 'Royal Oak'}
                  width={500}
                  height={500}
                  className="object-contain"
                  unoptimized
                />
              ) : (
                <div className="w-48 h-48 opacity-10">
                  <svg viewBox="0 0 200 200" fill="none"><polygon points="70,5 130,5 195,70 195,130 130,195 70,195 5,130 5,70" stroke="#C9A84C" strokeWidth="2" fill="none" /></svg>
                </div>
              )}
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-4 border border-[#E8E2D9]">
              <p className="text-[9px] tracking-[0.2em] uppercase text-[#AAA] mb-1">Latest addition</p>
              <p className="font-serif text-sm text-[#1A1A1A]">{recent[0]?.modelnaam || '—'}</p>
              <p className="font-mono text-[10px] text-[#C9A84C]">{recent[0]?.model_id || '—'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* COLLECTION GRID */}
      <section className="px-10 py-24 bg-white">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#C9A84C] mb-3">The Collection</p>
            <h2 className="font-serif text-4xl font-light text-[#1A1A1A]">Recent References</h2>
          </div>
          <Link href="/database" className="text-[11px] tracking-[0.2em] uppercase text-[#C9A84C] border-b border-[#C9A84C] pb-0.5 hover:text-[#B8973B] transition-colors">
            View all {stats.total} →
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {recent.map((w: any) => (
            <Link key={w.id} href={`/watch/${w.id}`} className="group bg-[#F8F6F2] rounded-xl overflow-hidden hover:shadow-xl hover:shadow-black/8 transition-all duration-300">
              <div className="aspect-square bg-white flex items-center justify-center p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[#C9A84C]/0 group-hover:bg-[#C9A84C]/3 transition-colors" />
                {w.image ? (
                  <Image
                    src={`${STORAGE_URL}/${encodeURIComponent(w.image)}`}
                    alt={w.modelnaam || 'Royal Oak'}
                    width={300}
                    height={300}
                    className="object-contain group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                ) : (
                  <div className="w-20 h-20 opacity-10">
                    <svg viewBox="0 0 200 200" fill="none"><polygon points="70,5 130,5 195,70 195,130 130,195 70,195 5,130 5,70" stroke="#C9A84C" strokeWidth="2" fill="none" /></svg>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-serif text-lg text-[#1A1A1A]">{w.modelnaam}</h3>
                  <span className="text-[8px] tracking-[0.1em] uppercase px-2 py-1 bg-[#E8E2D9] text-[#888] rounded-sm">{w.type?.replace('RoyalOak ', '') || '—'}</span>
                </div>
                <p className="font-mono text-[10px] text-[#C9A84C] mb-4">{w.model_id}</p>
                <div className="flex justify-between text-[11px] text-[#AAA] border-t border-[#E8E2D9] pt-4">
                  <span>{w.jaar_geintroduceerd || '—'}</span>
                  <span>{w.type_uurwerk || '—'}</span>
                  <span>{w.diameter_kast ? `${w.diameter_kast}mm` : '—'}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SEARCH BAR */}
      <section className="px-10 py-20 bg-[#1A1A1A]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#C9A84C] mb-4">Find any reference</p>
          <h2 className="font-serif text-4xl font-light text-white mb-10">Search the Archive</h2>
          <Link href="/database" className="flex items-stretch border border-[#333] hover:border-[#C9A84C] transition-colors group">
            <div className="flex-1 px-8 py-5 font-serif text-xl font-light text-[#555] italic text-left">Reference number, model name, caliber...</div>
            <div className="bg-[#C9A84C] group-hover:bg-[#B8973B] transition-colors px-10 flex items-center text-[11px] tracking-[0.2em] uppercase font-medium text-white">Search</div>
          </Link>
          <div className="flex gap-3 mt-5 justify-center flex-wrap">
            {['Royal Oak', 'Offshore', 'Limited Edition', 'Pocketwatch', 'Lady'].map(tag => (
              <Link key={tag} href={`/database?type=${tag}`} className="text-[10px] tracking-[0.15em] uppercase px-4 py-2 border border-[#333] text-[#666] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all rounded-sm">{tag}</Link>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-10 py-8 bg-white border-t border-[#E8E2D9] flex justify-between items-center">
        <span className="font-serif text-sm tracking-[0.2em] text-[#1A1A1A]">ROYAL OAK CLUB</span>
        <span className="text-[10px] text-[#AAA]">© Royal Oak Club — Independent since 2012</span>
        <Link href="/database" className="text-[10px] tracking-[0.2em] uppercase text-[#C9A84C] hover:text-[#B8973B] transition-colors">Database →</Link>
      </footer>
    </main>
  )
}
