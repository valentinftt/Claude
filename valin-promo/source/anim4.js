gsap.registerPlugin(DrawSVGPlugin);
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));
const B = 60 / 126;               // one beat (126 BPM tech-house)
const BAR = 4 * B;
const T = { s2: 2 * BAR, s3: 4 * BAR, s4: 5 * BAR, s5: 7 * BAR, s6: 10 * BAR, s7: 11 * BAR, s8: 13 * BAR };
const DURATION = 15 * BAR + 0.03;
const tl = gsap.timeline({ paused: true });
const P = { pct: 0, up: 0, rend: 0, vP: 0, step: 0, wire: 1 };
const LABELS = ['Schmuck', 'Mode', 'Beauty', 'Online-Kurse', 'Sneaker', 'Gastro', 'Uhren', 'Deko'];

function ringSVG() {
  return `<svg viewBox="0 0 300 300"><g class="band"><circle cx="150" cy="175" r="95" fill="none" stroke="url(#gold)" stroke-width="22"/><circle cx="150" cy="175" r="84" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="2"/><circle cx="150" cy="175" r="106" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="2"/></g>
  <g class="gemg" transform="translate(0 -8)"><path d="M136 74l5 14M164 74l-5 14" stroke="#d9b45a" stroke-width="6" stroke-linecap="round"/><polygon points="120,58 136,42 164,42 180,58 150,98" fill="url(#gem)" stroke="#9ccbe0" stroke-width="1.5"/><path d="M120 58H180M136 42L143 58L150 42L157 58L164 42M143 58L150 98L157 58" stroke="rgba(255,255,255,.85)" stroke-width="1.5" fill="none"/></g></svg>`;
}
function wireSVG() {
  let e = '';
  for (const c of [0.15, 0.45, 0.75]) e += `<ellipse cx="150" cy="175" rx="${95 * c}" ry="95" fill="none" stroke="#c7f431" stroke-width="1.5" opacity=".7"/>`;
  return `<svg viewBox="0 0 300 300"><g class="band"><circle cx="150" cy="175" r="106" fill="none" stroke="#c7f431" stroke-width="2"/><circle cx="150" cy="175" r="84" fill="none" stroke="#c7f431" stroke-width="2"/>${e}<ellipse cx="150" cy="175" rx="106" ry="22" fill="none" stroke="#c7f431" stroke-width="1.5" opacity=".6"/></g>
  <g class="gemg" transform="translate(0 -8)"><polygon points="120,58 136,42 164,42 180,58 150,98" fill="none" stroke="#c7f431" stroke-width="2"/><path d="M120 58H180M136 42L143 58L150 42L157 58L164 42M143 58L150 98L157 58" stroke="#c7f431" stroke-width="1.5" fill="none"/></g></svg>`;
}
const STAR = 'M23 0C25 15 31 21 46 23C31 25 25 31 23 46C21 31 15 25 0 23C15 21 21 15 23 0Z';

function rel(el) { const r = el.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height, cx: r.left + r.width / 2, cy: r.top + r.height / 2 }; }
function fitAll() {
  $$('[data-fit]').forEach((el) => {
    const max = +el.dataset.fit; let fs = parseFloat(getComputedStyle(el).fontSize);
    while (el.scrollWidth > max && fs > 10) { fs -= 1; el.style.fontSize = fs + 'px'; }
  });
}
const FT = { immediateRender: true };
const rise = (t, at, o = {}) => tl.fromTo(t, { yPercent: 115 }, { yPercent: 0, duration: o.d || 0.6, ease: 'expo.out', stagger: o.s || 0.09, ...FT }, at);
const popIn = (t, at, o = {}) => tl.fromTo(t, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: o.d || 0.45, ease: o.ease || 'back.out(2.2)', stagger: o.s || 0.08, ...FT }, at);
const marker = (s, at) => tl.fromTo(s, { '--hl': 0 }, { '--hl': 1, duration: 0.35, ease: 'power3.out', ...FT }, at);
function wipe(c, from, to) {
  tl.fromTo('#wipe', { x: -3800 }, { x: 1680, duration: 0.7, ease: 'sine.inOut', immediateRender: false }, c - 0.35);
  tl.set(from, { autoAlpha: 0 }, c); tl.set(to, { autoAlpha: 1 }, c);
}
function cut(c, from, to) { tl.set(from, { autoAlpha: 0 }, c); tl.set(to, { autoAlpha: 1 }, c); }
const camPunch = (at, s = 1.04) => tl.fromTo('#cam', { scale: s }, { scale: 1, duration: 0.35, ease: 'power2.out', immediateRender: false }, at);

function build() {
  $$('[data-ring]').forEach((el) => (el.innerHTML = ringSVG()));
  $('#wire').innerHTML = wireSVG();
  const sp = $('#spks');
  [[70, 200], [380, 250], [110, 520], [350, 470], [250, 150], [40, 380]].forEach(([x, y], i) => {
    sp.insertAdjacentHTML('beforeend', `<svg class="spk" style="left:${x}px;top:${y}px" viewBox="0 0 46 46"><path d="${STAR}" fill="${i % 2 ? '#fff' : '#fff6c9'}"/></svg>`);
  });
  const R = { acc: rel($('#lgAccent')) };
  gsap.set('#wipe', { x: -3800, skewX: -32 });
  gsap.set('.scene', { autoAlpha: 0 });
  gsap.set(['.st', '#price', '.mr'], { autoAlpha: 0 });

  tl.to('#glowA', { x: 420, y: 380, duration: DURATION, ease: 'sine.inOut' }, 0);
  tl.to('#glowB', { x: -420, y: -520, duration: DURATION, ease: 'sine.inOut' }, 0);
  tl.to('#grid', { y: 120, duration: DURATION, ease: 'none' }, 0);

  // ---------- S1 hook (2 bars, intro) ----------
  tl.set('#s1', { autoAlpha: 1 }, 0);
  rise('#s1 .head .mi', 0.05, { s: 0.12 });
  marker('#hl1', 0.75);
  tl.fromTo('#cam1', { y: 420, rotation: 6, autoAlpha: 0 }, { y: 0, rotation: -2, autoAlpha: 1, duration: 0.9, ease: 'expo.out', ...FT }, 0.35);
  popIn('#vorher', 1.2);
  popIn('#meh', 1.9, { ease: 'back.out(3)' });
  tl.to('#meh', { rotation: -10, duration: 0.3, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 2.3);
  // pre-drop tension: phone pushes in
  tl.to('#cam1', { scale: 1.1, duration: 1.0, ease: 'power2.in' }, T.s2 - 1.0);
  tl.fromTo('#flash', { opacity: 0 }, { opacity: 1, duration: 0.12, ease: 'power2.in', immediateRender: false }, T.s2 - 0.12);

  // ---------- S2 drop: cinematic reel ----------
  let o = T.s2;
  cut(o, '#s1', '#s2');
  tl.to('#flash', { opacity: 0, duration: 0.45, ease: 'power2.out' }, o);
  camPunch(o, 1.08);
  rise('#s2 .head .mi', o + 0.05);
  marker('#hl2', o + B);
  tl.fromTo('#rph', { scale: 1.25, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.7, ease: 'expo.out', ...FT }, o);
  popIn('#nachher', o + 2 * B);
  tl.fromTo('#bigRing', { scale: 0.4, rotation: -30 }, { scale: 1, rotation: 0, duration: 0.9, ease: 'expo.out', ...FT }, o + 0.05);
  tl.fromTo('#bigRing', { y: 0 }, { y: -16, duration: 2 * B, ease: 'sine.inOut', yoyo: true, repeat: 3, immediateRender: false }, o + 0.9);
  tl.fromTo('#spot', { opacity: 0 }, { opacity: 1, duration: 0.6, ...FT }, o);
  tl.fromTo('#pb2', { scaleX: 0 }, { scaleX: 1, duration: 2 * BAR, ease: 'none', ...FT }, o);
  tl.fromTo('#o1 span', { y: -30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, ease: 'expo.out', ...FT }, o + 2 * B);
  tl.fromTo('#o2 span', { scale: 0.5, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.45, ease: 'back.out(2.5)', ...FT }, o + 3 * B);
  tl.fromTo('#tag149', { scale: 0, rotation: -90 }, { scale: 1, rotation: 12, duration: 0.5, ease: 'back.out(2.5)', ...FT }, o + 4 * B);
  tl.fromTo('#shop', { y: 120, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out', ...FT }, o + 5 * B);
  tl.to('#shop', { scale: 1.06, duration: B / 2, yoyo: true, repeat: 3, ease: 'sine.inOut' }, o + 6 * B);
  [1, 3, 5, 7].forEach((b) => camPunch(o + b * B, 1.015));

  // ---------- S3 fact (1 bar) ----------
  o = T.s3;
  wipe(o, '#s2', '#s3');
  popIn('#s3 .pill', o + 0.05);
  rise('#fpct .mi', o + 0.05, { d: 0.5 });
  tl.fromTo(P, { pct: 0 }, { pct: 85, duration: 0.8, ease: 'power2.out', ...FT }, o + 0.1);
  tl.fromTo('#fbar i', { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'power2.out', ...FT }, o + 0.1);
  rise('#ftxt .mi', o + 0.35);
  marker('#hl3', o + 0.9);
  tl.fromTo('#fsrc', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ...FT }, o + 0.8);

  // ---------- S4 montage (2 bars, a cut on every beat) ----------
  o = T.s4;
  wipe(o, '#s3', '#s4');
  rise('#s4 .head .mi', o + 0.05);
  marker('#hl4', o + 0.45);
  tl.fromTo('#mph', { y: 300, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out', ...FT }, o);
  tl.fromTo('#pb4', { scaleX: 0 }, { scaleX: 1, duration: 2 * BAR, ease: 'none', ...FT }, o);
  $$('.mr').forEach((m, i) => {
    tl.set(m, { autoAlpha: 1 }, o + i * B);
    if (i < 7) tl.set(m, { autoAlpha: 0 }, o + (i + 1) * B);
    if (m.querySelector('.e')) tl.fromTo(m.querySelector('.e'), { scale: 0.6, rotation: -12 }, { scale: 1, rotation: 0, duration: 0.35, ease: 'back.out(2.5)', ...FT }, o + i * B);
    tl.fromTo('#mscr', { scale: 1.08 }, { scale: 1, duration: 0.3, ease: 'power2.out', immediateRender: false }, o + i * B);
    tl.fromTo('#mlabel span', { scale: 1.15 }, { scale: 1, duration: 0.25, ease: 'power2.out', immediateRender: false }, o + i * B);
  });
  popIn('#mlabel span', o + 0.05);

  // ---------- S5 three steps (3 bars) ----------
  o = T.s5;
  wipe(o, '#s4', '#s5');
  popIn('#steps > div', o + 0.05, { s: 0.06 });
  tl.set(P, { step: 1 }, o);
  // step 1 – material
  tl.set('#st1', { autoAlpha: 1 }, o);
  rise('#st1 .head .mi', o + 0.05);
  marker('#hl51', o + 0.45);
  tl.fromTo('#upl', { y: 80, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out', ...FT }, o + 0.15);
  ['#pc1', '#pc2', '#pc3'].forEach((p, i) => {
    tl.fromTo(p, { y: -500, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, ease: 'back.out(1.6)', ...FT }, o + 0.2 + i * B / 2);
    tl.to(p, { x: [330, 15, -300][i], y: 470, scale: 0.25, rotation: 0, autoAlpha: 0, duration: 0.4, ease: 'power3.in' }, o + 2 * B + i * 0.12);
  });
  tl.fromTo(P, { up: 0 }, { up: 1, duration: 1.2 * B, ease: 'power1.inOut', ...FT }, o + 2 * B + 0.1);
  tl.fromTo('#ubar i', { scaleX: 0 }, { scaleX: 1, duration: 1.2 * B, ease: 'power1.inOut', ...FT }, o + 2 * B + 0.1);
  tl.fromTo('#upl', { scale: 1.06 }, { scale: 1, duration: 0.3, ease: 'back.out(3)', immediateRender: false }, o + 3.4 * B);
  // step 2 – production (3D)
  o = T.s5 + BAR;
  cut(o, '#st1', '#st2'); tl.set(P, { step: 2 }, o); camPunch(o, 1.03);
  rise('#st2 .head .mi', o + 0.03);
  marker('#hl52', o + 0.4);
  tl.fromTo('#forge', { y: 120, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out', ...FT }, o + 0.1);
  tl.fromTo('#wire path, #wire circle, #wire ellipse, #wire polygon', { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.6, ease: 'power2.inOut', stagger: 0.02, ...FT }, o + 0.2);
  tl.fromTo(P, { rend: 0 }, { rend: 1, duration: 2.6 * B, ease: 'power1.inOut', ...FT }, o + 0.3);
  tl.fromTo('#rbar2 i', { scaleX: 0 }, { scaleX: 1, duration: 2.6 * B, ease: 'power1.inOut', ...FT }, o + 0.3);
  tl.fromTo('#rend', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2 * B, ease: 'power2.inOut', ...FT }, o + 1.6 * B);
  tl.to('#wire', { opacity: 0.15, duration: 0.3 }, o + 2.6 * B);
  tl.fromTo('#fchips span', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35, ease: 'back.out(2)', stagger: B / 2, ...FT }, o + 0.5);
  // step 3 – post & grow
  o = T.s5 + 2 * BAR;
  cut(o, '#st2', '#st3'); tl.set(P, { step: 3 }, o); camPunch(o, 1.03);
  rise('#st3 .head .mi', o + 0.03);
  marker('#hl53', o + 0.4);
  tl.fromTo('#pph', { y: 300, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out', ...FT }, o + 0.05);
  tl.fromTo('#pb5', { scaleX: 0 }, { scaleX: 1, duration: BAR, ease: 'none', ...FT }, o);
  popIn('#posted', o + B);
  tl.fromTo(P, { vP: 0 }, { vP: 72400, duration: 2.6 * B, ease: 'power2.in', ...FT }, o + B);
  tl.fromTo('#toast5', { x: -520, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out', ...FT }, o + 2 * B);
  tl.fromTo('#plats span', { y: 30, scale: 0.7, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.35, ease: 'back.out(2)', stagger: B / 2, ...FT }, o + 2 * B);

  // ---------- S6 included (1 bar, a tick on every half beat) ----------
  o = T.s6;
  wipe(o, '#s5', '#s6');
  rise('#s6 .head .mi', o + 0.03);
  marker('#hl6', o + 0.35);
  $$('.ir').forEach((r, i) => {
    const at = o + 0.25 + i * B / 2;
    tl.fromTo(r, { x: -80, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.35, ease: 'expo.out', ...FT }, at);
    tl.fromTo(r.querySelector('svg'), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.35, ease: 'back.out(3)', ...FT }, at);
    tl.fromTo(r.querySelector('.ck'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.22, ease: 'power2.out', ...FT }, at + 0.08);
  });

  // ---------- S7 compare + price (2 bars) ----------
  o = T.s7;
  wipe(o, '#s6', '#s7');
  rise('#cmpWrap .head .mi', o + 0.03);
  marker('#hl7', o + 0.4);
  tl.fromTo('#cOld', { y: 80, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, ease: 'expo.out', ...FT }, o + 0.2);
  tl.fromTo('#cOld .rw', { x: -40, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.3, ease: 'expo.out', stagger: B / 2, ...FT }, o + 0.45);
  tl.to('#cOld', { opacity: 0.55, scale: 0.97, duration: 0.3 }, o + 2 * B);
  tl.fromTo('#cNew', { y: 140, scale: 0.9, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.5, ease: 'back.out(1.6)', ...FT }, o + 2 * B);
  tl.fromTo('#cNew .rw', { x: -40, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.3, ease: 'back.out(2)', stagger: B / 2, ...FT }, o + 2.5 * B);
  o = T.s7 + BAR;
  cut(o, '#cmpWrap', '#price'); camPunch(o, 1.05);
  popIn('#price .pill', o + 0.03);
  rise('#pBig > *', o + 0.03, { s: 0.08 }) ;
  tl.fromTo('#pNum', { scale: 1.3 }, { scale: 1, duration: 0.45, ease: 'back.out(3)', immediateRender: false }, o + B);
  tl.fromTo('#price .chip', { y: 40, scale: 0.7, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.4, ease: 'back.out(2)', stagger: B, ...FT }, o + 1.5 * B);
  tl.fromTo('#eff', { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, ease: 'expo.out', ...FT }, o + 3 * B);

  // ---------- S8 CTA (2 bars) ----------
  o = T.s8;
  wipe(o, '#s7', '#s8');
  rise('#s8 .head .mi', o + 0.03);
  marker('#hl8', o + 0.45);
  const la = o + 0.5;
  tl.fromTo('.lg-l', { y: 230 }, { y: 0, duration: 0.65, ease: 'expo.out', stagger: 0.05, ...FT }, la);
  tl.fromTo('#lgAccent', { x: 70, y: -112, autoAlpha: 0 }, { x: 0, y: 0, autoAlpha: 1, duration: 0.25, ease: 'power3.in', ...FT }, la + 0.2);
  $$('.lg-s').forEach((s, i) => tl.fromTo(s, { x: (i - 2.5) * 60, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.8, ease: 'expo.out', ...FT }, la + 0.45 + i * 0.03));
  const imp = la + 0.45;
  tl.fromTo('#ringA', { left: R.acc.cx - 60, top: R.acc.cy - 60, scale: 0.2, opacity: 1 }, { scale: 3.5, opacity: 0, duration: 0.7, ease: 'expo.out', immediateRender: false }, imp);
  tl.to('#cam', { keyframes: [{ x: -12, y: 8 }, { x: 9, y: -6 }, { x: -5, y: 4 }, { x: 0, y: 0 }], duration: 0.26, ease: 'none' }, imp);
  tl.fromTo('#tag8', { autoAlpha: 0, letterSpacing: '0.8em' }, { autoAlpha: 1, letterSpacing: '0.32em', duration: 1.0, ease: 'expo.out', ...FT }, o + 1.1);
  popIn('#dm', o + 1.3);
  tl.fromTo('#cta', { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.6, ease: 'back.out(1.8)', ...FT }, o + 1.5);
  tl.fromTo('#cta .ar', { x: 0 }, { x: 8, duration: B / 2, ease: 'sine.inOut', yoyo: true, repeat: 9, ...FT }, o + 2.1);
  tl.fromTo('#bio', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out', ...FT }, o + 1.75);
  tl.fromTo('#web', { y: 120, rotation: 4, autoAlpha: 0 }, { y: 0, rotation: 0, autoAlpha: 1, duration: 0.6, ease: 'expo.out', ...FT }, o + 2.0);
  tl.fromTo('#webTag', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out', ...FT }, o + 2.2);
  ['#pr1', '#pr2'].forEach((p, i) => {
    tl.fromTo(p, { scale: 1, opacity: 0.6 }, { scale: 1.22, opacity: 0, duration: 0.9, ease: 'power2.out', immediateRender: false }, o + 2.4 + i * 2 * B);
    tl.fromTo('#cta', { scale: 1.04 }, { scale: 1, duration: 0.3, ease: 'power2.out', immediateRender: false }, o + 2.4 + i * 2 * B);
  });
  tl.to({}, { duration: 0.01 }, DURATION);
}

function fmtK(n) { if (n < 1000) return String(Math.round(n)); const k = n / 1000; return (k < 100 ? k.toFixed(1) : Math.round(k)).toString().replace('.', ',') + 'K'; }
const gc = $('#grain'), gx = gc.getContext('2d'), gimg = gx.createImageData(540, 960);
function grain(frame) {
  let s = (frame * 2654435761) >>> 0 || 1; const d = gimg.data;
  for (let i = 0; i < d.length; i += 4) { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; d[i] = d[i + 1] = d[i + 2] = s & 255; d[i + 3] = 255; }
  gx.putImageData(gimg, 0, 0);
}
function spin(el, sx) {
  el.querySelectorAll('.band, .gemg').forEach((g) => {
    const base = g.classList.contains('gemg') ? ' translate(0 -8)' : '';
    g.setAttribute('transform', `translate(150 175) scale(${sx.toFixed(3)} 1) translate(-150 -175)${base}`);
  });
}
function afterSeek(t, frame) {
  $('#pctN').textContent = Math.round(P.pct);
  $('#uTxt').textContent = P.up >= 1 ? 'Upload fertig ✓' : P.up > 0 ? `Upload … ${Math.round(P.up * 100)} %` : 'Fotos & Clips hochladen';
  $('#rPc').textContent = Math.round(P.rend * 100) + ' %';
  $('#rLbl').textContent = P.rend < 0.45 ? 'Modell wird gebaut …' : P.rend < 1 ? 'Rendering …' : 'Fertig ✓';
  $('#vP').textContent = fmtK(P.vP);
  ['#sp1', '#sp2', '#sp3'].forEach((s, i) => $(s).classList.toggle('on', P.step === i + 1));
  // montage labels
  const mi = Math.max(0, Math.min(7, Math.floor((t - T.s4) / B + 1e-6)));
  $('#mlab').textContent = LABELS[mi];
  $('#mc').textContent = String(mi + 1).padStart(2, '0');
  // ring spins
  spin($('#bigRing'), 0.25 + 0.75 * Math.abs(Math.cos((t - T.s2) * 1.6)));
  spin($('#wire'), Math.cos(t * 2.2));
  spin($('#rend'), Math.cos(t * 2.2));
  spin($('#postRing'), 0.3 + 0.7 * Math.abs(Math.cos(t * 1.8)));
  // sparkles
  $$('.spk').forEach((s, i) => {
    const ph = (t * 1.3 + i * 0.37) % 1;
    const k = Math.max(0, Math.sin(ph * Math.PI));
    s.style.transform = `scale(${(k * k).toFixed(3)}) rotate(${(ph * 90).toFixed(1)}deg)`;
  });
  grain(frame);
}
window.__duration = DURATION;
window.__seek = (t, frame) => { tl.seek(t, false); afterSeek(t, frame ?? Math.floor(t * 24)); };
window.__ready = (async () => {
  await Promise.all(['800 50px Unbounded', '900 50px Unbounded', '20px Michroma', '400 20px Inter', '600 20px Inter', '700 20px Inter', '20px "Noto Color Emoji"'].map((f) => document.fonts.load(f)));
  await document.fonts.ready;
  fitAll(); build(); window.__seek(0, 0);
  return true;
})();
