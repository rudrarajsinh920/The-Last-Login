import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const LIVE_URL = 'https://the-last-login-green.vercel.app/';

async function checkLiveOnboarding() {
  console.log(`Checking live onboarding on ${LIVE_URL}...`);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // Emulate fresh user by clearing storage
    await page.goto(LIVE_URL, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.evaluate(() => localStorage.clear());
    await page.goto(LIVE_URL, { waitUntil: 'networkidle0', timeout: 30000 });

    const status = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"][aria-labelledby="onboarding-modal-title"]');
      const ghost = modal ? modal.querySelector('[aria-label*="Ghost"]') : null;
      return {
        hasModal: !!modal,
        hasGhostInModal: !!ghost,
        title: document.getElementById('onboarding-modal-title')?.innerText || null
      };
    });

    console.log('Live Vercel Onboarding Status:', status);
    await page.screenshot({ path: 'docs/screenshots/live-vercel-onboarding.png' });
    console.log('Saved screenshot to docs/screenshots/live-vercel-onboarding.png');
  } catch (err) {
    console.error('Error during live check:', err.message);
  } finally {
    await browser.close();
  }
}

checkLiveOnboarding();
