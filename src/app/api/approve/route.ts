import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

const SUPABASE_URL = "https://tiinckbwtmwrmmpuhfsy.supabase.co"
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!

async function copyImage(sourceFilename: string, newFilename: string): Promise<boolean> {
  const signedRes = await fetch(
    `${SUPABASE_URL}/storage/v1/object/sign/submissions/${sourceFilename}`,
    {
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ expiresIn: 60 })
    }
  )
  const signedData = await signedRes.json()
  if (!signedData.signedURL) return false

  const signedUrl = `${SUPABASE_URL}/storage/v1${signedData.signedURL}`
  const imgRes = await fetch(signedUrl)
  const blob = await imgRes.arrayBuffer()

  const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/watch-images/${newFilename}`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'image/jpeg',
      'x-upsert': 'true'
    },
    body: new Uint8Array(blob)
  })
  return uploadRes.ok
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: isAdmin } = await supabase.from('admins').select('email').eq('email', user.email!).single()
  if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { submission } = await request.json()
  const timestamp = Date.now()

  // Kopieer hoofdfoto
  let watchImage = null
  if (submission.image) {
    const newFilename = `approved_${submission.id}_${timestamp}.jpg`
    const ok = await copyImage(submission.image, newFilename)
    if (ok) watchImage = newFilename
  }

  // Voeg toe aan watches
  const { data: newWatch } = await supabase.from('watches').insert({
    modelnaam: submission.modelnaam,
    model_id: submission.model_id,
    type: submission.type,
    geslacht: submission.geslacht,
    materiaal: submission.materiaal,
    movement: submission.movement,
    type_uurwerk: submission.type_uurwerk,
    productie_status: submission.productie_status,
    diameter_kast: submission.diameter_kast,
    jaar_geintroduceerd: submission.jaar_geintroduceerd,
    prijs_euro: submission.prijs_euro,
    prijs_dollar: submission.prijs_dollar,
    description: submission.description,
    image: watchImage
  }).select('id').single()

  // Kopieer extra foto's naar watch_images
  if (newWatch && submission.extra_images && submission.extra_images.length > 0) {
    for (let i = 0; i < submission.extra_images.length; i++) {
      const extraFilename = `approved_extra_${submission.id}_${timestamp}_${i}.jpg`
      const ok = await copyImage(submission.extra_images[i], extraFilename)
      if (ok) {
        await supabase.from('watch_images').insert({
          watch_id: newWatch.id,
          filename: extraFilename,
          sort_order: i + 1
        })
      }
    }
  }

  // Update status
  await supabase.from('submissions').update({ status: 'approved' }).eq('id', submission.id)

  return NextResponse.json({ success: true })
}
