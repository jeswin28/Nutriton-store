/**
 * Usage:
 *  - Create a Google service account and download JSON key file.
 *  - Share the target spreadsheet with the service account email.
 *  - Set env vars:
 *      GOOGLE_SHEETS_CREDENTIALS_PATH=/path/to/key.json
 *      GOOGLE_SHEETS_SPREADSHEET_ID=yourSpreadsheetId
 *  - Run: node scripts/upload_to_sheets.js
 *
 * This script reads exports/triggers.json (created by export_triggers_to_csv.js)
 * and writes rows to the first sheet, starting at A1, replacing existing content.
 */
const fs = require('fs');
const path = require('path');

const { google } = require('googleapis');

async function main() {
    const credPath = process.env.GOOGLE_SHEETS_CREDENTIALS_PATH;
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    if (!credPath || !spreadsheetId) {
        console.error('Set GOOGLE_SHEETS_CREDENTIALS_PATH and GOOGLE_SHEETS_SPREADSHEET_ID env vars.');
        process.exit(1);
    }
    if (!fs.existsSync(credPath)) {
        console.error('Credentials file not found at', credPath);
        process.exit(1);
    }

    const creds = JSON.parse(fs.readFileSync(credPath, 'utf8'));
    const clientEmail = creds.client_email;
    const privateKey = creds.private_key;
    if (!clientEmail || !privateKey) {
        console.error('Invalid service account JSON key.');
        process.exit(1);
    }

    const auth = new google.auth.JWT(
        clientEmail,
        null,
        privateKey,
        ['https://www.googleapis.com/auth/spreadsheets']
    );

    await auth.authorize();

    const sheets = google.sheets({ version: 'v4', auth });

    const jsonPath = path.join(__dirname, '..', 'exports', 'triggers.json');
    if (!fs.existsSync(jsonPath)) {
        console.error('Run export_triggers_to_csv.js first to generate exports/triggers.json');
        process.exit(1);
    }
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    // build rows with header
    const rows = [['Category', 'Trigger', 'Developer Work']];
    for (const r of data) {
        rows.push([r.category, r.trigger, r.developerWork]);
    }

    // clear sheet and write rows
    await sheets.spreadsheets.values.clear({ spreadsheetId, range: 'Sheet1' });
    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Sheet1!A1',
        valueInputOption: 'RAW',
        requestBody: { values: rows }
    });

    console.log('Uploaded', rows.length - 1, 'rows to spreadsheet', spreadsheetId);
}

main().catch(err => {
    console.error('Upload failed', err);
    process.exit(1);
});
