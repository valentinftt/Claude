const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));
const B = 60 / 126;
// beat grid: camera 0-3 | "… DAS." 3-4 | reel 4-22 | end card 22-30
const T = { shot: 2 * B, das: 3 * B, reel: 4 * B, end: 22 * B };
const DURATION = 30 * B;
const tl = gsap.timeline({ paused: true });
const FT = { immediateRender: true };
const P = { likes: 2481 };
let MAXF = 257;

function build() {
  gsap.set('#wipe', { x: -3800, skewX: -32 });
  gsap.set(['#k1 span', '#k2 span', '#k3 span', '#k4 span', '#stk', '#shop'], { autoAlpha: 0 });

  // ---- camera / Vorher ----
  tl.fromTo('#photo', { scale: 1.06 }, { scale: 1, duration: T.das, ease: 'none', ...FT }, 0);
  tl.fromTo('#tagV', { x: -40, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.3, ease: 'expo.out', ...FT }, 0.05);
  tl.fromTo('#q1 .mi', { yPercent: 115 }, { yPercent: 0, duration: 0.5, ease: 'expo.out', stagger: 0.12, ...FT }, 0.1);
  tl.fromTo('#focus', { scale: 1.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.25, ease: 'power2.out', ...FT }, 0.35);
  tl.to('#focus', { autoAlpha: 0, duration: 0.15 }, 0.85);
  tl.to('#shutter i', { scale: 0.82, duration: 0.07 }, T.shot - 0.05);
  tl.to('#shutter i', { scale: 1, duration: 0.15 }, T.shot + 0.05);
  tl.fromTo('#flash', { opacity: 0 }, { keyframes: [{ opacity: 0.85, duration: 0.05 }, { opacity: 0, duration: 0.25 }], immediateRender: false }, T.shot);
  tl.to('#th', { opacity: 1, duration: 0.1 }, T.shot + 0.1);
  // ---- "… DAS." punch ----
  tl.to('#q1 .mi', { yPercent: -115, duration: 0.2, ease: 'power3.in', stagger: 0.04 }, T.das - 0.12);
  tl.fromTo('#q2', { scale: 0.4, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.25, ease: 'back.out(2.5)', immediateRender: false }, T.das);
  tl.to('#photoWrap', { scale: 2.6, filter: 'blur(14px)', duration: B, ease: 'power3.in' }, T.das);
  tl.to('#q2', { scale: 2.2, autoAlpha: 0, duration: 0.2, ease: 'power2.in' }, T.reel - 0.18);
  tl.fromTo('#flash', { opacity: 0 }, { opacity: 1, duration: 0.08, immediateRender: false }, T.reel - 0.08);
  // ---- Nachher: finished reel ----
  tl.set(['#camui', '#tagV'], { autoAlpha: 0 }, T.reel);
  tl.to('#flash', { opacity: 0, duration: 0.45, ease: 'power2.out' }, T.reel);
  tl.fromTo('#cam', { scale: 1.12 }, { scale: 1, duration: 0.6, ease: 'expo.out', immediateRender: false }, T.reel);
  tl.fromTo('#tagN', { x: -40, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.35, ease: 'expo.out', immediateRender: false }, T.reel + 0.1);
  tl.to('#tagN', { x: -40, autoAlpha: 0, duration: 0.3 }, T.reel + 6 * B);
  const r = T.reel;
  tl.fromTo('#k1 span', { y: -30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35, ease: 'expo.out', ...FT }, r + 0.2);
  tl.fromTo('#k2 span', { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.45, ease: 'back.out(2.2)', ...FT }, r + B);
  tl.to(['#k1 span', '#k2 span'], { autoAlpha: 0, y: -40, duration: 0.25 }, r + 4 * B - 0.2);
  tl.fromTo('#k3 span', { scale: 0.3, rotation: -6, autoAlpha: 0 }, { scale: 1, rotation: -3, autoAlpha: 1, duration: 0.4, ease: 'back.out(3)', ...FT }, r + 4 * B);
  tl.fromTo('#k4 span', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, ease: 'expo.out', ...FT }, r + 5 * B);
  tl.to(['#k3 span', '#k4 span'], { autoAlpha: 0, duration: 0.25 }, r + 8 * B - 0.2);
  tl.fromTo('#stk', { scale: 0, rotation: -90, autoAlpha: 0 }, { scale: 1, rotation: 10, autoAlpha: 1, duration: 0.5, ease: 'back.out(2.4)', ...FT }, r + 8 * B);
  tl.fromTo('#stk', { scale: 1.1 }, { scale: 1, duration: B * 0.8, ease: 'power2.out', repeat: 5, immediateRender: false }, r + 9 * B);
  tl.fromTo('#hb', { scale: 0.2, autoAlpha: 0, y: 0 }, { keyframes: [{ scale: 1.2, autoAlpha: 1, duration: 0.18 }, { scale: 1, duration: 0.14 }, { scale: 1.5, autoAlpha: 0, y: -120, duration: 0.45 }], ...FT }, r + 10 * B);
  tl.to('#hp', { attr: { fill: '#ff3040', stroke: '#ff3040' }, duration: 0.05 }, r + 10 * B);
  tl.fromTo('#hrt', { scale: 1.5 }, { scale: 1, duration: 0.4, ease: 'back.out(3)', immediateRender: false }, r + 10 * B);
  tl.fromTo(P, { likes: 2481 }, { likes: 18900, duration: 7 * B, ease: 'power2.in', ...FT }, r + 10 * B);
  tl.fromTo('#shop', { y: 120, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, ease: 'expo.out', ...FT }, r + 12 * B);
  tl.fromTo('#shop', { scale: 1.05 }, { scale: 1, duration: B * 0.8, ease: 'power2.out', repeat: 4, immediateRender: false }, r + 13 * B);
  for (let b = 5; b < 22; b++) tl.fromTo('#rv', { scale: 1.015 }, { scale: 1, duration: B * 0.7, ease: 'power2.out', immediateRender: false }, b * B);

  // ---- end card ----
  const o = T.end;
  tl.fromTo('#wipe', { x: -3800 }, { x: 1680, duration: 0.7, ease: 'sine.inOut', immediateRender: false }, o - 0.35);
  tl.set('#end', { opacity: 1 }, o);
  tl.set('#reel', { autoAlpha: 0 }, o);
  tl.fromTo('.lg-l', { y: 230 }, { y: 0, duration: 0.6, ease: 'expo.out', stagger: 0.05, ...FT }, o + 0.05);
  tl.fromTo('#lgAccent', { x: 70, y: -112, autoAlpha: 0 }, { x: 0, y: 0, autoAlpha: 1, duration: 0.22, ease: 'power3.in', ...FT }, o + 0.25);
  $$('.lg-s').forEach((s, i) => tl.fromTo(s, { x: (i - 2.5) * 60, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.7, ease: 'expo.out', ...FT }, o + 0.45 + i * 0.03));
  tl.to('#cam', { keyframes: [{ x: -10, y: 7 }, { x: 8, y: -5 }, { x: -4, y: 3 }, { x: 0, y: 0 }], duration: 0.24, ease: 'none' }, o + 0.47);
  tl.fromTo('#e1 .mi', { yPercent: 115 }, { yPercent: 0, duration: 0.5, ease: 'expo.out', stagger: 0.1, ...FT }, o + B);
  tl.fromTo('#hle', { '--hl': 0 }, { '--hl': 1, duration: 0.3, ease: 'power3.out', ...FT }, o + 2 * B);
  tl.fromTo('#e2', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, ease: 'expo.out', ...FT }, o + 3 * B);
  ['#c1', '#c2', '#c3'].forEach((c, i) => tl.fromTo(c, { x: -120, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.45, ease: 'back.out(1.8)', ...FT }, o + (4 + i * 0.75) * B));
  tl.fromTo('#c1', { scale: 1.04 }, { scale: 1, duration: B * 0.8, ease: 'power2.out', repeat: 2, immediateRender: false }, o + 6.5 * B);
  tl.to({}, { duration: 0.01 }, DURATION);
}

const gc = $('#grain'), gx = gc.getContext('2d'), gimg = gx.createImageData(540, 960);
function grain(frame) {
  let s = (frame * 2654435761) >>> 0 || 1; const d = gimg.data;
  for (let i = 0; i < d.length; i += 4) { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; d[i] = d[i + 1] = d[i + 2] = s & 255; d[i + 3] = 255; }
  gx.putImageData(gimg, 0, 0);
}
async function afterSeek(t, frame) {
  const lt = Math.max(0, t - T.reel);
  const n = Math.min(MAXF, Math.floor(lt * 30) + 1);
  const src = `reel/f/${String(n).padStart(4, '0')}.jpg`;
  const img = $('#rv'); let job = null;
  if (img.getAttribute('src') !== src) { img.setAttribute('src', src); job = img.decode().catch(() => {}); }
  $('#rprog i').style.transform = `scaleX(${Math.min(1, lt / (T.end - T.reel))})`;
  $('#lk').textContent = Math.round(P.likes).toLocaleString('de-DE');
  grain(frame);
  if (job) await job;
}
window.__duration = DURATION;
window.__seek = async (t, frame) => { tl.seek(t, false); await afterSeek(t, frame ?? Math.floor(t * 24)); };
window.__ready = (async () => {
  await Promise.all(['800 50px Unbounded', '900 50px Unbounded', '20px Michroma', '600 20px Inter', '700 20px Inter', '20px "Noto Color Emoji"'].map((f) => document.fonts.load(f)));
  await document.fonts.ready;
  try { MAXF = (await (await fetch('reel/count.json')).json()).n; } catch (e) {}
  build(); await window.__seek(0, 0);
  return true;
})();
