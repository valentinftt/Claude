# VALÍN Studio Werbevideo – Quellprojekt

Animiertes 9:16-Werbevideo (1080×1920, 26,5 s), gebaut mit HTML/CSS + GSAP und Frame für Frame mit Playwright gerendert.

- `template.html` – Layout aller Szenen (`{{LOGO}}` wird durch `logo.svg.part` ersetzt)
- `anim.js` – komplette Timeline (Szenenzeiten stehen als Kommentare im Code)
- `audio.py` – synthetischer Soundtrack + Sounddesign, synchron zu den Schnitten (120 BPM)
- `render.mjs` – rendert 60 fps in 4 parallelen Browsern, `finish.sh` erzeugt das finale 30-fps-MP4 mit Motion Blur und Ton

## Neu rendern

```bash
npm install
python3 -c "open('index.html','w').write(open('template.html').read().replace('{{LOGO}}', open('logo.svg.part').read()))"
python3 -m http.server 8765 &
pip install numpy scipy && python3 audio.py
node render.mjs && bash finish.sh
```

## Video 2 (Weiß + Lime, 22 s, nur Soundeffekte)

- `template2.html` + `anim2.js` – Szenen und Timeline (Hook → Websites → Reels → Effekt → Preis → CTA)
- `sfx2.py` – nur Soundeffekte (keine Musik), damit ein Trend-Sound darübergelegt werden kann
- `build2.py` erzeugt `index2.html`, `render2.mjs` rendert die Frames (gleicher Ablauf wie oben)

## Video 3 „Website-Renovierung“ (25 s, nur Soundeffekte)

- `template3.html` + `anim3.js` – alte Website → Handy → Studien-Fakten → Chat junger Kunden → Renovierung (Vorher/Nachher) → Reels → Angebot (299 €, max. 7 Tage) → CTA
- `base.css` / `reel.css` – gemeinsame Styles aus Video 2, `build3.py` setzt alles zu `index3.html` zusammen
- `sfxlib.py` – gemeinsame Sound-Bausteine, `sfx3.py` – Effekte für Video 3
- Fakten: Lindgaard et al., Carleton University (2006) – 50 ms Ersteindruck; Stanford Web Credibility Research – 75 % beurteilen Glaubwürdigkeit am Website-Design

## Video 4 „Produktvideos & Reels“ (28,6 s, Tech-House-Song + Soundeffekte)

- `template4.html` + `anim4.js` – Handyfoto → Profi-Reel (Drop) → Fakt (85 %, Wyzowl 2025) → Branchen-Montage → 3 Schritte (Material, 3D-Produktion, Wachstum) → Inklusive → Vergleich + Abo ab 99 € → CTA
- `music4.py` – selbst komponierter Tech-House-Track (126 BPM), alle Schnitte auf dem Beat; schreibt `music4.wav` (Song + Effekte) und `sfx4.wav` (nur Effekte)
