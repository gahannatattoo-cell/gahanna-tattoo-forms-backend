# Dropbox Folder Setup

## Required Folder Structure

The backend expects this folder structure in your Dropbox:

```
/Intake Forms/
├── In Progress/
└── Completed/
```

## How To Create

### Option 1: Manual Setup (1 minute)

1. Go to dropbox.com
2. Create new folder: `Intake Forms`
3. Inside that folder, create: `In Progress`
4. Inside that folder, create: `Completed`

### Option 2: I'll Create Them (preferred)

Once your backend is deployed, I can hit a setup endpoint that creates these folders automatically.

## Folder Purposes

**In Progress:**
- Stores forms after "Client Complete" button
- Waiting for artist to complete procedure
- Staff can access if needed before completion

**Completed:**
- Final archive of all completed forms
- Moved here when "Artist Complete" is clicked
- Original is removed from "In Progress"

## Folder Permissions

Both folders are in YOUR Dropbox account. You control:
- Who can access them
- Sharing settings
- Backup/sync settings

## Naming Convention

Files are automatically named:
```
YYYY-MM-DD_LastName_FirstName_ArtistName_FormType_UniqueID.pdf
```

Example:
```
2026-03-09_Smith_Jane_Brett_TattooAdult_000472.pdf
2026-03-09_Johnson_Michael_Kacie_PiercingMinor_000473.pdf
```

This format allows:
- Easy sorting by date
- Quick client lookup by name
- Artist tracking
- Unique identification

## Search Tips

In Dropbox:
- Search by date: `2026-03-09`
- Search by client: `Smith`
- Search by artist: `Brett`
- Search by form type: `TattooAdult` or `PiercingMinor`

---

**Want me to create the folders for you?** 
Send me your Railway URL and I'll set it all up!
