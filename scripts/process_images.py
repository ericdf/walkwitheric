import os
import subprocess

SOURCE_DIR = "images.org"
DEST_DIR = "src/images"
CROP_FILE = os.path.join(SOURCE_DIR, "crops")

os.makedirs(DEST_DIR, exist_ok=True)


def magick(src, out, quality, extra_args=None):
    cmd = ["magick", src] + (extra_args or []) + ["-quality", str(quality), out]
    subprocess.run(cmd, check=True)


# ── Phase 1: Cropped tour card images ─────────────────────────────────────
with open(CROP_FILE, "r") as f:
    for line in f:
        if ":" not in line:
            continue
        filename, coords = line.split(":")
        w, h, x, y = map(int, coords.strip().split())
        filename = filename.strip()

        img_path = os.path.join(SOURCE_DIR, filename)
        if not os.path.exists(img_path):
            print(f"Missing source: {img_path}")
            continue

        stem = os.path.splitext(filename)[0]
        crop_args = ["-crop", f"{w}x{h}+{x}+{y}", "+repage", "-resize", "500x"]

        for ext, quality in [(".jpg", 90), (".webp", 85)]:
            out_path = os.path.join(DEST_DIR, stem + ext)
            magick(img_path, out_path, quality, crop_args)
            print(f"Cropped  {filename} → {stem + ext}")


# ── Phase 2: Static images from originals ─────────────────────────────────
STATIC_IMAGES = [
    ("eric.png", "400x"),
    ("latm-front-cover.jpg", "300x"),
    ("komorebi_logo.jpg", "240x"),
]
for filename, resize in STATIC_IMAGES:
    img_path = os.path.join(SOURCE_DIR, filename)
    if not os.path.exists(img_path):
        print(f"Missing source: {img_path}")
        continue
    stem = os.path.splitext(filename)[0]
    out_path = os.path.join(DEST_DIR, stem + ".webp")
    magick(img_path, out_path, 85, ["-resize", resize])
    print(f"Converted {filename} → {stem}.webp")


# ── Phase 3: Tour location/map images → WebP ──────────────────────────────
TOURS_DIR = os.path.join(DEST_DIR, "tours")
for fname in sorted(os.listdir(TOURS_DIR)):
    ext = os.path.splitext(fname)[1].lower()
    if ext not in (".jpg", ".jpeg", ".png"):
        continue
    src = os.path.join(TOURS_DIR, fname)
    stem = os.path.splitext(fname)[0]
    out = os.path.join(TOURS_DIR, stem + ".webp")
    magick(src, out, 85)
    print(f"Converted tours/{fname} → {stem}.webp")
