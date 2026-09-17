import os
from PIL import Image, ImageDraw, ImageFont

W, H = 1440, 900
img = Image.new("RGBA", (W, H), (28, 4, 11, 255))
draw = ImageDraw.Draw(img)

# Radial gradient background
for r in range(W // 2, 0, -5):
    alpha = int(255 * (r / (W // 2)))
    color = (46, 8, 19, alpha)
    draw.ellipse([W//2 - r, H//2 - r, W//2 + r, H//2 + r], fill=color)

# Load hand heart clean outline
hand_path = "public/images/hand_heart_clean_outline.png"
if os.path.exists(hand_path):
    hand_img = Image.open(hand_path).convert("RGBA")
    # scale to fit max-height ~ 580px
    hw, hh = hand_img.size
    scale = min(960 / hw, 560 / hh)
    nw, nh = int(hw * scale), int(hh * scale)
    hand_resized = hand_img.resize((nw, nh), Image.Resampling.LANCZOS)
    hx = (W - nw) // 2
    hy = (H - nh) // 2 - 50
    img.paste(hand_resized, (hx, hy), hand_resized)

# Center of heart opening ~ hx + nw * 0.49, hy + nh * 0.48
cx = int(hx + nw * 0.49)
cy = int(hy + nh * 0.48)

try:
    font_large = ImageFont.truetype("georgia.ttf", 68)
    font_day = ImageFont.truetype("arialbd.ttf", 16)
    font_month = ImageFont.truetype("arialbd.ttf", 11)
    font_btn = ImageFont.truetype("arialbd.ttf", 14)
except Exception:
    font_large = font_day = font_month = font_btn = ImageFont.load_default()

# Date inside heart
draw.text((cx, cy - 35), "26", font=font_large, fill=(255, 235, 160), anchor="mm")
draw.text((cx, cy + 18), "THURSDAY", font=font_day, fill=(255, 255, 255), anchor="mm")
draw.text((cx, cy + 38), "NOVEMBER 2026", font=font_month, fill=(212, 175, 55), anchor="mm")
draw.text((cx, cy + 58), "[ ✦ TAP TO SAVE ✦ ]", font=font_month, fill=(255, 230, 140), anchor="mm")

# Dedicated Button below hand heart
btn_w, btn_h = 280, 46
btn_x = (W - btn_w) // 2
btn_y = hy + nh + 16

# Draw button pill
draw.rounded_rectangle([btn_x, btn_y, btn_x + btn_w, btn_y + btn_h], radius=23, fill=(120, 16, 38, 220), outline=(255, 225, 140, 255), width=2)
draw.text((W // 2, btn_y + btn_h // 2), "📅  SAVE TO CALENDAR", font=font_btn, fill=(255, 250, 230), anchor="mm")

# Explore hint below button
draw.text((W // 2, btn_y + btn_h + 24), "EXPLORE INVITATION ▾", font=font_month, fill=(255, 235, 185, 200), anchor="mm")

out_path = "scratch/layout_verification.png"
img.save(out_path)
print("Saved to", out_path)
