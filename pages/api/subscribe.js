import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") return res.status(200).end()
  if (req.method !== "POST") return res.status(405).end()

  const { email, name, surname, city, country } = req.body
  if (!email) return res.status(400).json({ error: "Email required" })

  try {
    const airtableRes = await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_ID}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          Email: email,
          Name: name || "",
          Surname: surname || "",
          City: city || "",
          Country: country || "",
          "Subscribed at": new Date().toISOString().split("T")[0],
          Status: "Active",
        },
      }),
    })

    const airtableData = await airtableRes.json()

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

    return res.status(200).json({ success: true, airtable: airtableData })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
