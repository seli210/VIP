const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwry3iEOxG-aKW5CWYa6uXc-gN2GB5jcAOCDd33hjGQLxZb4LO9cpikZgalFcRIqnf0/exec';

// Fetch all VIPs from Google Sheets
async function getVIPs() {
    try {
        const response = await fetch(SCRIPT_URL);
        const data = await response.json();
        return data; // Returns array of VIPs
    } catch (e) {
        console.error("Error fetching VIPs", e);
        return [];
    }
}

// Update attendance to true
async function updateVIPAttendance(id, attendedStatus) {
    try {
        const response = await fetch(`${SCRIPT_URL}?action=attend&id=${id}`);
        const result = await response.json();
        
        window.dispatchEvent(new Event('storage'));
        return result.success;
    } catch (e) {
        console.error("Error updating attendance", e);
        return false;
    }
}
