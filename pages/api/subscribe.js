import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") return res.status(200).end()
  if (req.method !== "POST") return res.status(405).end()

  const { email } = req.body
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
      html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f5f5;padding:48px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;padding:48px;">

        <tr><td style="padding-bottom:48px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="120" height="50" viewBox="0 0 120 50">
            <path d="M 15.12 40.41 C 15.319 39.342 15.534 38.274 15.928 37.252 C 17.048 33.937 18.06 30.586 19.278 27.306 C 20.53 23.817 21.534 20.254 22.59 16.707 C 23.044 15.344 23.681 14.036 24.096 12.661 L 24.108 12.626 C 24.303 11.973 24.446 11.282 24.594 10.61 C 24.909 9.094 25.482 7.633 25.837 6.136 C 25.917 5.802 26.048 5.484 26.14 5.158 C 26.825 4.074 27.235 2.793 26.81 1.681 C 26.116 -0.122 23.598 -0.719 22.506 1.123 C 22.02 1.948 22.096 2.648 21.876 3.528 C 21.721 4.156 21.681 4.494 21.622 5.213 C 21.61 5.378 21.562 5.547 21.558 5.703 C 21.546 5.775 21.486 5.865 21.478 5.936 C 21.311 7.224 20.653 8.352 20.211 9.546 C 19.905 10.256 19.486 10.916 19.091 11.585 C 18.299 12.881 17.701 14.287 16.976 15.627 C 16.797 15.991 16.516 16.294 16.167 16.499 C 14.908 17.19 13.713 17.992 12.51 18.777 C 9.964 20.459 7.561 22.384 5.474 24.607 C 4.446 25.915 3.625 27.365 2.876 28.837 C 1.238 31.659 0.78 33.085 1.091 36.373 C 1.099 37.19 0.931 38.031 1.234 38.817 C 1.569 39.697 2.509 40.29 3.458 40.207 C 6.024 39.52 7.924 36.593 9.45 34.586 C 9.932 33.922 10.49 33.321 11.044 32.72 C 12.087 31.592 12.884 30.257 13.797 29.023 C 14.024 28.701 14.279 28.367 14.506 28.037 C 14.449 28.193 14.4 28.352 14.358 28.513 C 13.765 30.477 13.247 32.465 12.498 34.381 C 11.658 36.632 11.064 38.961 10.546 41.303 C 10.127 42.262 9.366 43.381 8.988 44.485 C 7.964 47.49 12.658 49.443 14.163 46.645 C 14.466 46.08 14.681 45.545 14.665 44.913 C 14.857 44.002 15.04 43.071 15.119 42.163 C 15.159 41.703 15.079 41.256 15.095 40.8 C 15.1 40.67 15.111 40.541 15.119 40.411 Z" fill="#000000"></path>
          </svg>
        </td></tr>

        <tr><td style="padding-bottom:16px;font-size:16px;line-height:150%;color:#999999;letter-spacing:-0.02em;">
          Good to have you here.
        </td></tr>

        <tr><td style="padding-bottom:48px;font-size:16px;line-height:150%;color:#000000;letter-spacing:-0.02em;">
          Here's 10% off your first order — a small gift to get started.
        </td></tr>

        <tr><td style="padding-bottom:48px;">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr><td style="background-color:#000000;padding:12px 24px;font-size:16px;letter-spacing:0.1em;color:#ffffff;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
              WELCOME10
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding-bottom:48px;font-size:14px;line-height:150%;color:#999999;letter-spacing:-0.02em;">
          Apply at checkout. No expiry.
        </td></tr>

        <tr><td style="border-top:1px solid #e0e0e0;padding-bottom:24px;"></td></tr>

        <tr><td style="font-size:13px;line-height:150%;color:#999999;letter-spacing:-0.02em;">
          © 2026 DÉRIVE — Sadulska 20, 04-660 Warszawa
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
    })

    return res.status(200).json({ success: true, airtable: airtableData })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
