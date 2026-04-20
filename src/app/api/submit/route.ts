import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import sharp from 'sharp'
import { Resend } from 'resend'

const SUPABASE_URL = "https://tiinckbwtmwrmmpuhfsy.supabase.co"
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!
const BUCKET = "submissions"

async function uploadImage(buffer: Buffer, filename: string): Promise<boolean> {
  const processed = await sharp(buffer)
    .resize(800, 800, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .jpeg({ quality: 90 })
    .toBuffer()

  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${filename}`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'image/jpeg',
      'x-upsert': 'true'
    },
    body: new Uint8Array(processed)
  })
  return res.ok
}

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  const honeypot = formData.get('honeypot') as string
  if (honeypot) return NextResponse.json({ error: 'Bot detected' }, { status: 400 })

  // Hoofdfoto
  const file = formData.get('file') as File | null
  let filename = null
  const extraFilenames: string[] = []

  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer())
    filename = `submission_${Date.now()}.jpg`
    const ok = await uploadImage(buffer, filename)
    if (!ok) return NextResponse.json({ error: 'Image upload failed' }, { status: 500 })
  }

  // Extra foto's
  let i = 1
  while (true) {
    const extraFile = formData.get(`file_${i}`) as File | null
    if (!extraFile || extraFile.size === 0) break
    const buffer = Buffer.from(await extraFile.arrayBuffer())
    const extraFilename = `submission_extra_${Date.now()}_${i}.jpg`
    const ok = await uploadImage(buffer, extraFilename)
    if (ok) extraFilenames.push(extraFilename)
    i++
  }

  const supabase = await createClient()
  const modelnaam = formData.get('modelnaam') as string || 'Onbekend'
  const model_id = formData.get('model_id') as string || ''
  const ingediend_door = formData.get('ingediend_door') as string || 'Anoniem'

  const { error } = await supabase.from('submissions').insert({
    modelnaam,
    model_id,
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
    ingediend_door,
    image: filename,
    extra_images: extraFilenames.length > 0 ? extraFilenames : null,
    status: 'pending'
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: 'Royal Oak Club <onboarding@resend.dev>',
    to: 'koen@koensmulders.nl',
    subject: `Nieuwe submission: ${modelnaam}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; color: #1A1A1A;">
        <h1 style="font-size: 24px; font-weight: 400; margin-bottom: 8px;">Nieuwe horloge submission</h1>
        <p style="color: #888; font-size: 14px; margin-bottom: 32px;">Er staat een nieuw horloge klaar voor beoordeling.</p>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; color: #888; width: 140px;">Model</td>
            <td style="padding: 10px 0; font-weight: 500;">${modelnaam}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; color: #888;">Reference</td>
            <td style="padding: 10px 0;">${model_id}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; color: #888;">Foto's</td>
            <td style="padding: 10px 0;">${(filename ? 1 : 0) + extraFilenames.length}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; color: #888;">Ingediend door</td>
            <td style="padding: 10px 0;">${ingediend_door}</td>
          </tr>
        </table>
        <div style="margin-top: 32px;">
          <a href="https://royaloakclub.vercel.app/admin/submissions"
             style="background: #C9A84C; color: white; padding: 12px 28px; text-decoration: none; font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase;">
            Bekijk submission →
          </a>
        </div>
        <p style="margin-top: 32px; font-size: 12px; color: #BBB;">Royal Oak Club — Independent Archive</p>
      </div>
    `
  })

  return NextResponse.json({ success: true })
}
