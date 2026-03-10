// Gahanna Tattoo Forms - Backend Integration
// Add this to all 4 forms (replace BACKEND_URL with your Railway URL)

const BACKEND_URL = 'YOUR_RAILWAY_URL_HERE'; // Will be updated after deployment

// Updated Client Complete Button Handler
async function handleClientComplete() {
    const date = document.getElementById('date').value;
    const lastName = document.getElementById('lastName').value;
    const firstName = document.getElementById('firstName').value;
    const artist = document.getElementById('artist').value;
    const uniqueID = generateUniqueID();
    
    const filename = `${date}_${lastName}_${firstName}_${artist}_FORMTYPE_${uniqueID}.pdf`;
    
    // Get complete form HTML
    const formHtml = document.documentElement.outerHTML;
    
    // Show loading state
    const statusMsg = document.getElementById('statusMessage');
    statusMsg.textContent = '⏳ Saving to Dropbox...';
    statusMsg.className = 'status-message';
    statusMsg.style.display = 'block';
    statusMsg.style.background = '#fff3cd';
    statusMsg.style.color = '#856404';
    
    try {
        const response = await fetch(`${BACKEND_URL}/api/forms/client-complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ formHtml, filename })
        });
        
        const result = await response.json();
        
        if (result.success) {
            statusMsg.textContent = '✅ Saved to In Progress folder! Hand iPad to staff.';
            statusMsg.className = 'status-message success';
            
            // Store filename for artist completion
            localStorage.setItem('currentFormID', uniqueID);
            localStorage.setItem('currentFilename', filename);
        } else {
            throw new Error(result.error || 'Upload failed');
        }
        
    } catch (error) {
        console.error('Upload error:', error);
        statusMsg.textContent = '❌ Upload failed. Please try again or save manually.';
        statusMsg.style.background = '#f8d7da';
        statusMsg.style.color = '#721c24';
        
        // Fallback: trigger browser print dialog
        setTimeout(() => {
            if (confirm('Upload failed. Open print dialog to save manually?')) {
                window.print();
            }
        }, 2000);
    }
}

// Updated Artist Complete Button Handler
async function handleArtistComplete() {
    const date = document.getElementById('date').value;
    const lastName = document.getElementById('lastName').value;
    const firstName = document.getElementById('firstName').value;
    const artist = document.getElementById('artist').value;
    const uniqueID = localStorage.getItem('currentFormID') || generateUniqueID();
    
    const filename = `${date}_${lastName}_${firstName}_${artist}_FORMTYPE_${uniqueID}.pdf`;
    
    // Get complete form HTML
    const formHtml = document.documentElement.outerHTML;
    
    // Show loading state
    const statusMsg = document.getElementById('statusMessage');
    statusMsg.textContent = '⏳ Completing and uploading...';
    statusMsg.className = 'status-message';
    statusMsg.style.display = 'block';
    statusMsg.style.background = '#fff3cd';
    statusMsg.style.color = '#856404';
    
    try {
        const response = await fetch(`${BACKEND_URL}/api/forms/artist-complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ formHtml, filename })
        });
        
        const result = await response.json();
        
        if (result.success) {
            statusMsg.textContent = '✅ Complete! Form saved to Dropbox. Ready for next client.';
            statusMsg.className = 'status-message success';
            
            // Clean up localStorage
            localStorage.removeItem('currentFormID');
            localStorage.removeItem('currentFilename');
            
            // Reset form after delay
            setTimeout(() => {
                if (confirm('Form complete! Reset for next client?')) {
                    location.reload();
                }
            }, 2000);
        } else {
            throw new Error(result.error || 'Upload failed');
        }
        
    } catch (error) {
        console.error('Upload error:', error);
        statusMsg.textContent = '❌ Upload failed. Please try again or save manually.';
        statusMsg.style.background = '#f8d7da';
        statusMsg.style.color = '#721c24';
        
        // Fallback: trigger browser print dialog
        setTimeout(() => {
            if (confirm('Upload failed. Open print dialog to save manually?')) {
                window.print();
            }
        }, 2000);
    }
}
