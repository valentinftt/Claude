"""Sound effects only (no music) for promo video 2 – timed to anim2.js."""
import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 48000
DUR = 22.0
N = int(SR * DUR)
rng = np.random.default_rng(11)
L = np.zeros(N); R = np.zeros(N); verb = np.zeros(N)

def t_(d): return np.arange(int(SR * d)) / SR
def bp(x, lo, hi, o=2):
    b, a = signal.butter(o, [lo / (SR / 2), min(hi, SR / 2 - 200) / (SR / 2)], 'band'); return signal.lfilter(b, a, x)
def lp(x, f, o=2):
    b, a = signal.butter(o, f / (SR / 2), 'low'); return signal.lfilter(b, a, x)
def hp(x, f, o=2):
    b, a = signal.butter(o, f / (SR / 2), 'high'); return signal.lfilter(b, a, x)
def note(n): return 440.0 * 2 ** ((n - 69) / 12)

def add(x, at, g=1.0, pan=0.0, rv=0.0):
    i = int(at * SR)
    if i >= N: return
    x = x[: N - i] * g
    L[i:i + len(x)] += x * min(1, 1 - pan)
    R[i:i + len(x)] += x * min(1, 1 + pan)
    if rv: verb[i:i + len(x)] += x * rv

# ---------- sounds ----------
def pop(f=900, g=0.5):
    t = t_(0.1)
    fr = f * np.exp(-t * 22) + f * 0.35
    return np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t * 42) * np.minimum(1, t / 0.001) * g

def tick(f=2600, g=0.25, d=0.025):
    t = t_(d)
    return (np.sin(2 * np.pi * f * t) * np.exp(-t * 220) + hp(rng.standard_normal(len(t)), 4000) * np.exp(-t * 600) * 0.3) * g

def click(g=0.6):
    t = t_(0.05)
    return (hp(rng.standard_normal(len(t)), 1500) * np.exp(-t * 300) * 0.6 + np.sin(2 * np.pi * 1700 * t) * np.exp(-t * 160)) * g

def whoosh(pre=0.35, post=0.3, lo=250, hi=7000, g=0.8):
    d = pre + post; t = t_(d); n = rng.standard_normal(len(t)); out = np.zeros(len(t))
    C = 48; Lc = len(t) // C
    for c in range(C):
        x = c / C * d
        fc = lo * (hi / lo) ** (x / pre) if x < pre else hi * (lo / hi) ** ((x - pre) / post)
        y = bp(n[c * Lc:(c + 1) * Lc + 1500], max(80, fc * 0.6), fc * 1.6)
        out[c * Lc:c * Lc + Lc] = y[:Lc]
    env = np.where(t < pre, (t / pre) ** 2.4, np.exp(-(t - pre) * 11))
    return out * env * g

def swish(g=0.4, d=0.2):
    t = t_(d); n = hp(rng.standard_normal(len(t)), 2500)
    env = np.sin(np.pi * np.minimum(1, t / d)) ** 2
    return bp(n, 2500, 11000) * env * g

def bonk(g=0.5):
    out = []
    for f, d in ((311, 0.11), (233, 0.2)):
        t = t_(d)
        x = signal.sawtooth(2 * np.pi * f * t, 0.5) * np.exp(-t * 9) * np.minimum(1, t / 0.003)
        out.append(lp(x, 1800))
    return np.concatenate(out) * g

def bell(f0, d=0.8, g=0.3):
    t = t_(d)
    x = np.sin(2 * np.pi * f0 * t) + 0.45 * np.sin(2 * np.pi * f0 * 2.0 * t) * np.exp(-t * 7) + 0.2 * np.sin(2 * np.pi * f0 * 3.01 * t) * np.exp(-t * 12)
    return x * np.exp(-t * 5) * np.minimum(1, t / 0.002) * g

def ding(g=0.35):  # notification: two quick bell notes
    gap = int(0.09 * SR)
    return np.pad(bell(note(88), 0.7, g), (0, gap)) + np.pad(bell(note(93), 0.7, g * 0.9), (gap, 0))

def boom(d=1.8, g=0.9):
    t = t_(d)
    f = 34 + 85 * np.exp(-t * 10)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.2)
    nz = lp(rng.standard_normal(len(t)), 1800) * np.exp(-t * 9) * 0.45
    return np.tanh((sub * 1.5 + nz) * 1.3) * g

def shimmer(d=1.6, g=0.25):
    t = t_(d)
    x = sum(np.sin(2 * np.pi * note(m) * t + k) for k, m in enumerate((84, 88, 91, 96))) / 4
    return x * np.minimum(1, t / 0.01) * np.exp(-t * 2.4) * g

def kaching(g=0.6):
    t = t_(1.0)
    chunk = hp(rng.standard_normal(len(t)), 3000) * np.exp(-t * 30) * 0.5
    thud = np.sin(2 * np.pi * 140 * t) * np.exp(-t * 25) * 0.6
    fit = lambda x: np.pad(x, (0, max(0, len(t) - len(x))))[: len(t)]
    bells = fit(np.pad(bell(note(96), 0.9, 0.5), (int(0.06 * SR), 0))) + fit(np.pad(bell(note(100), 0.85, 0.45), (int(0.1 * SR), 0)))
    metal = np.zeros(len(t))
    for f in (3150, 4210, 5530, 6890):
        metal += np.sin(2 * np.pi * f * t) * np.exp(-t * 14)
    return (chunk + thud + bells + metal * 0.08) * g

def whoop(g=0.35):
    t = t_(0.16)
    f = 380 * (3.2 ** (t / 0.16))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / 0.16) * g

def scratch(g=0.45, d=0.28):
    t = t_(d); n = rng.standard_normal(len(t)); out = np.zeros(len(t))
    C = 20; Lc = len(t) // C
    for c in range(C):
        fc = 1200 + 2600 * (c / C)
        y = bp(n[c * Lc:(c + 1) * Lc + 800], fc * 0.8, fc * 1.3)
        out[c * Lc:c * Lc + Lc] = y[:Lc]
    am = 0.6 + 0.4 * np.sin(2 * np.pi * 38 * t)
    return out * am * np.sin(np.pi * t / d) ** 0.6 * g

# ---------- timeline ----------
# S1 hook
for i, at in enumerate((0.04, 0.21, 0.38, 0.55)):
    add(pop(700 + i * 120, 0.5), at, pan=(-0.2 + 0.13 * i))
add(swish(0.25, 0.25), 0.55)
for k, at in enumerate(np.linspace(0.8, 1.32, 16)):
    add(tick(2800 + (k % 3) * 350, 0.16), at, pan=0.1)
add(bonk(0.5), 1.4)
# S2
add(whoosh(), 2.0 - 0.35, 0.75)
add(swish(0.2, 0.3), 2.02)
add(tick(3600, 0.3, 0.04), 2.47, rv=0.4); add(bell(note(91), 0.6, 0.12), 2.47, rv=0.5)
add(swish(0.45, 0.22), 2.6)
# S3 websites
add(whoosh(), 3.6 - 0.35, 0.75)
add(whoosh(0.2, 0.25, 400, 4000, 0.35), 3.8)
add(swish(0.4, 0.22), 4.1)
for at, f in ((4.12, 1100), (4.24, 1250), (4.36, 1400), (4.6, 900), (4.62, 1600)):
    add(pop(f, 0.25), at)
add(click(0.7), 5.42)
add(ding(0.3), 5.65, rv=0.3)
add(whoosh(0.25, 0.25, 500, 6000, 0.4), 5.9 - 0.1, pan=0.4)
for i, at in enumerate((6.3, 6.39, 6.48)):
    add(pop(1000 + i * 150, 0.28), at, pan=-0.3 + 0.3 * i)
# push transition
add(whoosh(0.3, 0.35, 200, 6000, 0.85), 7.6 - 0.3)
# S4 reels
add(whoosh(0.25, 0.3, 300, 5000, 0.4), 7.9)
add(swish(0.3, 0.2), 8.05, pan=-0.6); add(swish(0.3, 0.2), 8.1, pan=0.6)
add(swish(0.4, 0.22), 8.25)
add(pop(950, 0.45), 8.45); add(pop(1150, 0.45), 8.7)
add(pop(800, 0.25), 8.55, pan=-0.6); add(pop(850, 0.25), 8.67, pan=0.6)
ts = 8.2 + 2.8 * np.sqrt(np.linspace(0, 1, 26))  # counter ticks speeding up (power2.in)
for k, at in enumerate(ts):
    add(tick(2000 + k * 60, 0.09 + 0.004 * k), at, pan=0.15 * np.sin(k))
add(pop(600, 0.4), 9.6); add(bell(note(84), 0.4, 0.12), 9.6)
add(whoosh(0.2, 0.2, 600, 6000, 0.35), 9.8 - 0.1, pan=0.5)
add(ding(0.28), 9.85, pan=0.3, rv=0.3)
# S5 chain
add(whoosh(), 11.6 - 0.35, 0.75)
add(swish(0.4, 0.22), 12.1)
for i, (at, m) in enumerate(((11.9, 72), (12.32, 76), (12.74, 79))):
    add(pop(900, 0.3), at); add(bell(note(m), 0.5, 0.18), at, rv=0.3)
add(pop(700, 0.45), 13.16); add(boom(0.6, 0.35), 13.16)
for k, m in enumerate((84, 88, 91)):
    add(bell(note(m), 0.9, 0.17), 13.2 + k * 0.06, rv=0.5)
add(swish(0.2, 0.2), 13.55)
# S6 offer
add(whoosh(), 14.4 - 0.35, 0.75)
add(swish(0.4, 0.22), 14.9)
add(whoosh(0.2, 0.2, 400, 4000, 0.3), 14.6)
add(scratch(0.5), 15.12)
add(whoosh(0.22, 0.25, 300, 5000, 0.4), 15.3)
pts = 15.45 + 0.55 * (1 - np.sqrt(1 - np.linspace(0, 0.97, 14)))  # slot ticks slowing (power2.out)
for k, at in enumerate(pts):
    add(tick(3000 - k * 70, 0.16), at)
add(kaching(0.65), 16.0, rv=0.25)
add(pop(800, 0.35), 16.1)
add(swish(0.15, 0.2), 16.25)
add(pop(1100, 0.3), 16.5); add(pop(1250, 0.3), 16.65)
# S7 CTA
add(whoosh(), 17.6 - 0.35, 0.75)
add(swish(0.25, 0.3), 17.65)
add(boom(1.8, 0.85), 18.1); add(shimmer(1.6, 0.28), 18.1, rv=0.6); add(tick(4200, 0.25, 0.04), 18.1)
add(whoosh(0.2, 0.25, 400, 5000, 0.3), 18.45)
for k, at in enumerate(np.linspace(18.7, 19.28, 14)):
    add(tick(3100 + (k % 4) * 260, 0.13), at)
add(whoop(0.35), 19.38)
add(pop(1000, 0.4), 19.6); add(swish(0.2, 0.25), 19.6)
add(pop(1300, 0.18), 19.8)
add(tick(1500, 0.12, 0.06), 20.5); add(tick(1500, 0.12, 0.06), 21.4)

# ---------- mix ----------
ir_t = t_(1.6)
ir = lp(rng.standard_normal(len(ir_t)), 7000) * np.exp(-ir_t * 4)
wet = signal.fftconvolve(verb, ir)[:N] * 0.05
d = int(0.017 * SR)
st = np.stack([L + wet, R + np.concatenate([np.zeros(d), wet[:-d]])], 1)
fade = np.ones(N); f = int(0.6 * SR); fade[-f:] = np.linspace(1, 0, f)
st = np.tanh(st * fade[:, None] * 1.05)
st = st / np.abs(st).max() * 0.89
wavfile.write('sfx2.wav', SR, (st * 32767).astype(np.int16))
print('ok')
