"""Graded 9:16 jewelry reel (1080x1920, 30 fps) + glitter / prism overlay frame sequences."""
import subprocess, os
B = 60 / 128
C = '/tmp/v5/clips/'
OUT = '/tmp/v7/reel/'
# (clip, start, speed, cx, z0, z1, beats, fy)
CUTS = [(5222, 0.4, 0.5, 0.84, 1.15, 1.50, 4, 0.60, 0.68),     # same ring as the phone photo, now cinematic
        (26757, 2.0, 0.8, 0.50, 1.05, 1.40, 1, 0.5, 0.5, 'eq=contrast=1.6:brightness=-0.1:saturation=0.6,'),  # crystal burst
        (24656, 2.2, 0.6, 0.50, 1.40, 1.68, 3.5, 0.47),          # ring box opens
        (47476, 2.9, 0.6, 0.42, 1.10, 1.32, 3, 0.42),            # bracelet goes on
        (5222, 6.4, 0.5, 0.62, 1.28, 1.62, 3.5, 0.46, 0.56)]     # ring hero
GRADE = ("colorbalance=rs=.07:gs=.02:bs=-.08:rm=.05:gm=.01:bm=-.05:rh=.03:bh=-.04,"
         "curves=all='0/0 0.12/0.06 0.5/0.52 0.85/0.92 1/1',eq=contrast=1.08:saturation=1.18,"
         "vignette=angle=PI/4.5,unsharp=5:5:0.55,noise=alls=3:allf=t")
def wh(i):
    o = subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', f'{C}h{i}.mp4']).decode().split('\n')[0]
    return map(int, o.split(','))
def cut(cid, ss, sp, cx, z0, z1, n, fy, out, size='1080x1920', fx=0.5, ex=''):
    W, H = wh(cid)
    cw = int(H * 9 / 16) // 2 * 2
    x = int(min(max(cx * W - cw / 2, 0), W - cw)); crop = f'crop={cw}:{H}:{x}:0,'
    src = n / 30 * sp + 0.3
    f = (f"trim=start={ss}:duration={src},setpts=PTS-STARTPTS,setpts=PTS/{sp},minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:vsbmc=1,"
         if sp < 1 else f"trim=start={ss}:duration={src},setpts=PTS-STARTPTS,setpts=PTS/{sp},fps=30,")
    f += (f"{ex}{crop}scale=1080:1920:flags=lanczos,"
          f"zoompan=z='{z0}+({z1}-{z0})*on/{n}':x='min(max(iw*{fx}-(iw/zoom/2),0),iw-iw/zoom)':y='min(max(ih*{fy}-(ih/zoom/2),0),ih-ih/zoom)':d=1:s={size}:fps=30,"
          f"trim=end_frame={n},setpts=PTS-STARTPTS")
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{C}h{cid}.mp4', '-vf', f, '-an', '-c:v', 'libx264', '-crf', '11', '-pix_fmt', 'yuv420p', out], check=True)
parts, acc = [], 0
for k, c in enumerate(CUTS):
    cid, ss, sp, cx, z0, z1, beats, fy = c[:8]; fx = c[8] if len(c) > 8 else 0.5; ex = c[9] if len(c) > 9 else ''
    n = round((acc + beats) * B * 30) - round(acc * B * 30); acc += beats
    p = f'{OUT}c{k}.mp4'; cut(cid, ss, sp, cx, z0, z1, n, fy, p, fx=fx, ex=ex); parts.append(p); print(k, cid, n, flush=True)
TOT = round(acc * B * 30)
open(f'{OUT}list.txt', 'w').write(''.join(f"file '{p}'\n" for p in parts))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', f'{OUT}list.txt', '-vf', GRADE, '-c:v', 'libx264', '-crf', '11', '-pix_fmt', 'yuv420p', f'{OUT}reel.mp4'], check=True)
def frames(src, d, extra=''):
    os.makedirs(d, exist_ok=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src] + (['-vf', extra] if extra else []) + ['-q:v', '2', f'{d}/%04d.jpg'], check=True)
frames(f'{OUT}reel.mp4', f'{OUT}f')
# overlays (screen-blended in the browser): golden glitter + diamond prism light, half-res is enough
NO = TOT + 100
cut(46317, 1.0, 0.7, 0.5, 1.0, 1.15, NO, 0.6, f'{OUT}glit.mp4', '540x960')
frames(f'{OUT}glit.mp4', f'{OUT}g', "colorbalance=rs=.1:bs=-.1:rm=.06:bm=-.08,eq=saturation=0.8:contrast=1.35:brightness=-0.03")
cut(46235, 0.5, 0.95, 0.25, 1.0, 1.3, NO, 0.5, f'{OUT}prism.mp4', '540x960')
frames(f'{OUT}prism.mp4', f'{OUT}p', "colorbalance=rs=.08:bs=-.06,eq=contrast=1.3:saturation=1.2")
import json; json.dump({'n': TOT, 'o': NO}, open(f'{OUT}count.json', 'w'))
print('frames', TOT, NO)
