# Sonny's Fahrschule – neue Website

Neuaufbau von https://sonnys-fahrschule.jimdofree.com mit [Astro](https://astro.build). Alle bisherigen Seiten und Texte sind übernommen (Home, Blog, FE-Klassen mit B + BF17 / BE / B96, Kurse, News, Kontakt, Gästebuch mit allen 21 Einträgen, Passwortbereich, INFO, Impressum, Sitemap).

## Starten

```bash
npm install
npm run dev      # Entwicklung: http://localhost:4321
npm run build    # fertige Seite in dist/ (kann auf jeden Webspace hochgeladen werden)
```

## Inhalte ändern

- Kontaktdaten, Bürozeiten, Menü, Klassen: `src/data/site.ts`
- Gästebuch-Einträge: `src/data/gaestebuch.json`
- Seiten: `src/pages/`

## Vor dem Livegang

- Datenschutzerklärung in `src/pages/datenschutz.astro` einsetzen (die alte stammte automatisch von Jimdo).
- Passwortbereich: echter Schutz braucht den Webserver/Hoster (z. B. Passwortschutz per `.htaccess`), eine statische Seite kann das nicht.
- Formulare öffnen E-Mail-Programm bzw. WhatsApp mit der fertigen Nachricht (kein Server nötig).
