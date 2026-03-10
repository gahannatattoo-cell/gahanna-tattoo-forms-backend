require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const { Dropbox } = require('dropbox');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Initialize Dropbox
const dbx = new Dropbox({ accessToken: process.env.DROPBOX_TOKEN });

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Gahanna Tattoo Forms Backend' });
});

// Save form to "In Progress" folder (Client Complete)
app.post('/api/forms/client-complete', async (req, res) => {
  try {
    const { formHtml, filename } = req.body;

    if (!formHtml || !filename) {
      return res.status(400).json({ error: 'Missing formHtml or filename' });
    }

    // Generate PDF from HTML
    const pdfBuffer = await generatePDF(formHtml);

    // Upload to Dropbox "In Progress" folder
    const path = `/Intake Forms/In Progress/${filename}`;
    await dbx.filesUpload({
      path: path,
      contents: pdfBuffer,
      mode: 'overwrite',
      autorename: false
    });

    res.json({
      success: true,
      message: 'Form saved to In Progress folder',
      filename: filename,
      path: path
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
      '/Intake Forms/Completed'
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Gahanna Tattoo Forms Backend running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
