# Story-Sample-Reel v2 – Quellen

- Clips (Mixkit, assets.mixkit.co): 5222 (Ring auf Tischkante, auch Basis fürs „Vorher“-Foto), 24656 (rote Ringschachtel öffnet sich), 47476 (Diamant-Armband), 46235 (Diamant-Prisma, Lichtblitze), 26757 (Kristall-Burst), 46317 (goldener Glitzer, Screen-Overlay)
- „Lumière“ ist eine erfundene Beispielmarke
- Musik und Soundeffekte: selbst synthetisiert (music7.py, sfxlib.py), 128 BPM, Drop bei 0,94 s
- Schriften: Unbounded, Michroma, Inter, Cormorant Garamond (fontsource), Noto Color Emoji

Ablauf: `python3 reel7.py` → `python3 build7.py` → Server auf Port 8772 in diesem Ordner → `node render7.mjs` → `python3 music7.py` → ffmpeg-Finish (tmix 60→30 fps, 2-Pass ~9 Mbit/s, loudnorm -14 LUFS).
