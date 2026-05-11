import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  const { email } = req.body
  if (!email) return res.status(400).json({ error: "Email required" })

  try {
    await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_ID}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          Email: email,
          "Subscribed at": new Date().toISOString(),
          Status: "Active",
        },
      }),
    })

    await resend.emails.send({
      from: "DÉRIVE <hello@derive.studio>",
      to: email,
      subject: "Welcome — here's 10% off your first order",
      html: `
        <p>Thank you for subscribing.</p>
        <p>As a welcome, here's 10% off your first order:</p>
        <p><strong>WELCOME10</strong></p>
        <p>Apply at checkout. No expiry.</p>
        <p>— DÉRIVE</p>
      `,
    })

    return res.status(200).json({ success: true })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
