import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import sharp from 'sharp'

const SUPABASE_URL = "https://tiinckbwtmwrmmpuhfsy.supabase.co"
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!
const BUCKET = "watch-images"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file') as File
  const watchId = formData.get('watchId') as string

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const buffer = Buffer.from(await file.arrayBuffer())

  // Bijsnijden naar vierkant 800x800, witte achtergrond
  const processed = await sharp(buffer)
    .resize(800, 800, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .jpeg({ quality: 90 })
    .toBuffer()

  const filename = `${watchId}_${Date.now()}.jpg`

  // Upload naar Supabase Storage met service key
  const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${filename}`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'image/jpeg',
      'x-upsert': 'true'
    },
    body: processed
  })

  if (!uploadRes.ok) {
    const err = await uploadRes.text()
    return NextResponse.json({ error: err }, { status: 500 })
  }

  // Update watches tabel
  await supabase.from('watches').update({ image: filename }).eq('id', watchId)

  return NextResponse.json({ filename })
}
