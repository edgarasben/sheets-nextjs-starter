import { google } from 'googleapis'
import fs from 'fs'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const privatekey = JSON.parse(fs.readFileSync('google-keys.json', 'utf8'))

    const jwtClient = new google.auth.JWT(
      privatekey.client_email,
      undefined,
      privatekey.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    )

    await jwtClient.authorize()

    const sheets = google.sheets('v4')

    const spreadsheetId = privatekey.speadsheet_id
    const range = 'Sheet1!A1:C3'

    const response = await sheets.spreadsheets.values.get({
      auth: jwtClient,
      spreadsheetId,
      range
    })

    const data = response.data.values

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error accessing Google Sheets:', error)
    return NextResponse.json({ error: 'Error accessing Google Sheets' })
  }
}
