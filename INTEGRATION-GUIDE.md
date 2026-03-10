# Form Integration Guide

## After Railway Deployment

Once you have your Railway URL (e.g., `https://gahanna-tattoo-forms.up.railway.app`), I'll update all 4 HTML forms with the backend integration.

## What Changes in the Forms

### Before (Current):
- "Client Complete" → Shows alert, saves locally
- "Artist Complete" → Shows alert, saves locally

### After (With Backend):
- "Client Complete" → Uploads PDF to Dropbox "In Progress" folder automatically
- "Artist Complete" → Uploads PDF to Dropbox "Completed" folder, deletes from "In Progress"

## Changes Made

For each form, I'll add/update:

1. **Backend URL constant** at top of JavaScript:
   ```javascript
   const BACKEND_URL = 'https://your-app.up.railway.app';
   ```

2. **Client Complete button handler** → sends form HTML to backend
3. **Artist Complete button handler** → sends form HTML to backend
4. **Error handling** → falls back to manual save if backend fails
5. **Loading states** → shows progress during upload

## Form Types

All 4 forms will be updated:
- `Tattoo_Release_Adult.html`
- `Tattoo_Release_Minor.html`
- `Piercing_Release_Adult.html`
- `Piercing_Release_Minor.html`

## Fallback Behavior

If the backend is unreachable:
- Shows error message
- Offers to open print dialog for manual save
- Form data is never lost

## Testing Checklist

Before deploying to shop iPads:

- [ ] Health check works: `https://your-url/health`
- [ ] Dropbox test works: `https://your-url/api/test-dropbox`
- [ ] Client Complete uploads to "In Progress"
- [ ] Artist Complete uploads to "Completed"
- [ ] Proper filename format
- [ ] PDF looks correct

---

**Ready?** Send me your Railway URL and I'll update the forms!
