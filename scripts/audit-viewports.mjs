import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const CLIENT_DIST = path.resolve('apps/client/dist');
const PORT = 5174;

// MIME map
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

// Simple SPA static server
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
        res.end('Error loading file');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
}

const VIEWPORTS = [
  // Desktop
  { name: 'Desktop-1920x1080', width: 1920, height: 1080, type: 'desktop' },
  { name: 'Desktop-1440x900',  width: 1440, height: 900,  type: 'desktop' },
  { name: 'Desktop-1366x768',  width: 1366, height: 768,  type: 'desktop' },
  { name: 'Desktop-1280x800',  width: 1280, height: 800,  type: 'desktop' },
  // Tablet
  { name: 'Tablet-1024x768',   width: 1024, height: 768,  type: 'tablet' },
  { name: 'Tablet-768x1024',   width: 768,  height: 1024, type: 'tablet' },
  // Mobile
  { name: 'Mobile-430x932',    width: 430,  height: 932,  type: 'mobile' },
  { name: 'Mobile-390x844',    width: 390,  height: 844,  type: 'mobile' },
  { name: 'Mobile-375x812',    width: 375,  height: 812,  type: 'mobile' },
  { name: 'Mobile-360x800',    width: 360,  height: 800,  type: 'mobile' },
  { name: 'Mobile-320x700',    width: 320,  height: 700,  type: 'mobile' }
];

const ROUTES = [
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

async function main() {
  const server = createServer();
  await new Promise(resolve => server.listen(PORT, resolve));
  console.log(`Preview server listening at http://localhost:${PORT}`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const results = [];
  const errors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push({ type: 'console-error', text: msg.text() });
    }
  });

  page.on('pageerror', err => {
    errors.push({ type: 'page-error', text: err.message });
  });

  console.log('\nStarting Full Responsiveness & Quality Audit...');
  console.log(`Testing ${VIEWPORTS.length} viewports across ${ROUTES.length} routes (= ${VIEWPORTS.length * ROUTES.length} audits)...\n`);

  for (const vp of VIEWPORTS) {
    await page.setViewport({ width: vp.width, height: vp.height, isMobile: vp.type === 'mobile' });

    for (const route of ROUTES) {
      const url = `http://localhost:${PORT}${route}`;
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 10000 });
      // Allow minor animations
      await new Promise(r => setTimeout(r, 200));

      const audit = await page.evaluate(() => {
        const docScrollWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        const hasHorizontalOverflow = docScrollWidth > winWidth;
        const diff = docScrollWidth - winWidth;

        return {
          docScrollWidth,
          winWidth,
          hasHorizontalOverflow,
          diff
        };
      });

      const pass = !audit.hasHorizontalOverflow;
      results.push({
        viewport: vp.name,
        width: vp.width,
        height: vp.height,
        type: vp.type,
        route,
        pass,
        details: audit
      });

      // Capture high-fidelity screenshots for the target validation viewports
      const targetWidths = [390, 768, 1024, 1440, 1920];
      if (targetWidths.includes(vp.width) && route === '/inventory') {
        const screenshotPath = path.join('docs', 'screenshots', `responsive-${vp.width}px-inventory.png`);
        await page.screenshot({ path: screenshotPath, fullPage: false });
      }

      const icon = pass ? '✓ PASS' : '✗ FAIL';
      if (!pass) {
        console.log(`[${icon}] ${vp.name} on ${route} — OVERFLOW: doc=${audit.docScrollWidth}px > win=${audit.winWidth}px (+${audit.diff}px)`);
      }
    }
  }

  const failedCount = results.filter(r => !r.pass).length;
  const passedCount = results.filter(r => r.pass).length;

  console.log('\n================ AUDIT SUMMARY ================');
  console.log(`Total checks:  ${results.length}`);
  console.log(`Passed:        ${passedCount}`);
  console.log(`Failed:        ${failedCount}`);
  console.log(`Errors caught: ${errors.length}`);
  console.log('================================================\n');

  fs.writeFileSync('audit-results.json', JSON.stringify({ results, errors }, null, 2));

  await browser.close();
  server.close();
}

main().catch(err => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});
