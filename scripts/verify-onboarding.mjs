import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const CLIENT_DIST = path.resolve('apps/client/dist');
const PORT = 5177;

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

async function verifyOnboarding() {
  const server = createServer();
  await new Promise(resolve => server.listen(PORT, resolve));
  console.log(`Test server running on http://localhost:${PORT}`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    console.log('\n--- 1. FIRST-TIME VISITOR JOURNEY ---');
    // Clear any existing localStorage
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      localStorage.clear();
    });
    // Reload as fresh visitor
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    // Check if onboarding modal is auto-opened
    const isModalOpenFirstVisit = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"][aria-labelledby="onboarding-modal-title"]');
      const ghost = modal ? modal.querySelector('[aria-label*="Ghost"]') : null;
      return { hasModal: !!modal, hasGhost: !!ghost };
    });
    console.log('First-time visitor: Modal auto-opened:', isModalOpenFirstVisit.hasModal, 'Ghost present in modal:', isModalOpenFirstVisit.hasGhost);
    if (!isModalOpenFirstVisit.hasModal) throw new Error('Onboarding modal did not auto-open for first-time visitor!');

    // Check Step 0 content
    const step0Title = await page.evaluate(() => document.getElementById('onboarding-modal-title')?.innerText);
    console.log('Step 0 Title:', step0Title);

    // Click Continue through steps
    for (let s = 1; s <= 4; s++) {
      await page.evaluate(() => {
        const continueBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Continue'));
        if (continueBtn) continueBtn.click();
      });
      await new Promise(r => setTimeout(r, 400));
      const currentStep = await page.evaluate((sNum) => {
        const text = document.querySelector('[role="dialog"]')?.innerText || '';
        return text.includes(`Step ${sNum + 1} of 6`);
      }, s);
      console.log(`Advanced to Step ${s} (Step ${s + 1} of 6):`, currentStep);
    }

    // Now on Step 4: Test Creating First Legacy Item
    console.log('\n--- 2. GUIDED FIRST ITEM CREATION IN ONBOARDING ---');
    const createdItem = await page.evaluate(async () => {
      const saveBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Save First Memory'));
      if (saveBtn) {
        saveBtn.click();
        return true;
      }
      return false;
    });
    console.log('Clicked "Save First Memory":', createdItem);
    await new Promise(r => setTimeout(r, 800));

    // Verify success banner appears
    const successCardText = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]');
      return modal ? modal.innerText.includes('Saved to Inventory!') : false;
    });
    console.log('Success confirmation card displayed:', successCardText);
    if (!successCardText) throw new Error('Item creation confirmation did not display!');

    // Proceed to Step 5 (Finish)
    await page.evaluate(() => {
      const proceedBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Proceed to Finish'));
      if (proceedBtn) proceedBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    // Finish onboarding
    await page.evaluate(() => {
      const finishBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Enter My Estate Space') || b.innerText.includes('Get Started'));
      if (finishBtn) finishBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Verify modal is closed and localStorage is set
    const postCompletion = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"][aria-labelledby="onboarding-modal-title"]');
      const completed = localStorage.getItem('last_login_onboarding_completed_v1');
      return { hasModal: !!modal, completed };
    });
    console.log('After finishing: Modal closed:', !postCompletion.hasModal, 'Completed in localStorage:', postCompletion.completed);
    if (postCompletion.completed !== 'true' || postCompletion.hasModal) throw new Error('Onboarding did not complete properly!');

    console.log('\n--- 3. RETURNING USER JOURNEY ---');
    // Reload page as returning user
    await page.goto(`http://localhost:${PORT}/dashboard`, { waitUntil: 'networkidle0' });
    const modalOnReturn = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"][aria-labelledby="onboarding-modal-title"]');
      return !!modal;
    });
    console.log('Returning user on /dashboard: Modal auto-opened:', modalOnReturn, '(Expected: false)');
    if (modalOnReturn) throw new Error('Onboarding modal popped up repeatedly for returning user!');

    // Replay Onboarding Guide from Dashboard
    console.log('\n--- 4. REPLAY ONBOARDING TOUR ---');
    await page.evaluate(() => {
      const tourBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Onboarding Tour'));
      if (tourBtn) tourBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    const replayedModal = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"][aria-labelledby="onboarding-modal-title"]');
      return !!modal;
    });
    console.log('Replaying from Dashboard: Modal opened:', replayedModal);
    if (!replayedModal) throw new Error('Could not replay onboarding from Dashboard!');

    // Dismiss using Skip
    await page.evaluate(() => {
      const skipBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Skip to Estate'));
      if (skipBtn) skipBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    console.log('\n--- 5. RESPONSIVENESS CHECKS ON ONBOARDING MODAL ---');
    const viewports = [
      { name: 'Mobile-320', width: 320, height: 700 },
      { name: 'Mobile-390', width: 390, height: 844 },
      { name: 'Tablet-768', width: 768, height: 1024 },
      { name: 'Desktop-1440', width: 1440, height: 900 }
    ];

    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: vp.height });
      // Reopen modal to inspect responsiveness
      await page.evaluate(() => {
        const tourBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Onboarding Tour'));
        if (tourBtn) tourBtn.click();
      });
      await new Promise(r => setTimeout(r, 400));

      const overflow = await page.evaluate(() => {
        const sw = document.documentElement.scrollWidth;
        const iw = window.innerWidth;
        return { sw, iw, hasOverflow: sw > iw };
      });
      console.log(`[Viewport ${vp.name}] scrollWidth=${overflow.sw}px, innerWidth=${overflow.iw}px, overflow=${overflow.hasOverflow}`);
      if (overflow.hasOverflow) throw new Error(`Overflow on viewport ${vp.name}`);

      if (vp.name === 'Desktop-1440') {
        await page.screenshot({ path: 'docs/screenshots/onboarding-modal-desktop.png' });
        console.log('Saved screenshot: docs/screenshots/onboarding-modal-desktop.png');
      } else if (vp.name === 'Mobile-390') {
        await page.screenshot({ path: 'docs/screenshots/onboarding-modal-mobile.png' });
        console.log('Saved screenshot: docs/screenshots/onboarding-modal-mobile.png');
      }

      // Close modal
      await page.keyboard.press('Escape');
      await new Promise(r => setTimeout(r, 300));
    }

    console.log('\nALL ONBOARDING VERIFICATION JOURNEYS PASSED CLEANLY (0 ERRORS)!');
  } catch (err) {
    console.error('Onboarding verification error:', err);
    process.exit(1);
  } finally {
    await browser.close();
    server.close();
  }
}

verifyOnboarding();
