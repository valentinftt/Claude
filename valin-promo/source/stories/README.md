# Instagram-Stories (1080×1920; 1–5: je 6 s, nur Soundeffekte, 6: 9 s und 7: 12 s mit Beat)

Jede Story gibt es als Video (`valin-promo/stories/Story_*.mp4`) und als Standbild (`*.png`).

| Datei | Idee | Look |
|---|---|---|
| `st1.src.html` | Benachrichtigungs-Flut auf dem Lock-Screen → „Das passiert nach dem richtigen Reel.“ → Reel-Abos ab 99 €/Monat | dunkel |
| `st2.src.html` | Tristes Handyfoto → Tippen → Blitz → echtes Schmuck-Reel. „Gleiches Produkt. Anderes Ergebnis.“ | hell → dunkel |
| `st3.src.html` | „Bei wem kaufst du?“ – alte vs. moderne Website, der Finger entscheidet sich → Website ab 299 € | hell |
| `st4.src.html` | Endloser Ladebalken mit Timer, Kunde wischt weg → 53 % (Google, 2016) → schnelle Websites ab 299 € | dunkel |
| `st5.src.html` | Preis-Reveal: 2.000 €? → 1.000 €? → Slot-Spin → „ab 299 €“-Stempel | hell |
| `st6.src.html` | Empfehlungsprogramm (9 s): Betrieb mit wenig Reichweite → „Empfiehl mich dem Betrieb.“ – Zuschauer teilt das VALÍN-Profil im Chat mit dem Café, das antwortet „Hab direkt gebucht“ → Drop „20 %“ vom Auftragswert (z. B. Website 299 € → 59,80 €) → „Empfiehl mich weiter“ + „sag mir per DM, wen du empfohlen hast“ | dunkel, mit Beat |
| `st7.src.html` | Website-Vorschau (12 s): Beispiel-Website „Wildblüte Floristik“ scrollt auf MacBook + iPhone, am Handy wird live eine Strauß-Anfrage ausgefüllt → „Danke, Sophie!“ + Benachrichtigung → „So könnte Ihre Website aussehen.“ | dunkel, ruhiger Beat |
| `st8.src.html` | Guten-Morgen-Story (8 s): eigenes Café-Foto als Hintergrund mit langsamem Zoom auf den Cappuccino und aufsteigendem Dampf, „Guten Morgen.“, „Der Cappuccino steht, die Timeline läuft.“, Button „Dein Projekt als Nächstes?“ | Foto, ohne Ton |

- `common.js` / `stories.css` – gemeinsame Helfer (Timeline, Logo-Animation, CTA-Button, Filmkorn)
- `build.py` erzeugt `st1.html` … `st5.html` (braucht `base.css` und `logo.svg.part` aus `../`, `old.css` für die alte Website)
- `sfx_stories.py` – Soundeffekte je Story (`sfx1.wav` … `sfx5.wav`)
- `music6.py` – Story 6 mit eigenem Beat (120 BPM, Drop auf „20 %“ bei 5,5 s): schreibt `music6.wav` (Beat + Effekte) und `sfx6.wav` (nur Effekte)
- `build.py` übernimmt aus der Kopfzeile einen eigenen Button-Text (`dm:…`, sonst „SCHREIB UNS EINE DM“) und die Länge (`dur:…`, sonst 6 s)
- `render.mjs st1` rendert 60 fps, danach mit `tmix=frames=2,fps=30` auf 30 fps mit Motion Blur
- Story 2 nutzt die Schmuck-Reel-Frames aus Video 5 (`reels.py`) unter `img/reel/` sowie `img/dull.jpg`
- Story 7 nutzt Bilder der neutralen Demo-Website aus `demos/auers-blumenparadies/` (`Beispiel_Floristik_Demo.html`): `web_capture.mjs` nimmt sie nach `img/web/` auf (inkl. `web.json` mit Scroll- und Tipp-Positionen), `music7.py` schreibt `music7.wav` und `sfx7.wav`
