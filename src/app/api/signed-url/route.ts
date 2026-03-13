import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = "https://tiinckbwtmwrmmpuhfsy.supabase.co"
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!

export async function GET(request: NextRequest) {
  const filename = request.nextUrl.searchParams.get('filename')
  if (!filename) return NextResponse.json({ error: 'Missing filename' }, { status: 400 })

  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/sign/submissions/${encodeURIComponent(filename)}`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ expiresIn: 3600 })
  })

  const data = await res.json()
  const url = data.signedURL ? `${SUPABASE_URL}/storage/v1${data.signedURL}` : null
  return NextResponse.json({ url })
}
