import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

const SUPABASE_URL = "https://tiinckbwtmwrmmpuhfsy.supabase.co"
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!
const BUCKET = "watch-images"

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const watchId = formData.get('watchId') as string | null
  if (!file || !watchId) return NextResponse.json({ error: 'Missing file or watchId' }, { status: 400 })

  const buffer = Buffer.from(await file.arrayBuffer())
  const processed = await sharp(buffer)
    .resize(800, 800, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .jpeg({ quality: 90 })
    .toBuffer()

  const filename = `extra_${watchId}_${Date.now()}.jpg`

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
  if (!uploadRes.ok) return NextResponse.json({ error: 'Upload failed' }, { status: 500 })

  const existingRes = await fetch(
    `${SUPABASE_URL}/rest/v1/watch_images?watch_id=eq.${watchId}&order=sort_order.desc&limit=1`,
    { headers: { 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}` } }
  )
  const existing = await existingRes.json()
  const nextOrder = existing.length > 0 ? (existing[0].sort_order + 1) : 1

  const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/watch_images`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({ watch_id: parseInt(watchId), filename, sort_order: nextOrder })
  })
  if (!insertRes.ok) return NextResponse.json({ error: 'Database insert failed' }, { status: 500 })

  return NextResponse.json({ success: true, filename })
}
