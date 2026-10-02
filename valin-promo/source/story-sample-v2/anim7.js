const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));
const B = 60 / 128;
// beats: Vorher 0-4 | drop + reel 4-19 | end card 19-25  (25 beats = 11.72 s)
const D = 4 * B, E = 19 * B, DURATION = 25 * B;
const r = (x) => D + x * B;
const CUTS = [4, 5, 8.5, 11.5];
const tl = gsap.timeline({ paused: true });
const FT = { immediateRender: true };
let MAXF = 211, MAXO = 311;

function build() {
  gsap.set(['#w1', '#w2', '#w3 span', '#w4', '#w5', '#tagN'], { autoAlpha: 0 });
  // ---- Vorher: phone camera ----
  tl.fromTo('#photo', { scale: 1.08 }, { scale: 1, duration: D, ease: 'none', ...FT }, 0);
  tl.fromTo('#tagV', { x: -40, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.35, ease: 'expo.out', ...FT }, 0.05);
  tl.fromTo('#q1 .mi', { yPercent: 115 }, { yPercent: 0, duration: 0.55, ease: 'expo.out', ...FT }, 0.12);
  tl.fromTo('#focus', { scale: 1.7, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.25, ease: 'power2.out', ...FT }, 0.45);
  tl.to('#focus', { autoAlpha: 0, duration: 0.12 }, 0.95);
  tl.to('#shutter i', { scale: 0.8, duration: 0.07 }, 0.98);
  tl.to('#shutter i', { scale: 1, duration: 0.16 }, 1.07);
  tl.fromTo('#flash', { opacity: 0 }, { keyframes: [{ opacity: 0.7, duration: 0.05 }, { opacity: 0, duration: 0.22 }], immediateRender: false }, 1.04);
  tl.to('#th', { opacity: 1, duration: 0.1 }, 1.12);
  tl.to('#q1 .mi', { yPercent: -115, duration: 0.22, ease: 'power3.in' }, D - 0.45);
  tl.to('#photoWrap', { scale: 2.8, filter: 'blur(18px) brightness(1.6)', duration: 0.38, ease: 'power3.in' }, D - 0.38);
  tl.fromTo('#flash', { opacity: 0 }, { opacity: 1, duration: 0.08, immediateRender: false }, D - 0.08);
  // ---- DROP: the finished reel ----
  tl.set(['#camui', '#tagV'], { autoAlpha: 0 }, D);
  tl.to('#flash', { opacity: 0, duration: 0.6, ease: 'power2.out' }, D);
  tl.fromTo('#cam', { scale: 1.14 }, { scale: 1, duration: 0.9, ease: 'expo.out', immediateRender: false }, D);
  tl.to('#cam', { keyframes: [{ x: -12, y: 8 }, { x: 9, y: -6 }, { x: -5, y: 3 }, { x: 0, y: 0 }], duration: 0.24, ease: 'none' }, D);
  tl.fromTo('#q2', { scale: 1.8, autoAlpha: 0, filter: 'blur(20px)' }, { scale: 1, autoAlpha: 1, filter: 'blur(0px)', duration: 0.4, ease: 'expo.out', immediateRender: false }, D + 0.03);
  tl.to('#q2', { scale: 1.06, duration: 2.2 * B, ease: 'none' }, D + 0.43);
  tl.to('#q2', { scale: 1.8, autoAlpha: 0, filter: 'blur(16px)', duration: 0.3, ease: 'power2.in' }, r(3.1));
  tl.fromTo('#tagN', { x: -40, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.35, ease: 'expo.out', immediateRender: false }, D + 0.15);
  tl.to('#tagN', { autoAlpha: 0, duration: 0.25 }, E - 0.3);
  // golden glitter: heavy on the drop, then a soft layer
  tl.fromTo('#og', { opacity: 1 }, { opacity: 0.32, duration: 3 * B, ease: 'power2.out', immediateRender: false }, D);
  tl.to('#og', { opacity: 0.6, duration: 0.4 }, r(11.5));
  // cuts: soft flash + prism light + punch-in
  for (const c of CUTS) {
    tl.fromTo('#flash', { opacity: 0.32 }, { opacity: 0, duration: 0.28, ease: 'power2.out', immediateRender: false }, r(c));
    tl.fromTo('#op', { opacity: 0.85 }, { opacity: 0, duration: 0.45, ease: 'power2.out', immediateRender: false }, r(c) - 0.05);
    tl.fromTo('#rvw', { scale: 1.06 }, { scale: 1, duration: 0.55, ease: 'expo.out', immediateRender: false }, r(c));
  }
  for (const b of [2, 7, 10, 13]) tl.fromTo('#rvw', { scale: 1.015 }, { scale: 1, duration: 0.45, ease: 'power2.out', immediateRender: false }, r(b));
  // titles
  tl.fromTo('#w1', { letterSpacing: '1.3em', autoAlpha: 0 }, { letterSpacing: '.55em', autoAlpha: 1, duration: 0.8, ease: 'expo.out', ...FT }, r(5) + 0.08);
  tl.fromTo('#w2', { y: 50, autoAlpha: 0, filter: 'blur(18px)' }, { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.7, ease: 'expo.out', ...FT }, r(5) + 0.25);
  tl.fromTo('#w2g', { backgroundPosition: '100% 0' }, { backgroundPosition: '0% 0', duration: 1.5, ease: 'sine.inOut', ...FT }, r(5) + 0.25);
  tl.to(['#w1', '#w2'], { autoAlpha: 0, y: -30, filter: 'blur(10px)', duration: 0.22 }, r(8.5) - 0.2);
  tl.fromTo('#w3 span', { y: 50, autoAlpha: 0, filter: 'blur(14px)' }, { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.55, ease: 'expo.out', stagger: B * 0.75, ...FT }, r(8.5) + 0.1);
  tl.to('#w3 span', { autoAlpha: 0, filter: 'blur(10px)', duration: 0.2 }, r(11.5) - 0.18);
  tl.fromTo('#w4', { letterSpacing: '.9em', autoAlpha: 0, filter: 'blur(16px)' }, { letterSpacing: '.32em', autoAlpha: 1, filter: 'blur(0px)', duration: 1.0, ease: 'expo.out', ...FT }, r(11.5) + 0.08);
  tl.fromTo('#w5', { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out', ...FT }, r(12.5));
  // ---- end card ----
  tl.fromTo('#flash', { opacity: 0 }, { opacity: 1, duration: 0.08, immediateRender: false }, E - 0.08);
  tl.to('#rvw', { scale: 1.25, filter: 'blur(10px)', duration: 0.3, ease: 'power3.in' }, E - 0.3);
  tl.set('#end', { opacity: 1 }, E);
  tl.set('#reel', { autoAlpha: 0 }, E);
  tl.to('#flash', { opacity: 0, duration: 0.5, ease: 'power2.out' }, E);
  tl.fromTo('.lg-l', { y: 230 }, { y: 0, duration: 0.6, ease: 'expo.out', stagger: 0.05, ...FT }, E + 0.03);
  tl.fromTo('#lgAccent', { x: 70, y: -112, autoAlpha: 0 }, { x: 0, y: 0, autoAlpha: 1, duration: 0.2, ease: 'power3.in', ...FT }, E + 0.25);
  $$('.lg-s').forEach((s, i) => tl.fromTo(s, { x: (i - 2.5) * 60, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.7, ease: 'expo.out', ...FT }, E + 0.4 + i * 0.03));
  tl.to('#cam', { keyframes: [{ x: -10, y: 7 }, { x: 8, y: -5 }, { x: -4, y: 3 }, { x: 0, y: 0 }], duration: 0.24, ease: 'none' }, E + 0.45);
  tl.fromTo('#e1 .mi', { yPercent: 115 }, { yPercent: 0, duration: 0.55, ease: 'expo.out', stagger: 0.14, ...FT }, E + B);
  tl.fromTo('#e2', { scale: 0.5, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.5, ease: 'back.out(2.2)', ...FT }, E + 2 * B);
  ['#c1', '#c2', '#c3'].forEach((c, i) => tl.fromTo(c, { x: -110, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.45, ease: 'back.out(1.8)', ...FT }, E + (3 + i * 0.5) * B));
  tl.fromTo('#e2', { scale: 1.04 }, { scale: 1, duration: B * 0.8, ease: 'power2.out', repeat: 1, immediateRender: false }, E + 4 * B);
  tl.to({}, { duration: 0.01 }, DURATION);
}

// ring-stone track (reel frame -> px) for the sparkles
const TRK = [[[1, 382, 923], [28, 201, 778], [56, 45, 761]], [[163, 336, 972], [188, 249, 988], [211, 126, 988]]];
function stone(n) {
  for (const k of TRK) if (n >= k[0][0] && n <= k[k.length - 1][0]) {
    for (let i = 0; i < k.length - 1; i++) if (n <= k[i + 1][0]) {
      const a = k[i], b = k[i + 1], u = (n - a[0]) / (b[0] - a[0]);
      return [a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u, n - k[0][0]];
    }
  }
  return null;
}
function sparkle(t, n) {
  const p = t >= D && t < E ? stone(n) : null;
  for (const [id, dx, dy, ph, sz] of [['#s1', 0, -8, 0, 1], ['#s2', 26, 22, 2.1, 0.55]]) {
    const el = $(id);
    if (!p) { el.style.opacity = 0; continue; }
    const age = p[2] / 30;
    const tw = Math.pow(Math.max(0, Math.sin(t * 8.5 + ph)), 2.2);
    const intro = Math.min(1, age / 0.12);
    const s = sz * (0.35 + 0.85 * tw + (age < 0.35 ? (0.35 - age) * 3 : 0)) * intro;
    el.style.opacity = Math.min(1, 0.25 + tw + (age < 0.3 ? 1 : 0)) * intro;
    el.style.transform = `translate(${p[0] + dx}px,${p[1] + dy}px) rotate(${t * 50 + ph * 20}deg) scale(${s})`;
  }
}

const gc = $('#grain'), gx = gc.getContext('2d'), gimg = gx.createImageData(540, 960);
function grain(frame) {
  let s = (frame * 2654435761) >>> 0 || 1; const d = gimg.data;
  for (let i = 0; i < d.length; i += 4) { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; d[i] = d[i + 1] = d[i + 2] = s & 255; d[i + 3] = 255; }
  gx.putImageData(gimg, 0, 0);
}
const pad = (n) => String(n).padStart(4, '0');
function swap(sel, src, jobs) {
  const img = $(sel);
  if (img.getAttribute('src') !== src) { img.setAttribute('src', src); jobs.push(img.decode().catch(() => {})); }
}
async function afterSeek(t, frame) {
  const lt = Math.max(0, t - D), jobs = [];
  const n = Math.min(MAXF, Math.floor(lt * 30) + 1), o = Math.min(MAXO, Math.floor(lt * 30) + 1);
  swap('#rv', `reel/f/${pad(n)}.jpg`, jobs);
  swap('#og', `reel/g/${pad(o)}.jpg`, jobs);
  swap('#op', `reel/p/${pad(o)}.jpg`, jobs);
  swap('#eg', `reel/g/${pad(o)}.jpg`, jobs);
  $('#rprog i').style.transform = `scaleX(${Math.min(1, lt / (E - D))})`;
  sparkle(t, n);
  grain(frame);
  await Promise.all(jobs);
}
window.__duration = DURATION;
window.__seek = async (t, frame) => { tl.seek(t, false); await afterSeek(t, frame ?? Math.floor(t * 24)); };
window.__ready = (async () => {
  await Promise.all(['800 50px Unbounded', '900 50px Unbounded', '20px Michroma', '600 20px Inter', '700 20px Inter', '20px "Noto Color Emoji"', 'italic 500 50px Cormorant', '600 50px Cormorant'].map((f) => document.fonts.load(f, 'LUMIÈRE Gold')));
  await document.fonts.ready;
  try { const c = await (await fetch('reel/count.json')).json(); MAXF = c.n; MAXO = c.o; } catch (e) {}
  build(); await window.__seek(0, 0);
  return true;
})();
