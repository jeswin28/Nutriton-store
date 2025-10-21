Run export:
  node scripts/export_triggers_to_csv.js
  -> generates exports/triggers.json and exports/triggers.csv

Optional: upload to Google Sheets
  1. Create service account JSON and share sheet with service account email.
  2. Set env vars:
     GOOGLE_SHEETS_CREDENTIALS_PATH=/path/to/key.json
     GOOGLE_SHEETS_SPREADSHEET_ID=yourSpreadsheetId
  3. Run:
     node scripts/upload_to_sheets.js

These scripts are intentionally dependency-free except for the Google API upload (requires 'googleapis' package).
To install googleapis:
  npm install googleapis
