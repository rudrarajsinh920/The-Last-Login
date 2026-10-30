import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const CLIENT_DIST = path.resolve('apps/client/dist');
const PORT = 5176;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2'
};

function createServer() {
  return http.createServer((req, res) => {
    let urlPath = req.url.split('?')[0];
    if (urlPath === '/') urlPath = '/index.html';
    let filePath = path.join(CLIENT_DIST, urlPath);

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(CLIENT_DIST, 'index.html');
    }

    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
}

async function verify() {
  const server = createServer();
  await new Promise(resolve => server.listen(PORT, resolve));
  console.log(`Verification server running on http://localhost:${PORT}`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  const viewports = [
    { name: 'Mobile-320', width: 320, height: 700 },
    { name: 'Mobile-375', width: 375, height: 812 },
    { name: 'Mobile-390', width: 390, height: 844 },
    { name: 'Mobile-430', width: 430, height: 932 },
    { name: 'Tablet-768', width: 768, height: 1024 },
    { name: 'Laptop-1024', width: 1024, height: 768 },
    { name: 'Desktop-1440', width: 1440, height: 900 },
    { name: 'Desktop-1920', width: 1920, height: 1080 }
  ];

  console.log('\n--- VERIFYING RESPONSIVENESS ACROSS VIEWPORTS ---');
  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    const overflowCheck = await page.evaluate(() => {
      const sw = document.documentElement.scrollWidth;
      const iw = window.innerWidth;
      return { sw, iw, hasOverflow: sw > iw };
    });

    console.log(`[Viewport ${vp.name} (${vp.width}px)] doc=${overflowCheck.sw}px, win=${overflowCheck.iw}px, overflow=${overflowCheck.hasOverflow}`);
    if (overflowCheck.hasOverflow) {
      throw new Error(`Horizontal overflow detected at ${vp.name}!`);
    }
  }

  // Inspect elements and capture high-res desktop screenshot
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

  const bannerDetails = await page.evaluate(() => {
    const banner = document.querySelector('[aria-label*="Papel Picado"]');
    const ghost = document.querySelector('[aria-label*="Ghost"]');
    const animatedFlags = document.querySelectorAll('.animate-ofrenda-color');
    const breezeLeft = document.querySelectorAll('.animate-breeze-left');
    const breezeRight = document.querySelectorAll('.animate-breeze-right');

    return {
      hasBanner: !!banner,
      hasGhost: !!ghost,
      animatedFlagCount: animatedFlags.length,
      breezeLeftCount: breezeLeft.length,
      breezeRightCount: breezeRight.length
    };
  });

  console.log('\n--- BANNER & GHOST DOM VERIFICATION ---');
  console.log('Banner detected:', bannerDetails.hasBanner);
  console.log('Ghost detected:', bannerDetails.hasGhost);
  console.log('Animated 6-color flags count:', bannerDetails.animatedFlagCount);
  console.log('Left breeze flags:', bannerDetails.breezeLeftCount);
  console.log('Right breeze flags:', bannerDetails.breezeRightCount);

  // Capture screenshot of the top section with banner and ghost
  const screenshotPath = path.join('docs', 'screenshots', 'landing-page-animated-banner-ghost.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`\nScreenshot saved: ${screenshotPath}`);

  // Mobile screenshot as well
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
  const mobileScreenshotPath = path.join('docs', 'screenshots', 'landing-mobile-banner-ghost.png');
  await page.screenshot({ path: mobileScreenshotPath, fullPage: false });
  console.log(`Mobile screenshot saved: ${mobileScreenshotPath}`);

  console.log('\nConsole errors caught during verification:', consoleErrors.length);

  await browser.close();
  server.close();
}

verify().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
