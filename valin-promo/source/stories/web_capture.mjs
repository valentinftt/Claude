// Nimmt die Bilder der neutralen Demo-Website für das Vorschauvideo (Story 7) auf.
// node web_capture.mjs ../../../demos/auers-blumenparadies/Beispiel_Floristik_Demo.html img/web
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const [file, out] = process.argv.slice(2);
const T = new Date('2026-10-07T10:30:00+02:00');      // Mittwoch 10:30 -> "Jetzt geöffnet"
const STILL = 'html{scroll-behavior:auto!important}[data-reveal]{opacity:1!important;transform:none!important;filter:none!important;transition:none!important}*{animation-play-state:paused!important}.petal{display:none!important}';
const b = await chromium.launch({ args: ['--lang=de-DE'] });
const meta = {};
async function page(vp, mobile) {
  const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 2, isMobile: mobile, hasTouch: mobile, locale: 'de-DE', timezoneId: 'Europe/Berlin' });
  await ctx.clock.setFixedTime(T);
  const p = await ctx.newPage();
  p.on('pageerror', (e) => console.log('PAGEERR', e.message));
  await p.goto('file://' + file); await p.evaluate(() => document.fonts.ready);
  await p.addStyleTag({ content: STILL }); await p.waitForTimeout(500);
  return [ctx, p];
}
const sections = (p) => p.evaluate(() => { const o = {}; for (const id of ['anlaesse', 'ueber', 'anfrage', 'besuch']) o[id] = Math.round(document.getElementById(id).getBoundingClientRect().top + scrollY); o.reviews = Math.round(document.querySelector('.reviews').getBoundingClientRect().top + scrollY); o.total = document.documentElement.scrollHeight; return o; });

// ---- desktop 1440x900
{
  const [ctx, p] = await page({ width: 1440, height: 900 }, false);
  meta.desk = await sections(p);
  await p.screenshot({ path: `${out}/desk_full.png`, fullPage: true });
  await p.evaluate(() => scrollTo(0, 600)); await p.waitForTimeout(600);
  await p.locator('header').screenshot({ path: `${out}/desk_head.png` });
  meta.deskHead = await p.evaluate(() => document.querySelector('header').offsetHeight);
  await ctx.close();
}
// ---- mobile 390x844
{
  const [ctx, p] = await page({ width: 390, height: 844 }, true);
  meta.mob = await sections(p);
  await p.addStyleTag({ content: '.mbar{visibility:hidden}' });
  await p.screenshot({ path: `${out}/mob_full.png`, fullPage: true, clip: { x: 0, y: 0, width: 390, height: meta.mob.ueber } });
  await p.addStyleTag({ content: '.mbar{visibility:visible}' });
  await p.evaluate(() => scrollTo(0, 700)); await p.waitForTimeout(600);
  await p.locator('header').screenshot({ path: `${out}/mob_head.png` });
  await p.locator('.mbar').screenshot({ path: `${out}/mob_bar.png` });
  meta.mobHead = await p.evaluate(() => document.querySelector('header').offsetHeight);
  meta.mobBar = await p.evaluate(() => { const r = document.querySelector('.mbar').getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
  // form states (viewport shots incl. sticky header + action bar)
  const box = async (sel) => { const r = await p.locator(sel).boundingBox(); return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) }; };
  await p.evaluate(() => { const f = document.querySelector('#form'); scrollTo(0, f.getBoundingClientRect().top + scrollY - 92); });
  await p.waitForTimeout(400);
  await p.screenshot({ path: `${out}/form_a0.png` });
  meta.tapHochzeit = await box('[data-group="Anlass"] button:nth-child(1)');
  await p.evaluate(() => document.querySelector('[data-group="Anlass"] button:nth-child(1)').click());
  await p.waitForTimeout(800); await p.screenshot({ path: `${out}/form_a1.png` });
  meta.tapFarbe = await box('[data-group="Farben"] button:nth-child(1)');
  await p.evaluate(() => document.querySelector('[data-group="Farben"] button:nth-child(1)').click());
  await p.waitForTimeout(800); await p.screenshot({ path: `${out}/form_a2.png` });
  await p.fill('#date', '2026-10-10'); await p.dispatchEvent('#date', 'change'); await p.evaluate(() => document.activeElement.blur());
  await p.evaluate(() => { const f = document.querySelector('#name'); scrollTo(0, f.getBoundingClientRect().top + scrollY - 330); });
  await p.waitForTimeout(400); await p.screenshot({ path: `${out}/form_b0.png` });
  meta.tapName = await box('#name');
  const steps = ['S', 'Soph', 'Sophie', 'Sophie W', 'Sophie Wagner'];
  for (let i = 0; i < steps.length; i++) { await p.fill('#name', steps[i]); await p.screenshot({ path: `${out}/form_b${i + 1}.png` }); }
  await p.fill('#contact', '0170 2345678'); await p.screenshot({ path: `${out}/form_b6.png` });
  meta.tapSend = await box('#form button[type=submit]');
  await p.evaluate(() => { document.querySelector('#form').scrollIntoView = () => {}; document.querySelector('#form button[type=submit]').click(); const d = document.querySelector('.done'); scrollTo(0, d.getBoundingClientRect().top + scrollY - 160); });
  await p.waitForTimeout(400);
  await p.addStyleTag({ content: '.done svg circle,.done svg path{animation:none!important;stroke-dashoffset:0!important}' });
  await p.waitForTimeout(300); await p.screenshot({ path: `${out}/form_c.png` });
  await ctx.close();
}
fs.writeFileSync(`${out}/web.json`, JSON.stringify(meta, null, 1));
console.log(JSON.stringify(meta));
await b.close();
