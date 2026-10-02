"""Tech-house track (126 BPM, A minor) + sound effects for promo video 4."""
from sfxlib import *

BPM = 126
B = 60 / BPM
S16 = B / 4
BAR = 4 * B
DUR = 15 * BAR + 0.03
N = int(SR * DUR)
r = np.random.default_rng(5)

def buf(): return np.zeros(N)
def put(b, x, at, g=1.0):
    i = int(round(at * SR))
    if i >= N or i < 0: return
    x = x[: N - i]; b[i:i + len(x)] += x * g

# ---------- instruments ----------
def kick():
    t = t_(0.42)
    f = 48 + 120 * np.exp(-t * 32)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 6.5)
    click = hp(r.standard_normal(len(t)), 3000) * np.exp(-t * 500) * 0.4
    return np.tanh((body + click) * 1.8) * 0.95
KICK = kick()

def clap():
    t = t_(0.28)
    n = bp(r.standard_normal(len(t)), 1000, 6000)
    env = np.exp(-t * 20)
    for d in (0.0, 0.009, 0.019):
        env += np.where(t >= d, np.exp(-(t - d) * 180), 0) * 0.7
    return n * env * 0.45
CLAP = clap()

def hat(d=0.045, dec=110):
    t = t_(d); return hp(r.standard_normal(len(t)), 8000, 4) * np.exp(-t * dec) * 0.3
HAT, OHAT = hat(), hat(0.22, 16)

def shaker():
    t = t_(0.06); return bp(r.standard_normal(len(t)), 5000, 12000) * np.sin(np.pi * t / 0.06) ** 2 * 0.12
SHAK = shaker()

def rim():
    t = t_(0.06); return (np.sin(2 * np.pi * 1700 * t) * 0.6 + bp(r.standard_normal(len(t)), 2000, 6000) * 0.5) * np.exp(-t * 70) * 0.35
RIM = rim()

def saw(f, d, det=(0,)):
    t = t_(d); o = np.zeros(len(t))
    for c in det: o += 2 * ((t * f * 2 ** (c / 1200) + r.random()) % 1) - 1
    return o / len(det)

def bass(f, d=0.11):
    t = t_(d)
    x = np.sin(2 * np.pi * f * t) * 0.9 + saw(f, d) * 0.5
    cutoff_env = 180 + 900 * np.exp(-t * 30)
    y = np.zeros(len(t)); state = 0.0
    a = 1 - np.exp(-2 * np.pi * cutoff_env / SR)
    for i in range(len(t)):
        state += a[i] * (x[i] - state); y[i] = state
    env = np.minimum(1, t / 0.003) * np.minimum(1, (d - t) / 0.01)
    return np.tanh(y * env * 2.2) * 0.5

def stab(notes, d=0.22):
    t = t_(d)
    x = sum(saw(note(m), d, (-7, 0, 7)) for m in notes) / len(notes)
    x += sum(np.sin(2 * np.pi * note(m) * 2 * t) for m in notes) / len(notes) * 0.25
    x = lp(x, 2600)
    return x * np.exp(-t * 11) * np.minimum(1, t / 0.004) * 0.42

def pad(notes, d):
    t = t_(d)
    x = sum(saw(note(m), d, (-10, 0, 9)) for m in notes) / len(notes)
    x = lp(x, 1400)
    return x * np.minimum(1, t / 0.4) * np.minimum(1, (d - t) / 0.4) * 0.22

def riser(d):
    t = t_(d); n = r.standard_normal(len(t)); out = np.zeros(len(t))
    C = 50; L = len(t) // C
    for c in range(C):
        fc = 500 * (12000 / 500) ** (c / C)
        y = bp(n[c * L:(c + 1) * L + 1500], fc * 0.7, fc * 1.4); out[c * L:c * L + L] = y[:L]
    return out * (t / d) ** 2.2 * 0.5

def lowpass_sweep(x, f0, f1, start, end):
    """time-varying one-pole LP between start and end; above f1 after end"""
    i0, i1 = int(start * SR), int(end * SR)
    seg = x[i0:i1].copy()
    fc = f0 * (f1 / f0) ** (np.linspace(0, 1, len(seg)) ** 2)
    a = 1 - np.exp(-2 * np.pi * fc / SR)
    y = np.zeros(len(seg)); s = 0.0
    for k in range(len(seg)):
        s += a[k] * (seg[k] - s); y[k] = s
    x[i0:i1] = y
    return x

# ---------- arrangement ----------
drums, bassb, stabs, pads, fxm = buf(), buf(), buf(), buf(), buf()
side = np.ones(N)
def duck(at, depth=0.7, rel=0.22):
    i = int(at * SR); t = t_(rel); c = 1 - depth * np.exp(-t * 16)
    j = min(N, i + len(c)); side[i:j] = np.minimum(side[i:j], c[: j - i])

DROP = 2 * BAR
OUT = 13 * BAR
roots = [57, 57, 53, 55]  # A A F G
chords = {57: [57, 60, 64, 67], 53: [53, 57, 60, 64], 55: [55, 59, 62, 65]}
bass_steps = [2, 3, 6, 7, 10, 11, 14, 15]
stab_steps = [3, 6, 11, 14]

for bar in range(15):
    t0 = bar * BAR
    root = roots[bar % 4]
    for beat in range(4):
        tb = t0 + beat * B
        intro_gap = (bar == 1 and beat == 3)
        if not intro_gap:
            put(drums, KICK, tb, 0.85 if bar >= 2 else 0.7); duck(tb)
        if bar >= 2 or beat in (1, 3):
            if beat in (1, 3) and not intro_gap: put(drums, CLAP, tb, 0.8 if bar >= 2 else 0.4)
        put(drums, OHAT, tb + B / 2, 0.55 if bar >= 2 else 0.3)
    for s in range(16):
        ts = t0 + s * S16
        acc = 1.0 if s % 2 else 0.55
        put(drums, HAT, ts, acc * (0.8 if bar >= 2 else 0.5))
        if bar >= 2: put(drums, SHAK, ts, 0.8 if s % 4 == 2 else 0.4)
        if bar >= 2 and s in (7, 15) and bar % 2: put(drums, RIM, ts, 0.8)
        if s in bass_steps and not (bar == 1 and s >= 12):
            f = note(root - 24 + (12 if (s == 15 and bar % 2) else 0))
            put(bassb, bass(f), ts, 1.0)
        if bar >= 2 and bar < 15 and s in stab_steps:
            put(stabs, stab(chords[root]), ts, 1.0 if bar < OUT / BAR else 0.8)
    if bar >= 2:
        put(pads, pad(chords[root], BAR), t0, 0.8)

# intro: snare roll into drop
t = BAR + 2 * B; step = B / 2
while t < DROP - 0.01:
    put(drums, CLAP, t, 0.25 + 0.5 * (t - BAR - 2 * B) / (2 * B)); t += step
    if t > BAR + 3 * B: step = B / 4
put(fxm, riser(BAR), BAR, 0.8)
# small fills before each 4th bar
for bar in (5, 9):
    for k in range(4): put(drums, CLAP, bar * BAR + 3 * B + k * S16, 0.35 + 0.1 * k)

music = drums + (bassb + stabs + pads) * side
# intro filter sweep (closed -> open into drop)
music = lowpass_sweep(music, 350, 9000, 0.0, DROP)
# outro: gentle close in the last bar
music = lowpass_sweep(music, 12000, 900, DUR - BAR, DUR)

# ---------- sound effects ----------
M = Mix(DUR); add = M.add
add(swish(0.25, 0.25), 0.05)
add(whoosh(0.25, 0.3, 300, 4000, 0.35), 0.35)
add(swish(0.35, 0.22), 0.75)
add(pop(900, 0.3), 1.2)
add(pop(500, 0.35), 1.9); add(bonk(0.18), 2.0)
add(click(0.8), DROP - 0.12); add(tick(5200, 0.3, 0.03), DROP - 0.1)   # camera shutter
add(boom(1.6, 0.9), DROP); add(shimmer(1.6, 0.35), DROP, rv=0.6)
add(pop(1000, 0.3), DROP + 2 * B); add(tick(3000, 0.2), DROP + 2 * B)
add(pop(1200, 0.35), DROP + 3 * B)
add(pop(800, 0.4), DROP + 4 * B)
add(whoosh(0.2, 0.25, 400, 5000, 0.3), DROP + 5 * B)
for k in range(10):
    add(bell(note(96 + (k * 5) % 12), 0.4, 0.07), DROP + 0.3 + k * 0.37, pan=(-0.5 if k % 2 else 0.5), rv=0.4)
for c in (4 * BAR, 5 * BAR, 7 * BAR, 10 * BAR, 11 * BAR, 13 * BAR):
    add(whoosh(0.32, 0.3, 250, 7000, 0.6), c - 0.32)
# fact counter
for k, at in enumerate(4 * BAR + 0.1 + 0.8 * (1 - np.sqrt(1 - np.linspace(0, 0.96, 14)))):
    add(tick(1800 + k * 110, 0.12), at)
add(swish(0.3, 0.22), 4 * BAR + 0.9)
# montage cuts
for i in range(8):
    add(swish(0.18, 0.12), 5 * BAR + i * B, pan=(-0.4 if i % 2 else 0.4)); add(pop(900 + 60 * i, 0.15), 5 * BAR + i * B)
# step 1
o = 7 * BAR
for i in range(3): add(pop(900 + i * 150, 0.3), o + 0.2 + i * B / 2)
for i in range(3): add(swish(0.25, 0.18), o + 2 * B + i * 0.12)
for k in range(8): add(tick(2600 + k * 90, 0.08), o + 2 * B + 0.1 + k * 1.2 * B / 8)
add(ding(0.25), o + 3.4 * B, rv=0.3)
# step 2 – 3D
o = 8 * BAR
add(swish(0.3, 0.25), o)
for k in range(10): add(tick(3500 + (k % 3) * 600, 0.07, 0.02), o + 0.2 + k * 0.06)
for k in range(10): add(tick(2200 + k * 80, 0.07), o + 0.3 + k * 2.6 * B / 10)
add(shimmer(1.2, 0.25), o + 1.6 * B, rv=0.5)
add(bell(note(91), 0.6, 0.18), o + 0.3 + 2.6 * B, rv=0.3)
# step 3
o = 9 * BAR
add(swish(0.3, 0.25), o)
add(pop(1100, 0.35), o + B); add(ding(0.22), o + B + 0.05)
for k, at in enumerate(o + B + 2.6 * B * np.sqrt(np.linspace(0, 1, 16))): add(tick(2000 + k * 70, 0.08), at)
add(whoosh(0.2, 0.2, 600, 6000, 0.3), o + 2 * B); add(ding(0.24), o + 2 * B + 0.15, pan=-0.3, rv=0.3)
# included checks
for i in range(5):
    at = 10 * BAR + 0.25 + i * B / 2
    add(pop(800, 0.25), at); add(bell(note(76 + [0, 2, 4, 7, 12][i]), 0.4, 0.12), at + 0.05, rv=0.3)
# compare + price
o = 11 * BAR
for i in range(2):
    t_x = o + 0.45 + i * B / 2
    tt = t_(0.09); add(lp(signal.square(2 * np.pi * 150 * tt), 1500) * np.exp(-tt * 20) * 0.25, t_x)
add(whoosh(0.22, 0.25, 300, 5000, 0.35), o + 2 * B)
for i in range(3): add(pop(1000 + i * 150, 0.3), o + 2.5 * B + i * B / 2)
add(swish(0.3, 0.25), 12 * BAR)
add(kaching(0.5), 12 * BAR + B, rv=0.25)
add(pop(1100, 0.28), 12 * BAR + 1.5 * B); add(pop(1250, 0.28), 12 * BAR + 2.5 * B)
# CTA
o = 13 * BAR
add(swish(0.25, 0.3), o + 0.5)
add(boom(1.4, 0.7), o + 0.95); add(shimmer(1.4, 0.25), o + 0.95, rv=0.6)
add(pop(1000, 0.3), o + 1.3); add(pop(1200, 0.35), o + 1.5)
add(whoosh(0.22, 0.25, 400, 5000, 0.3), o + 2.0)

# ---------- final mix ----------
ir_t = t_(1.8)
ir = lp(r.standard_normal(len(ir_t)), 6000) * np.exp(-ir_t * 3.5)
wet = signal.fftconvolve(stabs * side + fxm, ir)[:N] * 0.035
d = int(0.014 * SR)
mL = music + wet + fxm
mR = drums + bassb * side + pads * side + np.concatenate([np.zeros(d), (stabs * side)[:-d]])
mR = lowpass_sweep(mR, 350, 9000, 0.0, DROP)
mR = lowpass_sweep(mR, 12000, 900, DUR - BAR, DUR) + np.concatenate([np.zeros(d), wet[:-d]]) + fxm
music_st = np.stack([mL, mR], 1)
music_st = music_st / np.abs(music_st).max()
sfx_st = np.stack([M.L, M.R], 1)
sfx_st = sfx_st / max(1e-9, np.abs(sfx_st).max())
mix = music_st * 0.8 + sfx_st * 0.5
fade = np.ones(N); f = int(1.2 * SR); fade[-f:] = np.linspace(1, 0, f) ** 1.3
mix = np.tanh(mix * fade[:, None] * 1.15)
mix = mix / np.abs(mix).max() * 0.89
wavfile.write('music4.wav', SR, (mix * 32767).astype(np.int16))
sfx_only = np.tanh(sfx_st * 0.9 * fade[:, None]); sfx_only = sfx_only / np.abs(sfx_only).max() * 0.89
wavfile.write('sfx4.wav', SR, (sfx_only * 32767).astype(np.int16))
print('ok', DUR)
