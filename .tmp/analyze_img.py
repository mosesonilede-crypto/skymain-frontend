from PIL import Image
from pathlib import Path
img_path = Path(r"C:\\Users\\moses\\OneDrive\\Documents\\frontend\\public\\_design_extract\\page_1.png")
img = Image.open(img_path)
print("size", img.size)
# sample colors
small = img.resize((64,64))
colors = small.getcolors(64*64)
colors = sorted(colors, key=lambda x: -x[0])[:10]
print("top colors", colors)
