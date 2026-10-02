"""Assembles st1..st5.html from the story templates (shared CSS, logo, CTA)."""
import sys
ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
HEAD = '''<!doctype html>
<html lang="de"><head><meta charset="utf-8"><title>{title}</title>
<link rel="stylesheet" href="base.css"><link rel="stylesheet" href="stories.css">
<style>{css}</style></head><body>
<div id="stage" class="{cls}"><div id="cam">
'''
TAIL = '''
<div id="dmPulse"></div><div id="dm">SCHREIB UNS EINE DM <i>{arrow}</i></div>
</div><div id="flash"></div><canvas id="grain" width="540" height="960" style="position:absolute;inset:0;width:1080px;height:1920px;z-index:80;opacity:.03;pointer-events:none"></canvas></div>
<script src="node_modules/gsap/dist/gsap.min.js"></script>
<script src="node_modules/gsap/dist/DrawSVGPlugin.min.js"></script>
<script src="common.js"></script>
<script>{js}</script>
</body></html>'''
LOGO = open('logo.svg.part').read()

for n in sys.argv[1:] or ['1', '2', '3', '4', '5']:
    src = open(f'st{n}.src.html').read()
    css, rest = src.split('<!--BODY-->')
    body, js = rest.split('<!--JS-->')
    meta = dict(l.split(':', 1) for l in css.splitlines()[0].strip('/* ').rstrip(' */').split(';') if ':' in l)
    out = HEAD.format(title=meta.get('title', f'Story {n}'), css=css.replace('{{OLDCSS}}', open('old.css').read()), cls=meta.get('cls', '').strip())
    out += body.replace('{{LOGO}}', f'<div id="logoTop">{LOGO}</div>')
    out += TAIL.format(arrow=ARROW, js=js)
    open(f'st{n}.html', 'w').write(out)
    print('built', n)
