"""Baut die Demo-Website als eine einzige HTML-Datei (Bilder und Schriften eingebettet).

    python3 build.py   ->  Auers_Blumenparadies_Demo.html
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

html = (HERE / 'src.html').read_text().replace('{{FONTS}}', fonts)
html = re.sub(r'\{\{IMG:([\w-]+)\}\}', lambda m: f"data:image/jpeg;base64,{b64(HERE / 'img' / (m.group(1) + '.jpg'))}", html)
out = HERE / 'Auers_Blumenparadies_Demo.html'
out.write_text(html)
print(out.name, f'{out.stat().st_size / 1e6:.1f} MB')
