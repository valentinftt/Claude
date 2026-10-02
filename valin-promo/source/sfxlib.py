"""Shared synthesized sound effects."""
import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 48000
rng = np.random.default_rng(11)

def t_(d): return np.arange(int(SR * d)) / SR
def bp(x, lo, hi, o=2):
    b, a = signal.butter(o, [lo / (SR / 2), min(hi, SR / 2 - 200) / (SR / 2)], 'band'); return signal.lfilter(b, a, x)
def lp(x, f, o=2):
    b, a = signal.butter(o, f / (SR / 2), 'low'); return signal.lfilter(b, a, x)
def hp(x, f, o=2):
    b, a = signal.butter(o, f / (SR / 2), 'high'); return signal.lfilter(b, a, x)
def note(n): return 440.0 * 2 ** ((n - 69) / 12)

class Mix:
    def __init__(self, dur):
        self.N = int(SR * dur)
        self.L = np.zeros(self.N); self.R = np.zeros(self.N); self.verb = np.zeros(self.N)
    def add(self, x, at, g=1.0, pan=0.0, rv=0.0):
        i = int(at * SR)
        if i >= self.N: return
        x = x[: self.N - i] * g
        self.L[i:i + len(x)] += x * min(1, 1 - pan)
        self.R[i:i + len(x)] += x * min(1, 1 + pan)
        if rv: self.verb[i:i + len(x)] += x * rv
    def write(self, path, fade=0.6):
        N = self.N
        ir_t = t_(1.6)
        ir = lp(rng.standard_normal(len(ir_t)), 7000) * np.exp(-ir_t * 4)
        wet = signal.fftconvolve(self.verb, ir)[:N] * 0.05
        d = int(0.017 * SR)
        st = np.stack([self.L + wet, self.R + np.concatenate([np.zeros(d), wet[:-d]])], 1)
        f = np.ones(N); k = int(fade * SR); f[-k:] = np.linspace(1, 0, k)
        st = np.tanh(st * f[:, None] * 1.05)
        st = st / np.abs(st).max() * 0.89
        wavfile.write(path, SR, (st * 32767).astype(np.int16))

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

