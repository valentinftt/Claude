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
