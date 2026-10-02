import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 48000
DUR = 26.5
N = int(SR * DUR)
BEAT = 0.5
rng = np.random.default_rng(7)

def t_(d):
    return np.arange(int(SR * d)) / SR

def add(buf, x, at, gain=1.0):
    i = int(at * SR)
    if i >= len(buf):
        return
    x = x[: len(buf) - i]
    buf[i:i + len(x)] += x * gain

def lp(x, f, order=2):
    b, a = signal.butter(order, f / (SR / 2), 'low'); return signal.lfilter(b, a, x)

def hp(x, f, order=2):
    b, a = signal.butter(order, f / (SR / 2), 'high'); return signal.lfilter(b, a, x)

def bp(x, lo, hi, order=2):
    b, a = signal.butter(order, [lo / (SR / 2), hi / (SR / 2)], 'band'); return signal.lfilter(b, a, x)

def note(n):  # midi -> hz
    return 440.0 * 2 ** ((n - 69) / 12)

# ---------------- instruments ----------------
def kick(strength=1.0):
    t = t_(0.45)
    f = 45 + 110 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t * 7.5)
    click = hp(rng.standard_normal(len(t)), 2000) * np.exp(-t * 400) * 0.35
    return np.tanh((body + click) * 1.6 * strength) * 0.9

def hat(open_=False):
    d = 0.18 if open_ else 0.05
    t = t_(d)
    n = hp(rng.standard_normal(len(t)), 7000, 4)
    return n * np.exp(-t * (18 if open_ else 90)) * 0.35

def clap():
    t = t_(0.3)
    n = bp(rng.standard_normal(len(t)), 900, 5000)
    env = np.exp(-t * 22)
    for d in (0.0, 0.011, 0.022):
        env += np.where(t >= d, np.exp(-(t - d) * 160), 0) * 0.6
    tone = np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30) * 0.3
    return (n * env * 0.5 + tone) * 0.8

def saw(freq, d, detune=(0.0,)):
    t = t_(d)
    out = np.zeros(len(t))
    for dt in detune:
        f = freq * (2 ** (dt / 1200))
        out += 2 * ((t * f + rng.random()) % 1.0) - 1
    return out / len(detune)

def bass_note(freq, d):
    t = t_(d)
    x = np.sin(2 * np.pi * freq * t) + 0.35 * saw(freq, d)
    x = lp(x, 260)
    env = np.minimum(1, t / 0.005) * np.exp(-t * 3.5)
    return np.tanh(x * env * 1.8) * 0.55

def pad_chord(midis, d):
    t = t_(d)
    x = sum(saw(note(m), d, (-9, 0, 8)) for m in midis) / len(midis)
    x = lp(x, 1500, 2)
    env = np.minimum(1, t / 0.35) * np.minimum(1, (d - t) / 0.3)
    return x * env * 0.35

def whoosh(d_pre=0.42, d_post=0.3, lo=300, hi=6000):
    d = d_pre + d_post
    t = t_(d)
    n = rng.standard_normal(len(t))
    # sweep a bandpass by processing chunks
    out = np.zeros(len(t))
    chunks = 40
    L = len(t) // chunks
    for c in range(chunks):
        frac = c / chunks
        fc = lo * (hi / lo) ** min(1, frac * d / d_pre) if frac * d < d_pre else hi * (lo / hi) ** ((frac * d - d_pre) / d_post)
        seg = n[c * L:(c + 1) * L + 2000]
        y = bp(seg, max(60, fc * 0.6), min(SR / 2 - 100, fc * 1.6))
        out[c * L:c * L + len(y)][:L] += y[:L]
    env = np.where(t < d_pre, (t / d_pre) ** 2.2, np.exp(-(t - d_pre) * 12))
    return out * env * 0.9

def tick(f=2400, d=0.03, g=0.25):
    t = t_(d)
    return np.sin(2 * np.pi * f * t) * np.exp(-t * 180) * g

def pop(g=0.4):
    t = t_(0.09)
    f = 900 * np.exp(-t * 25) + 300
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 45) * g

def bell(f0=1318.5, d=1.0, g=0.35):
    t = t_(d)
    x = np.sin(2 * np.pi * f0 * t) + 0.5 * np.sin(2 * np.pi * f0 * 1.5 * t) * np.exp(-t * 6) + 0.25 * np.sin(2 * np.pi * f0 * 2.76 * t) * np.exp(-t * 9)
    return x * np.exp(-t * 4.5) * np.minimum(1, t / 0.002) * g

def boom(d=2.8):
    t = t_(d)
    f = 32 + 90 * np.exp(-t * 9)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.4)
    noise = lp(rng.standard_normal(len(t)), 2500) * np.exp(-t * 6) * 0.5
    crack = hp(rng.standard_normal(len(t)), 3000) * np.exp(-t * 40) * 0.4
    return np.tanh((sub * 1.4 + noise + crack) * 1.3) * 0.95

def riser(d):
    t = t_(d)
    n = rng.standard_normal(len(t))
    out = np.zeros(len(t))
    chunks = 60; L = len(t) // chunks
    for c in range(chunks):
        fc = 400 * (9000 / 400) ** (c / chunks)
        seg = n[c * L:(c + 1) * L + 2000]
        y = bp(seg, fc * 0.7, min(SR / 2 - 100, fc * 1.4))
        out[c * L:c * L + L] += y[:L]
    f = 110 * 2 ** (t / d * 3)
    tone = saw(1, d) * 0  # placeholder for shape
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.25 + np.sign(np.sin(2 * np.pi * np.cumsum(f * 1.005) / SR)) * 0.06
    env = (t / d) ** 2.5
    return (out * 0.8 + tone) * env

def shimmer(d=2.5):
    t = t_(d)
    x = sum(np.sin(2 * np.pi * note(m) * t + rng.random() * 6) for m in (81, 84, 88, 93)) / 4
    return x * np.minimum(1, t / 0.02) * np.exp(-t * 1.6) * 0.25

# ---------------- arrangement ----------------
drums = np.zeros(N); bass = np.zeros(N); pads = np.zeros(N); fx = np.zeros(N); verb_send = np.zeros(N)
side = np.ones(N)  # sidechain gain curve

def duck(at, depth=0.65, rel=0.28):
    i = int(at * SR); t = t_(rel)
    curve = 1 - depth * np.exp(-t * 14)
    j = min(N, i + len(curve)); side[i:j] = np.minimum(side[i:j], curve[: j - i])

# kick: 0 – 18.0 on every beat, then outro half-time from 21.0
for b in np.arange(0, 18.01, BEAT):
    add(drums, kick(1.0 if b > 0 else 1.25), b); duck(b)
for b in np.arange(21.0, 25.01, 1.0):
    add(drums, kick(0.8), b, 0.8); duck(b, 0.5)

# hats
for b in np.arange(2.0, 20.0, BEAT):
    add(drums, hat(), b + 0.25, 0.9)
for b in np.arange(4.5, 18.4, 0.25):
    if (b * 4) % 2 == 0:
        add(drums, hat(), b, 0.35)
for b in np.arange(4.5, 18.4, 2.0):
    add(drums, hat(True), b + 1.75, 0.6)
for b in np.arange(21.0, 25.6, BEAT):
    add(drums, hat(), b + 0.25, 0.5)

# claps on 2 & 4
for b in np.arange(5.0, 18.1, 1.0):
    add(drums, clap(), b, 0.75); add(verb_send, clap(), b, 0.25)
# snare roll build 19.0 – 20.4
t_roll = 19.0; step = 0.25
while t_roll < 20.38:
    g = 0.35 + 0.9 * (t_roll - 19.0) / 1.4
    add(drums, clap(), t_roll, g)
    t_roll += step
    if t_roll > 19.5: step = 0.125
    if t_roll > 20.0: step = 0.0625

# chords Am – F – C – G  (2 s each)
prog = [(57, [57, 60, 64, 69]), (53, [53, 57, 60, 65]), (48, [55, 60, 64, 67]), (55, [55, 59, 62, 67])]
for bar_start in np.arange(0, 18.0, 2.0):
    root, ch = prog[int(bar_start / 2) % 4]
    if bar_start >= 2.0:
        add(pads, pad_chord(ch, 2.0), bar_start, 0.9 if bar_start >= 4.5 else 0.6)
    for k in range(4):
        tb = bar_start + k * BEAT + 0.25
        add(bass, bass_note(note(root - 24), 0.24), tb, 1.0)
        if bar_start >= 4.5:
            add(bass, bass_note(note(root - 12), 0.12), tb + 0.125, 0.35)
# tension pad 18 – 20.5
add(pads, pad_chord([57, 60, 64, 71], 2.4), 18.0, 0.7)
# outro: big chord after impact
add(pads, pad_chord([45, 57, 60, 64, 67, 71], 5.6), 20.5, 1.1)
for bar_start, (root, _) in zip(np.arange(21.0, 25.0, 2.0), [prog[0], prog[1]]):
    for k in range(4):
        add(bass, bass_note(note(root - 24), 0.35), bar_start + k * BEAT, 0.7)

# fx: whooshes at wipes
for c in (2.0, 4.5, 9.5, 14.5, 18.5):
    add(fx, whoosh(), c - 0.42, 0.55); add(verb_send, whoosh(), c - 0.42, 0.15)
add(fx, whoosh(0.3, 0.3, 1500, 9000), 0.0, 0.5)        # slash at start
add(fx, boom(1.2), 0.0, 0.45)
# word punches s1
for t in (0.25, 0.5, 0.75):
    add(fx, pop(0.25), t)
add(fx, pop(0.4), 1.0)
for t in (2.25, 3.0, 3.75):
    add(fx, pop(0.3), t)
# typing 5.25 – 5.95
for i, t in enumerate(np.linspace(5.25, 5.95, 20)):
    add(fx, tick(3000 + (i % 3) * 400, 0.025, 0.12), t)
# ui pops
for t in (5.95, 6.45, 6.53):
    add(fx, pop(0.18), t)
add(fx, tick(1800, 0.05, 0.5), 7.5)          # click
add(fx, bell(1760, 0.5, 0.15), 7.52)
for t in (8.0, 8.1, 8.2):
    add(fx, pop(0.2), t)
# reel caption pops
for t in (10.25, 10.5, 10.75, 11.0):
    add(fx, pop(0.35), t)
add(fx, pop(0.3), 11.5)                    # heart
add(fx, whoosh(0.15, 0.2, 2000, 10000), 11.85, 0.4)  # cut inside reel
# notifications
add(fx, bell(1318.5, 0.9, 0.22), 12.5); add(fx, bell(1975.5, 0.7, 0.16), 12.58)
add(fx, bell(1567.98, 0.9, 0.2), 13.0); add(fx, bell(2349.3, 0.7, 0.14), 13.08)
add(verb_send, bell(1318.5, 0.9, 0.2), 12.5); add(verb_send, bell(1567.98, 0.9, 0.2), 13.0)
# design tiles
for i, t in enumerate((14.8, 14.9, 15.0, 15.1)):
    add(fx, pop(0.22), t)
add(fx, tick(2200, 0.04, 0.3), 16.5)
# checks
for t in (18.6, 18.85, 19.1):
    add(fx, bell(1046.5 * (1 + 0.25 * ((t - 18.6) / 0.25)), 0.4, 0.14), t)
# riser into impact
add(fx, riser(1.95), 18.5, 1.3)
# impact + accent landing
add(fx, boom(), 20.5, 1.0); add(verb_send, boom(1.0), 20.5, 0.4)
add(fx, bell(2637, 1.6, 0.18), 21.0); add(fx, boom(1.2), 21.0, 0.35); add(fx, shimmer(), 21.0, 0.9)
add(verb_send, bell(2637, 1.6, 0.25), 21.0); add(verb_send, shimmer(), 21.0, 0.6)
add(fx, pop(0.3), 22.5)
for t in (23.5, 24.5, 25.5):
    add(fx, tick(1500, 0.06, 0.12), t)

# ---------------- mix ----------------
music = drums * 0.9 + bass * side + pads * side
# reverb
ir_t = t_(2.2)
ir = rng.standard_normal(len(ir_t)) * np.exp(-ir_t * 3.2)
ir = lp(ir, 6000)
wet = signal.fftconvolve(verb_send + pads * 0.15, ir)[:N] * 0.06

mixL = music + fx + wet
# stereo: widen pads/wet slightly via delays
d = int(0.012 * SR)
padsR = np.concatenate([np.zeros(d), (pads * side)[:-d]])
wetR = np.concatenate([np.zeros(d * 2), wet[:-d * 2]])
L = drums * 0.9 + bass * side + pads * side + fx + wet
R = drums * 0.9 + bass * side + padsR + fx + wetR
# fade out
fade = np.ones(N); fs = int(1.6 * SR); fade[-fs:] = np.linspace(1, 0, fs) ** 1.5
fi = int(0.005 * SR); fade[:fi] = np.linspace(0, 1, fi)
st = np.stack([L, R], 1) * fade[:, None]
st = np.tanh(st * 1.1)
st = st / np.abs(st).max() * 0.89
wavfile.write('music.wav', SR, (st * 32767).astype(np.int16))
print('ok', st.shape)
