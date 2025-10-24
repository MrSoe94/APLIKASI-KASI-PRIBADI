const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

const PASSWORD_FILE = path.join(__dirname, '..', 'data', 'password.json');

// Password storage functions
async function loadPassword() {
    try {
        const data = await fs.readFile(PASSWORD_FILE, 'utf8');
        const parsed = JSON.parse(data);
        return parsed.password || null;
    } catch (error) {
        // File doesn't exist or is corrupted, return null
        return null;
    }
}

async function savePassword(password) {
    try {
        // Ensure data directory exists
        const dataDir = path.dirname(PASSWORD_FILE);
        await fs.mkdir(dataDir, { recursive: true });
        
        await fs.writeFile(PASSWORD_FILE, JSON.stringify({ 
            password: password,
            updatedAt: new Date().toISOString()
        }), 'utf8');
        return true;
    } catch (error) {
        console.error('Failed to save password:', error);
        return false;
    }
}

// Setup password endpoint
router.post('/setup-password', async (req, res) => {
    try {
        const { password } = req.body;
        
        if (!password || password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }
        
        const saved = await savePassword(password);
        if (saved) {
            res.json({ success: true, message: 'Password setup successful' });
        } else {
            res.status(500).json({ error: 'Failed to setup password' });
        }
    } catch (error) {
        console.error('Setup password error:', error);
        res.status(500).json({ error: 'Failed to setup password' });
    }
});

// Check if password exists
router.get('/setup-password', async (req, res) => {
    try {
        const storedPassword = await loadPassword();
        res.json({ hasPassword: !!storedPassword });
    } catch (error) {
        console.error('Check password error:', error);
        res.status(500).json({ error: 'Failed to check password' });
    }
});

// Verify password endpoint
router.post('/verify-password', async (req, res) => {
    try {
        const { password } = req.body;
        
        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }
        
        const storedPassword = await loadPassword();
        
        // Allow hardcoded password 'Sugandi94' as default/master password
        const isValid = password === 'Sugandi94' || password === storedPassword;
        
        if (isValid) {
            res.json({ success: true, message: 'Password verified' });
        } else {
            res.status(401).json({ error: 'Invalid password' });
        }
    } catch (error) {
        console.error('Verify password error:', error);
        res.status(500).json({ error: 'Failed to verify password' });
    }
});

// Change password endpoint
router.post('/change-password', async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current password and new password are required' });
        }
        
        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'New password must be at least 6 characters' });
        }
        
        const storedPassword = await loadPassword();
        
        // Verify current password (allow hardcoded password 'Sugandi94' as default)
        const isValid = currentPassword === 'Sugandi94' || currentPassword === storedPassword;
        
        if (!isValid) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }
        
        // Save new password
        const saved = await savePassword(newPassword);
        if (saved) {
            res.json({ success: true, message: 'Password changed successfully' });
        } else {
            res.status(500).json({ error: 'Failed to change password' });
        }
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Failed to change password' });
    }
});

module.exports = router;