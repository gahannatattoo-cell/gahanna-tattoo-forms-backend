# ✅ Deployment Checklist

Follow this checklist in order. Each step takes 1-2 minutes.

## Prerequisites
- [x] Railway account created
- [x] Dropbox API token obtained
- [ ] GitHub account ready

---

## Phase 1: Code Setup (5 minutes)

### Step 1: Create GitHub Repository
- [ ] Go to https://github.com/new
- [ ] Name: `gahanna-tattoo-forms-backend`
- [ ] Click "Create repository"
- [ ] Copy the repository URL

### Step 2: Push Code
```bash
cd /Users/jonathanprince/.openclaw/workspace/intake-forms-backend
git init
git add .
git commit -m "Initial deployment"
git branch -M main
git remote add origin <PASTE_YOUR_REPO_URL_HERE>
git push -u origin main
```

---

## Phase 2: Railway Deployment (3 minutes)

### Step 3: Deploy to Railway
- [ ] Go to https://railway.app/dashboard
- [ ] Click "New Project"
- [ ] Choose "Deploy from GitHub repo"
- [ ] Select `gahanna-tattoo-forms-backend`
- [ ] Wait for deployment to complete

### Step 4: Add Environment Variable
- [ ] Click "Variables" tab in Railway
- [ ] Add new variable:
  - Name: `DROPBOX_TOKEN`
  - Value: `<your-dropbox-token>`
- [ ] Click "Add"

### Step 5: Get Your URL
- [ ] Go to "Settings" tab
- [ ] Under "Networking" → Click "Generate Domain"
- [ ] Copy the URL (e.g., `https://your-app.up.railway.app`)

---

## Phase 3: Verification (2 minutes)

### Step 6: Test Backend
Visit these URLs in your browser:

- [ ] Health check: `https://your-url/health`
  - Should show: `{"status":"ok","service":"Gahanna Tattoo Forms Backend"}`

- [ ] Dropbox test: `https://your-url/api/test-dropbox`
  - Should show your Dropbox account name

### Step 7: Create Dropbox Folders
- [ ] Go to dropbox.com
- [ ] Create folder: `Intake Forms`
- [ ] Inside it, create: `In Progress`
- [ ] Inside it, create: `Completed`

(Or I can do this for you via API)

---

## Phase 4: Final Integration

### Step 8: Send URL to Sophia
- [ ] Copy your Railway URL
- [ ] Text it to me via iMessage (through Brett's phone)

### What I'll Do:
- Update all 4 HTML forms with your backend URL
- Test the complete workflow
- Deliver final forms ready for iPad deployment

---

## You're Done! 🎉

Once I update the forms, you'll have:
- ✅ 4 professional intake forms
- ✅ Automatic PDF generation
- ✅ Dropbox sync (no manual uploads)
- ✅ Proper file organization
- ✅ Secure cloud hosting

---

## Stuck? Need Help?

Text me via iMessage! I'm here to help.

**Estimated Total Time: 10-15 minutes**
