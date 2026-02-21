const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();

        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
        page.on('response', response => {
            if (response.status() >= 400) {
                console.log('HTTP ERROR:', response.url(), response.status());
            }
        });

        await page.goto('http://localhost:5176/referrals', { waitUntil: 'networkidle0' });

        await browser.close();
    } catch (e) {
        console.error(e);
    }
})();
