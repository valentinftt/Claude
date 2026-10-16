"""Baut die Konzept-Website als eine einzige HTML-Datei (Bilder und Schriften eingebettet).

    python3 build.py   ->  Elisa_bewegt_Konzept.html
"""
import base64, pathlib, re

HERE = pathlib.Path(__file__).parent
b64 = lambda p: base64.b64encode(p.read_bytes()).decode()

FONTS = [  # family, file, descriptors
    ('Roboto Flex', 'roboto-flex-latin-full-normal.woff2',
     'font-weight:100 1000;font-stretch:25% 151%;font-style:oblique 0deg 10deg;font-display:block'),
    ('Manrope', 'manrope-latin-wght-normal.woff2', 'font-weight:200 800;font-style:normal;font-display:swap'),
]
fonts = '\n'.join(
    f"@font-face{{font-family:'{fam}';src:url(data:font/woff2;base64,{b64(HERE / 'fonts' / f)}) format('woff2');{desc}}}"
    for fam, f, desc in FONTS)


def build(name):
    html = (HERE / 'src.html').read_text()
    html = html.replace('{{FONTS}}', fonts)
    html = re.sub(r'\{\{IMG:([\w-]+)\}\}', lambda m: f"data:image/jpeg;base64,{b64(HERE / 'img' / (m.group(1) + '.jpg'))}", html)
    assert '{{' not in html, 'Platzhalter übrig'
    out = HERE / name
    out.write_text(html)
    print(out.name, f'{out.stat().st_size / 1e6:.1f} MB')


build('Elisa_bewegt_Konzept.html')
