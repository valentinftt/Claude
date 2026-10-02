HEART = '<svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.3 3 4.5 6.6 4.5c2.1 0 3.6 1.2 5.4 3.2 1.8-2 3.3-3.2 5.4-3.2 3.6 0 5.7 3.8 4.2 7.3C19.5 16.4 12 21 12 21z" fill="{f}" stroke="#fff" stroke-width="1.8"/></svg>'
COMM = '<svg viewBox="0 0 24 24"><path d="M20.5 11.5a8.5 8.5 0 0 1-12.2 7.7L3.5 20.5l1.4-4.6A8.5 8.5 0 1 1 20.5 11.5z" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/></svg>'
SEND = '<svg viewBox="0 0 24 24"><path d="M21.5 3.5L10.5 13.5M21.5 3.5l-6.5 18-4.5-8-8-4.5z" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/></svg>'
CAM = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="3" y="6" width="18" height="14" rx="3"/><circle cx="12" cy="13" r="3.5"/><path d="M8 6l1.5-2h5L16 6"/></svg>'

def reel(k, acc, av, avbg, text, likes, comms, caps, extra='', full=True):
    ui = ''
    if full:
        ui = f'''<div class="prog"><i id="pr{k}"></i></div>
 <div class="ui-top"><span>Reels</span>{CAM}</div>
 <div class="rail"><div><span id="hb{k}">{HEART.format(f='none')}</span><span id="lk{k}">{likes}</span></div><div>{COMM}<span>{comms}</span></div><div>{SEND}<span>Teilen</span></div></div>
 <div class="acc"><div class="row"><span class="av" style="background:{avbg}">{av}</span>{acc}<span class="fo">Folgen</span></div><p>{text}</p><div class="au">♪ Originalton · {acc}</div></div>'''
    return f'''<div class="reel" id="r{k}"><img class="v" id="v{k}" src="reels/{ {'a':'schmuck','b':'mode','c':'beauty'}[k[0]] }_f/0001.jpg"/><div class="shade"></div>{caps}{extra}{ui}</div>'''

A_CAPS = '''<div class="cap k" id="a1" style="top:170px"><span>NEU</span></div>
<div class="cap" id="a2" style="top:208px"><span style="font-size:62px">Gold Edition</span></div>
<div class="cap box" id="a3" style="top:700px"><span style="font-size:40px">Handgefertigt.</span></div>'''
A_EXTRA = '''<div class="stk" id="stk"><s>AB</s><b>89 €</b></div>
<svg class="heart" id="heart" viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.3 3 4.5 6.6 4.5c2.1 0 3.6 1.2 5.4 3.2 1.8-2 3.3-3.2 5.4-3.2 3.6 0 5.7 3.8 4.2 7.3C19.5 16.4 12 21 12 21z" fill="#fff"/></svg>'''
B_CAPS = '''<div class="cap k" id="b1" style="top:170px"><span>NEW DROP</span></div>
<div class="cap" id="b2" style="top:208px"><span style="font-size:54px">Outfit des Tages</span></div>
<div class="cap lb" id="b3" style="top:700px"><span style="font-size:32px">Jetzt shoppen →</span></div>'''
C_CAPS = '''<div class="cap k" id="c1k" style="top:170px"><span>GLOW ROUTINE</span></div>
<div class="cap" id="c2k" style="top:208px"><span style="font-size:62px">In 3 Steps</span></div>
<div class="cap box" id="c3k" style="top:700px"><span style="font-size:40px" id="step">Step 1</span></div>'''

t = open('template5.html').read()
t = t.replace('{{BASE_CSS}}', open('base.css').read()).replace('{{LOGO}}', open('logo.svg.part').read())
t = t.replace('{{REEL_A}}', reel('a', 'lumiere.jewelry', 'L', '#b8913f', 'Die neue Gold Edition ✨ Link in Bio', '24,8K', '412', A_CAPS, A_EXTRA))
t = t.replace('{{REEL_B}}', reel('b', 'north.wear', 'N', '#2b2b2b', 'Der neue Drop ist da 🔥 Welches Outfit ist dein Favorit?', '18,3K', '286', B_CAPS))
t = t.replace('{{REEL_C}}', reel('c', 'nova.skincare', 'N', '#e7a6b8', 'Deine Glow-Routine in 3 Steps 💗', '31,2K', '540', C_CAPS))
SIDE = {'b2': ('north.wear', 'N', '#2b2b2b', 'Der neue Drop ist da 🔥', '18,3K', '286'), 'a2': ('lumiere.jewelry', 'L', '#b8913f', 'Die neue Gold Edition ✨', '24,8K', '412')}
side = lambda k, idn: f'<div class="pho side" id="{idn}"><div class="scr"><div class="isl"></div>{reel(k, *SIDE[k][:4], *SIDE[k][4:], "")}</div></div>'
t = t.replace('{{SIDE_L}}', side('b2', 'tL')).replace('{{SIDE_R}}', side('a2', 'tR'))
open('index5.html', 'w').write(t)
print('ok')
