const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET'
};

const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        // Check if password button exists
        const hasPasswordBtn = data.includes('id="passwordBtn"');
        const hasPasswordModal = data.includes('id="passwordModal"');
        const hasPasswordForm = data.includes('id="passwordForm"');
        
        console.log('Password button exists:', hasPasswordBtn);
        console.log('Password modal exists:', hasPasswordModal);
        console.log('Password form exists:', hasPasswordForm);
        
        if (hasPasswordBtn && hasPasswordModal && hasPasswordForm) {
            console.log('✅ All required HTML elements are present');
        } else {
            console.log('❌ Some HTML elements are missing');
        }
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.end();