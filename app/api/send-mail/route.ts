import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const destination = 'bobs@posteo.de'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const apiKey = process.env.RESEND_API_KEY
    const from = process.env.MAIL_FROM
    if (!apiKey || !from) {
      return NextResponse.json({ sent:false, configured:false }, { status:200 })
    }
    const resend = new Resend(apiKey)
    const kind = body.kind === 'order' ? 'Neue Patenhuhn-Anfrage' : 'Neue Kontaktanfrage'
    const lines = Object.entries(body.data || {}).map(([k,v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : String(v)}`)
    const { error } = await resend.emails.send({
      from,
      to: destination,
      replyTo: body.replyTo || undefined,
      subject: kind,
      text: `${kind}\n\n${lines.join('\n')}`
    })
    if (error) return NextResponse.json({sent:false,error:String(error.message || error)}, {status:500})
    return NextResponse.json({sent:true})
  } catch (e:any) {
    return NextResponse.json({sent:false,error:e?.message || 'Mailfehler'}, {status:500})
  }
}
