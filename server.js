require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const { Dropbox } = require('dropbox');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Initialize Dropbox
const dbx = new Dropbox({ accessToken: process.env.DROPBOX_TOKEN });

// Serve static HTML forms
app.use('/public', express.static(path.join(__dirname, 'public')));

// Clean form URLs
app.get('/forms/tattoo-adult', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Tattoo_Release_Adult.html'));
});

app.get('/forms/tattoo-minor', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Tattoo_Release_Minor.html'));
});

app.get('/forms/piercing-adult', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Piercing_Release_Adult.html'));
});

app.get('/forms/piercing-minor', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Piercing_Release_Minor.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Gahanna Tattoo Forms Backend' });
});

// Debug endpoint - check filesystem
app.get('/api/debug/files', (req, res) => {
  try {
    const publicDir = path.join(__dirname, 'public');
    const filesExist = fs.existsSync(publicDir);
    const files = filesExist ? fs.readdirSync(publicDir) : [];
    
    res.json({
      __dirname: __dirname,
      publicDir: publicDir,
      publicExists: filesExist,
      files: files
    });
  } catch (err) {
    res.json({ error: err.message });
  }
});

// Save form to "In Progress" folder (Client Complete)
app.post('/api/forms/client-complete', async (req, res) => {
  try {
    const { formHtml, filename, formData } = req.body;

    if (!formHtml || !filename) {
      return res.status(400).json({ error: 'Missing formHtml or filename' });
    }

    // Generate PDF from HTML
    const pdfBuffer = await generatePDF(formHtml);

    // Upload PDF to Dropbox "In Progress" folder
    const pdfPath = `/Intake Forms/In Progress/${filename}`;
    await dbx.filesUpload({
      path: pdfPath,
      contents: pdfBuffer,
      mode: 'overwrite',
      autorename: false
    });

    // Save form data as JSON to Data folder
    if (formData) {
      const jsonFilename = filename.replace('.pdf', '.json');
      const jsonPath = `/Intake Forms/Data/${jsonFilename}`;
      await dbx.filesUpload({
        path: jsonPath,
        contents: JSON.stringify(formData, null, 2),
        mode: 'overwrite',
        autorename: false
      });
    }

    res.json({
      success: true,
      message: 'Form saved to In Progress folder',
      filename: filename,
      path: pdfPath
    });

  } catch (error) {
    console.error('Error in client-complete:', error);
    res.status(500).json({
      error: 'Failed to save form',
      details: error.message
    });
  }
});

// Complete form and move to "Completed" folder (Artist Complete)
app.post('/api/forms/artist-complete', async (req, res) => {
  try {
    const { formHtml, filename } = req.body;

    if (!formHtml || !filename) {
      return res.status(400).json({ error: 'Missing formHtml or filename' });
    }

    // Generate PDF from HTML
    const pdfBuffer = await generatePDF(formHtml);

    // Upload to Dropbox "Completed" folder
    const completedPath = `/Intake Forms/Completed/${filename}`;
    await dbx.filesUpload({
      path: completedPath,
      contents: pdfBuffer,
      mode: 'overwrite',
      autorename: false
    });

    // Try to delete from "In Progress" folder (may not exist if direct completion)
    try {
      const inProgressPath = `/Intake Forms/In Progress/${filename}`;
      await dbx.filesDeleteV2({ path: inProgressPath });
    } catch (deleteError) {
      // File might not exist in In Progress - that's okay
      console.log('No file to delete from In Progress (likely direct completion)');
    }

    // Try to delete the JSON data file
    try {
      const jsonFilename = filename.replace('.pdf', '.json');
      const dataPath = `/Intake Forms/Data/${jsonFilename}`;
      await dbx.filesDeleteV2({ path: dataPath });
    } catch (deleteError) {
      // File might not exist - that's okay
      console.log('No data file to delete');
    }

    res.json({
      success: true,
      message: 'Form completed and saved',
      filename: filename,
      path: completedPath
    });

  } catch (error) {
    console.error('Error in artist-complete:', error);
    res.status(500).json({
      error: 'Failed to complete form',
      details: error.message
    });
  }
});

// Generate PDF from HTML using Puppeteer
async function generatePDF(html) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'Letter',
      landscape: true,
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      }
    });

    return pdfBuffer;

  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Test endpoint for Dropbox connectivity
app.get('/api/test-dropbox', async (req, res) => {
  try {
    const response = await dbx.usersGetCurrentAccount();
    res.json({
      success: true,
      account: response.result.name.display_name,
      email: response.result.email
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Setup endpoint - creates required Dropbox folder structure
app.post('/api/setup-folders', async (req, res) => {
  try {
    const folders = [
      '/Intake Forms',
      '/Intake Forms/In Progress',
      '/Intake Forms/Completed',
      '/Intake Forms/Data'
    ];

    const results = [];

    for (const folder of folders) {
      try {
        await dbx.filesCreateFolderV2({ path: folder });
        results.push({ path: folder, status: 'created' });
      } catch (error) {
        if (error.status === 409) {
          // Folder already exists
          results.push({ path: folder, status: 'already exists' });
        } else {
          results.push({ path: folder, status: 'failed', error: error.message });
        }
      }
    }

    res.json({
      success: true,
      message: 'Folder setup complete',
      results: results
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get list of incomplete forms
app.get('/api/incomplete-forms', async (req, res) => {
  try {
    const response = await dbx.filesListFolder({
      path: '/Intake Forms/Data'
    });

    const forms = response.result.entries
      .filter(entry => entry['.tag'] === 'file' && entry.name.endsWith('.json'))
      .map(entry => {
        // Parse filename: YYYY-MM-DD_LastName_FirstName_Artist_FormType_ID.json
        const parts = entry.name.replace('.json', '').split('_');
        return {
          id: entry.id,
          filename: entry.name,
          date: parts[0] || '',
          lastName: parts[1] || '',
          firstName: parts[2] || '',
          artist: parts[3] || '',
          formType: parts[4] || '',
          uniqueId: parts[5] || '',
          modified: entry.client_modified
        };
      })
      .sort((a, b) => new Date(b.modified) - new Date(a.modified));

    res.json({
      success: true,
      forms: forms
    });

  } catch (error) {
    console.error('Error listing incomplete forms:', error);
    
    // If folder doesn't exist, return empty list
    if (error.status === 409 || error.status === 400) {
      return res.json({
        success: true,
        forms: []
      });
    }
    
    res.status(500).json({
      error: 'Failed to list forms',
      details: error.message
    });
  }
});

// Get specific form data
app.get('/api/form-data/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const path = `/Intake Forms/Data/${filename}`;

    const response = await dbx.filesDownload({ path: path });
    const fileData = response.result.fileBinary.toString('utf-8');
    const formData = JSON.parse(fileData);

    res.json({
      success: true,
      formData: formData,
      filename: filename
    });

  } catch (error) {
    console.error('Error getting form data:', error);
    res.status(500).json({
      error: 'Failed to get form data',
      details: error.message
    });
  }
});

// Artist dashboard
app.get('/artist-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'artist-dashboard.html'));
});

// Resume form
app.get('/resume-form/:filename', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'resume-form.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Gahanna Tattoo Forms Backend running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
