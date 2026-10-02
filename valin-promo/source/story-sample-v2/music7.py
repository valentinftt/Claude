"""Tech-house track (128 BPM, A minor) + sound effects for story reel v2."""
from sfxlib import *

BPM = 128
B = 60 / BPM
S16 = B / 4
BAR = 4 * B
DUR = 25 * B + 0.03
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

DROP = 4 * B            # camera flash -> finished reel
END = 19 * B            # end card
STOP = 25 * B
roots = [57, 53, 55, 52]  # Am F G Em
chords = {57: [57, 60, 64, 67], 53: [53, 57, 60, 64], 55: [55, 59, 62, 67], 52: [52, 55, 59, 64]}
bass_steps = [2, 3, 6, 7, 10, 11, 14, 15]
stab_steps = [3, 6, 11, 14]

# intro (2 beats): filtered hats + pad swell + snare roll
for s in range(16):
    put(drums, HAT, s * S16 * 2 + S16, 0.3 + 0.15 * (s / 16))
put(drums, KICK, 0.0, 0.6); put(drums, KICK, B, 0.5)
t = 2 * B
while t < DROP - 0.02:
    put(drums, CLAP, t, 0.15 + 0.5 * ((t - 2 * B) / (2 * B)) ** 1.5)
    t += S16 if t > 3 * B else B / 2
put(pads, pad(chords[57], DROP + 0.1), 0.0, 0.9)
put(fxm, riser(DROP), 0.0, 0.75)

# groove from the drop to the end card + 1 beat into it
gbeats = int(round((STOP - DROP) / B))
for g in range(gbeats):
    tb = DROP + g * B
    bar = g // 4
    root = roots[bar % 4]
    last = tb >= STOP - B * 0.5
    if g == 0 or g % 4 == 0:
        put(pads, pad(chords[root], min(4 * B, STOP - tb + 0.3)), tb, 0.85)
    put(drums, KICK, tb, 0.9); duck(tb)
    if g % 2 == 1: put(drums, CLAP, tb, 0.8)
    put(drums, OHAT, tb + B / 2, 0.55)
    for s in range(4):
        ts = tb + s * S16
        put(drums, HAT, ts, 0.75 if s % 2 else 0.4)
        put(drums, SHAK, ts, 0.75 if s == 2 else 0.35)
        st = (g % 4) * 4 + s
        if st in bass_steps:
            put(bassb, bass(note(root - 24 + (12 if st == 15 and bar % 2 else 0))), ts, 1.0)
        if st in stab_steps:
            put(stabs, stab(chords[root]), ts, 0.95)
    if g % 4 == 3: put(drums, RIM, tb + 3 * S16, 0.7)
# little fills into the bursts and into the end card
for at in (DROP + 4 * B - S16, DROP + 11.5 * B - S16):
    put(drums, CLAP, at, 0.45)
for k in range(4): put(drums, CLAP, END - B + k * S16, 0.3 + 0.12 * k)

music = drums + (bassb + stabs + pads) * side
music = lowpass_sweep(music, 300, 11000, 0.0, DROP)
music = lowpass_sweep(music, 12000, 900, STOP - B, DUR)

# ---------- sound effects ----------
M = Mix(DUR); add = M.add
r_ = lambda x: DROP + x * B
add(swish(0.18, 0.2), 0.04)
add(tick(2600, 0.12, 0.03), 0.47); add(tick(3100, 0.1, 0.03), 0.54)            # autofocus
add(click(0.9), 0.98); add(tick(5200, 0.3, 0.03), 1.0)                           # shutter
add(whoosh(0.38, 0.25, 200, 9000, 0.75), DROP - 0.38)                            # zoom into the photo
add(boom(1.8, 1.0), DROP); add(shimmer(1.8, 0.4), DROP, rv=0.7)                  # drop
add(bell(note(100), 0.7, 0.12), DROP + 0.2, pan=-0.4, rv=0.5)                   # sparkle on the stone
add(bell(note(105), 0.6, 0.08), DROP + 0.38, pan=0.4, rv=0.5)
add(whoosh(0.15, 0.3, 400, 8000, 0.45), r_(3.1) - 0.15)                          # "Dein Reel." flies out
for c in (4, 5, 8.5, 11.5):
    add(swish(0.3, 0.2), r_(c) - 0.07, pan=(-0.3 if c % 1 else 0.3))
add(shimmer(1.0, 0.32), r_(4), rv=0.6); add(boom(0.7, 0.4), r_(4))             # crystal burst
add(bell(note(93), 0.8, 0.14), r_(5) + 0.25, rv=0.6)                            # box opens / Gold Edition
add(bell(note(100), 0.8, 0.1), r_(5) + 0.42, rv=0.6, pan=0.3)
for i, n_ in enumerate((98, 105, 110)):                                          # "Funkelt. Für immer."
    add(bell(note(n_), 0.6, 0.08), r_(8.5) + 0.1 + i * B * 0.75, pan=(i - 1) * 0.35, rv=0.5)
add(bell(note(105), 1.0, 0.16), r_(11.5) + 0.08, rv=0.7); add(shimmer(1.4, 0.24), r_(11.5), rv=0.6)  # hero ring
for k in range(6): add(bell(note(100 + (k * 7) % 12), 0.3, 0.05), r_(12.2) + k * B * 0.5, pan=(-0.5 if k % 2 else 0.5), rv=0.4)
add(whoosh(0.35, 0.3, 250, 9000, 0.7), END - 0.35)
add(boom(1.6, 0.8), END); add(shimmer(1.5, 0.25), END, rv=0.6)
add(pop(800, 0.35), END + 0.45)                                                  # logo accent
add(pop(1000, 0.3), END + B); add(pop(1150, 0.28), END + B + 0.14)
add(kaching(0.45), END + 2 * B, rv=0.25)
for i in range(3): add(pop(1000 + i * 150, 0.3), END + (3 + i * 0.5) * B)

# ---------- final mix ----------
ir_t = t_(1.8)
ir = lp(r.standard_normal(len(ir_t)), 6000) * np.exp(-ir_t * 3.5)
wet = signal.fftconvolve(stabs * side + fxm, ir)[:N] * 0.035
d = int(0.014 * SR)
mL = music + wet + fxm
mR = drums + bassb * side + pads * side + np.concatenate([np.zeros(d), (stabs * side)[:-d]])
mR = lowpass_sweep(mR, 300, 11000, 0.0, DROP)
mR = lowpass_sweep(mR, 12000, 900, STOP - B, DUR) + np.concatenate([np.zeros(d), wet[:-d]]) + fxm
music_st = np.stack([mL, mR], 1)
music_st = music_st / np.abs(music_st).max()
M_ir = lp(r.standard_normal(len(t_(1.5))), 7000) * np.exp(-t_(1.5) * 4)
mw = signal.fftconvolve(M.verb, M_ir)[:N] * 0.05
sfx_st = np.stack([M.L + mw, M.R + np.concatenate([np.zeros(d), mw[:-d]])], 1)
sfx_st = sfx_st / max(1e-9, np.abs(sfx_st).max())
mix = music_st * 0.8 + sfx_st * 0.55
fade = np.ones(N); f = int(0.35 * SR); fade[-f:] = np.linspace(1, 0, f) ** 1.3
mix = np.tanh(mix * fade[:, None] * 1.15)
mix = mix / np.abs(mix).max() * 0.89
wavfile.write('music7.wav', SR, (mix * 32767).astype(np.int16))
sfx_only = np.tanh(sfx_st * 0.9 * fade[:, None]); sfx_only = sfx_only / np.abs(sfx_only).max() * 0.89
wavfile.write('sfx7.wav', SR, (sfx_only * 32767).astype(np.int16))
print('ok', DUR)
