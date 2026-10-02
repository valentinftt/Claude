import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { spawn } from 'child_process';
const FPS = 60, W = 4;
const b = await chromium.launch();
const probe = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await probe.goto('http://localhost:8770/index5.html');
await probe.evaluate(() => window.__ready);
const dur = await probe.evaluate(() => window.__duration);
await probe.close();
const N = Math.round(dur * FPS);
const t0 = Date.now();
await Promise.all([...Array(W).keys()].map(async (k) => {
  const a = Math.floor(k * N / W), z = Math.floor((k + 1) * N / W);
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', e => console.log('PAGEERR', e.message));
  await p.goto('http://localhost:8770/index5.html');
  await p.evaluate(() => window.__ready);
  const cdp = await p.context().newCDPSession(p);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '10', '-pix_fmt', 'yuv420p', `/tmp/v5/seg${k}.mp4`], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise(r => ff.on('close', r));
  for (let f = a; f < z; f++) {
    const t = f / FPS;
    await p.evaluate(([t, g]) => window.__seek(t, g), [t, Math.floor(t * 24)]);
    const r = await cdp.send('Page.captureScreenshot', { format: 'png', optimizeForSpeed: true });
    const buf = Buffer.from(r.data, 'base64');
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (k === 0 && f % 60 === 0) console.log(`worker0 ${f - a}/${z - a}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end(); await done;
}));
await b.close();
console.log('frames', N, 'time', ((Date.now() - t0) / 1000).toFixed(0), 's');
