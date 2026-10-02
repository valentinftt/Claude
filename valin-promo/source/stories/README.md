# Instagram-Stories (5 × 6 s, 1080×1920, nur Soundeffekte)

Jede Story gibt es als Video (`valin-promo/stories/Story_*.mp4`) und als Standbild (`*.png`).

| Datei | Idee | Look |
|---|---|---|
| `st1.src.html` | Benachrichtigungs-Flut auf dem Lock-Screen → „Das passiert nach dem richtigen Reel.“ → Reel-Abos ab 99 €/Monat | dunkel |
| `st2.src.html` | Tristes Handyfoto → Tippen → Blitz → echtes Schmuck-Reel. „Gleiches Produkt. Anderes Ergebnis.“ | hell → dunkel |
| `st3.src.html` | „Bei wem kaufst du?“ – alte vs. moderne Website, der Finger entscheidet sich → Website ab 299 € | hell |
| `st4.src.html` | Endloser Ladebalken mit Timer, Kunde wischt weg → 53 % (Google, 2016) → schnelle Websites ab 299 € | dunkel |
| `st5.src.html` | Preis-Reveal: 2.000 €? → 1.000 €? → Slot-Spin → „ab 299 €“-Stempel | hell |

- `common.js` / `stories.css` – gemeinsame Helfer (Timeline, Logo-Animation, CTA-Button, Filmkorn)
- `build.py` erzeugt `st1.html` … `st5.html` (braucht `base.css` und `logo.svg.part` aus `../`, `old.css` für die alte Website)
- `sfx_stories.py` – Soundeffekte je Story (`sfx1.wav` … `sfx5.wav`)
- `render.mjs st1` rendert 60 fps, danach mit `tmix=frames=2,fps=30` auf 30 fps mit Motion Blur
- Story 2 nutzt die Schmuck-Reel-Frames aus Video 5 (`reels.py`) unter `img/reel/` sowie `img/dull.jpg`
