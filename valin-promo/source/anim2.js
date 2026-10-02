gsap.registerPlugin(DrawSVGPlugin);
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));
const DURATION = 22.0;
const tl = gsap.timeline({ paused: true });
const P = { s: 0, vC: 0, vL: 0, vR: 0, fol: 0, price: 1000, i: 0, sent: 0 };
const S_TXT = 'dein Unternehmen';
const I_TXT = 'Hey, ich will mehr Kunden!';

function rel(el) {
  const r = el.getBoundingClientRect();
  return { x: r.left, y: r.top, w: r.width, h: r.height, cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
}
function fitAll() {
  $$('[data-fit]').forEach((el) => {
    const max = +el.dataset.fit;
    let fs = parseFloat(getComputedStyle(el).fontSize);
    while (el.scrollWidth > max && fs > 10) { fs -= 1; el.style.fontSize = fs + 'px'; }
  });
}
const FT = { immediateRender: true };
function rise(targets, at, o = {}) {
  tl.fromTo(targets, { yPercent: 115 }, { yPercent: 0, duration: o.d || 0.65, ease: 'expo.out', stagger: o.s || 0.1, ...FT }, at);
}
function popIn(targets, at, o = {}) {
  tl.fromTo(targets, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: o.d || 0.5, ease: o.ease || 'back.out(2.2)', stagger: o.s || 0.08, ...FT }, at);
}
function marker(sel, at) {
  tl.fromTo(sel, { '--hl': 0 }, { '--hl': 1, duration: 0.4, ease: 'power3.out', ...FT }, at);
}
function pill(scene, at) {
  tl.fromTo(`${scene} .pill`, { x: -60, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.55, ease: 'expo.out', ...FT }, at);
}
function wipe(center, from, to) {
  tl.fromTo('#wipe', { x: -3800 }, { x: 1680, duration: 0.75, ease: 'sine.inOut', immediateRender: false }, center - 0.375);
  tl.set(from, { autoAlpha: 0 }, center);
  tl.set(to, { autoAlpha: 1 }, center);
}
function logoReveal(prefix, at, studioAt) {
  tl.fromTo(`.${prefix}-l`, { y: 230 }, { y: 0, duration: 0.7, ease: 'expo.out', stagger: 0.05, ...FT }, at);
  tl.fromTo(`#${prefix === 'lg' ? '' : 'sm_'}lgAccent`, { x: 70, y: -112, autoAlpha: 0 }, { x: 0, y: 0, autoAlpha: 1, duration: 0.25, ease: 'power3.in', ...FT }, at + 0.2);
  $$(`.${prefix}-s`).forEach((s, i) => {
    tl.fromTo(s, { x: (i - 2.5) * 60, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.8, ease: 'expo.out', ...FT }, studioAt + i * 0.03);
  });
}

function build() {
  const R = {
    heroBtn: rel($('#heroBtn')),
    acc: rel($('#lgAccent')),
  };
  gsap.set('#wipe', { x: -3800, skewX: -32 });
  gsap.set('.scene', { autoAlpha: 0 });
  gsap.set('#strike', { rotation: -5, scaleX: 0, transformOrigin: '0% 50%' });

  // background drift
  tl.to('#glowA', { x: 420, y: 380, duration: DURATION, ease: 'sine.inOut' }, 0);
  tl.to('#glowB', { x: -420, y: -520, duration: DURATION, ease: 'sine.inOut' }, 0);
  tl.to('#grid', { y: 120, duration: DURATION, ease: 'none' }, 0);

  // ---------- S1 hook 0 – 2.0 ----------
  tl.set('#s1', { autoAlpha: 1 }, 0);
  $$('#s1 .w').forEach((w, i) => {
    tl.fromTo(w, { scale: 0.2, y: 60, autoAlpha: 0 }, { scale: 1, y: 0, autoAlpha: 1, duration: 0.42, ease: 'back.out(2.4)', ...FT }, 0.04 + i * 0.17);
  });
  tl.fromTo('#search', { y: 80, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out', ...FT }, 0.55);
  tl.fromTo(P, { s: 0 }, { s: 1, duration: 0.55, ease: 'none', ...FT }, 0.78);
  popIn('#noRes span', 1.4, { ease: 'back.out(3)' });
  tl.to('#search', { keyframes: [{ x: -18 }, { x: 15 }, { x: -10 }, { x: 6 }, { x: 0 }], duration: 0.32, ease: 'none' }, 1.4);
  tl.to('#nicht', { keyframes: [{ rotation: -6 }, { rotation: 5 }, { rotation: -3 }, { rotation: 0 }], duration: 0.3, ease: 'none' }, 1.42);
  tl.fromTo('#s1 .inner', { scale: 1 }, { scale: 1.05, duration: 2, ease: 'none' }, 0);

  // ---------- S2 2.0 – 3.6 ----------
  wipe(2.0, '#s1', '#s2');
  logoReveal('lgsm', 2.02, 2.3);
  rise('#s2 .big .mi', 2.12, { s: 0.12 });
  marker('#hl2', 2.6);
  tl.fromTo('#s2 .inner', { scale: 1 }, { scale: 1.05, duration: 1.6, ease: 'none' }, 2.0);

  // ---------- S3 websites 3.6 – 7.6 ----------
  let o = 3.6;
  wipe(o, '#s2', '#s3');
  pill('#s3', o + 0.08);
  rise('#s3 .head .mi', o + 0.1);
  marker('#hl3', o + 0.5);
  tl.fromTo('#browser', { y: 220, scale: 0.93, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.9, ease: 'expo.out', ...FT }, o + 0.2);
  tl.fromTo('.snav > *', { y: -24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, ease: 'expo.out', stagger: 0.04, ...FT }, o + 0.5);
  tl.fromTo('#hero', { clipPath: 'inset(0% 100% 0% 0% round 22px)' }, { clipPath: 'inset(0% 0% 0% 0% round 22px)', duration: 0.6, ease: 'expo.out', ...FT }, o + 0.6);
  popIn('#hero .orb', o + 0.72, { s: 0.08 });
  rise('#hero h2 .mi', o + 0.78, { s: 0.08 });
  popIn('#heroBtn', o + 1.0);
  tl.fromTo('.svc > div', { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out', stagger: 0.06, ...FT }, o + 0.95);
  const bx = R.heroBtn.x + R.heroBtn.w * 0.55, by = R.heroBtn.y + R.heroBtn.h * 0.5;
  tl.fromTo('#cur3', { x: 940, y: 1520, autoAlpha: 0 }, { x: 940, y: 1520, autoAlpha: 1, duration: 0.15, ...FT }, o + 1.15);
  tl.to('#cur3', { x: bx, y: by, duration: 0.55, ease: 'power3.inOut' }, o + 1.2);
  tl.to('#cur3', { scale: 0.8, duration: 0.07, transformOrigin: '10% 5%' }, o + 1.82);
  tl.to('#cur3', { scale: 1, duration: 0.2, ease: 'back.out(3)' }, o + 1.89);
  tl.fromTo('#rip3', { x: bx - 28, y: by - 28, scale: 0.3, opacity: 1 }, { scale: 3, opacity: 0, duration: 0.55, ease: 'power2.out', immediateRender: false }, o + 1.84);
  tl.to('#heroBtn', { scale: 0.92, duration: 0.07 }, o + 1.82);
  tl.to('#heroBtn', { scale: 1, duration: 0.3, ease: 'back.out(3)' }, o + 1.89);
  tl.fromTo('#toast3', { y: 90, scale: 0.85, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.55, ease: 'back.out(1.8)', ...FT }, o + 2.05);
  tl.to('#cur3', { x: bx + 160, y: by + 300, autoAlpha: 0, duration: 0.6, ease: 'power2.in' }, o + 2.2);
  tl.fromTo('#mob', { x: 380, rotation: 14, autoAlpha: 0 }, { x: 0, rotation: -4, autoAlpha: 1, duration: 0.9, ease: 'expo.out', ...FT }, o + 2.3);
  tl.fromTo('#c3 .chip', { y: 40, scale: 0.7, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.5, ease: 'back.out(2)', stagger: 0.09, ...FT }, o + 2.7);
  tl.fromTo('#s3 .inner', { scale: 1 }, { scale: 1.03, duration: 4, ease: 'none' }, o);

  // push transition S3 -> S4 (centre 7.6)
  tl.set('#s4', { autoAlpha: 1 }, 7.33);
  tl.to('#s3 .inner', { y: -1920, duration: 0.55, ease: 'power4.inOut' }, 7.33);
  tl.fromTo('#s4 .inner', { y: 1920 }, { y: 0, duration: 0.55, ease: 'power4.inOut', immediateRender: false }, 7.33);
  tl.set('#s3', { autoAlpha: 0 }, 7.9);

  // ---------- S4 reels 7.6 – 11.6 ----------
  o = 7.6;
  pill('#s4', o + 0.2);
  rise('#s4 .head .mi', o + 0.22);
  marker('#hl4', o + 0.65);
  tl.fromTo('#phC', { y: 520, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.0, ease: 'expo.out', ...FT }, o + 0.3);
  tl.fromTo('#phL', { x: -320, rotation: -22, autoAlpha: 0 }, { x: 0, rotation: -8, autoAlpha: 1, duration: 1.0, ease: 'expo.out', ...FT }, o + 0.45);
  tl.fromTo('#phR', { x: 320, rotation: 22, autoAlpha: 0 }, { x: 0, rotation: 8, autoAlpha: 1, duration: 1.0, ease: 'expo.out', ...FT }, o + 0.5);
  tl.fromTo(['#pbC', '#pbL', '#pbR'], { scaleX: 0 }, { scaleX: 1, duration: 3.6, ease: 'none', ...FT }, o + 0.4);
  tl.fromTo(P, { vC: 0, vL: 0, vR: 0 }, { vC: 128400, vL: 54200, vR: 87900, duration: 2.8, ease: 'power2.in', ...FT }, o + 0.6);
  popIn(['#cw1', '#cw2'], o + 0.85, { s: 0.25, ease: 'back.out(3)' });
  popIn(['#capL', '#capR'], o + 0.95, { s: 0.12 });
  tl.fromTo('#bot', { y: 0 }, { y: -16, duration: 0.5, ease: 'sine.inOut', yoyo: true, repeat: 6, ...FT }, o + 0.5);
  tl.fromTo('#shine', { x: 0 }, { x: 260, duration: 0.6, ease: 'power2.inOut', ...FT }, o + 1.3);
  tl.fromTo('.stm', { y: 18, opacity: 0.2 }, { y: -18, opacity: 0.95, duration: 0.6, ease: 'sine.inOut', yoyo: true, repeat: 5, stagger: 0.15, ...FT }, o + 0.5);
  tl.fromTo('#flame', { scaleY: 0.88, scaleX: 1.05, transformOrigin: '50% 100%' }, { scaleY: 1.1, scaleX: 0.95, duration: 0.13, ease: 'sine.inOut', yoyo: true, repeat: 27, ...FT }, o + 0.4);
  tl.fromTo('#cglow', { scale: 0.92, transformOrigin: '50% 50%' }, { scale: 1.06, duration: 0.2, ease: 'sine.inOut', yoyo: true, repeat: 17, ...FT }, o + 0.4);
  tl.to('#hrt', { attr: { fill: '#c7f431', stroke: '#c7f431' }, duration: 0.05 }, o + 2.0);
  tl.fromTo('#hrt', { scale: 1.6, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.45, ease: 'back.out(3)', immediateRender: false }, o + 2.0);
  tl.fromTo('#toast4', { x: 420, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.6, ease: 'expo.out', ...FT }, o + 2.2);
  tl.fromTo(P, { fol: 0 }, { fol: 1204, duration: 1.0, ease: 'power2.out', ...FT }, o + 2.3);
  tl.fromTo('#s4 .inner', { scale: 1 }, { scale: 1.03, duration: 4, ease: 'none', immediateRender: false }, o);

  // ---------- S5 chain 11.6 – 14.4 ----------
  o = 11.6;
  wipe(o, '#s4', '#s5');
  pill('#s5', o + 0.08);
  rise('#s5 .head .mi', o + 0.1);
  marker('#hl5', o + 0.5);
  $$('.crow').forEach((r, i) => {
    tl.fromTo(r, { x: -120, scale: 0.9, autoAlpha: 0 }, { x: 0, scale: 1, autoAlpha: 1, duration: 0.5, ease: 'back.out(1.6)', ...FT }, o + 0.3 + i * 0.42);
    const a = r.querySelector('.arw path');
    if (a) tl.fromTo(r.querySelector('.arw'), { y: -14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.3, ease: 'power2.out', ...FT }, o + 0.55 + i * 0.42);
  });
  tl.fromTo('#fin', { scale: 1.15 }, { scale: 1, duration: 0.5, ease: 'expo.out', immediateRender: false }, o + 1.6);
  tl.fromTo('#fin .ic', { rotation: -90 }, { rotation: 0, duration: 0.6, ease: 'back.out(2)', ...FT }, o + 1.6);
  tl.fromTo('#langf', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out', ...FT }, o + 1.95);
  tl.fromTo('#s5 .inner', { scale: 1 }, { scale: 1.04, duration: 2.8, ease: 'none' }, o);

  // ---------- S6 offer 14.4 – 17.6 ----------
  o = 14.4;
  wipe(o, '#s5', '#s6');
  rise('#s6 .head .mi', o + 0.08);
  marker('#hl6', o + 0.5);
  tl.fromTo('#cA', { y: 90, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'expo.out', ...FT }, o + 0.2);
  tl.to('#strike', { scaleX: 1, duration: 0.28, ease: 'power3.out' }, o + 0.75);
  tl.to('#pA', { opacity: 0.55, duration: 0.3 }, o + 0.85);
  tl.fromTo('#cB', { y: 160, scale: 0.9, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.7, ease: 'expo.out', ...FT }, o + 0.95);
  tl.fromTo(P, { price: 1000 }, { price: 299, duration: 0.55, ease: 'power2.out', ...FT }, o + 1.05);
  tl.fromTo('#price', { scale: 1.25, transformOrigin: '0% 80%' }, { scale: 1, duration: 0.45, ease: 'back.out(3)', immediateRender: false }, o + 1.6);
  tl.fromTo('#burst', { scale: 0, rotation: -120 }, { scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(2)', ...FT }, o + 1.7);
  tl.to('#burst svg', { rotation: 40, duration: 1.5, ease: 'none' }, o + 1.7);
  tl.fromTo('#tools', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out', ...FT }, o + 1.85);
  tl.fromTo('#s6 .chip', { y: 40, scale: 0.7, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.5, ease: 'back.out(2)', stagger: 0.15, ...FT }, o + 2.1);
  tl.fromTo('#s6 .inner', { scale: 1 }, { scale: 1.03, duration: 3.2, ease: 'none' }, o);

  // ---------- S7 CTA 17.6 – 22.0 ----------
  o = 17.6;
  wipe(o, '#s6', '#s7');
  logoReveal('lg', o + 0.05, o + 0.5);
  const imp = o + 0.5;
  tl.fromTo('#ringA', { left: R.acc.cx - 60, top: R.acc.cy - 60, scale: 0.2, opacity: 1 }, { scale: 3.5, opacity: 0, duration: 0.7, ease: 'expo.out', immediateRender: false }, imp);
  tl.to('#cam', { keyframes: [{ x: -12, y: 8 }, { x: 9, y: -6 }, { x: -5, y: 4 }, { x: 0, y: 0 }], duration: 0.26, ease: 'none' }, imp);
  tl.fromTo('#tag7', { autoAlpha: 0, letterSpacing: '0.8em' }, { autoAlpha: 1, letterSpacing: '0.32em', duration: 1.0, ease: 'expo.out', ...FT }, o + 0.65);
  rise('#h7 .mi', o + 0.7);
  tl.fromTo('#chat', { y: 70, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'expo.out', ...FT }, o + 0.85);
  tl.fromTo(P, { i: 0 }, { i: 1, duration: 0.6, ease: 'none', ...FT }, o + 1.1);
  tl.fromTo(P, { sent: 0 }, { sent: 1, duration: 0.01, ...FT }, o + 1.8);
  tl.fromTo('#inp .snd', { scale: 1 }, { keyframes: [{ scale: 0.8 }, { scale: 1.1 }, { scale: 1 }], duration: 0.3, immediateRender: false }, o + 1.78);
  tl.fromTo('#bub', { y: 110, scale: 0.6, autoAlpha: 0, transformOrigin: '100% 100%' }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.5, ease: 'back.out(2)', ...FT }, o + 1.8);
  tl.fromTo('#dots', { scale: 0, autoAlpha: 0, transformOrigin: '0% 100%' }, { scale: 1, autoAlpha: 1, duration: 0.4, ease: 'back.out(2)', ...FT }, o + 2.2);
  tl.fromTo('#dots i', { y: 0 }, { y: -7, duration: 0.22, ease: 'sine.inOut', yoyo: true, repeat: 9, stagger: 0.1, ...FT }, o + 2.3);
  tl.fromTo('#cta', { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.65, ease: 'back.out(1.8)', ...FT }, o + 2.0);
  tl.fromTo('#cta .ar', { x: 0 }, { x: 8, duration: 0.25, ease: 'sine.inOut', yoyo: true, repeat: 7, ...FT }, o + 2.6);
  tl.fromTo('#bio', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'expo.out', ...FT }, o + 2.3);
  ['#pr1', '#pr2'].forEach((p, i) => {
    tl.fromTo(p, { scale: 1, opacity: 0.6 }, { scale: 1.25, opacity: 0, duration: 0.9, ease: 'power2.out', immediateRender: false }, o + 2.9 + i * 0.9);
    tl.fromTo('#cta', { scale: 1.04 }, { scale: 1, duration: 0.35, ease: 'power2.out', immediateRender: false }, o + 2.9 + i * 0.9);
  });
  tl.to({}, { duration: 0.01 }, DURATION);
}

function fmtK(n) {
  if (n < 1000) return String(Math.round(n));
  const k = n / 1000;
  return (k < 100 ? k.toFixed(1) : Math.round(k)).toString().replace('.', ',') + 'K';
}
const gc = $('#grain'), gx = gc.getContext('2d'), gimg = gx.createImageData(540, 960);
function grain(frame) {
  let s = (frame * 2654435761) >>> 0 || 1;
  const d = gimg.data;
  for (let i = 0; i < d.length; i += 4) {
    s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0;
    d[i] = d[i + 1] = d[i + 2] = s & 255; d[i + 3] = 255;
  }
  gx.putImageData(gimg, 0, 0);
}
function afterSeek(t, frame) {
  $('#sText').textContent = S_TXT.slice(0, Math.round(P.s * S_TXT.length));
  $('#sCaret').style.opacity = (P.s > 0 && P.s < 1) || Math.floor(t * 2.6) % 2 === 0 ? 1 : 0;
  $('#vC').textContent = fmtK(P.vC); $('#vL').textContent = fmtK(P.vL); $('#vR').textContent = fmtK(P.vR);
  $('#fol').textContent = Math.round(P.fol).toLocaleString('de-DE');
  const pr = Math.round(P.price);
  $('#price').textContent = (pr >= 1000 ? '1.000' : pr) + ' €';
  const typed = P.sent ? '' : I_TXT.slice(0, Math.round(P.i * I_TXT.length));
  $('#iText').textContent = typed;
  $('#iPh').style.display = typed ? 'none' : 'inline';
  $('#iCaret').style.opacity = (P.i > 0 && !P.sent) || Math.floor(t * 2.6) % 2 === 0 ? 1 : 0;
  grain(frame);
}
window.__duration = DURATION;
window.__seek = (t, frame) => { tl.seek(t, false); afterSeek(t, frame ?? Math.floor(t * 24)); };
window.__ready = (async () => {
  await Promise.all(['800 50px Unbounded', '900 50px Unbounded', '20px Michroma', '400 20px Inter', '600 20px Inter', '700 20px Inter'].map((f) => document.fonts.load(f)));
  await document.fonts.ready;
  fitAll();
  build();
  window.__seek(0, 0);
  return true;
})();
