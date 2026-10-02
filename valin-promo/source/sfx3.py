"""Sound effects only (no music) for promo video 3 – timed to anim3.js."""
from sfxlib import *

M = Mix(24.8)
add = M.add

# ---------- extra sounds ----------
def square_blip(freqs, step=0.05, g=0.25):
    out = []
    for f in freqs:
        t = t_(step)
        out.append(signal.square(2 * np.pi * f * t, 0.5) * np.exp(-t * 18))
    return lp(np.concatenate(out), 5000) * g

def modem(d=1.2, g=0.18):
    t = t_(d); x = np.zeros(len(t))
    seg = [(0.0, 0.25, 'tone', 1375), (0.25, 0.45, 'tone', 2100), (0.45, 0.62, 'sweep', 0), (0.62, 0.85, 'tone', 1650), (0.85, 1.2, 'noise', 0)]
    for a, b, kind, f in seg:
        i, j = int(a * SR), min(len(t), int(b * SR)); tt = t[i:j] - a
        if kind == 'tone':
            x[i:j] = np.sin(2 * np.pi * f * tt) * 0.6 + np.sin(2 * np.pi * f * 1.52 * tt) * 0.3 * (np.sin(2 * np.pi * 14 * tt) > 0)
        elif kind == 'sweep':
            fr = 900 + 2400 * (tt / (b - a))
            x[i:j] = np.sin(2 * np.pi * np.cumsum(fr) / SR)
        else:
            x[i:j] = bp(rng.standard_normal(j - i), 800, 4000) * (0.6 + 0.4 * np.sign(np.sin(2 * np.pi * 9 * tt)))
    env = np.minimum(1, t / 0.01) * np.minimum(1, (d - t) / 0.08)
    return bp(x, 300, 3400) * env * g

def win_error(g=0.45):
    out = np.zeros(int(0.9 * SR))
    for at, f in ((0.0, note(81)), (0.12, note(76))):
        t = t_(0.75)
        x = (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 6) + 0.25 * np.sin(2 * np.pi * 3 * f * t) * np.exp(-t * 9))
        x *= np.exp(-t * 4.5) * np.minimum(1, t / 0.003)
        i = int(at * SR); out[i:i + len(x)] += x[: len(out) - i]
    return out * g

def low_buzz(g=0.3):
    t = t_(0.09)
    return lp(signal.square(2 * np.pi * 150 * t), 1500) * np.exp(-t * 20) * g

def zoom_up(g=0.3, d=0.4):
    t = t_(d); f = 300 * (5 ** (t / d))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / d) * g + swish(g * 0.6, d)

def boing(g=0.35, d=0.35):
    t = t_(d); f = 520 * np.exp(-t * 5) + 140 + 40 * np.sin(2 * np.pi * 18 * t) * np.exp(-t * 6)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7) * np.minimum(1, t / 0.004) * g

def msg_in(g=0.35):
    t = t_(0.22); f = np.where(t < 0.07, 1180, 880)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-((t % 0.07) * 0 + t) * 14) * np.minimum(1, t / 0.003) * g

def msg_out(g=0.32):
    t = t_(0.16); f = 600 + 900 * (t / 0.16)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / 0.16) * g

def womp(g=0.45):
    out = []
    for f, d in ((note(55), 0.22), (note(52), 0.22), (note(49), 0.5)):
        t = t_(d)
        vib = 1 + 0.012 * np.sin(2 * np.pi * 6 * t) * (t / d)
        x = signal.sawtooth(2 * np.pi * np.cumsum(f * vib) / SR * 1.0)
        x = lp(x, 900) * np.minimum(1, t / 0.02) * np.minimum(1, (d - t) / 0.04)
        out.append(x)
    return np.concatenate(out) * g

def clank(g=0.5):
    t = t_(0.6); x = np.zeros(len(t))
    for f, dec in ((523, 9), (1407, 12), (2210, 16), (3330, 22), (4890, 30)):
        x += np.sin(2 * np.pi * f * t) * np.exp(-t * dec)
    x += hp(rng.standard_normal(len(t)), 2000) * np.exp(-t * 60)
    return x / 3 * g

def hammer(g=0.55):
    t = t_(0.35)
    thud = np.sin(2 * np.pi * np.cumsum(180 * np.exp(-t * 20) + 70) / SR) * np.exp(-t * 18)
    knock = bp(rng.standard_normal(len(t)), 600, 3500) * np.exp(-t * 70)
    ring = (np.sin(2 * np.pi * 1900 * t) + 0.6 * np.sin(2 * np.pi * 3100 * t)) * np.exp(-t * 25) * 0.25
    return (thud + knock * 0.8 + ring) * g

def drill(d=0.4, g=0.3):
    t = t_(d)
    f = 95 + 25 * np.minimum(1, t / 0.08)
    x = signal.sawtooth(2 * np.pi * np.cumsum(f) / SR) * (0.7 + 0.3 * np.sin(2 * np.pi * 32 * t))
    x = bp(x + 0.3 * rng.standard_normal(len(t)), 200, 3000)
    return x * np.minimum(1, t / 0.03) * np.minimum(1, (d - t) / 0.05) * g

def sparkle(d=0.7, g=0.25):
    out = np.zeros(int(d * SR) + int(0.4 * SR))
    for k in range(14):
        at = d * (k / 14) ** 0.8
        b = bell(note(84 + int(rng.integers(0, 16))), 0.35, 1.0)
        i = int(at * SR); out[i:i + len(b)] += b[: len(out) - i] * (0.4 + 0.6 * rng.random())
    return out * g

# ---------- timeline ----------
# S1 old website (0 – 2.6)
add(swish(0.25, 0.25), 0.05)
add(square_blip([523, 784, 1047], 0.045, 0.22), 0.15)
add(modem(1.25, 0.16), 0.3)
for k in range(6):
    add(tick(1400 + 90 * k, 0.12, 0.03), 0.45 + k * 1.3 / 6)
add(swish(0.35, 0.22), 0.55)
add(win_error(0.5), 1.8, rv=0.2)
# S2 phone (2.6 – 4.8)
add(whoosh(), 2.6 - 0.35, 0.75)
add(whoosh(0.25, 0.3, 300, 4000, 0.35), 2.7)
add(swish(0.35, 0.22), 3.05)
for i, at in enumerate((3.15, 3.43, 3.71)):
    add(pop(800 + i * 100, 0.32), at, pan=(-0.4, 0.4, -0.3)[i]); add(low_buzz(0.22), at + 0.03, pan=(-0.4, 0.4, -0.3)[i])
add(zoom_up(0.25, 0.45), 3.5)
add(boing(0.3), 4.1)
# S3 facts (4.8 – 8.5)
add(whoosh(), 4.8 - 0.35, 0.75)
add(pop(1200, 0.25), 4.85)
for k, at in enumerate(5.15 + 0.4 * np.sqrt(np.linspace(0, 1, 12))):
    add(tick(3200 + k * 40, 0.15, 0.025), at)
add(bell(note(93), 0.9, 0.3), 5.55, rv=0.4); add(boom(0.5, 0.35), 5.55)
add(swish(0.2, 0.2), 5.75)
add(swish(0.25, 0.25), 6.55); add(pop(1100, 0.25), 6.65)
for k, at in enumerate(6.85 + 0.75 * (1 - np.sqrt(1 - np.linspace(0, 0.96, 16)))):
    add(tick(1800 + k * 110, 0.13), at)
add(bell(note(88), 0.6, 0.2), 7.6, rv=0.3)
add(swish(0.35, 0.22), 7.55)
# S4 chat (8.5 – 11.2)
add(whoosh(), 8.5 - 0.35, 0.75)
add(whoosh(0.25, 0.3, 300, 4000, 0.35), 8.6)
add(swish(0.35, 0.22), 8.95)
add(msg_in(0.35), 8.95, pan=-0.2)
add(msg_out(0.32), 9.4, pan=0.2)
add(msg_out(0.32), 9.75, pan=0.2)
for k in range(4):
    add(tick(900, 0.05, 0.03), 10.05 + k * 0.08, pan=-0.2)
add(msg_in(0.35), 10.4, pan=-0.2)
add(womp(0.42), 10.62); add(boom(0.4, 0.25), 10.65)
# S5 renovation (11.2 – 14.8)
add(whoosh(), 11.2 - 0.35, 0.75); add(clank(0.4), 11.2, rv=0.3)
add(whoosh(0.25, 0.3, 300, 4000, 0.35), 11.35)
add(pop(900, 0.3), 11.55)
add(swish(0.35, 0.22), 11.65)
for at in (11.72, 11.9, 12.08):
    add(hammer(0.5), at, pan=0.2)
add(drill(0.42, 0.28), 12.2, pan=-0.2)
add(bell(note(91), 0.6, 0.22), 12.66, rv=0.3); add(bell(note(96), 0.6, 0.18), 12.72, rv=0.3)
add(swish(0.3, 0.25), 12.75)
add(whoosh(0.5, 0.4, 300, 7000, 0.45), 12.85)
add(sparkle(0.8, 0.22), 13.1, rv=0.5)
add(pop(1200, 0.3), 13.2)
add(whoosh(0.25, 0.25, 500, 6000, 0.38), 13.75, pan=0.4)
add(pop(1000, 0.3), 14.15)
# S6 reels (14.8 – 17.6)
add(whoosh(), 14.8 - 0.35, 0.75)
add(pop(1200, 0.22), 14.88)
add(whoosh(0.25, 0.3, 300, 5000, 0.38), 15.0)
add(swish(0.3, 0.2), 15.12, pan=-0.6); add(swish(0.3, 0.2), 15.18, pan=0.6)
add(swish(0.35, 0.22), 15.3)
add(pop(950, 0.42), 15.5); add(pop(1150, 0.42), 15.75)
add(pop(820, 0.22), 15.6, pan=-0.6)
for k in range(3):
    add(pop(900 + k * 120, 0.2), 15.6 + k * 0.15, pan=0.6)
for k, at in enumerate(15.3 + 2.1 * np.sqrt(np.linspace(0, 1, 22))):
    add(tick(2000 + k * 60, 0.09 + 0.004 * k), at, pan=0.15 * np.sin(k))
add(pop(600, 0.4), 16.5); add(bell(note(84), 0.4, 0.12), 16.5)
add(whoosh(0.2, 0.2, 600, 6000, 0.32), 16.55, pan=0.5)
add(ding(0.26), 16.7, pan=0.3, rv=0.3)
# S7 offer (17.6 – 20.4)
add(whoosh(), 17.6 - 0.35, 0.75)
add(swish(0.35, 0.22), 18.05); add(kaching(0.55), 18.05, rv=0.25)
add(whoosh(0.2, 0.25, 400, 4000, 0.3), 18.2)
add(scratch(0.45), 18.38)
for k, m in enumerate((72, 74, 76, 77, 79, 81)):
    add(pop(700, 0.18), 18.6 + k * 0.12); add(bell(note(m), 0.3, 0.1), 18.6 + k * 0.12)
add(pop(600, 0.4), 19.35); add(boom(0.5, 0.3), 19.35)
for k, m in enumerate((84, 88, 91)):
    add(bell(note(m), 0.9, 0.16), 19.37 + k * 0.06, rv=0.5)
add(pop(1100, 0.3), 19.65); add(pop(1250, 0.3), 19.8)
# S8 CTA (20.4 – 24.8)
add(whoosh(), 20.4 - 0.35, 0.75)
add(swish(0.35, 0.22), 20.85)
add(swish(0.25, 0.3), 21.1)
add(boom(1.8, 0.85), 21.55); add(shimmer(1.6, 0.28), 21.55, rv=0.6); add(tick(4200, 0.25, 0.04), 21.55)
add(swish(0.2, 0.2), 21.8)
add(pop(1000, 0.35), 22.0)
add(pop(1200, 0.4), 22.2); add(swish(0.2, 0.25), 22.2)
add(tick(1500, 0.12, 0.06), 23.2); add(tick(1500, 0.12, 0.06), 24.1)

M.write('sfx3.wav')
print('ok')
