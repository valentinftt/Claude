#!/bin/bash
set -e
cd "$(dirname "$0")"
OUT=/home/user/Claude/valin-promo
mkdir -p "$OUT"
printf "file 'seg0.mp4'\nfile 'seg1.mp4'\nfile 'seg2.mp4'\nfile 'seg3.mp4'\n" > segs.txt
ffmpeg -y -loglevel error -f concat -safe 0 -i segs.txt -c copy full60.mp4
# 60 fps -> 30 fps with 2-frame blend (natural motion blur)
ffmpeg -y -loglevel error -i full60.mp4 -vf "tmix=frames=2,fps=30" -c:v libx264 -preset slow -crf 16 -profile:v high -pix_fmt yuv420p -movflags +faststart -an video30.mp4
ffmpeg -y -loglevel error -i video30.mp4 -i music.wav -map 0:v -map 1:a -c:v copy \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11" -ar 48000 -c:a aac -b:a 192k -shortest -movflags +faststart "$OUT/VALIN_Studio_Promo_9x16.mp4"
cp video30.mp4 "$OUT/VALIN_Studio_Promo_9x16_ohne_Ton.mp4"
ffmpeg -y -loglevel error -ss 24.0 -i video30.mp4 -frames:v 1 "$OUT/VALIN_Studio_Cover.png"
ls -la "$OUT"
