import sys
import os
from PIL import Image

def process_image(filename, w, h, x, y, target_w=500):
    try:
        with Image.open(filename) as img:
            # GIMP gives Top-Left Origin (x, y) and Size (w, h)
            # PIL crop needs: (left, top, right, bottom)
            left = x
            top = y
            right = x + w
            bottom = y + h
            
            # 1. Perform the crop
            cropped_img = img.crop((left, top, right, bottom))
            
            # 2. Calculate height to maintain aspect ratio
            aspect_ratio = h / w
            target_h = int(target_w * aspect_ratio)
            
            # 3. Scale to target width
            final_img = cropped_img.resize((target_w, target_h), Image.Resampling.LANCZOS)
            
            # 4. Save
            output_name = f"final_{os.path.basename(filename)}"
            # Convert to RGB to strip out transparency (Alpha channel)
            final_img = final_img.convert("RGB")
            final_img.save(output_name, quality=95)
            print(f"Success! Saved as {output_name} ({target_w}x{target_h})")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    # Usage: python3 process_one.py image.jpg 458 554 229 292
    if len(sys.argv) < 6:
        print("Usage: python3 process_one.py [file] [width] [height] [origin_x] [origin_y]")
    else:
        file = sys.argv[1]
        width = int(sys.argv[2])
        height = int(sys.argv[3])
        ox = int(sys.argv[4])
        oy = int(sys.argv[5])
        process_image(file, width, height, ox, oy)
