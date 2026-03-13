"use client"

import { useState } from 'react'
import Link from 'next/link'

const links = [
  { href: '/database', label: 'Database' },
  { href: '/history', label: 'History' },
  { href: '/contact', label: 'Contact' },
  { href: '/submit', label: 'Submit a Watch' },
  { href: '/login', label: 'Login' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur border-b border-[#E8E2D9]">
      <div className="px-6 md:px-10 py-5 flex justify-between items-center">
        <Link href="/" className="font-serif text-xl tracking-[0.15em] text-[#1A1A1A]">ROYAL OAK CLUB</Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-6 items-center">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="text-[11px] tracking-[0.2em] uppercase text-[#888] hover:text-[#C9A84C] transition-colors">{l.label}</Link>
          ))}
          <Link href="/database" className="text-[11px] tracking-[0.2em] uppercase px-5 py-2.5 bg-[#C9A84C] text-white hover:bg-[#B8973B] transition-colors">Explore →</Link>
        </div>

        {/* Hamburger */}
        <button onClick={() => setOpen(!open)} className="md:hidden flex flex-col gap-1.5 p-2">
          <span className={`block w-6 h-0.5 bg-[#1A1A1A] transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-[#1A1A1A] transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-[#1A1A1A] transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden bg-white border-t border-[#E8E2D9] overflow-hidden transition-all duration-300 ${open ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-6 py-4 flex flex-col gap-1">
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-[11px] tracking-[0.2em] uppercase text-[#888] hover:text-[#C9A84C] transition-colors py-3 border-b border-[#F0EDE8]">{l.label}</Link>
          ))}
          <Link href="/database" onClick={() => setOpen(false)} className="text-[11px] tracking-[0.2em] uppercase px-5 py-3 bg-[#C9A84C] text-white text-center hover:bg-[#B8973B] transition-colors mt-3">Explore →</Link>
        </div>
      </div>
    </nav>
  )
}
