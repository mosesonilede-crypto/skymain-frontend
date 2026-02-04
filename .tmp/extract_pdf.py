import fitz
from pathlib import Path
pdf_path = Path(r"C:\\Users\\moses\\OneDrive\\Documents\\frontend\\SkyMaintain Design.pdf")
output_dir = Path(r"C:\\Users\\moses\\OneDrive\\Documents\\frontend\\public\\_design_extract")
output_dir.mkdir(parents=True, exist_ok=True)

with fitz.open(pdf_path) as doc:
    print("pages", doc.page_count)
    for i in range(doc.page_count):
        page = doc[i]
        text = page.get_text("text")
        (output_dir / f"page_{i+1}.txt").write_text(text, encoding="utf-8")
        pix = page.get_pixmap(matrix=fitz.Matrix(2,2), alpha=False)
        img_path = output_dir / f"page_{i+1}.png"
        pix.save(img_path)
        print("saved", img_path)
