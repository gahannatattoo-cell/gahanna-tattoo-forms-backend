# Gahanna Tattoo Intake Forms Backend

Backend service for automated PDF generation and Dropbox sync.

## What This Does

- Receives form data from iPad intake forms
- Generates professional PDF documents
- Uploads to Dropbox with proper naming (`YYYY-MM-DD_LastName_FirstName_Artist_FormType_ID.pdf`)
- Manages "In Progress" and "Completed" folders
- Automatically deletes local copies after upload

## Deployment to Railway

### Prerequisites
✅ Railway account created
✅ Dropbox API token obtained

### Step 1: Create New Project on Railway

1. Go to https://railway.app
2. Click **New Project**
3. Choose **Deploy from GitHub repo**
4. If you haven't connected GitHub yet:
   - Click **Configure GitHub App**
   - Authorize Railway
   - Select the repo containing this backend

### Step 2: Add Environment Variables

In Railway project settings, add these variables:

```
DROPBOX_TOKEN=<your-token-from-earlier>
PORT=3000
```

(Port will be auto-set by Railway, but good to have as fallback)

### Step 3: Deploy

Railway will automatically:
- Detect Node.js project
- Install dependencies
- Start the server
- Give you a public URL (like `https://gahanna-tattoo-forms.up.railway.app`)

### Step 4: Test Deployment

Once deployed, visit:
```
https://your-app-url.railway.app/health
```

You should see:
```json
{"status":"ok","service":"Gahanna Tattoo Forms Backend"}
```

Also test Dropbox connection:
```
https://your-app-url.railway.app/api/test-dropbox
```

Should return your Dropbox account name.

### Step 5: Update Form URLs

Copy your Railway URL and update the forms (Sophia will do this for you).

## API Endpoints

### `POST /api/forms/client-complete`
Saves form to Dropbox "In Progress" folder

**Body:**
```json
{
  "formHtml": "<html>...</html>",
  "filename": "2026-03-09_Smith_Jane_Brett_TattooAdult_000472.pdf"
}
```

### `POST /api/forms/artist-complete`
Moves form to "Completed" folder and removes from "In Progress"

**Body:**
```json
{
  "formHtml": "<html>...</html>",
  "filename": "2026-03-09_Smith_Jane_Brett_TattooAdult_000472.pdf"
}
```

### `GET /health`
Health check endpoint

### `GET /api/test-dropbox`
Test Dropbox API connection

## Dropbox Folder Structure

```
/Intake Forms/
  ├── In Progress/     (client completed, waiting for artist)
  └── Completed/       (fully processed forms)
```

## Troubleshooting

**Forms not uploading?**
- Check Railway logs for errors
- Verify DROPBOX_TOKEN is set correctly
- Test `/api/test-dropbox` endpoint

**PDF generation failing?**
- Check Puppeteer/Chromium installation in Railway logs
- Verify nixpacks.toml is present

**Need to redeploy?**
- Push changes to GitHub
- Railway auto-deploys on push

## Support

Built by Sophia for Gahanna Tattoo
Questions? Text Brett and he'll loop me in via iMessage.
