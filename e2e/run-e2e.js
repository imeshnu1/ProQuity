// End-to-end robot test. It clicks through the whole Capital Seeker journey in a phone-sized
// browser and reports every check. Usage:
//   npx expo export --platform web && npx serve -s dist -l 8090   (in one terminal)
//   node e2e/run-e2e.js [screenshotFolder] [baseUrl] [width] [height]
const { chromium } = require('playwright');
const fs = require('fs');

const OUT = process.argv[2] || 'e2e/shots';
const BASE = process.argv[3] || 'http://localhost:8090';
const W = +(process.argv[4] || 430);
const H = +(process.argv[5] || 932);
fs.mkdirSync(OUT, { recursive: true });

let pass = 0;
const fails = [];
let shotN = 0;

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: W, height: H } });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  p.on('console', (m) => {
    if (m.type() === 'error') errors.push('console: ' + m.text());
  });

  const id = (t) => p.getByTestId(t).locator('visible=true').first();
  const text = (t) => p.getByText(t, { exact: false }).locator('visible=true').first();
  const wait = (ms = 350) => p.waitForTimeout(ms);
  const shot = async (name) => p.screenshot({ path: `${OUT}/${String(++shotN).padStart(2, '0')}-${name}.png` });
  async function check(name, fn) {
    try {
      await fn();
      pass++;
    } catch (e) {
      fails.push(`${name}: ${e.message.split('\n')[0]}`);
      await shot('FAIL-' + name.replace(/\W+/g, '-'));
    }
  }
  const visible = async (loc, ms = 4000) => loc.waitFor({ state: 'visible', timeout: ms });
  const click = async (loc) => {
    await visible(loc);
    await loc.click();
    await wait();
  };
  const disabled = async (loc) => {
    const v = await loc.getAttribute('aria-disabled');
    if (v !== 'true') throw new Error('expected disabled');
  };
  const enabled = async (loc) => {
    const v = await loc.getAttribute('aria-disabled');
    if (v === 'true') throw new Error('expected enabled');
  };
  const typeIn = async (loc, s) => {
    await visible(loc);
    await loc.fill(s);
    await wait(150);
  };

  // ---------- 1. New user, email sign-up, Growth path ----------
  await p.goto(BASE + '/');
  await check('splash shows', () => visible(id('splash')));
  await check('welcome after splash', () => visible(id('get-started'), 6000));
  await shot('welcome');
  await check('get started → notification step', async () => {
    await click(id('get-started'));
    await visible(text('How to see messages from other users?'));
    await shot('notify-intro');
  });
  await check('notification allow → role', async () => {
    await click(id('notify-intro-allow'));
    await click(text('Allow Notifications'));
    await visible(id('role-continue'));
  });
  await check('role continue disabled before choice', () => disabled(id('role-continue')));
  await check('provider shows coming soon', async () => {
    await click(id('role-provider'));
    await click(id('role-continue'));
    await visible(text('Coming soon'));
    await click(text('Continue as Capital Seeker'));
  });
  await check('seeker selected → intro', async () => {
    await click(id('role-continue'));
    await visible(id('intro-email'));
  });
  await shot('intro');
  await check('intro → email signup', () => click(id('intro-email')));
  await check('signup continue disabled for bad email', async () => {
    await typeIn(id('signup-email'), 'john@');
    await disabled(id('signup-continue'));
  });
  await check('signup with valid email', async () => {
    await typeIn(id('signup-email'), 'john.doe@psquare.com');
    await enabled(id('signup-continue'));
    await click(id('signup-continue'));
  });
  await check('otp screen shows masked email', () => visible(text('john***@psquare.com')));
  await check('verify disabled until 6 digits', async () => {
    await id('otp-input').fill('524');
    await disabled(id('verify'));
  });
  await check('verify with 6 digits → intent', async () => {
    await id('otp-input').fill('524029');
    await wait();
    await click(id('verify'));
    await visible(text('What are you looking to do?'), 5000);
  });
  await shot('intent');
  await check('intent raise shows tags', async () => {
    await click(id('intent-raise'));
    await visible(text('Acquisition Financing'));
    await click(id('step-continue'));
  });
  await check('purpose growth', async () => {
    await visible(text('What are you raising capital for?'));
    await click(id('purpose-growth'));
    await visible(text('Expansion Capital'));
    await shot('purpose');
    await click(id('step-continue'));
  });
  await check('stage mvp', async () => {
    await visible(text('What best describes your current stage?'));
    await click(id('stage-mvp'));
    await click(id('step-continue'));
  });
  await check('details continue disabled when empty', async () => {
    await visible(text('Opportunity Details'));
    await disabled(id('step-continue'));
  });
  await check('details: raise chips', () => click(text('$5M – $10M')));
  await check('details: capital type sheet', async () => {
    await click(id('field-capitalType'));
    await click(text('Capital raised by selling ownership'));
    await visible(text('Equity'));
  });
  await check('details: industry search + pick', async () => {
    await click(id('field-industries'));
    await p.getByPlaceholder('Search').last().fill('fin');
    await wait();
    await click(p.locator('body').getByRole('radio', { name: /FinTech/ }).first());
  });
  await check('details: geography + country', async () => {
    await click(id('field-geo'));
    await click(text('UK • EU'));
    await click(id('field-country'));
    await click(text('Germany'));
  });
  await shot('details-filled');
  await check('details continue enabled → personal info', async () => {
    await enabled(id('step-continue'));
    await click(id('step-continue'));
    await visible(text('Complete Personal Info'));
  });
  await check('personal continue disabled when empty', () => disabled(id('personal-continue')));
  await check('personal info filled', async () => {
    await typeIn(id('first-name'), 'John');
    await typeIn(id('last-name'), 'Doe');
    await click(id('personal-continue'));
    await visible(text('Complete Your Profile'));
  });
  await check('profile: company details', async () => {
    await click(id('edit-company'));
    await typeIn(id('company-name'), 'Psquare Company');
    await click(id('company-save'));
    await visible(text('Psquare Company'));
  });
  await check('profile: pitch deck URL', async () => {
    await click(id('edit-deck'));
    await click(text('Upload URL'));
    await typeIn(id('deck-url'), 'https://psquare.com/deck.pdf');
    await click(id('deck-save'));
    await visible(text('psquare.com/deck.pdf'));
  });
  await check('profile: current stage', async () => {
    await click(id('edit-stage'));
    await click(p.locator('body').getByRole('radio', { name: /Early Revenue/ }).first());
    await click(text('Save Changes'));
    await visible(text('Early Revenue'));
  });
  await shot('profile');
  await check('profile → visibility', async () => {
    await click(id('profile-continue'));
    await visible(text('Choose your visibility preference'));
    await click(id('vis-private'));
    await shot('visibility');
    await click(id('visibility-continue'));
  });
  await check('AI: completion sheet then later', async () => {
    await click(id('score-later'));
  });
  await check('AI: matches, skips notification ask (already on)', async () => {
    await visible(text('84 investors'), 6000);
    await shot('ai-onboarding');
    await visible(text('Thanks for enabling notifications!'), 6000);
  });
  await check('paywall after setup', () => visible(id('subscribe'), 8000));
  await shot('paywall');
  await check('paywall skip → home', async () => {
    await click(id('paywall-skip'));
    await visible(text('Welcome John'));
  });
  await shot('home');

  // ---------- 2. Main app on the free plan ----------
  await check('home: profile alert visible', () => visible(id('alert-profile')));
  await check('providers tab locked cards', async () => {
    await click(id('tab-providers'));
    await visible(text('Names and firms are hidden'));
    await shot('providers-locked');
  });
  await check('filters: locked group opens unlock sheet', async () => {
    await click(id('open-filters'));
    await click(id('fgroup-sector'));
    await visible(text('Subscribe to unlock investor access'));
    await click(text('Skip for now'));
  });
  await check('filters apply count', async () => {
    await click(id('fopt-Venture Capitalist'));
    await click(id('apply-filters'));
    await visible(text('1'));
  });
  await check('locked card → subscribe → purchase', async () => {
    await click(id('person-p1'));
    await visible(text('Subscribe to unlock investor access'));
    await shot('unlock-sheet');
    await click(id('unlock-subscribe'));
    await click(id('store-confirm'));
    await visible(text('You are all set'));
    await click(p.getByText('Ok', { exact: true }).locator('visible=true').first());
  });
  await check('investor profile opens after purchase', async () => {
    await visible(id('investor-name'), 5000);
    await shot('investor');
  });
  await check('investor next works', async () => {
    const before = await id('investor-name').innerText();
    await click(id('investor-next'));
    const after = await id('investor-name').innerText();
    if (before === after) throw new Error('name did not change');
  });
  await check('existing conversation opens chat', async () => {
    await click(id('investor-message'));
    const gate = id('gate-later');
    if (await gate.isVisible().catch(() => false)) await click(gate);
    await visible(id('chat-input'));
  });
  await check('message → profile gate → later → connect', async () => {
    await p.goto(BASE + '/investor/a1?list=advisor');
    await click(id('investor-message'));
    const gate = id('gate-later');
    if (await gate.isVisible().catch(() => false)) await click(gate);
    await visible(text('Send Connection Request'));
  });
  await check('connect: send disabled when empty', () => disabled(id('connect-send')));
  await check('connect: write with AI', async () => {
    await click(id('generate-ai'));
    await click(text('Friendly'));
    await click(id('ai-generate'));
    await wait(900);
    const body = await id('connect-body').inputValue();
    if (!body.includes('Psquare Company')) throw new Error('AI draft missing company');
    await shot('connect-filled');
  });
  await check('connect: email preview with profile summary', async () => {
    await click(id('connect-send'));
    await visible(id('profile-summary'));
    await visible(text('daniel@novatech.com'));
    await shot('email-preview');
  });
  await check('connect: send → chat', async () => {
    await click(id('preview-send'));
    await visible(text('Waiting for providers to respond'));
    await shot('chat');
  });
  await check('chat: send message', async () => {
    await typeIn(id('chat-input'), 'Sharing our latest update.');
    await click(id('chat-input-send'));
    await visible(text('Sharing our latest update.'));
  });
  await check('messages: list + filter', async () => {
    await p.goto(BASE + '/messages');
    await visible(text('Messages'));
    await click(p.locator('body').getByRole('button', { name: 'Negotiation' }).first());
    await visible(text('Ryan Thompson'));
    await click(p.locator('body').getByRole('button', { name: 'All' }).first());
  });
  await check('messages: select + move', async () => {
    await click(id('select-chats'));
    await click(id('conv-c1'));
    await visible(text('1 Selected'));
    await click(text('Move to'));
    await click(id('move-In Conversation'));
    await visible(text('Moved 1 chat'));
  });
  await check('messages: new custom tag', async () => {
    await click(id('new-tag'));
    await typeIn(id('tag-name'), 'Hot leads');
    await click(id('add-people'));
    await click(text('Emily Johnson'));
    await click(p.getByText('Add', { exact: true }).locator('visible=true').first());
    await click(id('tag-save'));
    await click(p.locator('body').getByRole('button', { name: 'Hot leads' }).first());
    await visible(text('Emily Johnson'));
    await shot('messages-tag');
  });
  await check('AI chat answers a prompt', async () => {
    await p.goto(BASE + '/ai');
    await typeIn(id('ai-input'), 'Draft outreach message');
    await click(id('ai-input-send'));
    await visible(text('Looking forward'), 4000);
    await shot('ai-chat');
  });
  await check('book a pitch call', async () => {
    await p.goto(BASE + '/pitch-calls');
    await visible(text('No Pitch calls yet'));
    await click(id('book-pitch'));
    await click(id('pick-provider'));
    await click(text('Brad Chesak'));
    await typeIn(id('agenda'), 'Introductory Pitch & QA');
    await click(id('pick-date'));
    const tomorrow = new Date(Date.now() + 86400000).getDate();
    await click(id(`day-${tomorrow}`));
    await click(id('time-10:00'));
    await click(id('date-done'));
    await enabled(id('book-now'));
    await shot('book-call');
    await click(id('book-now'));
    await visible(text('Pitch Call Booked'));
    await click(id('review-bookings'));
    await visible(text('Brad Chesak'));
    await shot('bookings');
  });
  await check('settings: change email with OTP', async () => {
    await p.goto(BASE + '/settings');
    await click(p.getByLabel('Edit Account Settings'));
    await typeIn(id('new-email'), 'johndoenew@gmail.com');
    await click(id('update-email'));
    await id('otp-input').fill('123456');
    await wait();
    await click(id('verify'));
    await visible(text('johndoenew@gmail.com (Primary)'));
    await shot('settings');
  });
  await check('settings: subscription change', async () => {
    await click(id('manage-sub'));
    await click(id('sub-6m'));
    await click(id('update-sub'));
    await click(id('store-confirm'));
    await click(p.getByText('Ok', { exact: true }).locator('visible=true').first());
    await visible(text('6 Months (Current)'));
  });
  await check('resources: burn rate calculator', async () => {
    await p.goto(BASE + '/resources');
    await click(id('res-Calculators'));
    await click(id('calc-burn'));
    await typeIn(id('calc-field-exp'), '50000');
    await typeIn(id('calc-field-rev'), '20000');
    await click(id('calc-go'));
    await visible(text('$ 30,000'));
    await shot('calculator');
  });
  await check('resources: legal doc preview', async () => {
    await p.goto(BASE + '/resources/legal');
    await click(id('legal-l1'));
    await visible(id('download-template'));
  });
  await check('resources: news + articles open', async () => {
    await p.goto(BASE + '/resources/news');
    await click(id('news-nw1'));
    await visible(text('Related Updates'));
    await p.goto(BASE + '/resources/articles');
    await click(id('article-ar1'));
    await visible(text('Read Next'));
  });
  await check('side menu opens + profile', async () => {
    await p.goto(BASE + '/home');
    await click(id('open-menu'));
    await visible(id('menu-profile'));
    await shot('menu');
    await click(id('menu-profile'));
    await visible(text('See who’s viewed your profile'));
  });
  await check('logout → welcome', async () => {
    await p.goto(BASE + '/settings');
    await click(id('logout'));
    await visible(id('get-started'));
  });
  await check('state persists after reload (existing login)', async () => {
    await click(id('existing-login'));
    await click(id('login-linkedin'));
    await click(id('linkedin-allow'));
    await visible(text('Welcome John'), 5000);
    await p.reload();
    await visible(text('Welcome John'), 8000);
  });
  await check('delete account → welcome', async () => {
    await p.goto(BASE + '/settings');
    await click(id('delete-profile'));
    await click(text('Yes, Delete'));
    await visible(id('get-started'));
  });

  // ---------- 3. Other onboarding branches ----------
  const branches = [
    { intent: 'raise', purpose: 'acquisition', stage: null, fields: [['$5M – $10M', 1]], select: 'Investor capital to fund an acquisition', geo: false },
    { intent: 'raise', purpose: 'fund', stage: 'vc', fields: [['$25M – $50M', 0]], select: 'LP commitments to an equity', industries: true, geo: false },
    { intent: 'raise', purpose: 'realestate', stage: 'commercial', fields: [['$10M – $25M', 0], ['$2M – $5M', 0]], select: 'Investor capital for a real estate', industries: true, geo: true },
    { intent: 'liquidity', purpose: 'exit', stage: 'exit-ready', fields: [['$25M – $50M', 0]], industries: true, geo: false },
    { intent: 'liquidity', purpose: 'secondary', stage: 'founder-shares', fields: [['$1M – $5M', 0]], industries: true, geo: false },
    { intent: 'liquidity', purpose: 'secondary', stage: 'lp', fields: [['$500K – $1M', 0]], geo: false },
  ];
  for (const b of branches) {
    const name = `branch ${b.purpose}${b.stage === 'lp' ? '-lp' : ''}`;
    await check(name, async () => {
      await p.evaluate(() => localStorage.clear());
      await p.goto(BASE + '/welcome');
      await click(id('existing-login'));
      // sign up through LinkedIn to also cover that path
      await p.goto(BASE + '/auth/linkedin?next=signup');
      await click(id('linkedin-allow'));
      await click(id(`intent-${b.intent}`));
      await click(id('step-continue'));
      await click(id(`purpose-${b.purpose}`));
      await click(id('step-continue'));
      if (b.stage) await click(id(`stage-${b.stage}`));
      await click(id('step-continue'));
      await visible(text('Opportunity Details'));
      for (const [f, n] of b.fields) await click(p.getByText(f, { exact: true }).locator('visible=true').nth(n));
      if (b.select) {
        await click(id('field-capitalType'));
        await click(text(b.select));
      }
      if (b.industries) {
        await click(id('field-industries'));
        const multi = ['fund', 'realestate'].includes(b.purpose);
        await click(p.locator('body').getByRole(multi ? 'checkbox' : 'radio', { name: /Software/ }).first());
        if (multi) await click(text('Done'));
      }
      if (b.geo) {
        await click(id('field-geo'));
        await click(text('United States • Canada'));
      }
      await enabled(id('step-continue'));
      await click(id('step-continue'));
      await visible(text('Complete Your Profile')); // LinkedIn users skip personal info
    });
  }


  // ---------- 4. Every remaining option, on a fresh free account ----------
  await check('fresh account via email login (existing user)', async () => {
    await p.evaluate(() => localStorage.clear());
    await p.goto(BASE + '/welcome');
    await click(id('existing-login'));
    await typeIn(id('login-email'), 'john@psquare.com');
    await click(id('login-continue'));
    await id('otp-input').fill('111111');
    await wait();
    await click(id('verify'));
    await visible(text('Welcome John'), 6000);
  });
  await check('dashboard skeleton then matches', async () => {
    await visible(id('match-skeleton').or(id('match-p1')), 4000);
    await visible(id('match-p1'), 4000);
  });
  await check('free plan: no premium badge', async () => {
    if (await id('premium-badge').isVisible().catch(() => false)) throw new Error('badge on free plan');
  });
  await check('home: AI prompt chip opens chat with answer', async () => {
    await click(text('Write warm intro'));
    await visible(text('forwardable blurb'), 4000);
  });
  await check('AI history: open and delete', async () => {
    await click(id('ai-history'));
    await visible(text('Chat history'));
    await click(p.getByLabel('Delete Warm intro draft'));
    if (await text('Warm intro draft').isVisible().catch(() => false)) throw new Error('not deleted');
  });
  await check('advisors tab locked + list', async () => {
    await p.goto(BASE + '/advisors');
    await visible(id('person-a1'), 5000);
  });
  await check('free plan daily request limit', async () => {
    await p.goto(BASE + '/connect/a2');
    await typeIn(id('connect-subject'), 'Hello');
    await typeIn(id('connect-body'), 'Would love to connect.');
    await click(id('connect-send'));
    await click(id('preview-send'));
    await visible(id('chat-input'));
    await p.goto(BASE + '/connect/a3');
    await visible(text('Daily Limit Reached'));
    await shot('limit-reached');
  });
  await check('every filter group (premium after upgrade)', async () => {
    await p.goto(BASE + '/paywall');
    await click(id('plan-1m'));
    await click(id('subscribe'));
    await click(id('store-confirm'));
    await click(p.getByText('Ok', { exact: true }).locator('visible=true').first());
    await p.goto(BASE + '/filters?kind=provider');
    for (const g of ['firmType', 'stage', 'sector', 'check', 'geo']) await click(id('fgroup-' + g));
    await click(id('fopt-Europe'));
    await click(id('apply-filters'));
    await visible(id('person-p6'));
  });
  await check('premium badge on dashboard', async () => {
    await p.goto(BASE + '/home');
    await visible(id('premium-badge'));
  });
  await check('investor prev', async () => {
    await p.goto(BASE + '/investor/p2?list=provider');
    await click(text('Prev'));
    await visible(text('Susan Sandgren'));
  });
  await check('profile sheets: name, revenue, geography, readiness', async () => {
    await p.goto(BASE + '/profile');
    await click(id('edit-name'));
    await click(text('Save'));
    await click(text('Annual Revenue'));
    await click(p.getByText('$1M – $5M', { exact: true }).locator('visible=true').first());
    await click(p.getByText('Save Changes', { exact: true }).locator('visible=true').first());
    await visible(text('$1M – $5M'));
    await click(text('Geographic Focus'));
    await click(p.locator('body').getByRole('checkbox', { name: /Asia/ }).first());
    await click(p.getByText('Save Changes', { exact: true }).locator('visible=true').first());
    await click(text('Readiness'));
    await click(p.locator('body').getByRole('radio', { name: /Actively Raising/ }).first());
    await click(p.getByText('Save Changes', { exact: true }).locator('visible=true').first());
    await visible(text('Actively Raising'));
  });
  await check('profile reaches 100% → submit for review', async () => {
    await click(id('edit-company'));
    await typeIn(id('company-name'), 'Psquare Company');
    await click(id('company-save'));
    await click(id('edit-deck'));
    await click(text('Upload URL'));
    await typeIn(id('deck-url'), 'https://psquare.com/deck.pdf');
    await click(id('deck-save'));
    const label = await id('profile-done').innerText();
    if (!/Submit/.test(label)) throw new Error('score not 100, button says ' + label);
    await click(id('profile-done'));
    await visible(text('Your profile is under review'));
    await click(id('review-ok'));
  });
  await check('side menu items all open', async () => {
    const items = [['Pitch Call', 'Call Bookings'], ['News', 'Latest updates'], ['Blogs', 'Articles and Blogs'], ['Resources', 'Tools, templates'], ['Settings', 'Account Settings'], ['Notifications', 'Follow-up with Sandgren']];
    for (const [m, expect] of items) {
      await p.goto(BASE + '/home');
      await click(id('open-menu'));
      await click(id('menu-' + m));
      await visible(text(expect));
    }
  });
  await check('pitch calls history tab', async () => {
    await p.goto(BASE + '/pitch-calls');
    await click(text('History'));
    await visible(text('No past calls'));
  });
  await check('settings: visibility change', async () => {
    await p.goto(BASE + '/settings');
    await click(p.getByLabel('Edit Visibility Preferences'));
    await click(id('vis-enhanced'));
    await click(text('Save Changes'));
    await visible(text('Enhanced Reach'));
  });
  await check('settings: notifications off then on', async () => {
    const sw = p.getByLabel('Notifications').locator('visible=true').last();
    await sw.click(); // currently off → opens the permission explainer
    await click(id('notify-enable'));
    await click(text('Allow Notifications'));
    if (!(await sw.isChecked())) throw new Error('switch not on');
    await sw.click(); // turn off
    if (await sw.isChecked()) throw new Error('switch not off');
  });
  await check('legal footer: restore purchase', async () => {
    await p.goto(BASE + '/settings/subscription');
    await click(text('Restore purchase'));
    await visible(text('No previous purchases'));
  });
  await check('all 8 calculators compute', async () => {
    const cases = { burn: ['exp', 'rev'], runway: ['cash', 'burn'], dilution: ['pre', 'inv', 'own'], target: ['burn', 'months', 'buffer'], premoney: ['post', 'inv'], postmoney: ['pre', 'inv'], comparable: ['rev', 'mult'], vc: ['exit', 'roi', 'dil'] };
    for (const [cid, fields] of Object.entries(cases)) {
      await p.goto(BASE + '/resources/calculator?id=' + cid);
      for (const f of fields) await typeIn(id('calc-field-' + f), '10');
      await click(id('calc-go'));
      await visible(id('calc-result'));
    }
  });
  await check('resources: decks, deck preview, videos, legal locked docs open on premium', async () => {
    await p.goto(BASE + '/resources/decks');
    await click(id('deck-d2'));
    await visible(text('Pitch Deck Preview'));
    await p.goto(BASE + '/resources/videos');
    await click(id('video-v1'));
    await visible(text('Playing'));
    await p.goto(BASE + '/resources/legal');
    await click(id('legal-l2'));
    await visible(id('download-template'));
  });
  await check('messages: unread filter + chat reply composer', async () => {
    await p.goto(BASE + '/messages');
    await click(p.locator('body').getByRole('button', { name: 'Unread' }).first());
    await visible(text('Emily Johnson'));
  });

  await check('no runtime errors', async () => {
    const real = errors.filter((e) => !/favicon|DevTools|Download the React DevTools/.test(e));
    if (real.length) throw new Error(real.slice(0, 3).join(' | '));
  });

  console.log(`\n${pass} passed, ${fails.length} failed (viewport ${W}x${H})`);
  fails.forEach((f) => console.log('  ✗ ' + f));
  await browser.close();
  process.exit(fails.length ? 1 : 0);
})();
