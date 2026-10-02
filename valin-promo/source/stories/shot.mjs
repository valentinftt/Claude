import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [name, ...ts] = process.argv.slice(2);
const times = ts.map(Number);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('console', m => console.log('console:', m.text()));
p.on('pageerror', e => console.log('PAGEERR', e.message));
await p.goto(`http://localhost:8767/${name}.html`);
await p.evaluate(() => window.__ready);
for (const t of times) {
  await p.evaluate(t => window.__seek(t), t);
  await p.screenshot({ path: `shots/${name}_${t.toFixed(2)}.png` });
}
await b.close();
