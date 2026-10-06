// Shared helpers for the 6-second story videos (1080x1920, seeked frame by frame).
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));
const DUR = +($('#stage').dataset.dur || 6);   // template header can set dur:… (default 6 s)
const tl = gsap.timeline({ paused: true });
const FT = { immediateRender: true };
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = (x) => 1 - Math.pow(1 - clamp(x), 3);
const rise = (t, at, o = {}) => tl.fromTo(t, { yPercent: 115 }, { yPercent: 0, duration: o.d || 0.55, ease: 'expo.out', stagger: o.s ?? 0.08, ...FT }, at);
const popIn = (t, at, o = {}) => tl.fromTo(t, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: o.d || 0.45, ease: o.ease || 'back.out(2.2)', stagger: o.s ?? 0.08, ...FT }, at);
const slideUp = (t, at, o = {}) => tl.fromTo(t, { y: o.y || 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: o.d || 0.45, ease: 'expo.out', stagger: o.s ?? 0.08, ...FT }, at);
const marker = (s, at) => tl.fromTo(s, { '--hl': 0 }, { '--hl': 1, duration: 0.35, ease: 'power3.out', ...FT }, at);
const camPunch = (at, s = 1.04, d = 0.35) => tl.fromTo('#cam', { scale: s }, { scale: 1, duration: d, ease: 'power2.out', immediateRender: false }, at);
const shake = (at, a = 10, d = 0.26) => tl.to('#cam', { keyframes: [{ x: -a, y: a * 0.6 }, { x: a * 0.8, y: -a * 0.5 }, { x: -a * 0.4, y: a * 0.3 }, { x: 0, y: 0 }], duration: d, ease: 'none' }, at);

// shared CTA: optional offer line + DM button with a nudging arrow
function cta(at, offerAt) {
  if (offerAt != null && $('#offer')) { rise('#offer .mi', offerAt, { s: 0.1 }); if ($('#hlo')) marker('#hlo', offerAt + 0.35); }
  tl.fromTo('#dm', { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.55, ease: 'back.out(1.8)', ...FT }, at);
  tl.fromTo('#dm i', { x: 0 }, { x: 9, duration: 0.24, ease: 'sine.inOut', yoyo: true, repeat: 7, ...FT }, at + 0.5);
  [at + 0.9, at + 1.9].forEach((p) => {
    if (p > DUR - 1.0) return;
    tl.fromTo('#dmPulse', { scale: 1, opacity: 0.7 }, { scale: 1.25, opacity: 0, duration: 0.9, ease: 'power2.out', immediateRender: false }, p);
    tl.fromTo('#dm', { scale: 1.05 }, { scale: 1, duration: 0.3, ease: 'power2.out', immediateRender: false }, p);
  });
}
function logoIn(at, el = '#logoTop') {
  tl.fromTo(`${el} .lg-l`, { y: 230 }, { y: 0, duration: 0.6, ease: 'expo.out', stagger: 0.04, ...FT }, at);
  tl.fromTo(`${el} #lgAccent`, { x: 70, y: -112, autoAlpha: 0 }, { x: 0, y: 0, autoAlpha: 1, duration: 0.22, ease: 'power3.in', ...FT }, at + 0.18);
  tl.fromTo(`${el} .lg-s`, { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 0.6, ease: 'expo.out', stagger: 0.02, ...FT }, at + 0.35);
}
function fitAll() {
  $$('[data-fit]').forEach((el) => {
    const max = +el.dataset.fit; let fs = parseFloat(getComputedStyle(el).fontSize);
    while (el.scrollWidth > max && fs > 10) { fs -= 1; el.style.fontSize = fs + 'px'; }
  });
}
const gc = $('#grain'), gx = gc.getContext('2d'), gimg = gx.createImageData(540, 960);
function grain(frame) {
  let s = (frame * 2654435761) >>> 0 || 1; const d = gimg.data;
  for (let i = 0; i < d.length; i += 4) { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; d[i] = d[i + 1] = d[i + 2] = s & 255; d[i + 3] = 255; }
  gx.putImageData(gimg, 0, 0);
}
async function setImg(img, src) {
  if (img.getAttribute('src') === src) return;
  img.src = src; try { await img.decode(); } catch (e) {}
}
function start(build, after) {
  window.__duration = DUR;
  window.__seek = async (t, frame) => { tl.seek(t, false); if (after) await after(t); grain(frame ?? Math.floor(t * 24)); };
  window.__ready = (async () => {
    await Promise.all(['800 50px Unbounded', '900 50px Unbounded', '600 50px Unbounded', '20px Michroma', '400 20px Inter', '500 20px Inter', '600 20px Inter', '700 20px Inter', '20px "Noto Color Emoji"', '20px "Liberation Sans"', '20px "Liberation Serif"', '20px "Liberation Mono"'].map((f) => document.fonts.load(f)));
    await document.fonts.ready;
    fitAll(); build(); tl.to({}, { duration: 0.001 }, DUR);
    await window.__seek(0, 0);
    return true;
  })();
}
