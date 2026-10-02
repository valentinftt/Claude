gsap.registerPlugin(DrawSVGPlugin);
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));
const DURATION = 26.5;
const tl = gsap.timeline({ paused: true });
const P = { url: 0, likes: 1200, comms: 86, shares: 40, wght: 200 };
const URL_TXT = 'www.nova-skincare.de';

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

// mask-line reveal helper
function rise(targets, at, opt = {}) {
  tl.fromTo(targets, { yPercent: 115 }, { yPercent: 0, duration: opt.d || 0.7, ease: opt.ease || 'expo.out', stagger: opt.s || 0.08, immediateRender: true }, at);
}
function sink(targets, at, opt = {}) {
  tl.to(targets, { yPercent: -115, duration: opt.d || 0.35, ease: 'power3.in', stagger: opt.s || 0.04 }, at);
}
function label(scene, at) {
  tl.fromTo(`${scene} .label > *`, { x: -40, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.6, ease: 'expo.out', stagger: 0.06, immediateRender: true }, at);
}
function chips(sel, at) {
  tl.fromTo(`${sel} .chip`, { y: 40, scale: 0.7, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.6, ease: 'back.out(2)', stagger: 0.1, immediateRender: true }, at);
}
// lime diagonal swipe; screen fully covered at `center`
function wipe(center, from, to) {
  tl.fromTo('#wipe', { x: -3800 }, { x: 1680, duration: 0.8, ease: 'sine.inOut', immediateRender: false }, center - 0.4);
  tl.set(from, { autoAlpha: 0 }, center);
  tl.set(to, { autoAlpha: 1 }, center);
}

function build() {
  const btn = rel($('#buyBtn'));
  const hb = rel($('#heart'));
  gsap.set('#wipe', { x: -3800, skewX: -32 });
  gsap.set('#slash1', { skewX: -32, x: -1600 });
  gsap.set('.scene', { autoAlpha: 0 });

  // ---------- background ----------
  tl.to('#grid', { opacity: 1, duration: 1.2, ease: 'power1.out' }, 0.05);
  tl.to('#grid', { y: 120, duration: DURATION, ease: 'none' }, 0);
  tl.to('#glowA', { x: 500, y: 300, duration: DURATION, ease: 'sine.inOut' }, 0);
  tl.to('#glowB', { x: -500, y: -500, duration: DURATION, ease: 'sine.inOut' }, 0);

  // ---------- S1 hook (0 – 2) ----------
  tl.set('#s1', { autoAlpha: 1 }, 0);
  tl.to('#slash1', { x: 1700, duration: 0.42, ease: 'power2.in' }, 0);
  const w1 = $$('#s1 .mi');
  [0.25, 0.5, 0.75, 1.0].forEach((t, i) => rise(w1[i], t, { d: 0.55 }));
  tl.fromTo('#mehr1', { scale: 1.35, transformOrigin: '0% 70%' }, { scale: 1, duration: 0.6, ease: 'expo.out', immediateRender: false }, 1.0);
  tl.fromTo('#s1 .inner', { scale: 1 }, { scale: 1.06, duration: 2, ease: 'none' }, 0);

  // ---------- S2 MEHR (2 – 4.5) ----------
  wipe(2.0, '#s1', '#s2');
  tl.fromTo('#s2tag', { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 0.6, ease: 'expo.out', immediateRender: true }, 2.1);
  rise('#s2 .mehr .mi', 2.05, { d: 0.6 });
  const sw = ['#sw1 .mi', '#sw2 .mi', '#sw3 .mi'];
  gsap.set(sw, { yPercent: 115 });
  rise(sw[0], 2.25, { d: 0.5 }); sink(sw[0], 2.8, { d: 0.22 });
  rise(sw[1], 3.0, { d: 0.5 }); sink(sw[1], 3.55, { d: 0.22 });
  rise(sw[2], 3.75, { d: 0.5 });
  tl.fromTo('#sw3 .mi', { scale: 1.25, transformOrigin: '0% 70%' }, { scale: 1, duration: 0.5, ease: 'expo.out', immediateRender: false }, 3.75);
  tl.fromTo('#cline', { drawSVG: '0%' }, { drawSVG: '100%', duration: 2.1, ease: 'power2.inOut', immediateRender: true }, 2.15);
  tl.fromTo('#areaRect', { attr: { width: 0 } }, { attr: { width: 1080 }, duration: 2.1, ease: 'power2.inOut', immediateRender: true }, 2.15);
  tl.fromTo(['#cdot', '#cdotR'], { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.4, ease: 'back.out(3)', immediateRender: true }, 4.1);
  tl.to('#cdotR', { scale: 2.6, opacity: 0, duration: 0.6, ease: 'power2.out' }, 4.2);
  tl.fromTo('#s2 .inner', { scale: 1 }, { scale: 1.05, duration: 2.5, ease: 'none' }, 2.0);

  // ---------- S3 websites (4.5 – 9.5) ----------
  let o = 4.5;
  wipe(o, '#s2', '#s3');
  label('#s3', o + 0.1);
  rise('#s3 .head .mi', o + 0.15, { s: 0.1 });
  tl.fromTo('#browser', { y: 260, scale: 0.92, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 1.0, ease: 'expo.out', immediateRender: true }, o + 0.25);
  tl.fromTo(P, { url: 0 }, { url: 1, duration: 0.7, ease: 'none', immediateRender: true }, o + 0.75);
  tl.fromTo('.site-nav > *', { y: -24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out', stagger: 0.05, immediateRender: true }, o + 1.45);
  rise('.hero h1 .mi', o + 1.55, { s: 0.09 });
  tl.fromTo('#heroP', { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'expo.out', immediateRender: true }, o + 1.85);
  tl.fromTo('.hero .btn', { scale: 0.5, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.55, ease: 'back.out(2.2)', stagger: 0.08, immediateRender: true }, o + 1.95);
  tl.fromTo('#heroImg', { clipPath: 'inset(100% 0% 0% 0% round 26px)' }, { clipPath: 'inset(0% 0% 0% 0% round 26px)', duration: 0.8, ease: 'expo.out', immediateRender: true }, o + 1.6);
  tl.fromTo('#heroBottle', { y: 120, rotation: -14 }, { y: 0, rotation: 0, duration: 1.0, ease: 'expo.out', immediateRender: true }, o + 1.7);
  tl.fromTo('#heroBottle .shine', { x: 0 }, { x: 260, duration: 0.7, ease: 'power2.inOut', immediateRender: true }, o + 2.3);

  const cur = $('#cursor');
  const tx = btn.x + btn.w * 0.62, ty = btn.y + btn.h * 0.45;
  tl.fromTo(cur, { x: 980, y: 1500, autoAlpha: 0 }, { x: 980, y: 1500, autoAlpha: 1, duration: 0.2, immediateRender: true }, o + 2.3);
  tl.to(cur, { x: tx, y: ty, duration: 0.65, ease: 'power3.inOut' }, o + 2.35);
  tl.to(cur, { scale: 0.8, duration: 0.08, ease: 'power1.in', transformOrigin: '10% 5%' }, o + 3.0);
  tl.to(cur, { scale: 1, duration: 0.2, ease: 'back.out(3)' }, o + 3.08);
  tl.fromTo('#ripple', { x: tx - 28, y: ty - 28, scale: 0.3, opacity: 1 }, { scale: 3, opacity: 0, duration: 0.6, ease: 'power2.out', immediateRender: false }, o + 3.02);
  tl.to('#buyBtn', { backgroundColor: '#c7f431', color: '#0b0b0b', scale: 0.94, duration: 0.1 }, o + 3.0);
  tl.to('#buyBtn', { scale: 1, duration: 0.35, ease: 'back.out(3)' }, o + 3.1);
  tl.to(cur, { x: tx + 140, y: ty + 260, autoAlpha: 0, duration: 0.8, ease: 'power2.in' }, o + 3.35);
  tl.to('#page', { y: -400, duration: 1.1, ease: 'power3.inOut' }, o + 3.3);
  tl.fromTo('.card', { y: 70, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: 'expo.out', stagger: 0.08, immediateRender: true }, o + 3.55);
  tl.fromTo('#mob', { x: 420, rotation: 14, autoAlpha: 0 }, { x: 0, rotation: -4, autoAlpha: 1, duration: 1.0, ease: 'expo.out', immediateRender: true }, o + 3.2);
  tl.fromTo('#mobTag', { scale: 0, rotation: -12, autoAlpha: 0 }, { scale: 1, rotation: -6, autoAlpha: 1, duration: 0.5, ease: 'back.out(2.5)', immediateRender: true }, o + 3.7);
  chips('#c3', o + 3.5);
  tl.fromTo('#s3 .inner', { scale: 1 }, { scale: 1.035, duration: 5, ease: 'none' }, o);

  // ---------- S4 social videos (9.5 – 14.5) ----------
  o = 9.5;
  wipe(o, '#s3', '#s4');
  label('#s4', o + 0.1);
  rise('#s4 .head .mi', o + 0.15, { s: 0.1 });
  tl.fromTo('#phone', { y: 420, rotation: 7, autoAlpha: 0 }, { y: 0, rotation: 0, autoAlpha: 1, duration: 1.1, ease: 'expo.out', immediateRender: true }, o + 0.2);
  tl.fromTo('#disc', { scale: 0.4 }, { scale: 1, duration: 1.0, ease: 'expo.out', immediateRender: true }, o + 0.45);
  tl.fromTo('#reelBottle', { y: 0 }, { y: -18, duration: 0.5, ease: 'sine.inOut', yoyo: true, repeat: 4, immediateRender: true }, o + 0.4);
  tl.fromTo('#shine1', { x: 0 }, { x: 260, duration: 0.6, ease: 'power2.inOut', immediateRender: true }, o + 0.9);
  tl.fromTo('#pg1', { scaleX: 0 }, { scaleX: 1, duration: 2.1, ease: 'none', immediateRender: true }, o + 0.4);
  tl.fromTo('#pg2', { scaleX: 0 }, { scaleX: 1, duration: 2.5, ease: 'none', immediateRender: true }, o + 2.5);
  ['#cw1', '#cw2', '#cw3', '#cw4'].forEach((id, i) => {
    tl.fromTo(id, { scale: 0, rotation: i % 2 ? 6 : -6 }, { scale: 1, rotation: i % 2 ? 2 : -3, duration: 0.4, ease: 'back.out(3)', immediateRender: true }, o + 0.75 + i * 0.25);
  });
  tl.to(['#cw1', '#cw2', '#cw3', '#cw4'], { scale: 0, duration: 0.2, ease: 'power2.in', stagger: 0.03 }, o + 2.3);
  tl.to(P, { likes: 84700, comms: 1240, shares: 3900, duration: 3.6, ease: 'power2.in' }, o + 0.6);
  tl.to('#heartP', { attr: { fill: '#c7f431', stroke: '#c7f431' }, duration: 0.05 }, o + 2.0);
  tl.fromTo('#heart', { scale: 1.6, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.5, ease: 'back.out(3)', immediateRender: false }, o + 2.0);
  // cut to shot 2
  tl.set('#shot2', { autoAlpha: 1 }, o + 2.5);
  tl.set('#shot1', { autoAlpha: 0 }, o + 2.5);
  tl.fromTo('#scrFlash', { opacity: 0.85 }, { opacity: 0, duration: 0.3, ease: 'power2.out', immediateRender: false }, o + 2.5);
  tl.fromTo('#shot2 .big', { y: 0 }, { y: -160, duration: 2.5, ease: 'none', immediateRender: true }, o + 2.5);
  tl.fromTo('#reelBottle2', { scale: 2.3 }, { scale: 1.75, duration: 0.6, ease: 'expo.out', immediateRender: false }, o + 2.5);
  tl.fromTo('#shine2', { x: 0 }, { x: 260, duration: 0.6, ease: 'power2.inOut', immediateRender: true }, o + 3.1);
  tl.fromTo('#sticker', { scale: 0, rotation: -60 }, { scale: 1, rotation: 12, duration: 0.55, ease: 'back.out(2.5)', immediateRender: true }, o + 2.75);
  tl.fromTo('#shopBtn', { y: 120, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'expo.out', immediateRender: true }, o + 3.0);
  tl.to('#shopBtn', { scale: 1.06, duration: 0.25, ease: 'sine.inOut', yoyo: true, repeat: 3 }, o + 3.6);
  // flying hearts
  const drift = [-40, 30, -70, 55, -20, 80, -55, 15, -85, 45];
  $$('.fh').forEach((h, i) => {
    tl.fromTo(h, { x: hb.x, y: hb.y, scale: 0.4, autoAlpha: 1, rotation: 0 },
      { x: hb.x + drift[i] - 30, y: hb.y - 330 - (i % 3) * 60, scale: 0.9 + (i % 3) * 0.25, rotation: drift[i] / 3, autoAlpha: 0, duration: 1.4, ease: 'power1.out', immediateRender: false }, o + 2.0 + i * 0.09);
  });
  tl.fromTo('#toast1', { x: -520, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.7, ease: 'expo.out', immediateRender: true }, o + 3.0);
  tl.fromTo('#toast2', { x: 520, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.7, ease: 'expo.out', immediateRender: true }, o + 3.5);
  chips('#c4', o + 3.25);
  tl.fromTo('#s4 .inner', { scale: 1 }, { scale: 1.035, duration: 5, ease: 'none' }, o);

  // ---------- S5 design (14.5 – 18.5) ----------
  o = 14.5;
  wipe(o, '#s4', '#s5');
  label('#s5', o + 0.1);
  rise('#s5 .head .mi', o + 0.15, { s: 0.1 });
  const tiles = ['#tType', '#tColor', '#tLogo', '#tSocial'];
  tiles.forEach((t, i) => {
    tl.fromTo(t, { y: 180, scale: 0.86, rotation: [-4, 5, -5, 3][i], autoAlpha: 0 },
      { y: 0, scale: 1, rotation: 0, autoAlpha: 1, duration: 1.0, ease: 'expo.out', immediateRender: true }, o + 0.3 + i * 0.1);
  });
  tl.fromTo(P, { wght: 200 }, { wght: 900, duration: 1.2, ease: 'power2.inOut', immediateRender: true }, o + 0.8);
  tl.to(P, { wght: 600, duration: 0.8, ease: 'power2.inOut' }, o + 2.3);
  tl.fromTo('#tColor .sw > div', { scaleY: 0 }, { scaleY: 1, duration: 0.7, ease: 'expo.out', stagger: 0.07, immediateRender: true }, o + 0.65);
  tl.to('#swL', { flexGrow: 2.6, duration: 0.7, ease: 'expo.inOut' }, o + 1.8);
  tl.fromTo('#markC', { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.9, ease: 'power2.inOut', immediateRender: true }, o + 0.8);
  tl.fromTo('#markN', { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.7, ease: 'power2.inOut', immediateRender: true }, o + 1.1);
  rise('#tLogo .wm .mi', o + 1.15);
  tl.fromTo('#sel', { scale: 1.12, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.45, ease: 'back.out(2)', immediateRender: true }, o + 2.0);
  tl.fromTo('.post', { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: 'expo.out', stagger: 0.1, immediateRender: true }, o + 0.95);
  tl.fromTo('.post.a s', { scale: 0.3, transformOrigin: '0% 100%' }, { scale: 1, duration: 0.5, ease: 'back.out(3)', immediateRender: true }, o + 1.4);
  chips('#c5', o + 2.2);
  tl.fromTo('#s5 .inner', { scale: 1 }, { scale: 1.035, duration: 4, ease: 'none' }, o);

  // ---------- S6 alles aus einer Hand (18.5 – 20.5) ----------
  o = 18.5;
  wipe(o, '#s5', '#s6');
  const rows = $$('#s6 .row');
  rows.forEach((r, i) => {
    const at = o + 0.1 + i * 0.25;
    tl.fromTo(r, { x: -80, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out', immediateRender: true }, at);
    tl.fromTo(r.querySelector('svg'), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.45, ease: 'back.out(3)', immediateRender: true }, at);
    tl.fromTo(r.querySelector('.ck'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.3, ease: 'power2.out', immediateRender: true }, at + 0.12);
  });
  tl.to(rows, { y: -90, autoAlpha: 0, duration: 0.3, ease: 'power3.in', stagger: 0.04 }, o + 0.95);
  rise('#s6 .big .mi', o + 1.1, { s: 0.12, d: 0.6 });
  tl.to('#ul', { scaleX: 1, duration: 0.45, ease: 'expo.out' }, o + 1.45);
  tl.fromTo('#s6 .inner', { scale: 1 }, { scale: 1.14, duration: 1.0, ease: 'power2.in' }, o + 1.0);
  tl.fromTo('#flash', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.12, ease: 'power2.in', immediateRender: false }, o + 1.88);

  // ---------- S7 logo + CTA (20.5 – 26.5) ----------
  o = 20.5;
  tl.set('#s6', { autoAlpha: 0 }, o);
  tl.set('#s7', { autoAlpha: 1 }, o);
  tl.set('#grid', { opacity: 0.5 }, o);
  tl.to('#flash', { autoAlpha: 0, duration: 0.45, ease: 'power2.out' }, o);
  tl.fromTo('#lglow', { scale: 0.4, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.6, ease: 'expo.out', immediateRender: true }, o);
  tl.fromTo('#lw', { scale: 1.22 }, { scale: 1, duration: 2.6, ease: 'expo.out', immediateRender: true }, o);
  tl.fromTo('.lg-l', { y: 230 }, { y: 0, duration: 0.75, ease: 'expo.out', stagger: 0.06, immediateRender: true }, o + 0.02);
  tl.fromTo('#lgAccent', { x: 70, y: -112, autoAlpha: 0 }, { x: 0, y: 0, autoAlpha: 1, duration: 0.3, ease: 'power3.in', immediateRender: true }, o + 0.2);
  // impact at 21.0
  const imp = o + 0.5;
  tl.to('#cam', { keyframes: [{ x: -14, y: 9 }, { x: 11, y: -7 }, { x: -6, y: 5 }, { x: 3, y: -2 }, { x: 0, y: 0 }], duration: 0.3, ease: 'none' }, imp);
  tl.fromTo('#lglow', { scale: 1.25 }, { scale: 1, duration: 0.8, ease: 'expo.out', immediateRender: false }, imp);
  tl.fromTo('#ringA', { scale: 0.2, opacity: 1 }, { scale: 4, opacity: 0, duration: 0.8, ease: 'expo.out', immediateRender: false }, imp);
  const studio = $$('.lg-s');
  studio.forEach((s, i) => {
    tl.fromTo(s, { x: (i - 2.5) * 70, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.9, ease: 'expo.out', immediateRender: true }, o + 0.65 + i * 0.03);
  });
  tl.fromTo('#tag7', { autoAlpha: 0, letterSpacing: '0.9em' }, { autoAlpha: 1, letterSpacing: '0.34em', duration: 1.3, ease: 'expo.out', immediateRender: true }, o + 1.2);
  rise('#q7 .mi', o + 1.6);
  tl.fromTo('#cta', { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.7, ease: 'back.out(1.8)', immediateRender: true }, o + 2.0);
  tl.fromTo('#ctaArrow', { x: 0 }, { x: 10, duration: 0.25, ease: 'sine.inOut', yoyo: true, repeat: 11, immediateRender: true }, o + 2.7);
  ['#pr1', '#pr2', '#pr3'].forEach((p, i) => {
    tl.fromTo(p, { scale: 1, opacity: 0.8 }, { scale: 1.3, opacity: 0, duration: 1.0, ease: 'power2.out', immediateRender: false }, o + 3.0 + i);
    tl.fromTo('#cta', { scale: 1.05 }, { scale: 1, duration: 0.4, ease: 'power2.out', immediateRender: false }, o + 3.0 + i);
  });
  tl.fromTo('#bio', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: 'expo.out', immediateRender: true }, o + 2.4);
  tl.to({}, { duration: 0.01 }, DURATION);
}

function placeExtras() {
  const box = $('#hearts');
  for (let i = 0; i < 10; i++) {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.classList.add('fh');
    s.innerHTML = `<path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.3 3 4.5 6.6 4.5c2.1 0 3.6 1.2 5.4 3.2 1.8-2 3.3-3.2 5.4-3.2 3.6 0 5.7 3.8 4.2 7.3C19.5 16.4 12 21 12 21z" fill="${i % 3 === 2 ? '#f3f3ee' : '#c7f431'}"/>`;
    s.style.left = '0px'; s.style.top = '0px';
    box.appendChild(s);
  }
  // impact ring centred on the accent
  const a = rel($('#lgAccent'));
  gsap.set('#ringA', { left: a.cx - 60, top: a.cy - 60 });
}

function fmtK(n) {
  if (n < 1000) return String(Math.round(n));
  const k = n / 1000;
  return (k < 100 ? k.toFixed(1) : Math.round(k)).toString().replace('.', ',') + 'K';
}

// grain
const gc = $('#grain'), gx = gc.getContext('2d'), gimg = gx.createImageData(540, 960);
function grain(frame) {
  let s = (frame * 2654435761) >>> 0;
  const d = gimg.data;
  for (let i = 0; i < d.length; i += 4) {
    s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0;
    const v = s & 255;
    d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255;
  }
  gx.putImageData(gimg, 0, 0);
}

function afterSeek(t, frame) {
  const n = Math.round(P.url * URL_TXT.length);
  $('#urlText').textContent = URL_TXT.slice(0, n);
  $('#caret').style.opacity = (P.url > 0 && P.url < 1) || Math.floor(t * 2.6) % 2 === 0 ? 1 : 0;
  $('#likes').textContent = fmtK(P.likes);
  $('#comms').textContent = fmtK(P.comms);
  $('#shares').textContent = fmtK(P.shares);
  $('#aa').style.fontWeight = Math.round(P.wght);
  grain(frame);
}

window.__duration = DURATION;
window.__seek = (t, frame) => { tl.seek(t, false); afterSeek(t, frame ?? Math.floor(t * 24)); };
window.__ready = (async () => {
  await Promise.all(['200 50px Unbounded', '900 50px Unbounded', '20px Michroma', '400 20px Inter', '600 20px Inter', '700 20px Inter'].map((f) => document.fonts.load(f)));
  await document.fonts.ready;
  fitAll();
  placeExtras();
  build();
  window.__seek(0, 0);
  return true;
})();
