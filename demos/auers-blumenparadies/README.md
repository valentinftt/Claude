# Demo-Website: Auer's Blumenparadies (Regensburg)

Test-Website zum Zeigen im Kundengespräch mit Veronika Auer. One-Pager, Look „natürlich & warm“.

- **`Auers_Blumenparadies_Demo.html`**: fertige Datei, einfach im Browser öffnen. Bilder und Schriften sind eingebettet, läuft auch offline (nur die Karte braucht Internet).
- `src.html` + `img/` + `fonts/`: Quelle; `python3 build.py` baut daraus die Demo-Datei neu.

## Inhalt
Hero mit Live-Status „Jetzt geöffnet“ · Anlässe (Hochzeit, Sträuße & Geschenke, Trauer) · Über Veronika + Google-Bewertung 5,0 (14) · Strauß-Anfrage mit Live-Zusammenfassung · Besuch mit Öffnungszeiten und Google-Karte · mobile Aktionsleiste „Anrufen / Strauß anfragen“.

## Platzhalter (vor dem Livegang mit ihr klären)
- **Öffnungszeiten**: Beispiel (Mo–Fr 9–18, Sa 9–14). Anpassen in `src.html` → `const HOURS`.
- **Bewertungen**: Beispieltexte; echte Google-Bewertungen einsetzen.
- **Über-mich-Text**: Entwurf aus öffentlichen Infos (Eröffnung Februar 2026).
- **Budget-Stufen im Formular**: Beispielwerte.
- **Fotos**: Unsplash-Fotos (frei nutzbar) als Platzhalter, später durch ihre eigenen ersetzen.
- Das Formular verschickt in der Demo nichts.

## Bildquellen (Unsplash, unsplash.com/photos/…)
hero `1563241527-3004b7be0ffd` · hero-round `1718568698631-c8e53cc1b18b` · hochzeit `1595467959554-9ffcbf37f10f` · straeusse `1610599929507-fac366fb4252` · trauer `1700142611715-8a023c5eb8c5` · ueber `1642751652611-bb9a7cad58a3` · anfrage `1667555150959-3e881131b9e4` · laden `1589244159943-460088ed5c92`

Schriften: Cormorant Garamond, DM Sans, Great Vibes (alle SIL Open Font License, via Fontsource).
