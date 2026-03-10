# 🚀 DEPLOYMENT GUIDE - For Brett

## What You Need
- ✅ Railway account (done)
- ✅ Dropbox token (done)
- ✅ GitHub account
- ⏳ 5 minutes

## Step-by-Step Deployment

### Step 1: Push Code to GitHub

Option A - If you have GitHub Desktop:
1. Open GitHub Desktop
2. Add this repository (`intake-forms-backend` folder)
3. Commit with message: "Initial backend deployment"
4. Push to GitHub

Option B - Command line (I'll do this for you):
```bash
cd intake-forms-backend
git init
git add .
git commit -m "Initial backend deployment"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### Step 2: Connect to Railway

1. Go to https://railway.app/dashboard
2. Click **New Project**
3. Choose **Deploy from GitHub repo**
4. Select your `intake-forms-backend` repository
5. Railway will auto-detect it's a Node.js project

### Step 3: Add Environment Variables

1. In Railway, click your project
2. Go to **Variables** tab
3. Click **+ New Variable**
4. Add:
   ```
   DROPBOX_TOKEN = <paste your token from earlier>
   ```
5. Railway will automatically redeploy

### Step 4: Get Your Backend URL

1. In Railway, go to **Settings** tab
2. Under **Networking**, click **Generate Domain**
3. Copy the URL (looks like `https://gahanna-tattoo-forms-production.up.railway.app`)

### Step 5: Tell Me Your URL!

Send me the Railway URL via iMessage and I'll:
- Update all 4 HTML forms to use it
- Test the integration
- Give you the final forms ready for iPad deployment

---

## That's It!

Once you give me the URL, the system will be fully automated:
- Client fills form → clicks "Client Complete" → auto-saves to Dropbox "In Progress"
- Artist completes → clicks "Artist Complete" → moves to "Completed" folder
- No manual uploads
- No local file management

## Troubleshooting

**Deployment failed?**
- Check Railway build logs for errors
- Make sure all files are committed to GitHub

**Need help?**
- Text me (via Brett's phone)
- I'll walk you through it

---

Built with ✨ by Sophia
