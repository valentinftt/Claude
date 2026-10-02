t = open('template4.html').read()
t = t.replace('{{BASE_CSS}}', open('base.css').read()).replace('{{REEL_CSS}}', open('reel.css').read()).replace('{{LOGO}}', open('logo.svg.part').read())
open('index4.html', 'w').write(t)
