import Link from 'next/link'

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#F8F6F2] text-[#1A1A1A]">
      <nav className="sticky top-0 z-50 px-10 py-5 flex justify-between items-center bg-white/95 backdrop-blur border-b border-[#E8E2D9]">
        <Link href="/" className="font-serif text-xl tracking-[0.15em] text-[#1A1A1A]">ROYAL OAK CLUB</Link>
        <Link href="/database" className="text-[11px] tracking-[0.2em] uppercase text-[#888] hover:text-[#C9A84C] transition-colors">Browse Archive</Link>
      </nav>

      <div className="px-10 py-16 max-w-3xl">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#C9A84C] mb-2">Get in Touch</p>
        <h1 className="font-serif text-5xl font-light mb-12">Contact</h1>

        <div className="bg-white rounded-xl border border-[#E8E2D9] p-10 space-y-8">
          <div>
            <p className="text-[#444] leading-relaxed mb-6">We appreciate any feedback you may have about our website so please feel free to contact us. If you have information about a Royal Oak watch that is not yet in our database, or have pictures you want to share with us, please e-mail your information to:</p>
            <a href="mailto:info@royaloakclub.com" className="font-serif text-2xl text-[#C9A84C] hover:text-[#B8973B] transition-colors">
              info@royaloakclub.com
            </a>
          </div>

          <div className="pt-6 border-t border-[#E8E2D9]">
            <p className="text-[#444] leading-relaxed">If there is any information in our database that you think is inaccurate, please help us improve the website and let us know.</p>
          </div>

          <div className="pt-6 border-t border-[#E8E2D9]">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#AAA] mb-4">Or submit a watch directly</p>
            <Link href="/submit" className="inline-flex items-center gap-3 px-6 py-3 border border-[#C9A84C] text-[#C9A84C] text-[11px] tracking-[0.2em] uppercase hover:bg-[#C9A84C] hover:text-white transition-colors">
              Submit a Watch →
            </Link>
          </div>
        </div>
      </div>

      <footer className="px-10 py-8 bg-white border-t border-[#E8E2D9] flex justify-between items-center mt-16">
        <span className="font-serif text-sm tracking-[0.2em] text-[#1A1A1A]">ROYAL OAK CLUB</span>
        <span className="text-[10px] text-[#AAA]">© Royal Oak Club — Independent since 2012</span>
      </footer>
    </main>
  )
}
