"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Altijd in beeld, op elke pagina — geen menu waar hij achter weg kan vallen
// (zie klantfeedback over de "Submit a Watch"-knop). Verborgen in admin/login/
// het formulier zelf, want daar is hij niet zinvol.
export default function FeedbackButton() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin') || pathname === '/login' || pathname === '/feedback') return null

  return (
    <Link
      href="/feedback"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 bg-[#1A1A1A] text-white text-[10px] tracking-[0.15em] uppercase shadow-lg shadow-black/20 hover:bg-[#C9A84C] transition-colors rounded-full"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      Feedback
    </Link>
  )
}
