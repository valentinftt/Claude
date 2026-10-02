"""Tech-house track (126 BPM, A minor) + sound effects for promo video 5."""
from sfxlib import *

BPM = 126
B = 60 / BPM
S16 = B / 4
BAR = 4 * B
DUR = 31 * B + 0.03
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

DROP = BAR                       # beat 4: reel drop
TB, TC, TALL, TCTA = 10 * B, 15 * B, 20 * B, 23 * B
SW = 0.18
roots = [57, 57, 53, 55]  # A A F G
chords = {57: [57, 60, 64, 67], 53: [53, 57, 60, 64], 55: [55, 59, 62, 65]}
bass_steps = [2, 3, 6, 7, 10, 11, 14, 15]
stab_steps = [3, 6, 11, 14]

for bar in range(8):
    t0 = bar * BAR
    root = roots[(bar - 1) % 4]
    for beat in range(4):
        tb = t0 + beat * B
        if bar >= 1 or beat < 2:
            put(drums, KICK, tb, 0.85 if bar >= 1 else 0.65); duck(tb)
        if bar >= 1 and beat in (1, 3): put(drums, CLAP, tb, 0.8)
        put(drums, OHAT, tb + B / 2, 0.55 if bar >= 1 else 0.25)
    for s in range(16):
        ts = t0 + s * S16
        acc = 1.0 if s % 2 else 0.55
        put(drums, HAT, ts, acc * (0.8 if bar >= 1 else 0.45))
        if bar >= 1: put(drums, SHAK, ts, 0.8 if s % 4 == 2 else 0.4)
        if bar >= 1 and s in (7, 15) and bar % 2: put(drums, RIM, ts, 0.8)
        if s in bass_steps and not (bar == 0 and s >= 8):
            f = note(root - 24 + (12 if (s == 15 and bar % 2) else 0))
            put(bassb, bass(f), ts, 1.0)
        if bar >= 1 and s in stab_steps:
            put(stabs, stab(chords[root]), ts, 1.0)
    if bar >= 1:
        put(pads, pad(chords[root], BAR), t0, 0.8)

# intro: snare roll into the drop
t = 2 * B; step = B / 2
while t < DROP - 0.01:
    put(drums, CLAP, t, 0.25 + 0.5 * (t - 2 * B) / (2 * B)); t += step
    if t > 3 * B: step = B / 4
put(fxm, riser(DROP), 0, 0.7)
# fill into "Jede Branche" and into the CTA
for k in range(4): put(drums, CLAP, TALL - B + k * S16, 0.35 + 0.1 * k)
put(fxm, riser(2 * B), TCTA - 2 * B, 0.5)

music = drums + (bassb + stabs + pads) * side
music = lowpass_sweep(music, 350, 9000, 0.0, DROP)
music = lowpass_sweep(music, 12000, 900, DUR - BAR, DUR)

# ---------- sound effects ----------
M = Mix(DUR); add = M.add
# hook
add(swish(0.25, 0.25), 0.05)
add(swish(0.3, 0.22), 0.4)
add(pop(1000, 0.35), 0.85)
add(whoosh(0.3, 0.3, 250, 6000, 0.55), 2.4 * B)
add(click(0.8), DROP - 0.12); add(tick(5200, 0.3, 0.03), DROP - 0.1)   # camera shutter
# drop + reel A (Schmuck)
o = DROP
add(boom(1.6, 0.9), o); add(shimmer(1.6, 0.35), o, rv=0.6)
add(whoosh(0.15, 0.3, 300, 5000, 0.35), o + 0.05)
for k in range(8):
    add(bell(note(96 + (k * 5) % 12), 0.4, 0.06), o + 0.35 + k * 0.33, pan=(-0.5 if k % 2 else 0.5), rv=0.4)
add(pop(1000, 0.3), o + 0.3)
add(pop(1200, 0.35), o + B)
add(pop(800, 0.35), o + 2 * B)
add(pop(600, 0.4), o + 3 * B); add(tick(3000, 0.2), o + 3 * B + 0.05)
add(ding(0.25), o + 3.5 * B, pan=0.3, rv=0.3)
add(whoop(0.3), o + 4 * B); add(pop(1400, 0.35), o + 4 * B + 0.05)
# swipes between reels
for c in (TB, TC):
    add(whoosh(0.2, 0.25, 300, 7000, 0.55), c - SW)
# reel B (Mode)
o = TB
add(pop(1000, 0.3), o + 0.2)
add(swish(0.3, 0.2), o + B)
add(pop(900, 0.35), o + 2.5 * B)
add(ding(0.25), o + 2 * B, pan=-0.3, rv=0.3)
# reel C (Beauty)
o = TC
add(pop(1000, 0.3), o + 0.2)
add(pop(1200, 0.35), o + B)
for b in (1.5, 2.75, 4): add(pop(800 + 150 * b, 0.3), o + b * B); add(tick(2800, 0.15), o + b * B + 0.03)
add(whoop(0.28), o + 3 * B)
add(ding(0.25), o + 2 * B, pan=0.3, rv=0.3)
# all industries
o = TALL
add(whoosh(0.25, 0.3, 250, 6000, 0.55), o - 0.25)
add(swish(0.35, 0.25), o + 0.05, pan=-0.5); add(swish(0.35, 0.25), o + 0.12, pan=0.5)
for i in range(4): add(pop(900 + i * 120, 0.28), o + 0.5 * B + i * B / 2)
# CTA
o = TCTA
add(whoosh(0.32, 0.3, 250, 7000, 0.6), o - 0.32)
add(swish(0.25, 0.3), o + 0.1)
add(boom(1.4, 0.75), o + 0.55); add(shimmer(1.4, 0.25), o + 0.55, rv=0.6)
add(swish(0.2, 0.25), o + 0.7)
add(pop(900, 0.3), o + 2 * B)
add(kaching(0.45), o + 3 * B, rv=0.25)
add(pop(1100, 0.28), o + 3.5 * B); add(pop(1250, 0.28), o + 4 * B)
add(pop(800, 0.4), o + 4.5 * B); add(ding(0.25), o + 4.6 * B, rv=0.3)
add(pop(1300, 0.25), o + 5 * B)

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
fade = np.ones(N); f = int(0.9 * SR); fade[-f:] = np.linspace(1, 0, f) ** 1.3
mix = np.tanh(mix * fade[:, None] * 1.15)
mix = mix / np.abs(mix).max() * 0.89
wavfile.write('music5.wav', SR, (mix * 32767).astype(np.int16))
sfx_only = np.tanh(sfx_st * 0.9 * fade[:, None]); sfx_only = sfx_only / np.abs(sfx_only).max() * 0.89
wavfile.write('sfx5.wav', SR, (sfx_only * 32767).astype(np.int16))
