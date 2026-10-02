t = open('template6.html').read().replace('{{BASE_CSS}}', open('base.css').read()).replace('{{LOGO}}', open('logo.svg.part').read())
open('index6.html', 'w').write(t)
