#!/usr/bin/env python3
"""Render Talby educational carousel slides to 1080x1920 PNG using PIL text compositing.
Crisp typography, calm Talby aesthetic. No AI image generation for text slides."""
import os
import sys
from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from carousel_content import SLIDES

W, H = 1080, 1920
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)))
BG = (12, 15, 20)          # deep calm near-black
PANEL = (20, 26, 35)
HEAD = (245, 246, 247)     # off-white headline
BODY = (178, 186, 196)     # soft light body
DIM = (110, 118, 128)
ACCENT = (167, 139, 250)   # calm violet
MINT = (141, 208, 190)
FONT_DIR = "/System/Library/Fonts"

def font(size, path="SFCompact.ttf"):
    return ImageFont.truetype(os.path.join(FONT_DIR, path), size)

def font_semibold(size):
    return ImageFont.truetype(os.path.join(FONT_DIR, "SFCompact.ttf"), size)

def wrap(draw, text, fnt, max_w):
    words = text.split(" ")
    lines, cur = [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if draw.textbbox((0, 0), t, font=fnt)[2] <= max_w:
            cur = t
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines

def draw_bg(d):
    d.rectangle([0, 0, W, H], fill=BG)

def render_text_slide(idx, s):
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    draw_bg(d)
    # top tag
    f_tag = font(30)
    tag = "TALBY  /\u00a0tracking without a spreadsheet"
    d.text((56, 60), tag, font=f_tag, fill=DIM)
    # slide marker
    marker = f"{idx+1} / {len(SLIDES)}"
    d.text((W - 56 - d.textbbox((0,0), marker, font=f_tag)[2], 60), marker, font=f_tag, fill=DIM)

    # headline
    f_head = font(78)
    head_lines = wrap(d, s["headline"], f_head, W - 112)
    x, y = 56, 260
    for ln in head_lines:
        d.text((x, y), ln, font=f_head, fill=HEAD)
        y += 96

    y += 70  # gap
    # body bullets
    f_body = font(52)
    bullet_gap = 84
    for b in s["body"]:
        for bln in wrap(d, b, f_body, W - 150):
            d.ellipse([72, y-2, 96, y+30], fill=ACCENT)
            d.text((120, y), bln, font=f_body, fill=BODY)
            y += 72
        y += bullet_gap - 72 + 12
    text_bottom = y

    if s.get("bridge"):
        # real product screenshot on bridge slide, positioned below text dynamically
        shot = os.path.join(os.path.dirname(OUT), "ad", "sc3_overview.png")
        shot_h = 660
        shot_top = text_bottom + 100
        if os.path.exists(shot):
            sc = Image.open(shot).convert("RGB")
            scw = int(sc.width * (shot_h / sc.height))
            sc = sc.resize((scw, shot_h), Image.Resampling.LANCZOS)
            sx = (W - scw) // 2
            sy = shot_top
            d.rounded_rectangle([sx-40, sy-40, sx+scw+40, sy+shot_h+40], radius=36, fill=PANEL, outline=(45,55,70))
            img.paste(sc, (sx, sy))
            # url bar
            url = s.get("show_url", "www.talby.io")
            f_url = font(54)
            uy = sy + shot_h + 60
            ubox = d.textbbox((0,0), url, font=f_url)
            uw = ubox[2]-ubox[0]+110
            d.rounded_rectangle([(W-uw)//2, uy-16, (W-uw)//2+uw, uy+84], radius=40, fill=(30,38,50))
            d.text(((W-uw)//2+30, uy+8), url, font=f_url, fill=HEAD)
        else:
            url = s.get("show_url", "www.talby.io")
            f_url = font(56)
            d.text(((W - d.textbbox((0,0), url, font=f_url)[2])//2, H-320), url, font=f_url, fill=HEAD)

    return img

def main():
    marker = "talby_edu" + "_" + "spreadsheet"
    paths = []
    for i, s in enumerate(SLIDES):
        img = render_text_slide(i, s)
        p = os.path.join(OUT, f"{marker}_{i+1:02d}.png")
        img.save(p, "PNG")
        paths.append(p)
        print(p, img.size)
    print("RENDERED", len(paths))

if __name__ == "__main__":
    main()