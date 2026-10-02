const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));
const B = 60 / 126;               // one beat (126 BPM tech-house)
// beat grid: hook 0-4 | Schmuck 4-12 | Mode 12-18 | Beauty 18-24 | CTA 24-32
const T = { a: 4 * B, b: 12 * B, c: 18 * B, cta: 24 * B };
const DURATION = 32 * B;
const REELH = 1076;
const tl = gsap.timeline({ paused: true });
const FT = { immediateRender: true };
const rise = (t, at, o = {}) => tl.fromTo(t, { yPercent: 115 }, { yPercent: 0, duration: o.d || 0.55, ease: 'expo.out', stagger: o.s || 0.08, ...FT }, at);
const sink = (t, at) => tl.to(t, { yPercent: -115, duration: 0.25, ease: 'power3.in' }, at);
const marker = (s, at) => tl.fromTo(s, { '--hl': 0 }, { '--hl': 1, duration: 0.3, ease: 'power3.out', ...FT }, at);
const pop = (t, at, o = {}) => tl.fromTo(t, { scale: o.from ?? 0.3, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.4, ease: 'back.out(2.6)', ...FT }, at);
const REELS = [
  { id: 'A', dir: 'schmuck', start: T.a, end: T.b },
  { id: 'B', dir: 'mode', start: T.b, end: T.c },
  { id: 'C', dir: 'beauty', start: T.c, end: T.cta },
];
function heartBurst(k, at) {
  tl.fromTo('#hb' + k, { scale: 0.2, autoAlpha: 0, y: 0 }, { keyframes: [{ scale: 1.25, autoAlpha: 1, duration: 0.18 }, { scale: 1, duration: 0.14 }, { scale: 1.5, autoAlpha: 0, y: -90, duration: 0.4 }], immediateRender: true }, at);
  tl.to(`#h${k} path`, { attr: { fill: '#ff3040', stroke: '#ff3040' }, duration: 0.05 }, at);
  tl.fromTo('#h' + k, { scale: 1.5 }, { scale: 1, duration: 0.4, ease: 'back.out(3)', immediateRender: false }, at);
}

function build() {
  gsap.set('#wipe', { x: -3800, skewX: -32 });
  gsap.set(['#c2', '#c3', '#c4'], { yPercent: 115 });
  gsap.set(['#kick', '#num', '#t1', '#t2', '#t3', '#ch .chip'], { autoAlpha: 0 });
  tl.to('#glowA', { x: 420, y: 380, duration: DURATION, ease: 'sine.inOut' }, 0);
  tl.to('#glowB', { x: -420, y: -520, duration: DURATION, ease: 'sine.inOut' }, 0);

  // ---- hook (white) ----
  rise('#hook .mi', 0.05, { s: 0.1 });
  marker('#hl1', 0.6);
  tl.fromTo('#main', { y: 1500, rotation: 8 }, { y: 560, rotation: 4, duration: 0.9, ease: 'expo.out', ...FT }, 0.75);
  tl.to('#hook .mi', { yPercent: -115, duration: 0.3, ease: 'power3.in', stagger: 0.04 }, T.a - 0.36);
  tl.fromTo('#flash', { opacity: 0 }, { opacity: 1, duration: 0.1, ease: 'power2.in', immediateRender: false }, T.a - 0.1);
  // ---- drop → dark showroom ----
  tl.set('#dark', { opacity: 1 }, T.a);
  tl.to('#flash', { opacity: 0, duration: 0.4, ease: 'power2.out' }, T.a);
  tl.to('#main', { y: 0, rotation: 0, duration: 0.5, ease: 'expo.out' }, T.a);
  tl.fromTo('#cam', { scale: 1.08 }, { scale: 1, duration: 0.5, ease: 'power2.out', immediateRender: false }, T.a);
  tl.to(['#kick', '#num'], { autoAlpha: 1, duration: 0.3 }, T.a + 0.05);
  rise('#c1', T.a + 0.05);
  for (let b = 5; b < 24; b++) tl.fromTo('#main', { scale: 1.01 }, { scale: 1, duration: B * 0.8, ease: 'power2.out', immediateRender: false }, b * B);
  tl.fromTo('#ch .chip', { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, ease: 'back.out(2)', stagger: B / 2, immediateRender: false }, T.c + B);

  // reel A
  pop('#a1 span', T.a + 0.15, { from: 0.6 });
  tl.fromTo('#a2 span', { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, ease: 'expo.out', ...FT }, T.a + B);
  tl.fromTo('#a3', { scale: 0, rotation: -80 }, { scale: 1, rotation: 10, duration: 0.5, ease: 'back.out(2.5)', ...FT }, T.a + 3 * B);
  heartBurst('A', T.a + 5 * B);
  tl.fromTo('#t1', { x: 520, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out', immediateRender: false }, T.a + 4 * B);
  tl.to('#t1', { x: 520, autoAlpha: 0, duration: 0.3, ease: 'power3.in' }, T.b - 0.4);

  // swipe → reel B
  tl.to('#feed', { y: -REELH, duration: 0.38, ease: 'power3.inOut' }, T.b - 0.3);
  sink('#c1', T.b - 0.2); rise('#c2', T.b);
  pop('#b1 span', T.b + 0.15, { from: 0.5 });
  tl.fromTo('#b2 span', { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, ease: 'expo.out', ...FT }, T.b + B);
  heartBurst('B', T.b + 3 * B);
  tl.fromTo('#t2', { x: -520, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out', immediateRender: false }, T.b + 2 * B);
  tl.to('#t2', { x: -520, autoAlpha: 0, duration: 0.3, ease: 'power3.in' }, T.c - 0.4);

  // swipe → reel C
  tl.to('#feed', { y: -2 * REELH, duration: 0.38, ease: 'power3.inOut' }, T.c - 0.3);
  sink('#c2', T.c - 0.2); rise('#c3', T.c);
  pop('#c1x span', T.c + 0.15, { from: 0.5 });
  tl.fromTo('#c2x span', { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, ease: 'expo.out', ...FT }, T.c + B);
  heartBurst('C', T.c + 3 * B);
  tl.fromTo('#t3', { x: 520, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out', immediateRender: false }, T.c + 2 * B);
  sink('#c3', T.c + 4.4 * B); rise('#c4', T.c + 4.6 * B);

  // ---- CTA (white) ----
  const o = T.cta;
  tl.fromTo('#wipe', { x: -3800 }, { x: 1680, duration: 0.7, ease: 'sine.inOut', immediateRender: false }, o - 0.35);
  tl.set(['#dark', '#main', '#kick', '#num', '#cat', '#ch', '#t3'], { autoAlpha: 0 }, o);
  tl.set('#cta', { opacity: 1 }, o);
  tl.fromTo('.lg-l', { y: 230 }, { y: 0, duration: 0.6, ease: 'expo.out', stagger: 0.05, ...FT }, o + 0.05);
  tl.fromTo('#lgAccent', { x: 70, y: -112, autoAlpha: 0 }, { x: 0, y: 0, autoAlpha: 1, duration: 0.22, ease: 'power3.in', ...FT }, o + 0.25);
  $$('.lg-s').forEach((s, i) => tl.fromTo(s, { x: (i - 2.5) * 60, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.7, ease: 'expo.out', ...FT }, o + 0.45 + i * 0.03));
  tl.to('#cam', { keyframes: [{ x: -10, y: 7 }, { x: 8, y: -5 }, { x: -4, y: 3 }, { x: 0, y: 0 }], duration: 0.24, ease: 'none' }, o + 0.47);
  tl.fromTo('#cta .t8', { autoAlpha: 0, letterSpacing: '0.8em' }, { autoAlpha: 1, letterSpacing: '0.32em', duration: 0.8, ease: 'expo.out', ...FT }, o + 0.6);
  rise('#price .mi', o + 2 * B);
  marker('#hlp', o + 3 * B);
  tl.fromTo('#cta .chip', { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, ease: 'back.out(2)', stagger: B / 2, ...FT }, o + 4 * B);
  tl.fromTo('#btn', { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.5, ease: 'back.out(1.8)', ...FT }, o + 5 * B);
  tl.fromTo('#bio', { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, ease: 'expo.out', ...FT }, o + 6 * B);
  tl.fromTo('#btn i', { x: 0 }, { x: 8, duration: B / 2, ease: 'sine.inOut', yoyo: true, repeat: 3, ...FT }, o + 6 * B);
  tl.to({}, { duration: 0.01 }, DURATION);
}

const gc = $('#grain'), gx = gc.getContext('2d'), gimg = gx.createImageData(540, 960);
function grain(frame) {
  let s = (frame * 2654435761) >>> 0 || 1; const d = gimg.data;
  for (let i = 0; i < d.length; i += 4) { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; d[i] = d[i + 1] = d[i + 2] = s & 255; d[i + 3] = 255; }
  gx.putImageData(gimg, 0, 0);
}
async function afterSeek(t, frame) {
  const jobs = [];
  for (const r of REELS) {
    const lt = Math.max(0, t - r.start + 0.4);
    const n = Math.min(r.max, Math.floor(lt * 30) + 1);
    const src = `reels/${r.dir}_f/${String(n).padStart(4, '0')}.jpg`;
    const img = $('#v' + r.id);
    if (img.getAttribute('src') !== src) { img.setAttribute('src', src); jobs.push(img.decode().catch(() => {})); }
    $('#p' + r.id).style.transform = `scaleX(${Math.min(1, lt / (r.end - r.start + 0.4))})`;
  }
  $('#num').textContent = `0${t >= T.c - 0.1 ? 3 : t >= T.b - 0.1 ? 2 : 1} / 03`;
  grain(frame);
  await Promise.all(jobs);
}
window.__duration = DURATION;
window.__seek = async (t, frame) => { tl.seek(t, false); await afterSeek(t, frame ?? Math.floor(t * 24)); };
window.__ready = (async () => {
  await Promise.all(['800 50px Unbounded', '900 50px Unbounded', '20px Michroma', '600 20px Inter', '700 20px Inter', '20px "Noto Color Emoji"'].map((f) => document.fonts.load(f)));
  await document.fonts.ready;
  const counts = await (await fetch('reels/counts.json')).json();
  REELS.forEach((r) => (r.max = counts[r.dir]));
  build(); await window.__seek(0, 0);
  return true;
})();
