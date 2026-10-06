"""Story 6 (Empfehlung): short tech-house beat (120 BPM) + sound effects.

Three-beat pickup, so the bars start at 1.5 / 3.5 / 5.5 / 7.5 s: a muffled groove under the hook (0-3 s),
the filter opens while the business gets recommended (3-5.5 s) and the drop lands on the "20 %" at 5.5 s.
Writes music6.wav (song + effects) and sfx6.wav (effects only).
"""
from sfxlib import *

BPM = 120
B = 60 / BPM
S16 = B / 4
DUR = 9.0
N = int(SR * DUR)
r = np.random.default_rng(6)
DROP, SWAP, CTA = 5.5, 3.0, 7.0

def buf(): return np.zeros(N)
def put(b, x, at, g=1.0):
    i = int(round(at * SR))
    if i >= N or i < 0: return
    x = x[: N - i]; b[i:i + len(x)] += x * g

# ---------- instruments (same palette as video 5) ----------
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

def saw(f, d, det=(0,)):
    t = t_(d); o = np.zeros(len(t))
    for c in det: o += 2 * ((t * f * 2 ** (c / 1200) + r.random()) % 1) - 1
    return o / len(det)

def bass(f, d=0.11):
    t = t_(d)
    x = np.sin(2 * np.pi * f * t) * 0.9 + saw(f, d) * 0.5
    a = 1 - np.exp(-2 * np.pi * (180 + 900 * np.exp(-t * 30)) / SR)
    y = np.zeros(len(t)); s = 0.0
    for i in range(len(t)):
        s += a[i] * (x[i] - s); y[i] = s
    env = np.minimum(1, t / 0.003) * np.minimum(1, (d - t) / 0.01)
    return np.tanh(y * env * 2.2) * 0.5

def stab(notes, d=0.22):
    t = t_(d)
    x = sum(saw(note(m), d, (-7, 0, 7)) for m in notes) / len(notes)
    x += sum(np.sin(2 * np.pi * note(m) * 2 * t) for m in notes) / len(notes) * 0.25
    return lp(x, 2600) * np.exp(-t * 11) * np.minimum(1, t / 0.004) * 0.42

def pad(notes, d):
    t = t_(d)
    x = lp(sum(saw(note(m), d, (-10, 0, 9)) for m in notes) / len(notes), 1400)
    return x * np.minimum(1, t / 0.3) * np.minimum(1, (d - t) / 0.2) * 0.22

def riser(d):
    t = t_(d); n = r.standard_normal(len(t)); out = np.zeros(len(t))
    C = 50; L = len(t) // C
    for c in range(C):
        fc = 500 * (12000 / 500) ** (c / C)
        y = bp(n[c * L:(c + 1) * L + 1500], fc * 0.7, fc * 1.4); out[c * L:c * L + L] = y[:L]
    return out * (t / d) ** 2.2 * 0.5

def lowpass_sweep(x, f0, f1, start, end):
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

AM, DM, F, G, C = [57, 60, 64, 67], [50, 53, 57, 60], [53, 57, 60, 64], [55, 59, 62, 65], [60, 64, 67, 71]
# (start, end, chord, bass root): Am under the hook, Dm while recommending, drop F -> G7 -> C (resolves on the call to action)
HARM = [(0.0, 3.5, AM, 33), (3.5, DROP, DM, 38), (DROP, 6.5, F, 29), (6.5, 7.5, G, 31), (7.5, DUR, C, 36)]
for a, z, ch, root in HARM:
    drop = a >= DROP
    put(pads, pad(ch, z - a), a, 0.8 if drop else 0.55)
    for k in range(int(round((z - a) / S16))):
        ts = a + k * S16
        if ts >= DROP - 0.12 and not drop: break          # breath before the drop
        s = k % 16
        if s in (2, 3, 6, 7, 10, 11, 14, 15): put(bassb, bass(note(root + (12 if s == 15 else 0))), ts, 1.0 if drop else 0.7)
        if drop and s in (3, 6, 11, 14): put(stabs, stab(ch), ts, 1.0)

for k in range(int(DUR / B)):
    tb = k * B
    drop = tb >= DROP
    put(drums, KICK, tb, 0.9 if drop else 0.7); duck(tb)
    if k % 2 == 0 and k: put(drums, CLAP, tb, 0.8 if drop else 0.35)            # beats 2 and 4 of each bar
    put(drums, OHAT, tb + B / 2, 0.55 if drop else 0.3)
    for s in range(4):
        ts = tb + s * S16
        if not drop and ts > DROP - 0.12: break
        put(drums, HAT, ts, (1.0 if s % 2 else 0.55) * (0.8 if drop else 0.5))
        if drop: put(drums, SHAK, ts, 0.8 if s == 2 else 0.4)

# snare roll into the drop, 8ths then 16ths
t = DROP - 1.0; step = B / 2
while t < DROP - 0.11:
    put(drums, CLAP, t, 0.2 + 0.55 * (t - DROP + 1.0)); t += step
    if t >= DROP - 0.5: step = S16
put(fxm, riser(DROP - 0.1 - (SWAP + 0.4)), SWAP + 0.4, 0.6)

music = drums + (bassb + stabs + pads) * side
music = lowpass_sweep(music, 1100, 1100, 0.0, SWAP)
music = lowpass_sweep(music, 1100, 9000, SWAP, DROP)
music = lowpass_sweep(music, 12000, 1500, DUR - 0.8, DUR)

# ---------- sound effects (times match st6.src.html) ----------
M = Mix(DUR); add = M.add
# A: the business that needs reach
add(swish(0.28, 0.25), 0.0)
for i, at in enumerate((0.04, 0.12, 0.2)): add(pop(1000 + 120 * i, 0.2), at)
add(pop(1300, 0.18), 0.38)                                              # logo accent
add(whoosh(0.15, 0.3, 300, 5000, 0.38), 0.1)                            # profile card slides in
add(bonk(0.2), 0.85, pan=-0.2); add(bonk(0.17), 1.0, pan=0.2)           # "Keine Website" / "Keine Reels"
add(pop(600, 0.22), 0.85); add(pop(520, 0.2), 1.0)
add(swish(0.22, 0.2), 1.15)                                             # marker "Reichweite"
# B: recommend VALÍN Studio to the business
add(whoosh(0.14, 0.2, 400, 6000, 0.35), SWAP - 0.16)
add(pop(700, 0.28), SWAP - 0.04); add(pop(1100, 0.25), SWAP + 0.02); add(pop(1250, 0.25), SWAP + 0.11)
add(whoosh(0.12, 0.2, 500, 6000, 0.3), SWAP + 0.15, pan=0.3); add(pop(1000, 0.3), SWAP + 0.3)   # shared profile
add(swish(0.2, 0.2), SWAP + 0.35)                                       # marker "Empfiehl mich"
add(pop(1200, 0.35), SWAP + 0.6); add(tick(3200, 0.15), SWAP + 0.62)   # text bubble
add(whoop(0.3), SWAP + 0.75); add(tick(4200, 0.18), SWAP + 0.81)       # sent
add(pop(650, 0.2), SWAP + 0.9, pan=-0.3)                               # typing ...
add(ding(0.26), SWAP + 1.2, pan=-0.3, rv=0.3); add(pop(1100, 0.3), SWAP + 1.22, pan=-0.3)   # "Hab direkt gebucht"
# C: drop -> 20 %
add(whoosh(0.2, 0.2, 300, 7000, 0.5), DROP - 0.22)
add(swish(0.2, 0.2), DROP - 0.1)
add(boom(1.6, 0.9), DROP); add(kaching(0.5), DROP + 0.02, rv=0.3); add(shimmer(1.4, 0.3), DROP, rv=0.6)
for k in range(8): add(bell(note(96 + (k * 5) % 12), 0.35, 0.06), DROP + 0.05 + k * 0.06, pan=(-0.5 if k % 2 else 0.5), rv=0.4)
add(swish(0.25, 0.2), DROP + 0.28)                                      # "vom gesamten Auftragswert."
add(pop(800, 0.35), DROP + 0.5)                                         # example card
for k in range(1, 15):                                                  # counter 0,00 -> 59,80 € (power2.out)
    p = 1 - np.sqrt(1 - k / 15)
    add(tick(2200 + 90 * k, 0.13, 0.02), DROP + 0.65 + 0.65 * p)
add(kaching(0.32), DROP + 1.32, rv=0.25); add(pop(1300, 0.3), DROP + 1.32)
# D: call to action
add(whoosh(0.18, 0.25, 400, 5000, 0.3), CTA - 0.05); add(pop(800, 0.4), CTA + 0.05)
add(ding(0.22), CTA + 0.15, rv=0.3)
add(pop(1000, 0.22), CTA + 0.3)
for i in range(4): add(pop(900 + i * 120, 0.2), CTA + 0.45 + 0.08 * i)
add(tick(3000, 0.12), CTA + 0.9)

# ---------- final mix ----------
ir_t = t_(1.8)
ir = lp(r.standard_normal(len(ir_t)), 6000) * np.exp(-ir_t * 3.5)
wet = signal.fftconvolve(stabs * side + fxm, ir)[:N] * 0.035
d = int(0.014 * SR)
mL = music + wet + fxm
mR = drums + bassb * side + pads * side + np.concatenate([np.zeros(d), (stabs * side)[:-d]])
mR = lowpass_sweep(mR, 1100, 1100, 0.0, SWAP)
mR = lowpass_sweep(mR, 1100, 9000, SWAP, DROP)
mR = lowpass_sweep(mR, 12000, 1500, DUR - 0.8, DUR) + np.concatenate([np.zeros(d), wet[:-d]]) + fxm
music_st = np.stack([mL, mR], 1)
music_st = music_st / np.abs(music_st).max()
sfx_st = np.stack([M.L, M.R], 1)
sfx_st = sfx_st / max(1e-9, np.abs(sfx_st).max())
mix = music_st * 0.75 + sfx_st * 0.55
fade = np.ones(N); f = int(0.5 * SR); fade[-f:] = np.linspace(1, 0, f) ** 1.3
mix = np.tanh(mix * fade[:, None] * 1.15)
mix = mix / np.abs(mix).max() * 0.89
wavfile.write('music6.wav', SR, (mix * 32767).astype(np.int16))
sfx_only = np.tanh(sfx_st * 0.9 * fade[:, None]); sfx_only = sfx_only / np.abs(sfx_only).max() * 0.89
wavfile.write('sfx6.wav', SR, (sfx_only * 32767).astype(np.int16))
print('ok')
