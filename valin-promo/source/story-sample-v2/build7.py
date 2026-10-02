t = open('template7.html').read().replace('{{BASE_CSS}}', open('base.css').read()).replace('{{LOGO}}', open('logo.svg.part').read())
open('index7.html', 'w').write(t)
