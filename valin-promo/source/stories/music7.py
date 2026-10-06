"""Story 7 (Website-Vorschau Floristik): calm, warm beat (120 BPM, half-time feel) + sound effects.

Bars every 2 s: Fmaj7 - Em7 - Dm7 - Cmaj7 - Fmaj7 - Cmaj9 (end card at 10 s).
Writes music7.wav (beat + effects) and sfx7.wav (effects only).
"""
from sfxlib import *

B = 0.5
DUR = 12.0
N = int(SR * DUR)
r = np.random.default_rng(7)
END = 10.0

def buf(): return np.zeros(N)
def put(b, x, at, g=1.0):
    i = int(round(at * SR))
    if i >= N or i < 0: return
    x = x[: N - i]; b[i:i + len(x)] += x * g

# ---------- soft instruments ----------
def kick():
    t = t_(0.5)
    f = 45 + 70 * np.exp(-t * 28)
    return np.tanh(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7) * 1.4) * 0.8
def snap():
    t = t_(0.2)
    return lp(bp(r.standard_normal(len(t)), 1200, 5000) * np.exp(-t * 28), 3500) * 0.35
def hat(d=0.04):
    t = t_(d); return hp(r.standard_normal(len(t)), 7000, 4) * np.exp(-t * 120) * 0.16
def shaker():
    t = t_(0.07); return bp(r.standard_normal(len(t)), 5000, 11000) * np.sin(np.pi * t / 0.07) ** 2 * 0.08
def epiano(m, d):
    t = t_(d); f = note(m)
    trem = 1 + 0.06 * np.sin(2 * np.pi * 4.5 * t)
    x = np.sin(2 * np.pi * f * t) + 0.22 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 6) + 0.08 * np.sin(2 * np.pi * 3 * f * t) * np.exp(-t * 9)
    env = np.minimum(1, t / 0.012) * (0.55 * np.exp(-t * 1.6) + 0.45) * np.minimum(1, (d - t) / 0.25)
    return x * env * trem * 0.12
def chord(notes, d): return sum(epiano(m, d) for m in notes)
def sub(m, d=0.9):
    t = t_(d); return np.sin(2 * np.pi * note(m) * t) * np.minimum(1, t / 0.01) * np.exp(-t * 2.2) * 0.42
def pluck(m, g=0.08):
    t = t_(0.6); f = note(m)
    return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t)) * np.exp(-t * 7) * np.minimum(1, t / 0.003) * g

drums, keys, bass, arp = buf(), buf(), buf(), buf()
KICK, SNAP, HAT, SHK = kick(), snap(), hat(), shaker()
PROG = [([53, 57, 60, 64], 41), ([52, 55, 59, 62], 40), ([50, 53, 57, 60], 38), ([48, 52, 55, 59], 36), ([53, 57, 60, 64], 41), ([48, 52, 55, 59, 62], 36)]
for bar, (ch, root) in enumerate(PROG):
    t0 = bar * 2.0
    d = 2.0 if bar < 5 else DUR - t0
    put(keys, chord(ch, d + 0.2), t0)
    put(bass, sub(root - 12, 0.95), t0); put(bass, sub(root - 12, 0.6), t0 + 1.0 + 0.25)
    for k in range(4):                                  # half-time: kick on 1, snap on 3
        tb = t0 + k * B
        if k == 0: put(drums, KICK, tb, 0.9)
        if k == 2: put(drums, SNAP, tb, 0.8)
        if k == 3 and bar % 2: put(drums, KICK, tb + 0.25, 0.5)
        for e in range(2):
            put(drums, HAT, tb + e * 0.25 + (0.03 if e else 0), 0.9 if e else 0.5)
        put(drums, SHK, tb + 0.125, 0.8)
    if 1 <= bar <= 4:                                   # light arpeggio while the site scrolls
        tones = [m + 12 for m in ch]
        for k in range(8):
            put(arp, pluck(tones[[0, 2, 1, 3, 2, 1, 3, 2][k]], 0.05 + 0.01 * (k % 2)), t0 + k * 0.25)
music = drums + keys + bass + arp

# ---------- sound effects (times match st7.src.html) ----------
M = Mix(DUR); add = M.add
add(swish(0.25, 0.25), 0.0); add(pop(1300, 0.18), 0.38)                 # logo
add(pop(1000, 0.2), 0.1); add(pop(1150, 0.2), 0.19); add(swish(0.2, 0.2), 0.62)
add(whoosh(0.2, 0.35, 250, 5000, 0.4), 0.05)                            # laptop rises
add(whoosh(0.18, 0.3, 300, 6000, 0.35), 0.7, pan=0.4)                   # phone slides in
for t in (1.5, 3.0, 5.5): add(pop(900, 0.3), t); add(tick(2800, 0.12), t + 0.04)   # feature chips
for t in (1.8, 3.8, 5.8): add(swish(0.1, 0.5), t, pan=-0.2)            # laptop scrolls
for t in (2.2, 3.6): add(swish(0.09, 0.45), t, pan=0.3)                 # phone scrolls
add(whoosh(0.12, 0.2, 500, 7000, 0.25), 4.65, pan=0.3)
add(pop(800, 0.22), 5.08, pan=0.3)                                      # form appears
for t in (5.75, 6.3, 7.1, 8.3): add(click(0.45), t, pan=0.3)            # taps
for t in (7.22, 7.36, 7.5, 7.64, 7.78, 8.0): add(tick(3800 + r.integers(0, 600), 0.1, 0.02), t, pan=0.3)   # typing
add(pop(1200, 0.3), 8.36, pan=0.3); add(shimmer(1.2, 0.22), 8.36, rv=0.5)   # sent
add(ding(0.24), 8.75, pan=-0.3, rv=0.3)                                 # notification
add(whoosh(0.3, 0.25, 250, 6000, 0.45), END - 0.3)                      # devices out
add(boom(1.4, 0.4), END + 0.05); add(shimmer(1.4, 0.25), END + 0.05, rv=0.6)
add(swish(0.2, 0.2), END + 0.45)
add(pop(800, 0.35), END + 0.65); add(tick(3000, 0.12), END + 1.5)

# ---------- final mix ----------
ir_t = t_(1.8)
ir = lp(r.standard_normal(len(ir_t)), 6000) * np.exp(-ir_t * 3.2)
wet = signal.fftconvolve(keys + arp, ir)[:N] * 0.06
d = int(0.012 * SR)
mL = music + wet
mR = drums + bass + np.concatenate([np.zeros(d), (keys + arp)[:-d]]) + np.concatenate([np.zeros(d), wet[:-d]])
music_st = np.stack([mL, mR], 1); music_st /= np.abs(music_st).max()
sfx_st = np.stack([M.L, M.R], 1); sfx_st /= max(1e-9, np.abs(sfx_st).max())
fade = np.ones(N); f = int(0.7 * SR); fade[-f:] = np.linspace(1, 0, f) ** 1.3
fade[:int(0.02 * SR)] = np.linspace(0, 1, int(0.02 * SR))
mix = np.tanh((music_st * 0.8 + sfx_st * 0.5) * fade[:, None] * 1.1)
mix = mix / np.abs(mix).max() * 0.89
wavfile.write('music7.wav', SR, (mix * 32767).astype(np.int16))
sfx_only = np.tanh(sfx_st * 0.9 * fade[:, None]); sfx_only = sfx_only / np.abs(sfx_only).max() * 0.89
wavfile.write('sfx7.wav', SR, (sfx_only * 32767).astype(np.int16))
print('ok')
