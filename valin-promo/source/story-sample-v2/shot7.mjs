import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const times = process.argv.slice(2).map(Number);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => { if (m.type() === 'error' || m.text().includes('GSAP')) console.log('C', m.text()); });
await p.goto('http://localhost:8772/index7.html'); await p.evaluate(() => window.__ready);
for (const t of times) { await p.evaluate(t => window.__seek(t), t); await p.screenshot({ path: `/tmp/v7/s_${t.toFixed(2)}.png` }); }
await b.close();
