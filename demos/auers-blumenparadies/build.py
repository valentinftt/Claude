"""Baut die Demo-Website als eine einzige HTML-Datei (Bilder und Schriften eingebettet).

    python3 build.py   ->  Auers_Blumenparadies_Demo.html   (für das Gespräch mit Frau Auer)
                           Beispiel_Floristik_Demo.html     (neutral, ohne ihre Daten: zum Posten/Zeigen)
"""
import base64, pathlib, re

HERE = pathlib.Path(__file__).parent
b64 = lambda p: base64.b64encode(p.read_bytes()).decode()

FONTS = [  # family, file, weight, style
    ('Cormorant Garamond', 'cormorant-garamond-latin-500-normal.woff2', '500', 'normal'),
    ('Cormorant Garamond', 'cormorant-garamond-latin-600-normal.woff2', '600', 'normal'),
    ('Cormorant Garamond', 'cormorant-garamond-latin-500-italic.woff2', '500', 'italic'),
    ('Cormorant Garamond', 'cormorant-garamond-latin-600-italic.woff2', '600', 'italic'),
    ('DM Sans', 'dm-sans-latin-wght-normal.woff2', '100 1000', 'normal'),
    ('Great Vibes', 'great-vibes-latin-400-normal.woff2', '400', 'normal'),
]
fonts = '\n'.join(
    f"@font-face{{font-family:'{fam}';src:url(data:font/woff2;base64,{b64(HERE / 'fonts' / f)}) format('woff2');font-weight:{w};font-style:{st};font-display:swap}}"
    for fam, f, w, st in FONTS)

# neutrale Beispiel-Version: Reihenfolge wichtig (lange Ausdrücke zuerst)
NEUTRAL = [
    (re.compile(r'\s*<iframe title="Karte".*?</iframe>', re.S), ''),
    (re.compile(r'\s*<p class="demo-hint">.*?</p>', re.S), ''),
    (re.compile(r'\s*<small>Vorschau: .*?</small>', re.S), ''),
    ("Auer’s Blumenparadies", 'Wildblüte Floristik'),
    ("<b>Auer’s</b><span>Blumenparadies</span>", '<b>Wildblüte</b><span>Blumen &amp; Floristik</span>'),
    ('Bischof-Konrad-<br>Straße 4, Regensburg', 'Musterstraße 12,<br>Musterstadt'),
    ('Bischof-Konrad-Straße&nbsp;4', 'Musterstraße&nbsp;12'),
    ('Bischof-Konrad-Straße 4', 'Musterstraße 12'),
    ('Bischof-Konrad-Straße', 'Musterstraße'),
    ('93051 Regensburg', '12345 Musterstadt'),
    ('REGENSBURG', 'MUSTERSTADT'),
    ('Regensburg', 'Musterstadt'),
    ('0941 94299725', '0123 456 789'),
    ('+4994194299725', '+49123456789'),
    ('https://www.instagram.com/auersblumenparadies/', '#'),
    ('@auersblumenparadies', '@wildbluete.floristik'),
    ('Veronika Auer', 'Lena Berger'),
    ('Veronika', 'Lena'),
    ('14 Google-Bewertungen', '38 Google-Bewertungen'),
]
LEAKS = ['Auer', 'Blumenparadies', 'Regensburg', 'Bischof', '93051', '0941', '94299725', 'Veronika', 'auersblumen']


def build(name, replacements=()):
    html = (HERE / 'src.html').read_text()
    for a, b in replacements:
        html = a.sub(b, html) if hasattr(a, 'sub') else html.replace(a, b)
    if replacements:
        left = [w for w in LEAKS if w in html]
        assert not left, f'noch Kundendaten in {name}: {left}'
    html = html.replace('{{FONTS}}', fonts)
    html = re.sub(r'\{\{IMG:([\w-]+)\}\}', lambda m: f"data:image/jpeg;base64,{b64(HERE / 'img' / (m.group(1) + '.jpg'))}", html)
    out = HERE / name
    out.write_text(html)
    print(out.name, f'{out.stat().st_size / 1e6:.1f} MB')


build('Auers_Blumenparadies_Demo.html')
build('Beispiel_Floristik_Demo.html', NEUTRAL)
