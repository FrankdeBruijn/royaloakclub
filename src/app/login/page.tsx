"use client"

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      console.log('Ingelogd als:', data.user?.email)
      window.location.href = '/admin'
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F6F2] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <span className="font-serif text-2xl tracking-[0.15em] text-[#1A1A1A]">ROYAL OAK CLUB</span>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#C9A84C] mt-2">Admin Access</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg shadow-black/5 p-10 border border-[#E8E2D9]">
          <h1 className="font-serif text-3xl font-light mb-8 text-[#1A1A1A]">Sign In</h1>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase text-[#AAA] block mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-[#E8E2D9] focus:border-[#C9A84C] outline-none bg-[#FAFAF8] text-[#1A1A1A] font-serif text-lg transition-colors"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase text-[#AAA] block mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-[#E8E2D9] focus:border-[#C9A84C] outline-none bg-[#FAFAF8] text-[#1A1A1A] font-serif text-lg transition-colors"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#1A1A1A] text-white text-[11px] tracking-[0.2em] uppercase hover:bg-[#C9A84C] transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
