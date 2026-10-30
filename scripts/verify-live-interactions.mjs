import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const LIVE_URL = 'https://the-last-login-green.vercel.app';

async function testInteractions() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    const routes = [
      '/',
      '/dashboard',
      '/inventory',
      '/seance',
      '/decisions',
      '/letters',
      '/sealed-ofrenda',
      '/memorial-preview',
      '/settings'
    ];

    console.log('Testing live routes on Vercel:');
    for (const r of routes) {
      await page.setViewport({ width: 1440, height: 900 });
      await page.goto(`${LIVE_URL}${r}`, { waitUntil: 'networkidle0', timeout: 20000 });

      const check = await page.evaluate((route) => {
        const sw = document.documentElement.scrollWidth;
        const iw = window.innerWidth;
        const ghost = document.querySelector('[aria-label*="Ghost"]');
        return {
          route,
          hasGhost: !!ghost,
          hasOverflow: sw > iw,
          sw,
          iw
        };
      }, r);

      console.log(`[Route ${r}] Ghost present: ${check.hasGhost}, Overflow: ${check.hasOverflow} (${check.sw}px / ${check.iw}px)`);
      if (check.hasOverflow) {
        throw new Error(`Overflow on ${r}`);
      }
    }

    console.log('\nTesting mobile responsiveness (390px):');
    for (const r of ['/', '/dashboard', '/inventory', '/decisions']) {
      await page.setViewport({ width: 390, height: 844 });
      await page.goto(`${LIVE_URL}${r}`, { waitUntil: 'networkidle0', timeout: 20000 });

      const mobileCheck = await page.evaluate((route) => {
        const sw = document.documentElement.scrollWidth;
        const iw = window.innerWidth;
        return {
          route,
          hasOverflow: sw > iw,
          sw,
          iw
        };
      }, r);

      console.log(`[Mobile 390px ${r}] Overflow: ${mobileCheck.hasOverflow} (${mobileCheck.sw}px / ${mobileCheck.iw}px)`);
      if (mobileCheck.hasOverflow) {
        throw new Error(`Mobile overflow on ${r}`);
      }
    }

    console.log('\nALL LIVE VERCEL TESTS PASSED WITH 0 OVERFLOW!');
  } catch (err) {
    console.error('Error during live verification:', err);
  } finally {
    await browser.close();
  }
}

testInteractions();
