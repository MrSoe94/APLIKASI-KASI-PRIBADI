const puppeteer = require('puppeteer');

async function testPasswordButton() {
    let browser;
    try {
        browser = await puppeteer.launch({ 
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Enable console logging from the page
        page.on('console', msg => {
            console.log('PAGE CONSOLE:', msg.text());
        });
        
        // Navigate to the app
        await page.goto('http://localhost:3000');
        
        // Wait for the page to load
        await page.waitForSelector('#passwordBtn', { timeout: 5000 });
        
        console.log('Password button found, clicking...');
        
        // Click the password button
        await page.click('#passwordBtn');
        
        // Wait a moment to see if modal appears
        await page.waitForTimeout(2000);
        
        // Check if modal is visible
        const modalVisible = await page.evaluate(() => {
            const modal = document.getElementById('passwordModal');
            return modal && modal.style.display !== 'none';
        });
        
        console.log('Modal visible:', modalVisible);
        
        if (modalVisible) {
            console.log('✅ SUCCESS: Password modal is working!');
        } else {
            console.log('❌ FAILED: Password modal did not appear');
        }
        
        // Take a screenshot for debugging
        await page.screenshot({ path: '/home/z/my-project/screenshot.png' });
        console.log('Screenshot saved to /home/z/my-project/screenshot.png');
        
    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

testPasswordButton();