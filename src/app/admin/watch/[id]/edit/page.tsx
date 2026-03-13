import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ImageUploader from './ImageUploader'

const STORAGE_URL = "https://tiinckbwtmwrmmpuhfsy.supabase.co/storage/v1/object/public/watch-images"

export default async function EditWatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: isAdmin } = await supabase.from('admins').select('email').eq('email', user.email!).single()
  if (!isAdmin) redirect('/')

  const { data: watch } = await supabase.from('watches').select('*').eq('id', id).single()
  if (!watch) redirect('/admin')

  async function updateWatch(formData: FormData) {
    'use server'
    const supabase = await createClient()
    await supabase.from('watches').update({
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
    }).eq('id', id)
    redirect('/admin')
  }

  async function deleteWatch() {
    'use server'
    const supabase = await createClient()
    await supabase.from('watches').delete().eq('id', id)
    redirect('/admin')
  }

  const fields = [
    { name: 'modelnaam', label: 'Model Name', value: watch.modelnaam, span: true },
    { name: 'model_id', label: 'Reference Number', value: watch.model_id },
    { name: 'type', label: 'Type', value: watch.type },
    { name: 'geslacht', label: 'Gender', value: watch.geslacht },
    { name: 'materiaal', label: 'Case Material', value: watch.materiaal },
    { name: 'diameter_kast', label: 'Case Size (mm)', value: watch.diameter_kast },
    { name: 'type_uurwerk', label: 'Caliber', value: watch.type_uurwerk },
    { name: 'movement', label: 'Movement', value: watch.movement },
    { name: 'productie_status', label: 'Status', value: watch.productie_status },
    { name: 'jaar_geintroduceerd', label: 'Year Introduced', value: watch.jaar_geintroduceerd },
    { name: 'prijs_euro', label: 'Price EU (€)', value: watch.prijs_euro },
    { name: 'prijs_dollar', label: 'Price USA ($)', value: watch.prijs_dollar },
  ]

  const imageUrl = watch.image ? `${STORAGE_URL}/${encodeURIComponent(watch.image)}` : null

  return (
    <main className="min-h-screen bg-[#F8F6F2]">
      <nav className="sticky top-0 z-50 px-10 py-5 flex justify-between items-center bg-white/95 backdrop-blur border-b border-[#E8E2D9]">
        <Link href="/" className="font-serif text-xl tracking-[0.15em] text-[#1A1A1A]">ROYAL OAK CLUB</Link>
        <Link href="/admin" className="text-[11px] tracking-[0.2em] uppercase text-[#888] hover:text-[#C9A84C] transition-colors">← Back to Admin</Link>
      </nav>

      <div className="px-10 py-12 max-w-5xl">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#C9A84C] mb-2">Admin — ID {id}</p>
        <h1 className="font-serif text-4xl font-light mb-10">{watch.modelnaam || 'Edit Watch'}</h1>

        <div className="grid grid-cols-3 gap-8 mb-8">
          {/* IMAGE UPLOADER */}
          <div className="col-span-1">
            <ImageUploader watchId={id} currentImage={imageUrl} currentFilename={watch.image} />
          </div>

          {/* FORM */}
          <div className="col-span-2">
            <form action={updateWatch} className="bg-white rounded-xl border border-[#E8E2D9] overflow-hidden">
              <div className="px-8 py-5 border-b border-[#E8E2D9]">
                <h2 className="text-[10px] tracking-[0.3em] uppercase text-[#C9A84C]">Edit Information</h2>
              </div>
              <div className="p-8 grid grid-cols-2 gap-5">
                {fields.map(f => (
                  <div key={f.name} className={f.span ? 'col-span-2' : ''}>
                    <label className="text-[10px] tracking-[0.2em] uppercase text-[#AAA] block mb-2">{f.label}</label>
                    <input
                      name={f.name}
                      defaultValue={f.value ?? ''}
                      className="w-full px-4 py-3 border border-[#E8E2D9] focus:border-[#C9A84C] outline-none bg-[#FAFAF8] text-[#1A1A1A] transition-colors text-sm"
                    />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-[#AAA] block mb-2">Image filename</label>
                  <input
                    name="image"
                    defaultValue={watch.image ?? ''}
                    className="w-full px-4 py-3 border border-[#E8E2D9] focus:border-[#C9A84C] outline-none bg-[#FAFAF8] text-[#1A1A1A] transition-colors text-sm font-mono"
                    placeholder="15500ST.OO.1220ST.01.jpg"
                  />
                </div>
              </div>
              <div className="px-8 py-6 border-t border-[#E8E2D9] flex gap-4">
                <button type="submit" className="px-8 py-3 bg-[#C9A84C] text-white text-[11px] tracking-[0.2em] uppercase hover:bg-[#B8973B] transition-colors">
                  Save Changes
                </button>
                <Link href="/admin" className="px-8 py-3 border border-[#E8E2D9] text-[#888] text-[11px] tracking-[0.2em] uppercase hover:border-[#C9A84C] transition-colors">
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* DELETE */}
        <div className="bg-white rounded-xl border border-red-100 overflow-hidden">
          <div className="px-8 py-5 border-b border-red-100">
            <h2 className="text-[10px] tracking-[0.3em] uppercase text-red-400">Danger Zone</h2>
          </div>
          <div className="p-8 flex items-center justify-between">
            <div>
              <p className="text-sm text-[#1A1A1A] mb-1">Delete this watch</p>
              <p className="text-[11px] text-[#AAA]">This action cannot be undone.</p>
            </div>
            <form action={deleteWatch}>
              <button type="submit" className="px-6 py-3 bg-red-500 text-white text-[11px] tracking-[0.2em] uppercase hover:bg-red-600 transition-colors rounded-sm">
                Delete Watch
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
