import shutil
from PIL import Image
import numpy as np

for filename in ['groom_clean_outline.png', 'bride_clean_outline.png', 'groom_outline_clean.png', 'bride_outline_clean.png']:
    filepath = f"public/images/{filename}"
    try:
        img = Image.open(filepath).convert("RGBA")
        # Keep backup if not exists
        backup_path = f"public/images/{filename}.gold.bak"
        try:
            shutil.copyfile(filepath, backup_path)
        except Exception:
            pass

        data = np.array(img)
        # data has shape (H, W, 4): R, G, B, A
        # Set R, G, B to 255 for all pixels, keeping original alpha
        data[..., 0] = 255
        data[..., 1] = 255
        data[..., 2] = 255
        # Keep alpha unchanged

        out_img = Image.fromarray(data, mode="RGBA")
        out_img.save(filepath, format="PNG")
        print(f"Successfully converted {filename} to pure white lines.")
    except Exception as e:
        print(f"Error processing {filename}: {e}")
