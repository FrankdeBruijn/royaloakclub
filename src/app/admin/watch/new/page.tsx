import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function NewWatchPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: isAdmin } = await supabase.from('admins').select('email').eq('email', user.email!).single()
  if (!isAdmin) redirect('/')

  async function createWatch(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const { error } = await supabase.from('watches').insert({
      modelnaam: formData.get('modelnaam') as string || null,
      model_id: formData.get('model_id') as string || null,
      type: formData.get('type') as string || null,
      geslacht: formData.get('geslacht') as string || null,
      materiaal: formData.get('materiaal') as string || null,
      movement: formData.get('movement') as string || null,
      type_uurwerk: formData.get('type_uurwerk') as string || null,
      productie_status: formData.get('productie_status') as string || null,
      diameter_kast: formData.get('diameter_kast') as string || null,
      jaar_geintroduceerd: formData.get('jaar_geintroduceerd') ? parseInt(formData.get('jaar_geintroduceerd') as string) : null,
      prijs_euro: formData.get('prijs_euro') as string || null,
      prijs_dollar: formData.get('prijs_dollar') as string || null,
      image: formData.get('image') as string || null,
    })
    if (!error) redirect('/admin')
  }

  return (
    <main className="min-h-screen bg-[#F8F6F2]">
      <nav className="sticky top-0 z-50 px-10 py-5 flex justify-between items-center bg-white/95 backdrop-blur border-b border-[#E8E2D9]">
        <Link href="/" className="font-serif text-xl tracking-[0.15em] text-[#1A1A1A]">ROYAL OAK CLUB</Link>
        <Link href="/admin" className="text-[11px] tracking-[0.2em] uppercase text-[#888] hover:text-[#C9A84C] transition-colors">← Back to Admin</Link>
      </nav>
      <div className="px-10 py-12 max-w-3xl">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#C9A84C] mb-2">Admin</p>
        <h1 className="font-serif text-4xl font-light mb-10">Add New Watch</h1>
        <form action={createWatch} className="bg-white rounded-xl border border-[#E8E2D9] overflow-hidden">
          <div className="px-8 py-5 border-b border-[#E8E2D9]">
            <h2 className="text-[10px] tracking-[0.3em] uppercase text-[#C9A84C]">Basic Information</h2>
          </div>
          <div className="p-8 grid grid-cols-2 gap-6">
            {[
              { name: 'modelnaam', label: 'Model Name', placeholder: 'Royal Oak Date', span: true },
              { name: 'model_id', label: 'Reference Number', placeholder: '15500ST.OO.1220ST.01' },
              { name: 'type', label: 'Type', placeholder: 'RoyalOak' },
              { name: 'geslacht', label: 'Gender', placeholder: 'Gent' },
              { name: 'materiaal', label: 'Case Material', placeholder: 'Steel' },
              { name: 'diameter_kast', label: 'Case Size (mm)', placeholder: '41' },
              { name: 'type_uurwerk', label: 'Caliber', placeholder: '4302' },
              { name: 'movement', label: 'Movement', placeholder: 'Automatic' },
              { name: 'productie_status', label: 'Status', placeholder: 'Current' },
              { name: 'jaar_geintroduceerd', label: 'Year Introduced', placeholder: '2021' },
              { name: 'prijs_euro', label: 'Price EU (€)', placeholder: '26500' },
              { name: 'prijs_dollar', label: 'Price USA ($)', placeholder: '28900' },
              { name: 'image', label: 'Image filename', placeholder: '15500ST.OO.1220ST.01.jpg', span: true },
            ].map(f => (
              <div key={f.name} className={f.span ? 'col-span-2' : ''}>
                <label className="text-[10px] tracking-[0.2em] uppercase text-[#AAA] block mb-2">{f.label}</label>
                <input
                  name={f.name}
                  placeholder={f.placeholder}
                  className="w-full px-4 py-3 border border-[#E8E2D9] focus:border-[#C9A84C] outline-none bg-[#FAFAF8] text-[#1A1A1A] transition-colors"
                />
              </div>
            ))}
          </div>
          <div className="px-8 py-6 border-t border-[#E8E2D9] flex gap-4">
            <button type="submit" className="px-8 py-3 bg-[#C9A84C] text-white text-[11px] tracking-[0.2em] uppercase hover:bg-[#B8973B] transition-colors">
              Save Watch
            </button>
            <Link href="/admin" className="px-8 py-3 border border-[#E8E2D9] text-[#888] text-[11px] tracking-[0.2em] uppercase hover:border-[#C9A84C] transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  )
}
