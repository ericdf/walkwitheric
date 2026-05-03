import os
from PIL import Image

SOURCE_DIR = "images.org"
DEST_DIR = "src/assets/images"
CROP_FILE = os.path.join(SOURCE_DIR, "crops")

os.makedirs(DEST_DIR, exist_ok=True)

with open(CROP_FILE, "r") as f:
    for line in f:
        if ":" not in line: continue
        
        filename, coords = line.split(":")
        w, h, x, y = map(int, coords.strip().split())
        
        img_path = os.path.join(SOURCE_DIR, filename.strip())
        if os.path.exists(img_path):
            with Image.open(img_path) as img:
                # Convert to RGB (removes Alpha/CMYK issues)
                img = img.convert("RGB")
                # Crop: (left, top, right, bottom)
                cropped = img.crop((x, y, x + w, y + h))
                # Scale to 500px width, maintaining aspect ratio
                aspect_ratio = h / w
                new_h = int(500 * aspect_ratio)
                final = cropped.resize((500, new_h), Image.Resampling.LANCZOS)
                
                final.save(os.path.join(DEST_DIR, filename.strip()), "JPEG", quality=90)
                print(f"Processed {filename} -> 500x{new_h}")
