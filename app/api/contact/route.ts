import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SUPPORT_TO = process.env.SUPPORT_TO_EMAIL || 'apputilitybuilder@gmail.com'
const MAX_MESSAGE_LENGTH = 5000

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 255
}

/**
 * Contact / support form — emails apputilitybuilder@gmail.com
 * (same inbox as CreatorFlow365 / ReadAI support).
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      name?: string
      email?: string
      subject?: string
      message?: string
    }

    const name = body.name?.trim() ?? ''
    const email = body.email?.trim().toLowerCase() ?? ''
    const subject = body.subject?.trim() || 'general'
    const message = body.message?.trim() ?? ''

    if (!name || name.length > 200) {
      return NextResponse.json({ error: 'Enter your name.' }, { status: 400 })
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 })
    }
    if (message.length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters.' },
        { status: 400 }
      )
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: 'Message is too long.' }, { status: 400 })
    }

    const user = process.env.EMAIL_USER
    const pass = process.env.EMAIL_PASS
    if (!user || !pass) {
      return NextResponse.json(
        {
          error:
            'Support mail is not set up on the server yet. Please try again later or email apputilitybuilder@gmail.com.',
        },
        { status: 503 }
      )
    }

    const safeName = name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    const safeMessage = message
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    const safeSubject = subject.replace(/[^\w\s\-]/g, '').slice(0, 80) || 'general'

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    })

    await transporter.sendMail({
      from: `ToolMarket365 Support <${user}>`,
      to: SUPPORT_TO,
      replyTo: email,
      subject: `ToolMarket365 Support (${safeSubject}): ${email}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2 style="margin: 0 0 12px 0;">ToolMarket365 Support Message</h2>
          <p style="margin: 0 0 8px 0;"><strong>From:</strong> ${safeName} &lt;${email}&gt;</p>
          <p style="margin: 0 0 12px 0;"><strong>Subject:</strong> ${safeSubject}</p>
          <div style="white-space: pre-wrap; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px;">
            ${safeMessage}
          </div>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (error: unknown) {
    console.error('Contact route error:', error)
    return NextResponse.json({ error: 'Could not send your message.' }, { status: 500 })
  }
}
