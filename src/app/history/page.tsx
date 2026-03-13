import Link from 'next/link'

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-[#F8F6F2] text-[#1A1A1A]">
      <nav className="sticky top-0 z-50 px-6 md:px-10 py-5 flex justify-between items-center bg-white/95 backdrop-blur border-b border-[#E8E2D9]">
        <Link href="/" className="font-serif text-xl tracking-[0.15em] text-[#1A1A1A]">ROYAL OAK CLUB</Link>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-[11px] tracking-[0.2em] uppercase text-[#888] hover:text-[#C9A84C] transition-colors">Home</Link>
          <Link href="/database" className="text-[11px] tracking-[0.2em] uppercase text-[#888] hover:text-[#C9A84C] transition-colors">Browse Archive</Link>
        </div>
      </nav>

      <div className="px-6 md:px-10 py-16 max-w-3xl mx-auto">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#C9A84C] mb-2">Background</p>
        <h1 className="font-serif text-3xl md:text-5xl font-light mb-12">History of the Royal Oak</h1>

        <div className="space-y-8 text-[#444] leading-relaxed">
          <div>
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-3">1972</h2>
            <p>A "vintage year" for Audemars Piguet and an historic one for the craft of watchmaking with the launch of the world's first luxury sports watch, the Royal Oak. Its octagonal shape, steel edges and the use of prominent hexagonal screws as a design feature strike a perfect balance between power and elegance. Worthy of its name, the Royal Oak has since become a legend.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-3">Audemars Piguet's Success Story</h2>
            <p>Audemars Piguet watchmakers found themselves confronted with a new challenge: to reinterpret the classical watch for a new age. The solution they came up with is the refined heir to an aristocratic lineage: the peerless Royal Oak. Its octagonal design, originally produced only in high-grade steel, took the breath away even of many professionals. When the initial shock abated, some in the industry hinted that Audemars Piguet had taken a wrong turning. However, when the Royal Oak was unveiled at the 1972 European watchmaking fair in Basel with a price tag of just Sfr. 3,300 — unheard of for a watch bearing the Audemars Piguet name — its success was beyond even its creators' expectations!</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-3">The Legend of the Royal Oak</h2>
            <p>The legend of the oak stretches back to the dawn of history, when man discovered the virtues of wood as a toolmaking material. The oak's structural strength was prefigured in the majesty of the tree itself. The oak has another, more recent association with majesty. In 1651 after the Battle of Worcester, King Charles II of England, Scotland and Wales found refuge from pursuers in the hollow of an ancient oak. A "royal oak" indeed.</p>
            <p className="mt-4">The name Royal Oak was adopted by the Royal Navy for a series of vessels of the line, in the days at the height of imperial glory when Britain "ruled the waves". The ships naturally distinguished themselves in the Napoleonic wars and in the great wars of this century. It is this ancient, royal and naval heritage of the name Royal Oak that inspired Audemars Piguet in the creation of a legendary watch.</p>
            <p className="mt-4">The porthole, that symbol of the high seas, was the starting point for this virile design. The choice of an octagonal form, with a bezel secured by hexagonal screws in white gold, followed naturally. The "rugged" look of this luxury sports watch is emphasized by the use of steel, satin-finished to highlight the quality of the Royal Oak's design. The Royal Oak is also distinctive as the first successful use of integrated design, for watch and bracelet. The octagonal porthole motif is echoed in the bracelet, with its hand-made links of progressively diminishing size.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-3">1993</h2>
            <p>The Royal Oak Offshore was introduced in 1993, water-resistant to a depth of 100 metres and designed for extreme sports. Crafting Royal Oak and Royal Oak Offshore cases calls for more than 250 successive operations including all types of hand-made finish: bevelling, lapping, polishing, brushing, sandblasting and circular-graining.</p>
            <p className="mt-4">Initially introduced in steel, representing a revolution in the world of luxury watches, the cases of the Royal Oak and Royal Oak Offshore are currently made from a wide variety of metals, some of which originate from the latest research in the aeronautical and spatial industries. Around its legendary octagonal dial, eight visible white gold screws hold together the bezel, the exclusive water-resistance gasket and the case-back and middle.</p>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[#E8E2D9]">
          <Link href="/database" className="inline-flex items-center gap-3 text-[11px] tracking-[0.2em] uppercase text-[#C9A84C] hover:text-[#B8973B] transition-colors">
            Browse the Archive →
          </Link>
        </div>
      </div>

      <footer className="px-6 md:px-10 py-8 bg-white border-t border-[#E8E2D9] flex justify-between items-center mt-16">
        <span className="font-serif text-sm tracking-[0.2em] text-[#1A1A1A]">ROYAL OAK CLUB</span>
        <span className="text-[10px] text-[#AAA]">© Royal Oak Club — Independent since 2012</span>
      </footer>
    </main>
  )
}
