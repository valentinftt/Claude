// Rendert die Highlight-Cover: node shot.mjs <out-dir> <name>:<query> ...
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { fileURLToPath } from 'url';
const [out, ...jobs] = process.argv.slice(2);
const page = fileURLToPath(new URL('./cover.html', import.meta.url));
const b = await chromium.launch();
for (const job of jobs) {
  const [name, query] = job.split(':');
  const sq = query.includes('s=sq');
  const p = await b.newPage({ viewport: { width: 1080, height: sq ? 1080 : 1920 } });
  await p.goto(`file://${page}?${query}`);
  await p.waitForFunction(() => window.__ready);
  await p.locator('#stage').screenshot({ path: `${out}/${name}.png` });
  await p.close();
}
await b.close();
