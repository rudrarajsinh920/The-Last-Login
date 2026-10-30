import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const LIVE_URL = 'https://the-last-login-green.vercel.app/';

async function checkLive() {
  console.log(`Connecting to ${LIVE_URL}...`);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    const response = await page.goto(LIVE_URL, { waitUntil: 'networkidle0', timeout: 30000 });
    console.log(`Status code: ${response.status()}`);

    const result = await page.evaluate(() => {
      const banner = document.querySelector('[aria-label*="Papel Picado"]');
      const ghost = document.querySelector('[aria-label*="Ghost"]');
      const flags = document.querySelectorAll('.animate-ofrenda-color');
      const hairlines = document.querySelectorAll('.bg-gradient-to-r.from-olive-900\\/10');
      return {
        title: document.title,
        hasBanner: !!banner,
        hasGhost: !!ghost,
        colorFlagCount: flags.length,
        hasHairline: hairlines.length > 0
      };
    });

    console.log('Live inspection result:', result);
    await page.screenshot({ path: 'docs/screenshots/live-vercel-verification.png' });
    console.log('Saved screenshot to docs/screenshots/live-vercel-verification.png');
  } catch (err) {
    console.error('Live inspection error:', err.message);
  } finally {
    await browser.close();
  }
}

checkLive();
