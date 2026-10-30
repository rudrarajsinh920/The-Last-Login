import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const screenshotsDir = path.resolve(__dirname, '../docs/screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const routes = [
  { name: '01-landing-page.png', path: '/' },
  { name: '02-dashboard.png', path: '/dashboard' },
  { name: '03-inventory.png', path: '/inventory' },
  { name: '04-decisions.png', path: '/decisions' },
  { name: '05-living-seance.png', path: '/seance' },
  { name: '06-legacy-letters.png', path: '/letters' },
  { name: '07-sealed-ofrenda.png', path: '/sealed-ofrenda' },
  { name: '08-memorial-preview.png', path: '/memorial-preview' },
  { name: '09-settings.png', path: '/settings' },
];

async function capture() {
  console.log('Launching Chrome from:', chromePath);
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  for (const route of routes) {
    const url = `http://localhost:5173${route.path}`;
    console.log(`Navigating to ${url}...`);
    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
      // Wait an extra second for animations and fonts to settle
      await new Promise(r => setTimeout(r, 1200));
      const dest = path.join(screenshotsDir, route.name);
      await page.screenshot({ path: dest, fullPage: false });
      console.log(`Saved screenshot: ${dest}`);
    } catch (err) {
      console.error(`Failed to capture ${route.path}:`, err.message);
    }
  }

  await browser.close();
  console.log('All route screenshots captured successfully.');
}

capture().catch(err => {
  console.error('Fatal error during capture:', err);
  process.exit(1);
});
