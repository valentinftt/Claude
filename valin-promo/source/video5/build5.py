t = open('template5.html').read()
HEART = '<svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.3 3 4.5 6.6 4.5c2.1 0 3.6 1.2 5.4 3.2 1.8-2 3.3-3.2 5.4-3.2 3.6 0 5.7 3.8 4.2 7.3C19.5 16.4 12 21 12 21z" fill="{f}" stroke="#fff" stroke-width="1.8"/></svg>'
CMT = '<svg viewBox="0 0 24 24"><path d="M20.5 11.5a8.5 8.5 0 0 1-12.2 7.7L3.5 20.5l1.4-4.6A8.5 8.5 0 1 1 20.5 11.5z" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/></svg>'
SND = '<svg viewBox="0 0 24 24"><path d="M21.5 3.5L10.5 13.5M21.5 3.5l-6.5 18-4.5-8-8-4.5z" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/></svg>'
CAM = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"><rect x="3" y="6" width="18" height="14" rx="3"/><circle cx="12" cy="13" r="4"/><path d="M8 6l1.5-2h5L16 6"/></svg>'
def reel(k, acc, ini, likes, cm, sh, text, caps):
    return f'''<div class="reel" id="r{k}"><img class="v" id="v{k}" src="reels/{acc[1]}_f/0001.jpg"><div class="shade"></div>
<div class="prog"><i id="p{k}"></i></div>
<div class="ui-top"><span>Reels</span>{CAM}</div>
{caps}
<div class="rail"><div id="h{k}">{HEART.format(f="none")}<span id="lk{k}">{likes}</span></div><div>{CMT}<span>{cm}</span></div><div>{SND}<span>{sh}</span></div></div>
<div class="acc"><div class="row"><span class="av" style="background:{acc[2]}">{ini}</span>{acc[0]}<span class="fo">Folgen</span></div><p>{text}</p><div class="au">♫ Original-Audio</div></div>
<svg class="heart" id="hb{k}" viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.3 3 4.5 6.6 4.5c2.1 0 3.6 1.2 5.4 3.2 1.8-2 3.3-3.2 5.4-3.2 3.6 0 5.7 3.8 4.2 7.3C19.5 16.4 12 21 12 21z" fill="#fff"/></svg>
</div>'''
A = reel('A', ('lumiere.jewelry', 'schmuck', '#b8913f'), 'L', '12,4K', '318', '1.204', 'Handgefertigt. Für immer. ✨ Die neue Gold Edition ist da.',
  '<div class="cap k" id="a1" style="top:250px"><span>NEU</span></div><div class="cap" id="a2" style="top:290px"><span style="font-size:58px">Gold Edition</span></div><div class="stk" id="a3"><s>AB</s><b>89 €</b></div>')
Bq = reel('B', ('north.wear', 'mode', '#2f3a4a'), 'N', '8.912', '204', '977', 'Der Spring Drop ist live. Nur solange der Vorrat reicht.',
  '<div class="cap box" id="b1" style="top:230px"><span style="font-size:44px">NEW DROP</span></div><div class="cap" id="b2" style="top:310px"><span style="font-size:54px">Spring \'26</span></div>')
Cq = reel('C', ('nova.skincare', 'beauty', '#d98ca0'), 'N', '21,7K', '512', '2.390', 'Glow in 3 Steps 💗 Welche Farbe ist deine?',
  '<div class="cap lb" id="c1x" style="top:230px"><span style="font-size:46px">Glow-Routine</span></div><div class="cap" id="c2x" style="top:312px"><span style="font-size:50px">in 3 Steps</span></div>')
t = t.replace('{{BASE_CSS}}', open('base.css').read()).replace('{{LOGO}}', open('logo.svg.part').read())
t = t.replace('{{SIDE_L}}', '').replace('{{SIDE_R}}', '').replace('{{REEL_A}}', A).replace('{{REEL_B}}', Bq).replace('{{REEL_C}}', Cq)
open('index5.html', 'w').write(t)
