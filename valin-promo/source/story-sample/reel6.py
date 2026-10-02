import subprocess, os
B = 60 / 126
C = '/tmp/v5/clips/'
OUT = '/tmp/v6/reel/'
# (clip, start, speed, cx, z0, z1, beats, fy)
CUTS = [(34611, 0.4, 0.5, 0.55, 1.06, 1.22, 2, 0.68), (20877, 0.6, 0.65, 0.45, 1.30, 1.08, 2, 0.5),
        (34424, 1.0, 0.9, 0.5, 1.00, 1.12, 2, 0.45), (5225, 4.2, 0.6, 0.30, 1.10, 1.25, 2, 0.45),
        (2865, 8.7, 0.45, 0.43, 1.25, 1.40, 1, 0.42), (34611, 2.6, 0.5, 0.60, 1.22, 1.38, 2, 0.62),
        (20877, 2.4, 0.55, 0.47, 1.05, 1.25, 2, 0.5), (34424, 4.2, 0.8, 0.5, 1.14, 1.0, 3, 0.45),
        (34611, 3.4, 0.5, 0.56, 1.0, 1.16, 2, 0.66)]
GRADE = ("colorbalance=rs=.06:gs=.02:bs=-.07:rm=.04:bm=-.04,eq=contrast=1.12:saturation=1.15:gamma=0.97,"
         "vignette=angle=PI/5,unsharp=5:5:0.4,noise=alls=4:allf=t")
def wh(i):
    o = subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', f'{C}h{i}.mp4']).decode().split('\n')[0]
    return map(int, o.split(','))
parts, acc = [], 0
for k, (cid, ss, sp, cx, z0, z1, beats, fy) in enumerate(CUTS):
    n = round((acc + beats) * B * 30) - round(acc * B * 30); acc += beats
    W, H = wh(cid)
    crop = ''
    if W > H:
        cw = int(H * 9 / 16) // 2 * 2
        x = int(min(max(cx * W - cw / 2, 0), W - cw)); crop = f'crop={cw}:{H}:{x}:0,'
    src = n / 30 * sp + 0.3
    f = (f"trim=start={ss}:duration={src},setpts=PTS-STARTPTS,setpts=PTS/{sp},minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:vsbmc=1,"
         if sp < 1 else f"trim=start={ss}:duration={src},setpts=PTS-STARTPTS,fps=30,")
    f += (f"{crop}scale=1080:1920:flags=lanczos,"
          f"zoompan=z='{z0}+({z1}-{z0})*on/{n}':x='iw/2-(iw/zoom/2)':y='min(max(ih*{fy}-(ih/zoom/2),0),ih-ih/zoom)':d=1:s=1080x1920:fps=30,"
          f"trim=end_frame={n},setpts=PTS-STARTPTS")
    p = f'{OUT}c{k}.mp4'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{C}h{cid}.mp4', '-vf', f, '-an', '-c:v', 'libx264', '-crf', '12', '-pix_fmt', 'yuv420p', p], check=True)
    parts.append(p); print(k, cid, n, flush=True)
open(f'{OUT}list.txt', 'w').write(''.join(f"file '{p}'\n" for p in parts))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', f'{OUT}list.txt', '-vf', GRADE, '-c:v', 'libx264', '-crf', '12', '-pix_fmt', 'yuv420p', f'{OUT}reel.mp4'], check=True)
os.makedirs(f'{OUT}f', exist_ok=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{OUT}reel.mp4', '-q:v', '2', f'{OUT}f/%04d.jpg'], check=True)
print('frames', len(os.listdir(f'{OUT}f')))
