const http = require('http');

// Test if the app loads correctly
const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET'
};

const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log('=== TESTING PASSWORD BUTTON FUNCTIONALITY ===\n');
        
        // Check for required elements
        const checks = [
            { name: 'Password Button', test: data.includes('id="passwordBtn"') },
            { name: 'Password Modal', test: data.includes('id="passwordModal"') },
            { name: 'Password Form', test: data.includes('id="passwordForm"') },
            { name: 'Current Password Input', test: data.includes('id="currentPassword"') },
            { name: 'New Password Input', test: data.includes('id="newPassword"') },
            { name: 'Confirm Password Input', test: data.includes('id="confirmPassword"') },
            { name: 'App.js Script', test: data.includes('src="app.js"') }
        ];
        
        let allPassed = true;
        checks.forEach(check => {
            const status = check.test ? '✅ PASS' : '❌ FAIL';
            console.log(`${status} ${check.name}`);
            if (!check.test) allPassed = false;
        });
        
        console.log('\n=== SUMMARY ===');
        if (allPassed) {
            console.log('✅ All HTML elements are present!');
            console.log('📝 The password button should work when clicked.');
            console.log('🔧 If it still doesn\'t work, check browser console for JavaScript errors.');
        } else {
            console.log('❌ Some HTML elements are missing!');
        }
        
        console.log('\n=== MANUAL TESTING INSTRUCTIONS ===');
        console.log('1. Open http://localhost:3000 in your browser');
        console.log('2. Open browser developer tools (F12)');
        console.log('3. Click the "Ganti Password" button');
        console.log('4. Check console for debug messages');
        console.log('5. The modal should appear with password fields');
        console.log('6. Test with current password: 123456');
    });
});

req.on('error', (e) => {
    console.error(`Request failed: ${e.message}`);
});

req.end();