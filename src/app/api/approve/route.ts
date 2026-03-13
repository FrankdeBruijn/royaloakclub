import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

const SUPABASE_URL = "https://tiinckbwtmwrmmpuhfsy.supabase.co"
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: isAdmin } = await supabase.from('admins').select('email').eq('email', user.email!).single()
  if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { submission } = await request.json()

  let watchImage = null

  // Kopieer foto van submissions naar watch-images bucket
  if (submission.image) {
    const signedRes = await fetch(
      `${SUPABASE_URL}/storage/v1/object/sign/submissions/${submission.image}`,
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
    const signedUrl = `${SUPABASE_URL}/storage/v1${signedData.signedURL}`

    const imgRes = await fetch(signedUrl)
    const blob = await imgRes.arrayBuffer()
    const newFilename = `approved_${submission.id}_${Date.now()}.jpg`

    await fetch(`${SUPABASE_URL}/storage/v1/object/watch-images/${newFilename}`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'image/jpeg',
        'x-upsert': 'true'
      },
      body: new Uint8Array(blob)
    })
    watchImage = newFilename
  }

  // Voeg toe aan watches
  await supabase.from('watches').insert({
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
  })

  // Update status
  await supabase.from('submissions').update({ status: 'approved' }).eq('id', submission.id)

  return NextResponse.json({ success: true })
}
