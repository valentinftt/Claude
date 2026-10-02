import math
t = open('template2.html').read()
logo = open('logo.svg.part').read()
sm = logo.replace('id="logo"', 'id="logoSmSvg"').replace('id="lclip"', 'id="sm_lclip"').replace('url(#lclip)', 'url(#sm_lclip)') \
         .replace('id="lg', 'id="sm_lg').replace('class="lg-l"', 'class="lgsm-l"').replace('class="lg-s"', 'class="lgsm-s"')
pts = []
for i in range(32):
    r = 100 if i % 2 == 0 else 84
    a = math.pi * 2 * i / 32
    pts.append(f'{100 + r * math.cos(a):.1f} {100 + r * math.sin(a):.1f}')
burst = 'M' + ' L'.join(pts) + 'Z'
t = t.replace('{{LOGO_SM}}', sm).replace('{{LOGO}}', logo).replace('{{BURST}}', burst)
open('index2.html', 'w').write(t)
