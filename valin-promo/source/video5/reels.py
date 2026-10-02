"""Builds three graded 9:16 product reels (720x1280, 30 fps) from Mixkit clips."""
import subprocess, os
B = 60 / 126
C = '/tmp/v5/clips/'
OUT = '/tmp/v5/reels/'
os.makedirs(OUT, exist_ok=True)

# (clip id, source start, speed, crop centre x (0-1), zoom start, zoom end, duration in beats)
REELS = {
    'schmuck': dict(grade="colorbalance=rs=.06:gs=.02:bs=-.07:rm=.04:bm=-.04,eq=contrast=1.12:saturation=1.18:gamma=0.97",
        cuts=[(34611, 0.4, 0.55, 0.55, 1.05, 1.20, 2, 0.68), (20877, 0.6, 0.7, 0.45, 1.28, 1.08, 2), (34424, 1.2, 1.0, 0.5, 1.00, 1.10, 2),
              (34611, 2.6, 0.55, 0.60, 1.22, 1.36, 2, 0.62), (20877, 2.4, 0.6, 0.47, 1.05, 1.22, 2), (34424, 4.0, 0.8, 0.5, 1.12, 1.0, 3)]),
    'mode': dict(grade="colorbalance=bs=.05:rs=-.02:rh=.04:bh=-.03,eq=contrast=1.14:saturation=1.08",
        cuts=[(805, 6.6, 1.0, 0.47, 1.00, 1.12, 2), (35987, 6.9, 0.65, 0.45, 1.12, 1.0, 2),
              (49381, 6.8, 0.9, 0.42, 1.0, 1.1, 2), (805, 10.6, 1.0, 0.47, 1.15, 1.28, 3)]),
    'beauty': dict(grade="colorbalance=rs=.04:bs=.02:rh=.03,eq=contrast=1.04:saturation=1.12:brightness=.02",
        cuts=[(382, 5.2, 0.6, 0.62, 1.10, 1.22, 2), (371, 1.5, 0.75, 0.55, 1.18, 1.05, 2),
              (45160, 0.2, 0.8, 0.45, 1.0, 1.16, 2), (371, 9.0, 0.6, 0.55, 1.05, 1.15, 3)]),
}

def probe(i):
    o = subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', f'{C}h{i}.mp4']).decode().split('\n')[0]
    return map(int, o.split(','))

for name, R in REELS.items():
    parts = []
    acc = 0
    for k, cut in enumerate(R['cuts']):
        cid, ss, sp, cx, z0, z1, beats = cut[:7]
        fy = cut[7] if len(cut) > 7 else 0.5
        n = round((acc + beats) * B * 30) - round(acc * B * 30)
        acc += beats
        dur = n / 30
        W, H = probe(cid)
        if W > H:
            cw = int(H * 9 / 16) // 2 * 2
            x = int(min(max(cx * W - cw / 2, 0), W - cw))
            crop = f'crop={cw}:{H}:{x}:0,'
        else:
            crop = ''
        src_len = dur * sp + 0.2
        f = (f"trim=start={ss}:duration={src_len},setpts=PTS-STARTPTS,setpts=PTS/{sp},"
             f"minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:vsbmc=1," if sp < 1 else
             f"trim=start={ss}:duration={src_len},setpts=PTS-STARTPTS,fps=30,")
        f += (f"{crop}scale=1080:1920:flags=lanczos,"
              f"zoompan=z='{z0}+({z1}-{z0})*on/{n}':x='iw/2-(iw/zoom/2)':y='min(max(ih*{fy}-(ih/zoom/2),0),ih-ih/zoom)':d=1:s=720x1280:fps=30,"
              f"trim=end_frame={n},setpts=PTS-STARTPTS")
        p = f'{OUT}{name}_{k}.mp4'
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{C}h{cid}.mp4', '-vf', f, '-an', '-c:v', 'libx264', '-crf', '12', '-pix_fmt', 'yuv420p', p], check=True)
        parts.append(p)
        print(name, k, cid, n)
    lst = f'{OUT}{name}.txt'
    open(lst, 'w').write(''.join(f"file '{p}'\n" for p in parts))
    g = R['grade'] + ",vignette=angle=PI/5:mode=forward,unsharp=5:5:0.5,noise=alls=5:allf=t"
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-vf', g, '-c:v', 'libx264', '-crf', '12', '-pix_fmt', 'yuv420p', f'{OUT}{name}.mp4'], check=True)
    # frames for the HTML compositor
    fd = f'{OUT}{name}_f'
    os.makedirs(fd, exist_ok=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{OUT}{name}.mp4', '-q:v', '2', f'{fd}/%04d.jpg'], check=True)
    print(name, 'frames', len(os.listdir(fd)))
