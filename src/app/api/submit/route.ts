import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import sharp from 'sharp'

const SUPABASE_URL = "https://tiinckbwtmwrmmpuhfsy.supabase.co"
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!
const BUCKET = "submissions"

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  
  const honeypot = formData.get('honeypot') as string
  if (honeypot) return NextResponse.json({ error: 'Bot detected' }, { status: 400 })

  const file = formData.get('file') as File | null
  let filename = null

  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer())
    const processed = await sharp(buffer)
      .resize(800, 800, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .jpeg({ quality: 90 })
      .toBuffer()

    filename = `submission_${Date.now()}.jpg`

    const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${filename}`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'image/jpeg',
        'x-upsert': 'true'
      },
      body: new Uint8Array(processed)
    })

    if (!uploadRes.ok) return NextResponse.json({ error: 'Image upload failed' }, { status: 500 })
  }

  const supabase = await createClient()
  const { error } = await supabase.from('submissions').insert({
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
    description: formData.get('description') as string || null,
    ingediend_door: formData.get('ingediend_door') as string || null,
    image: filename,
    status: 'pending'
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
