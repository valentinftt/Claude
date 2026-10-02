const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));
const B = 60 / 126;               // one beat (126 BPM tech-house)
// beat grid: hook 0-4 | drop + Schmuck 4-10 | Mode 10-15 | Beauty 15-20 | Jede Branche 20-23 | CTA 23-31
const T = { drop: 4 * B, b: 10 * B, c: 15 * B, all: 20 * B, cta: 23 * B };
const DURATION = 31 * B + 0.03;
const SW = 0.18;                  // half of the swipe between reels
const tl = gsap.timeline({ paused: true });

// reel frame sources: [img id, folder, frame count, start time, frame offset, visible from, visible to]
const NF = { schmuck: 186, mode: 129, beauty: 129 };
const SRC = [
  ['#va', 'schmuck', 2.5 * B, 0, 0, T.b + SW],
  ['#vb', 'mode', T.b - SW, 0, T.b - SW, T.c + SW],
  ['#vc', 'beauty', T.c - SW, 0, T.c - SW, T.cta + 0.4],
  ['#vb2', 'mode', T.all - 0.3, 60, T.all - 0.3, T.cta + 0.4],
  ['#va2', 'schmuck', T.all - 0.3, 110, T.all - 0.3, T.cta + 0.4],
];

const FT = { immediateRender: true };
const rise = (t, at, o = {}) => tl.fromTo(t, { yPercent: 115 }, { yPercent: 0, duration: o.d || 0.6, ease: 'expo.out', stagger: o.s || 0.09, ...FT }, at);
const fall = (t, at) => tl.to(t, { yPercent: -115, duration: 0.3, ease: 'power3.in' }, at);
const popIn = (t, at, o = {}) => tl.fromTo(t, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: o.d || 0.45, ease: o.ease || 'back.out(2.2)', stagger: o.s || 0.08, ...FT }, at);
const marker = (s, at) => tl.fromTo(s, { '--hl': 0 }, { '--hl': 1, duration: 0.35, ease: 'power3.out', ...FT }, at);
const camPunch = (at, s = 1.04) => tl.fromTo('#cam', { scale: s }, { scale: 1, duration: 0.35, ease: 'power2.out', immediateRender: false }, at);
const slideUp = (t, at) => tl.fromTo(t, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, ease: 'expo.out', ...FT }, at);
function toast(id, at, out, from) {
  tl.fromTo(id, { x: from, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out', ...FT }, at);
  tl.to(id, { x: from, autoAlpha: 0, duration: 0.3, ease: 'power3.in' }, out);
}
function heartTap(k, at, from, to, big = true) {
  if (big) tl.fromTo('#heart', { scale: 0, rotation: -15, autoAlpha: 1 }, { scale: 1.15, rotation: 0, duration: 0.3, ease: 'back.out(3)', immediateRender: false }, at);
  if (big) tl.to('#heart', { scale: 1.6, y: -120, autoAlpha: 0, duration: 0.4, ease: 'power2.in' }, at + 0.45);
  tl.set(`#hb${k} path`, { attr: { fill: '#ff3040' }, stroke: '#ff3040' }, at + 0.05);
  tl.fromTo(`#hb${k}`, { scale: 1.5 }, { scale: 1, duration: 0.35, ease: 'back.out(3)', immediateRender: false }, at + 0.05);
  LIKE.push([k, at + 0.05, from, to]);
}
const LIKE = [];

function build() {
  const R = $('#lgAccent').getBoundingClientRect();
  gsap.set('#wipe', { x: -3800, skewX: -32 });
  gsap.set(['#kick', '#num', '#ch', '#tL', '#tR', '.toast', '#heart'], { autoAlpha: 0 });
  gsap.set('#cat .mi', { yPercent: 115 });
  gsap.set('#main', { y: 1500 });
  $$('.cap span, #stk').forEach((e) => gsap.set(e, { autoAlpha: 0 }));

  tl.to('#glowA', { x: 420, y: 380, duration: DURATION, ease: 'sine.inOut' }, 0);
  tl.to('#glowB', { x: -420, y: -520, duration: DURATION, ease: 'sine.inOut' }, 0);
  tl.to('#grid', { y: 120, duration: DURATION, ease: 'none' }, 0);
  tl.to('#dark .gl', { x: 300, y: -200, duration: DURATION, ease: 'sine.inOut' }, 0);

  // ---------- hook (white, 4 beats) ----------
  rise('#hook .mi', 0.05, { s: 0.12 });
  marker('#hl1', 0.85);
  tl.to('#hook', { y: -150, scale: 0.86, duration: 1.4 * B, ease: 'power2.inOut' }, 2.4 * B);
  tl.fromTo('#main', { y: 1500, rotation: 8 }, { y: 260, rotation: -3, duration: 1.4 * B, ease: 'expo.out', immediateRender: false }, 2.4 * B);
  tl.fromTo('#flash', { opacity: 0 }, { opacity: 0.9, duration: 0.1, ease: 'power2.in', immediateRender: false }, T.drop - 0.1);

  // ---------- drop: dark, phone snaps in ----------
  let o = T.drop;
  tl.set('#hook', { autoAlpha: 0 }, o);
  tl.set('#dark', { opacity: 1 }, o);
  tl.to('#flash', { opacity: 0, duration: 0.45, ease: 'power2.out' }, o);
  camPunch(o, 1.08);
  tl.to('#main', { y: 0, rotation: 0, duration: 0.55, ease: 'expo.out' }, o);
  tl.fromTo('#main', { y: 0 }, { y: -14, duration: 2 * B, ease: 'sine.inOut', yoyo: true, repeat: 7, immediateRender: false }, o + 0.6);
  tl.set(['#kick', '#num'], { autoAlpha: 1 }, o);
  tl.fromTo('#kick', { letterSpacing: '0.9em', autoAlpha: 0 }, { letterSpacing: '0.4em', autoAlpha: 1, duration: 0.7, ease: 'expo.out', ...FT }, o + 0.05);
  slideUp('#num', o + 0.1);
  for (let b = 6; b < 23; b += 2) camPunch(b * B, 1.012);

  // reel A – Schmuck
  rise('#c1', o + 0.05);
  tl.fromTo('#pra', { scaleX: 0 }, { scaleX: 1, duration: T.b - o, ease: 'none', ...FT }, o);
  tl.fromTo('#a1 span', { y: -20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, ease: 'expo.out', ...FT }, o + 0.3);
  tl.fromTo('#a2 span', { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.45, ease: 'back.out(2.5)', ...FT }, o + B);
  popIn('#a3 span', o + 2 * B);
  tl.fromTo('#stk', { scale: 0, rotation: -90, autoAlpha: 0 }, { scale: 1, rotation: 12, autoAlpha: 1, duration: 0.5, ease: 'back.out(2.5)', ...FT }, o + 3 * B);
  heartTap('a', o + 4 * B, 24800, 24900);
  toast('#t1', o + 3.5 * B, T.b - 0.3, 560);

  // reel B – Mode
  o = T.b;
  tl.fromTo('#feed', { y: 0 }, { y: -1076, duration: 2 * SW, ease: 'power3.inOut', immediateRender: false }, o - SW);
  fall('#c1', o - 0.25); rise('#c2', o + 0.05);
  tl.fromTo('#prb', { scaleX: 0 }, { scaleX: 1, duration: T.c - o, ease: 'none', ...FT }, o);
  tl.fromTo('#b1 span', { y: -20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, ease: 'expo.out', ...FT }, o + 0.2);
  tl.fromTo('#b2 span', { x: -60, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.45, ease: 'expo.out', ...FT }, o + B);
  popIn('#b3 span', o + 2.5 * B);
  tl.to('#b3 span', { scale: 1.08, duration: B / 2, yoyo: true, repeat: 3, ease: 'sine.inOut' }, o + 3 * B);
  toast('#t2', o + 2 * B, T.c - 0.3, -560);

  // reel C – Beauty
  o = T.c;
  tl.to('#feed', { y: -2152, duration: 2 * SW, ease: 'power3.inOut' }, o - SW);
  fall('#c2', o - 0.25); rise('#c3', o + 0.05);
  tl.fromTo('#prc', { scaleX: 0 }, { scaleX: 1, duration: T.all - o, ease: 'none', ...FT }, o);
  tl.fromTo('#c1k span', { y: -20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, ease: 'expo.out', ...FT }, o + 0.2);
  tl.fromTo('#c2k span', { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.45, ease: 'back.out(2.5)', ...FT }, o + B);
  popIn('#c3k span', o + 1.5 * B);
  [1.5, 2.75, 4].forEach((b) => tl.fromTo('#c3k span', { scale: 1.2 }, { scale: 1, duration: 0.3, ease: 'back.out(3)', immediateRender: false }, o + b * B));
  heartTap('c', o + 3 * B, 31200, 31300, false);
  toast('#t3', o + 2 * B, T.all - 0.2, 560);

  // ---------- all industries: three phones ----------
  o = T.all;
  fall('#c3', o - 0.25);
  tl.fromTo('#c4', { yPercent: 115 }, { yPercent: 0, duration: 0.6, ease: 'expo.out', immediateRender: false }, o + 0.05);
  marker('#c4 em', o);
  tl.to('#num', { autoAlpha: 0, duration: 0.2 }, o - 0.2);
  tl.to('#main', { scale: 0.86, y: 40, duration: 0.6, ease: 'expo.out' }, o);
  tl.fromTo('#tL', { x: -700, rotation: -20, scale: 0.72, autoAlpha: 1 }, { x: 40, rotation: -8, scale: 0.72, autoAlpha: 1, duration: 0.6, ease: 'expo.out', immediateRender: false }, o + 0.05);
  tl.fromTo('#tR', { x: 700, rotation: 20, scale: 0.72, autoAlpha: 1 }, { x: -40, rotation: 8, scale: 0.72, autoAlpha: 1, duration: 0.6, ease: 'expo.out', immediateRender: false }, o + 0.12);
  tl.set('#ch', { autoAlpha: 1 }, o);
  tl.fromTo('#ch .chip', { y: 40, scale: 0.7, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.35, ease: 'back.out(2)', stagger: B / 2, ...FT }, o + 0.5 * B);
  camPunch(o, 1.05);

  // ---------- CTA (white) ----------
  o = T.cta;
  tl.fromTo('#wipe', { x: -3800 }, { x: 1680, duration: 0.7, ease: 'sine.inOut', immediateRender: false }, o - 0.35);
  tl.set(['#dark', '#kick', '#cat', '#main', '#tL', '#tR', '#ch', '.toast'], { autoAlpha: 0 }, o);
  tl.set('#cta', { autoAlpha: 1 }, o);
  const la = o + 0.1;
  tl.fromTo('.lg-l', { y: 230 }, { y: 0, duration: 0.65, ease: 'expo.out', stagger: 0.05, ...FT }, la);
  tl.fromTo('#lgAccent', { x: 70, y: -112, autoAlpha: 0 }, { x: 0, y: 0, autoAlpha: 1, duration: 0.25, ease: 'power3.in', ...FT }, la + 0.2);
  $$('.lg-s').forEach((s, i) => tl.fromTo(s, { x: (i - 2.5) * 60, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.8, ease: 'expo.out', ...FT }, la + 0.45 + i * 0.03));
  const imp = la + 0.45;
  tl.fromTo('#ringA', { left: R.left + R.width / 2 - 60, top: R.top + R.height / 2 - 60, scale: 0.2, opacity: 1 }, { scale: 3.5, opacity: 0, duration: 0.7, ease: 'expo.out', immediateRender: false }, imp);
  tl.to('#cam', { keyframes: [{ x: -12, y: 8 }, { x: 9, y: -6 }, { x: -5, y: 4 }, { x: 0, y: 0 }], duration: 0.26, ease: 'none' }, imp);
  tl.fromTo('#cta .t8', { autoAlpha: 0, letterSpacing: '0.8em' }, { autoAlpha: 1, letterSpacing: '0.32em', duration: 1.0, ease: 'expo.out', ...FT }, o + 0.7);
  rise('#price .mi', o + 2 * B, { s: 0.1 });
  marker('#hlp', o + 3 * B);
  tl.fromTo('#cta .chip', { y: 40, scale: 0.7, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.4, ease: 'back.out(2)', stagger: B / 2, ...FT }, o + 3.5 * B);
  tl.fromTo('#btn', { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.55, ease: 'back.out(1.8)', ...FT }, o + 4.5 * B);
  tl.fromTo('#btn i', { x: 0 }, { x: 8, duration: B / 2, ease: 'sine.inOut', yoyo: true, repeat: 5, ...FT }, o + 5.5 * B);
  slideUp('#bio', o + 5 * B);
  tl.fromTo('#btn', { scale: 1.05 }, { scale: 1, duration: 0.3, ease: 'power2.out', immediateRender: false }, o + 6.5 * B);
  tl.to({}, { duration: 0.01 }, DURATION);
}

function fmtK(n) { const k = n / 1000; return k.toFixed(1).replace('.', ',') + 'K'; }
const gc = $('#grain'), gx = gc.getContext('2d'), gimg = gx.createImageData(540, 960);
function grain(frame) {
  let s = (frame * 2654435761) >>> 0 || 1; const d = gimg.data;
  for (let i = 0; i < d.length; i += 4) { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; d[i] = d[i + 1] = d[i + 2] = s & 255; d[i + 3] = 255; }
  gx.putImageData(gimg, 0, 0);
}
const STEPS = ['Step 1 · Farbe', 'Step 2 · Glanz', 'Step 3 · Pflege'];
async function afterSeek(t, frame) {
  LIKE.forEach(([k, at, a, b]) => ($(`#lk${k}`).textContent = fmtK(t >= at ? b : a)));
  $('#num').textContent = t < T.b ? '01 / 03' : t < T.c ? '02 / 03' : '03 / 03';
  const si = Math.max(0, Math.min(2, Math.floor((t - T.c - 1.5 * B) / (1.25 * B))));
  $('#step').textContent = STEPS[si];
  grain(frame);
  const ps = [];
  for (const [id, dir, start, off, v0, v1] of SRC) {
    if (t < v0 - 0.05 || t > v1) continue;
    const n = NF[dir];
    const f = (Math.max(0, Math.floor((t - start) * 30 + 1e-6)) + off) % n + 1;
    const img = $(id), src = `reels/${dir}_f/${String(f).padStart(4, '0')}.jpg`;
    if (img.getAttribute('src') !== src) { img.src = src; ps.push(img.decode().catch(() => {})); }
  }
  await Promise.all(ps);
}
window.__duration = DURATION;
window.__seek = (t, frame) => { tl.seek(t, false); return afterSeek(t, frame ?? Math.floor(t * 24)); };
window.__ready = (async () => {
  await Promise.all(['800 50px Unbounded', '900 50px Unbounded', '20px Michroma', '400 20px Inter', '600 20px Inter', '700 20px Inter', '20px "Noto Color Emoji"'].map((f) => document.fonts.load(f)));
  await document.fonts.ready;
  build(); await window.__seek(0, 0);
  return true;
})();
