"""Baut das einseitige Angebots-PDF:  python3 build.py  ->  Angebot_Elisa_bewegt_VALIN.pdf"""
import pathlib, re, subprocess
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[2]
NM = ROOT / 'valin-promo' / 'source' / 'node_modules'
logo = (ROOT / 'valin-promo' / 'source' / 'logo.svg.part').read_text()
logo = logo.replace('var(--ink)', '#ffffff').replace('var(--lime)', '#c7f431').replace('id="logo"', 'id="valin-logo"')
html = (HERE / 'angebot.src.html').read_text().replace('{{NM}}', NM.as_uri()).replace('{{LOGO}}', logo)
(HERE / 'angebot.html').write_text(html)
subprocess.run(['node', str(HERE / 'pdf.mjs'), str(HERE / 'angebot.html'), str(HERE / 'Angebot_Elisa_bewegt_VALIN.pdf')], check=True)
