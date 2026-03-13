import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  console.log('User:', user?.email)
  console.log('User error:', userError)

  if (!user) {
    console.log('No user, redirecting to login')
    redirect('/login')
  }

  const { data: isAdmin, error: adminError } = await supabase.from('admins').select('email').eq('email', user.email!).single()
  
  console.log('isAdmin:', isAdmin)
  console.log('adminError:', adminError)

  if (!isAdmin) {
    console.log('Not admin, redirecting to home')
    redirect('/')
  }

  const { data: watches, count } = await supabase.from('watches').select('*', { count: 'exact' }).order('id', { ascending: false }).limit(50)

  async function signOut() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <main className="min-h-screen bg-[#F8F6F2]">
      <nav className="sticky top-0 z-50 px-10 py-5 flex justify-between items-center bg-white/95 backdrop-blur border-b border-[#E8E2D9]">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-serif text-xl tracking-[0.15em] text-[#1A1A1A]">ROYAL OAK CLUB</Link>
          <span className="text-[10px] tracking-[0.2em] uppercase px-3 py-1 bg-[#C9A84C]/10 text-[#C9A84C] rounded-sm">Admin</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-[11px] text-[#AAA]">{user.email}</span>
          <form action={signOut}>
            <button className="text-[10px] tracking-[0.2em] uppercase text-[#888] hover:text-red-500 transition-colors">Sign out</button>
          </form>
        </div>
      </nav>
      <div className="px-10 py-12">
        <div className="flex justify-between items-end mb-10 pb-8 border-b border-[#E8E2D9]">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#C9A84C] mb-2">Admin Dashboard</p>
            <h1 className="font-serif text-4xl font-light">Manage Watches <span className="font-mono text-2xl text-[#CCC] ml-3">{count}</span></h1>
          </div>
          <Link href="/admin/watch/new" className="px-6 py-3 bg-[#C9A84C] text-white text-[11px] tracking-[0.2em] uppercase hover:bg-[#B8973B] transition-colors rounded-sm">
            + Add Watch
          </Link>
        </div>
        <div className="bg-white rounded-xl border border-[#E8E2D9] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E8E2D9]">
                {['ID', 'Model', 'Reference', 'Type', 'Year', 'Status', ''].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-[9px] tracking-[0.2em] uppercase text-[#AAA]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {watches?.map((w, i) => (
                <tr key={w.id} className={`border-b border-[#F0EDE8] hover:bg-[#FAFAF8] transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#FDFCFB]'}`}>
                  <td className="px-6 py-4 font-mono text-[11px] text-[#AAA]">{w.id}</td>
                  <td className="px-6 py-4 font-serif text-sm text-[#1A1A1A]">{w.modelnaam || '—'}</td>
                  <td className="px-6 py-4 font-mono text-[11px] text-[#C9A84C]">{w.model_id || '—'}</td>
                  <td className="px-6 py-4 text-[11px] text-[#888]">{w.type?.replace('RoyalOak ', '') || '—'}</td>
                  <td className="px-6 py-4 text-[11px] text-[#888]">{w.jaar_geintroduceerd || '—'}</td>
                  <td className="px-6 py-4 text-[11px] text-[#888]">{w.productie_status || '—'}</td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/watch/${w.id}/edit`} className="text-[10px] tracking-[0.15em] uppercase text-[#C9A84C] hover:text-[#B8973B] transition-colors">Edit →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
