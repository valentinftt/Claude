"""Sound effects for the five 6-second story videos (no music)."""
from sfxlib import *
import numpy as np

DUR = 6.0

def buzz(g=0.35):   # phone haptic
    t = t_(0.12); return np.sin(2 * np.pi * 165 * t) * (0.6 + 0.4 * np.sign(np.sin(2 * np.pi * 30 * t))) * np.sin(np.pi * t / 0.12) * g
def note_ping(m, g=0.22):  # iOS-like tri-tone
    return bell(note(m), 0.35, g)
def riser(d, g=0.4):
    t = t_(d); n = rng.standard_normal(len(t)); out = np.zeros(len(t)); C = 30; L = len(t) // C
    for c in range(C):
        fc = 500 * (9000 / 500) ** (c / C); y = bp(n[c * L:(c + 1) * L + 1200], fc * .7, fc * 1.4); out[c * L:c * L + L] = y[:L]
    return out * (t / d) ** 2 * g
def clock(g=0.3):
    t = t_(0.04); return bp(rng.standard_normal(len(t)), 2500, 6000) * np.exp(-t * 160) * g
def errtone(g=0.3):
    t = t_(0.35); return lp(signal.square(2 * np.pi * 220 * t) + signal.square(2 * np.pi * 233 * t), 1800) * np.exp(-t * 7) * g * 0.5

def cta_sfx(add, at, offer=None):
    if offer is not None: add(swish(0.25, 0.22), offer); add(pop(1100, 0.25), offer + 0.35)
    add(whoosh(0.18, 0.25, 400, 5000, 0.3), at - 0.05); add(pop(800, 0.4), at + 0.05)
    add(ding(0.22), at + 0.15, rv=0.3)
    add(tick(3000, 0.12), at + 0.9)
def logo(add, at): add(swish(0.25, 0.25), at); add(pop(1300, 0.22), at + 0.38)

# ---------- 1: notification flood ----------
M = Mix(DUR); a = M.add
TA = [0.12 + 2.55 * (1 - (1 - k / 13) ** 2) for k in range(14)]
for k, t in enumerate(TA):
    a(buzz(0.28), t)
    a(note_ping(84 + [0, 4, 7, 12, 7, 4][k % 6], 0.2 + 0.01 * k), t + 0.02, pan=(-0.3 if k % 2 else 0.3), rv=0.2)
a(riser(1.6, 0.25), 1.25)
H = 2.85
a(whoosh(0.2, 0.3, 300, 6000, 0.5), H - 0.2); a(boom(1.4, 0.7), H); a(shimmer(1.2, 0.2), H, rv=0.5)
logo(a, H + 0.05)
for i in range(3): a(pop(900 + 120 * i, 0.3), H + 0.05 + 0.1 * i)
a(swish(0.3, 0.2), H + 0.55)
cta_sfx(a, 4.05, 3.55)
M.write('sfx1.wav')

# ---------- 2: phone photo -> reel ----------
M = Mix(DUR); a = M.add; FL = 1.78
logo(a, 0.0); a(pop(1000, 0.3), 0.08)
a(whoosh(0.2, 0.3, 300, 5000, 0.4), 0.2)
a(bonk(0.25), 0.75); a(pop(500, 0.3), 0.78)
a(click(0.6), 1.48)
a(riser(FL - 1.0, 0.45), 1.0)
a(click(0.8), FL - 0.1); a(tick(5200, 0.3, 0.03), FL - 0.08)
a(boom(1.6, 0.9), FL); a(shimmer(1.6, 0.35), FL, rv=0.6)
for k in range(9): a(bell(note(96 + (k * 5) % 12), 0.4, 0.06), FL + 0.3 + k * 0.33, pan=(-0.5 if k % 2 else 0.5), rv=0.4)
a(pop(1100, 0.3), FL + 0.2); a(pop(1300, 0.32), FL + 0.45); a(swish(0.3, 0.2), FL + 0.5)
a(pop(900, 0.35), FL + 0.65); a(pop(800, 0.3), FL + 0.95); a(pop(600, 0.35), FL + 1.3); a(tick(3000, 0.2), FL + 1.35)
cta_sfx(a, 4.1, 3.55)
M.write('sfx2.wav')

# ---------- 3: which site would you buy from ----------
M = Mix(DUR); a = M.add; TAP = 2.45
logo(a, 0.0)
a(pop(1000, 0.3), 0.05); a(pop(1200, 0.3), 0.15); a(swish(0.25, 0.2), 0.55)
a(whoosh(0.2, 0.25, 300, 5000, 0.35), 0.15, pan=-0.3); a(whoosh(0.2, 0.25, 300, 5000, 0.35), 0.25, pan=0.3)
a(pop(700, 0.3), 0.6); a(pop(900, 0.3), 0.7)
a(swish(0.2, 0.2), 1.2)
a(bonk(0.22), 1.7); a(bonk(0.18), 1.85)
a(swish(0.25, 0.22), 2.05, pan=0.3)
a(click(0.7), TAP); a(ding(0.3), TAP + 0.12, rv=0.3)
a(pop(1200, 0.35), TAP + 0.15); a(errtone(0.25), TAP + 0.3, pan=-0.4)
a(kaching(0.4), TAP + 0.45, pan=0.3, rv=0.25)
a(whoop(0.2), TAP + 0.75, pan=-0.3)
cta_sfx(a, 4.1, 3.55)
M.write('sfx3.wav')

# ---------- 4: endless loading ----------
M = Mix(DUR); a = M.add; OUT, FACT = 3.05, 3.45
logo(a, 0.0); a(pop(900, 0.3), 0.0)
a(whoosh(0.2, 0.25, 300, 5000, 0.35), 0.1)
k = 0; t = 0.25
while t < OUT:
    a(clock(0.32 if k % 2 == 0 else 0.22), t); t += 0.5 - min(0.25, k * 0.02); k += 1
for s in (1, 2, 3): a(tick(1800 + s * 300, 0.2), s / 1.1)
a(errtone(0.35), 3 / 1.1)
d = OUT - 0.2; tt = t_(d); a(np.sin(2 * np.pi * (60 + 30 * tt / d) * tt) * (tt / d) ** 1.5 * 0.25, 0.2)  # tension drone
a(whoosh(0.25, 0.35, 300, 7000, 0.6), OUT - 0.1, pan=0.4)
a(whoop(0.25), OUT + 0.2)
a(boom(1.4, 0.75), FACT); a(shimmer(1.2, 0.2), FACT, rv=0.5)
for i, at in enumerate(FACT + 0.6 * (1 - np.sqrt(1 - np.linspace(0, .95, 10)))): a(tick(1800 + i * 120, 0.12), at)
a(swish(0.25, 0.2), FACT + 0.6)
cta_sfx(a, 4.55, 4.15)
M.write('sfx4.wav')

# ---------- 5: price reveal ----------
M = Mix(DUR); a = M.add; SP, LAND = 2.3, 2.9
logo(a, 0.0)
a(pop(1000, 0.3), 0.05); a(pop(1200, 0.3), 0.15); a(swish(0.25, 0.2), 0.55)
a(pop(700, 0.4), 0.75)
a(scratch(0.4, 0.2), 1.2); a(bonk(0.2), 1.32)
a(whoosh(0.15, 0.2, 400, 5000, 0.3), 1.5)
a(pop(800, 0.4), 1.6)
a(scratch(0.4, 0.2), 1.95); a(bonk(0.2), 2.07)
for i in range(int((LAND - SP) * 30)): a(tick(2400 + (i % 5) * 250, 0.16, 0.02), SP + i / 30)
a(riser(LAND - SP + 0.1, 0.3), SP - 0.1)
a(boom(1.6, 0.9), LAND); a(kaching(0.55), LAND + 0.05, rv=0.3); a(shimmer(1.3, 0.3), LAND, rv=0.6)
a(pop(1300, 0.3), LAND + 0.25)
a(swish(0.2, 0.2), LAND + 0.45)
for i in range(3): a(pop(900 + i * 150, 0.3), 3.6 + 0.12 * i); a(bell(note(76 + [0, 4, 7][i]), 0.4, 0.1), 3.65 + 0.12 * i, rv=0.3)
cta_sfx(a, 4.15)
M.write('sfx5.wav')
print('ok')
