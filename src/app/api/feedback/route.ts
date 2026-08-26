import { NextRequest, NextResponse } from 'next/server'
import { waitUntil } from '@vercel/functions'
import { createClient } from '@/lib/supabase-server'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  const body = await request.json()

  const honeypot = body.honeypot as string
  if (honeypot) return NextResponse.json({ error: 'Bot detected' }, { status: 400 })

  const message = (body.message as string || '').trim()
  const context = (body.context as string || '').trim() || null
  if (!message) return NextResponse.json({ error: 'Message is required' }, { status: 400 })

  const supabase = await createClient()
  const { error } = await supabase.from('feedback').insert({
    message,
    context,
    status: 'new',
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const resend = new Resend(process.env.RESEND_API_KEY)
  waitUntil(
    resend.emails.send({
      from: 'Royal Oak Club <noreply@royaloakclub.frankdebruijn.com>',
      to: ['gewoonfrankdebruijn@gmail.com'],
      subject: 'Nieuwe feedback op Royal Oak Club',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; color: #1A1A1A;">
          <h1 style="font-size: 24px; font-weight: 400; margin-bottom: 8px;">Nieuwe feedback</h1>
          <p style="color: #888; font-size: 14px; margin-bottom: 24px; white-space: pre-wrap;">${message}</p>
          ${context ? `<p style="font-size: 13px; color: #AAA;">Context: ${context}</p>` : ''}
          <div style="margin-top: 32px;">
            <a href="https://royaloakclub.vercel.app/admin/feedback"
               style="background: #C9A84C; color: white; padding: 12px 28px; text-decoration: none; font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase;">
              Bekijk feedback →
            </a>
          </div>
        </div>
      `,
    }).then(({ error }) => {
      if (error) console.error('Resend: feedbackmail mislukt:', error)
    })
  )

  return NextResponse.json({ success: true })
}
