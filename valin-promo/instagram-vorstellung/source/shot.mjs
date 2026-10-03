import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 7560, height: 1350 } });
p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('C', m.text()); });
await p.goto('http://localhost:8775/index.html');
console.log('name font', await p.evaluate(() => window.__ready));
await p.screenshot({ path: 'full.png' });
await b.close();
