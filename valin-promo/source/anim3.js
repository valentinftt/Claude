gsap.registerPlugin(DrawSVGPlugin);
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));
const DURATION = 24.8;
const tl = gsap.timeline({ paused: true });
const P = { pb: 0, pct: 0, m4: 0, reno: 0, rev: 0, vC: 0, vL: 0, vR: 0, fol: 0, fk: 1, d7: 0 };

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
function sink(targets, at, o = {}) {
  tl.to(targets, { yPercent: -115, duration: o.d || 0.3, ease: 'power3.in', stagger: o.s || 0.03 }, at);
}
function popIn(targets, at, o = {}) {
  tl.fromTo(targets, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: o.d || 0.5, ease: o.ease || 'back.out(2.2)', stagger: o.s || 0.08, ...FT }, at);
}
function marker(sel, at) {
  tl.fromTo(sel, { '--hl': 0 }, { '--hl': 1, duration: 0.4, ease: 'power3.out', ...FT }, at);
}
function wipe(center, from, to, el = '#wipe') {
  tl.fromTo(el, { x: -3800 }, { x: 1680, duration: 0.75, ease: 'sine.inOut', immediateRender: false }, center - 0.375);
  tl.set(from, { autoAlpha: 0 }, center);
  tl.set(to, { autoAlpha: 1 }, center);
}
function shake(sel, at, amp = 14, d = 0.3) {
  tl.to(sel, { keyframes: [{ x: -amp }, { x: amp * 0.8 }, { x: -amp * 0.5 }, { x: amp * 0.3 }, { x: 0 }], duration: d, ease: 'none' }, at);
}

function cloneOld(target, scale) {
  const c = $('#oldsite').cloneNode(true);
  c.removeAttribute('id');
  c.querySelectorAll('[id]').forEach((e) => e.removeAttribute('id'));
  c.querySelector('.lm').remove();
  c.style.position = 'absolute'; c.style.left = '0'; c.style.top = '0'; c.style.width = '914px'; c.style.height = '638px'; c.style.bottom = 'auto'; c.style.right = 'auto';
  $(target).appendChild(c);
  if (scale) gsap.set(target, { scale });
  return c;
}

function build() {
  cloneOld('#ocl', 398 / 914);
  const v = cloneOld('#vOld');
  v.style.height = '700px';
  // ring ticks
  const g = $('#ticks');
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const x1 = 300 + Math.cos(a) * 222, y1 = 300 + Math.sin(a) * 222, x2 = 300 + Math.cos(a) * 238, y2 = 300 + Math.sin(a) * 238;
    g.insertAdjacentHTML('beforeend', `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`);
  }
  const R = { acc: rel($('#lgAccent')), anchor: rel($('#anchor')) };
  gsap.set('#strk', { width: R.anchor.w + 8, top: R.anchor.y + R.anchor.h * 0.5 + 2, left: R.anchor.x - 4, scaleX: 0, rotation: -1, transformOrigin: '0% 50%' });
  gsap.set(['#wipe', '#hazard'], { x: -3800, skewX: -32 });
  gsap.set('.scene', { autoAlpha: 0 });
  gsap.set('#rp', { drawSVG: '0%' });

  tl.to('#glowA', { x: 420, y: 380, duration: DURATION, ease: 'sine.inOut' }, 0);
  tl.to('#glowB', { x: -420, y: -520, duration: DURATION, ease: 'sine.inOut' }, 0);
  tl.to('#grid', { y: 120, duration: DURATION, ease: 'none' }, 0);

  // ---------- S1 old website 0 – 2.6 ----------
  tl.set('#s1', { autoAlpha: 1 }, 0);
  rise('#s1 .head .mi', 0.05);
  marker('#hl1', 0.55);
  tl.fromTo('#oldwin', { scale: 0.5, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.3, ease: 'steps(5)', ...FT }, 0.15);
  tl.fromTo('#loadMask', { scaleY: 1 }, { scaleY: 0, duration: 1.3, ease: 'steps(6)', ...FT }, 0.45);
  tl.fromTo('#s1 .mq', { x: 0 }, { x: -760, duration: 2.6, ease: 'none', ...FT }, 0);
  tl.fromTo(P, { pb: 0 }, { pb: 1, duration: 2.0, ease: 'none', ...FT }, 0.4);
  tl.fromTo('#hg', { rotation: 0 }, { rotation: 540, duration: 2.4, ease: 'steps(3)', transformOrigin: '50% 50%', ...FT }, 0.2);
  tl.fromTo('#err', { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.18, ease: 'steps(3)', ...FT }, 1.8);
  shake('#oldwin', 1.8, 10, 0.25);
  tl.fromTo('#s1 .inner', { scale: 1 }, { scale: 1.04, duration: 2.6, ease: 'none' }, 0);

  // ---------- S2 phone 2.6 – 4.8 ----------
  let o = 2.6;
  wipe(o, '#s1', '#s2');
  rise('#s2 .head .mi', o + 0.05);
  marker('#hl2', o + 0.45);
  tl.fromTo('#ophone', { y: 420, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: 'expo.out', ...FT }, o + 0.1);
  tl.fromTo(['#fg1', '#fg2'], { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.15, ...FT }, o + 0.8);
  tl.to('#fg1', { x: -60, y: -70, duration: 0.45, ease: 'power2.inOut' }, o + 0.9);
  tl.to('#fg2', { x: 60, y: 70, duration: 0.45, ease: 'power2.inOut' }, o + 0.9);
  tl.to('#ocl', { scale: 1.05, x: -140, y: -40, duration: 0.45, ease: 'power2.inOut' }, o + 0.9);
  tl.to(['#fg1', '#fg2'], { autoAlpha: 0, duration: 0.15 }, o + 1.4);
  tl.to('#ocl', { scale: 398 / 914, x: 0, y: 0, duration: 0.35, ease: 'back.out(1.4)' }, o + 1.5);
  ['#x1', '#x2', '#x3'].forEach((x, i) => {
    tl.fromTo(x, { scale: 0, autoAlpha: 0, rotation: i % 2 ? 8 : -8 }, { scale: 1, autoAlpha: 1, rotation: i % 2 ? 3 : -3, duration: 0.45, ease: 'back.out(2.5)', ...FT }, o + 0.55 + i * 0.28);
  });
  tl.fromTo('#s2 .inner', { scale: 1 }, { scale: 1.04, duration: 2.2, ease: 'none' }, o);

  // ---------- S3 facts 4.8 – 8.5 ----------
  o = 4.8;
  wipe(o, '#s2', '#s3');
  tl.fromTo('#fpill', { y: -30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out', ...FT }, o + 0.05);
  gsap.set('.f2', { yPercent: 115 });
  gsap.set('.f2s', { autoAlpha: 0 });
  rise('.ftop .f1', o + 0.1);
  tl.fromTo('#ring', { scale: 0.8, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.5, ease: 'expo.out', ...FT }, o + 0.1);
  tl.to('#rp', { drawSVG: '100%', duration: 0.4, ease: 'power1.in' }, o + 0.35);
  rise('.fnum .f1', o + 0.75, { d: 0.55 });
  tl.fromTo('.fnum', { scale: 1.2 }, { scale: 1, duration: 0.5, ease: 'expo.out', immediateRender: false }, o + 0.75);
  rise('.fbot .f1', o + 0.95);
  tl.fromTo('.f1s', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ...FT }, o + 1.1);
  // swap to fact 2
  sink('.f1', o + 1.75);
  tl.to('.f1s', { autoAlpha: 0, duration: 0.2 }, o + 1.75);
  tl.to('#rp', { drawSVG: '0%', duration: 0.25, ease: 'power2.in' }, o + 1.75);
  tl.to(P, { fk: 2, duration: 0.01 }, o + 1.85);
  tl.fromTo('#fpill', { scale: 1.2 }, { scale: 1, duration: 0.35, ease: 'back.out(3)', immediateRender: false }, o + 1.85);
  rise('.ftop .f2', o + 1.95);
  rise('.fnum .f2', o + 1.98);
  tl.to('#rp', { drawSVG: '75%', duration: 0.75, ease: 'power2.out' }, o + 2.05);
  tl.fromTo(P, { pct: 0 }, { pct: 75, duration: 0.75, ease: 'power2.out', ...FT }, o + 2.05);
  rise('.fbot .f2', o + 2.2, { s: 0.08 });
  marker('#hl3', o + 2.75);
  tl.to('.f2s', { autoAlpha: 1, duration: 0.4 }, o + 2.55);
  tl.fromTo('#s3 .inner', { scale: 1 }, { scale: 1.04, duration: 3.7, ease: 'none' }, o);

  // ---------- S4 youth chat 8.5 – 11.2 ----------
  o = 8.5;
  wipe(o, '#s3', '#s4');
  rise('#s4 .head .mi', o + 0.05);
  marker('#hl4', o + 0.45);
  tl.fromTo('#cph', { y: 420, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: 'expo.out', ...FT }, o + 0.1);
  const bub = (id, at, origin) => tl.fromTo(id, { scale: 0.4, autoAlpha: 0, transformOrigin: origin }, { scale: 1, autoAlpha: 1, duration: 0.4, ease: 'back.out(2.2)', ...FT }, at);
  bub('#m1', o + 0.45, '0% 100%');
  bub('#m2', o + 0.9, '100% 100%');
  bub('#m3', o + 1.25, '100% 100%');
  bub('#m4', o + 1.5, '0% 100%');
  tl.fromTo('#m4d i', { y: 0 }, { y: -7, duration: 0.18, ease: 'sine.inOut', yoyo: true, repeat: 1, stagger: 0.08, ...FT }, o + 1.55);
  tl.to(P, { m4: 1, duration: 0.01 }, o + 1.9);
  tl.fromTo('#m4', { scale: 0.92 }, { scale: 1, duration: 0.3, ease: 'back.out(3)', immediateRender: false }, o + 1.9);
  tl.fromTo('#lost', { y: 120, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'back.out(1.6)', ...FT }, o + 2.15);
  shake('#cph', o + 2.15, 10, 0.3);
  tl.fromTo('#s4 .inner', { scale: 1 }, { scale: 1.04, duration: 2.7, ease: 'none' }, o);

  // ---------- S5 renovation 11.2 – 14.8 ----------
  o = 11.2;
  wipe(o, '#s4', '#s5', '#hazard');
  rise('#s5 .head .mi', o + 0.05);
  marker('#hl5', o + 0.45);
  tl.fromTo('#nb', { y: 220, scale: 0.94, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.8, ease: 'expo.out', ...FT }, o + 0.15);
  tl.fromTo('#reno .card', { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.45, ease: 'back.out(2)', ...FT }, o + 0.35);
  tl.fromTo(P, { reno: 0 }, { reno: 1, duration: 0.95, ease: 'power1.inOut', ...FT }, o + 0.5);
  tl.fromTo('#rbar', { scaleX: 0 }, { scaleX: 1, duration: 0.95, ease: 'power1.inOut', ...FT }, o + 0.5);
  tl.fromTo('#reno .tape', { backgroundPositionX: '0px' }, { backgroundPositionX: '148px', duration: 1.2, ease: 'none', ...FT }, o + 0.35);
  tl.to('#reno', { autoAlpha: 0, duration: 0.25 }, o + 1.5);
  tl.to('#reno .card', { scale: 0.9, duration: 0.25 }, o + 1.5);
  tl.fromTo(['#sl', '#tVor'], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, ...FT }, o + 1.55);
  tl.fromTo('#sl', { x: 0 }, { x: 920, duration: 0.85, ease: 'power2.inOut', ...FT }, o + 1.65);
  tl.fromTo(P, { rev: 0 }, { rev: 1, duration: 0.85, ease: 'power2.inOut', ...FT }, o + 1.65);
  tl.fromTo('#tNach', { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(2.5)', ...FT }, o + 2.0);
  tl.to(['#sl', '#tVor'], { autoAlpha: 0, duration: 0.2 }, o + 2.5);
  tl.fromTo('#nmob', { x: 380, rotation: 14, autoAlpha: 0 }, { x: 0, rotation: -4, autoAlpha: 1, duration: 0.85, ease: 'expo.out', ...FT }, o + 2.55);
  tl.fromTo('#mtag', { scale: 0, rotation: -14, autoAlpha: 0 }, { scale: 1, rotation: -6, autoAlpha: 1, duration: 0.45, ease: 'back.out(2.5)', ...FT }, o + 2.95);
  tl.fromTo('#s5 .inner', { scale: 1 }, { scale: 1.03, duration: 3.6, ease: 'none' }, o);

  // ---------- S6 reels 14.8 – 17.6 ----------
  o = 14.8;
  wipe(o, '#s5', '#s6');
  tl.fromTo('#s6 .pill', { x: -60, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out', ...FT }, o + 0.08);
  rise('#s6 .head .mi', o + 0.1);
  marker('#hl6', o + 0.5);
  tl.fromTo('#phC', { y: 520, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, ease: 'expo.out', ...FT }, o + 0.2);
  tl.fromTo('#phL', { x: -320, rotation: -22, autoAlpha: 0 }, { x: 0, rotation: -8, autoAlpha: 1, duration: 0.9, ease: 'expo.out', ...FT }, o + 0.32);
  tl.fromTo('#phR', { x: 320, rotation: 22, autoAlpha: 0 }, { x: 0, rotation: 8, autoAlpha: 1, duration: 0.9, ease: 'expo.out', ...FT }, o + 0.38);
  tl.fromTo(['#pbC', '#pbL', '#pbR'], { scaleX: 0 }, { scaleX: 1, duration: 2.8, ease: 'none', ...FT }, o + 0.3);
  tl.fromTo(P, { vC: 0, vL: 0, vR: 0 }, { vC: 96300, vL: 41800, vR: 63500, duration: 2.1, ease: 'power2.in', ...FT }, o + 0.5);
  popIn(['#cw1', '#cw2'], o + 0.7, { s: 0.25, ease: 'back.out(3)' });
  popIn('#capL', o + 0.8);
  tl.fromTo('#txr > *', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, ease: 'back.out(2)', stagger: 0.15, ...FT }, o + 0.8);
  tl.fromTo('#eC', { y: 0, rotation: -6 }, { y: -20, rotation: 6, duration: 0.55, ease: 'sine.inOut', yoyo: true, repeat: 4, ...FT }, o + 0.4);
  tl.fromTo('#eL', { y: 0 }, { y: -12, duration: 0.6, ease: 'sine.inOut', yoyo: true, repeat: 3, ...FT }, o + 0.5);
  tl.to('#hrt', { attr: { fill: '#0b0b0b' }, duration: 0.05 }, o + 1.7);
  tl.fromTo('#hrt', { scale: 1.6, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.45, ease: 'back.out(3)', immediateRender: false }, o + 1.7);
  tl.fromTo('#toast6', { x: 420, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.6, ease: 'expo.out', ...FT }, o + 1.85);
  tl.fromTo(P, { fol: 0 }, { fol: 860, duration: 0.8, ease: 'power2.out', ...FT }, o + 1.95);
  tl.fromTo('#s6 .inner', { scale: 1 }, { scale: 1.03, duration: 2.8, ease: 'none' }, o);

  // ---------- S7 offer 17.6 – 20.4 ----------
  o = 17.6;
  wipe(o, '#s6', '#s7');
  rise('#s7 .head .mi', o + 0.05);
  marker('#hl7', o + 0.45);
  tl.fromTo('#anchor', { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, ease: 'expo.out', ...FT }, o + 0.5);
  tl.to('#strk', { scaleX: 1, duration: 0.25, ease: 'power3.out' }, o + 0.8);
  tl.fromTo('#week', { y: 100, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'expo.out', ...FT }, o + 0.6);
  $$('.day .fill').forEach((f, i) => {
    tl.fromTo(f, { scaleY: 0 }, { scaleY: 1, duration: 0.18, ease: 'power2.out', ...FT }, o + 1.0 + i * 0.12);
  });
  tl.to(P, { d7: 1, duration: 0.01 }, o + 1.75);
  tl.fromTo('#d7c', { scale: 0, rotation: -45, transformOrigin: '50% 50%' }, { scale: 1, rotation: 0, duration: 0.4, ease: 'back.out(3)', ...FT }, o + 1.75);
  tl.fromTo('#d7', { scale: 1.15 }, { scale: 1, duration: 0.4, ease: 'back.out(3)', immediateRender: false }, o + 1.75);
  tl.fromTo('#launch', { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, ease: 'expo.out', ...FT }, o + 1.9);
  tl.fromTo('#s7 .chip', { y: 40, scale: 0.7, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.5, ease: 'back.out(2)', stagger: 0.15, ...FT }, o + 2.05);
  tl.fromTo('#s7 .inner', { scale: 1 }, { scale: 1.03, duration: 2.8, ease: 'none' }, o);

  // ---------- S8 CTA 20.4 – 24.8 ----------
  o = 20.4;
  wipe(o, '#s7', '#s8');
  rise('#s8 .head .mi', o + 0.05);
  marker('#hl8', o + 0.45);
  const la = o + 0.7;
  tl.fromTo('.lg-l', { y: 230 }, { y: 0, duration: 0.7, ease: 'expo.out', stagger: 0.05, ...FT }, la);
  tl.fromTo('#lgAccent', { x: 70, y: -112, autoAlpha: 0 }, { x: 0, y: 0, autoAlpha: 1, duration: 0.25, ease: 'power3.in', ...FT }, la + 0.2);
  $$('.lg-s').forEach((s, i) => tl.fromTo(s, { x: (i - 2.5) * 60, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.8, ease: 'expo.out', ...FT }, la + 0.45 + i * 0.03));
  const imp = la + 0.45;
  tl.fromTo('#ringA', { left: R.acc.cx - 60, top: R.acc.cy - 60, scale: 0.2, opacity: 1 }, { scale: 3.5, opacity: 0, duration: 0.7, ease: 'expo.out', immediateRender: false }, imp);
  tl.to('#cam', { keyframes: [{ x: -12, y: 8 }, { x: 9, y: -6 }, { x: -5, y: 4 }, { x: 0, y: 0 }], duration: 0.26, ease: 'none' }, imp);
  tl.fromTo('#tag8', { autoAlpha: 0, letterSpacing: '0.8em' }, { autoAlpha: 1, letterSpacing: '0.32em', duration: 1.0, ease: 'expo.out', ...FT }, o + 1.3);
  rise('#h8 .mi', o + 1.4);
  popIn('#dm', o + 1.6);
  tl.fromTo('#cta', { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.65, ease: 'back.out(1.8)', ...FT }, o + 1.8);
  tl.fromTo('#cta .ar', { x: 0 }, { x: 8, duration: 0.25, ease: 'sine.inOut', yoyo: true, repeat: 9, ...FT }, o + 2.4);
  tl.fromTo('#bio', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'expo.out', ...FT }, o + 2.1);
  ['#pr1', '#pr2'].forEach((p, i) => {
    tl.fromTo(p, { scale: 1, opacity: 0.6 }, { scale: 1.25, opacity: 0, duration: 0.9, ease: 'power2.out', immediateRender: false }, o + 2.8 + i * 0.9);
    tl.fromTo('#cta', { scale: 1.04 }, { scale: 1, duration: 0.35, ease: 'power2.out', immediateRender: false }, o + 2.8 + i * 0.9);
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
let pbBox;
function afterSeek(t, frame) {
  const n = Math.round(P.pb * 15);
  if (!pbBox) pbBox = $('#pb');
  if (pbBox.childElementCount !== n) pbBox.innerHTML = '<i></i>'.repeat(n);
  $('#stTxt').textContent = `Lädt... (${Math.max(1, Math.round(P.pb * 27))} von 27 Elementen)`;
  $('#pct').textContent = Math.round(P.pct);
  $('#fkn').textContent = P.fk >= 2 ? '#2' : '#1';
  $('#m4d').style.display = P.m4 ? 'none' : 'flex';
  $('#m4t').style.display = P.m4 ? 'inline' : 'none';
  $('#rpc').textContent = Math.round(P.reno * 100) + ' %';
  $('#vNew').style.clipPath = `inset(0 ${(1 - P.rev) * 100}% 0 0)`;
  $('#vC').textContent = fmtK(P.vC); $('#vL').textContent = fmtK(P.vL); $('#vR').textContent = fmtK(P.vR);
  $('#fol').textContent = Math.round(P.fol).toLocaleString('de-DE');
  $('#d7s').style.visibility = $('#d7b').style.visibility = P.d7 ? 'hidden' : 'visible';
  grain(frame);
}
window.__duration = DURATION;
window.__seek = (t, frame) => { tl.seek(t, false); afterSeek(t, frame ?? Math.floor(t * 24)); };
window.__ready = (async () => {
  await Promise.all(['800 50px Unbounded', '900 50px Unbounded', '20px Michroma', '400 20px Inter', '600 20px Inter', '700 20px Inter', '20px "Liberation Serif"', '20px "Liberation Sans"', '20px "Noto Color Emoji"'].map((f) => document.fonts.load(f)));
  await document.fonts.ready;
  fitAll();
  build();
  window.__seek(0, 0);
  return true;
})();
