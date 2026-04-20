import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = "https://tiinckbwtmwrmmpuhfsy.supabase.co"
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!
const BUCKET = "watch-images"

const headers = {
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json'
}

export async function GET(request: NextRequest) {
  const watchId = request.nextUrl.searchParams.get('watchId')
  if (!watchId) return NextResponse.json([], { status: 200 })

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/watch_images?watch_id=eq.${watchId}&order=sort_order.asc`,
    { headers }
  )
  const data = await res.json()
  return NextResponse.json(data)
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  const filename = request.nextUrl.searchParams.get('filename')
  if (!id || !filename) return NextResponse.json({ error: 'Missing params' }, { status: 400 })

  await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${encodeURIComponent(filename)}`, {
    method: 'DELETE',
    headers
  })

  await fetch(`${SUPABASE_URL}/rest/v1/watch_images?id=eq.${id}`, {
    method: 'DELETE',
    headers
  })

  return NextResponse.json({ success: true })
}
