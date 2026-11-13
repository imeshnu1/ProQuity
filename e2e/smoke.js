// Quick visual smoke run: opens each early screen and saves a screenshot.
const { chromium } = require('playwright');
const OUT = process.argv[2] || 'e2e-shots';
const BASE = process.argv[3] || 'http://localhost:8090';
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 1 });
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  await p.goto(BASE + '/');
  await p.waitForTimeout(800);
  await p.screenshot({ path: `${OUT}/00-splash.png` });
  await p.waitForTimeout(1800);
  await p.screenshot({ path: `${OUT}/01-welcome.png` });
  await p.getByTestId('get-started').click();
  await p.waitForTimeout(500);
  await p.getByTestId('role-seeker').click();
  await p.screenshot({ path: `${OUT}/02-role.png` });
  console.log('errors:', errs.slice(0, 10));
  await b.close();
})();
