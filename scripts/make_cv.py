"""Génère les CV PDF (fr, en, tr) à partir de content/cv-data.json (source unique).

Usage : py -3.11 scripts/make_cv.py
Dépendances : reportlab, pypdf, pillow (pip install --user reportlab pypdf pillow)

// relecture native à faire : la version turque (clé "tr" de cv-data.json)
"""
import io
import json
from datetime import date
from pathlib import Path
from xml.sax.saxutils import escape

from PIL import Image
from pypdf import PdfReader
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate, Frame, FrameBreak, HRFlowable, KeepInFrame, PageTemplate, Paragraph, Spacer, Table, TableStyle,
)

ROOT = Path(__file__).resolve().parent.parent
DATA = json.loads((ROOT / 'content' / 'cv-data.json').read_text(encoding='utf-8'))
OUT = ROOT / 'public' / 'cv'
PORTRAIT = ROOT / 'public' / 'portrait.jpg'

NAVY = HexColor('#0b1f4d')
GOLD = HexColor('#c8901f')
GOLD_TEXT = HexColor('#8a5d0a')  # or assombri : reste lisible en noir et blanc
INK = HexColor('#0b1530')
MUTED = HexColor('#44506e')
SOFT = HexColor('#dfe5f2')

PAGE_W, PAGE_H = A4
MARGIN = 14 * mm
BAND_H = 47 * mm
BODY_TOP = PAGE_H - BAND_H - 6 * mm
BOTTOM = 9 * mm
CONTENT_W = PAGE_W - 2 * MARGIN
LEFT_W = 58 * mm
GAP = 8 * mm
RIGHT_W = CONTENT_W - LEFT_W - GAP

FONT_CANDIDATES = [
    (r'C:\Windows\Fonts\arial.ttf', r'C:\Windows\Fonts\arialbd.ttf'),
    (r'C:\Windows\Fonts\segoeui.ttf', r'C:\Windows\Fonts\segoeuib.ttf'),
    ('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'),
]


def register_fonts() -> tuple[str, str]:
    for regular, bold in FONT_CANDIDATES:
        if Path(regular).exists() and Path(bold).exists():
            pdfmetrics.registerFont(TTFont('CV', regular))
            pdfmetrics.registerFont(TTFont('CV-Bold', bold))
            pdfmetrics.registerFontFamily('CV', normal='CV', bold='CV-Bold', italic='CV', boldItalic='CV-Bold')
            return 'CV', 'CV-Bold'
    raise SystemExit('Aucune police TrueType compatible turc trouvée.')


FONT, BOLD = register_fonts()


def portrait_image() -> ImageReader:
    """Recadre le portrait sur le visage (carré) ; le clip en cercle se fait au dessin."""
    img = Image.open(PORTRAIT).convert('RGB')
    cx, cy, half = 530, 790, 370
    crop = img.crop((cx - half, cy - half, cx + half, cy + half)).resize((480, 480), Image.LANCZOS)
    buf = io.BytesIO()
    crop.save(buf, 'JPEG', quality=92)
    buf.seek(0)
    return ImageReader(buf)


PHOTO = portrait_image()


def fmt_date(iso: str, mode: str) -> str:
    y, m, d = (int(x) for x in iso.split('-'))
    return date(y, m, d).strftime('%Y-%m-%d') if mode == 'iso' else f'{d:02d}/{m:02d}/{y}'


def styles(scale: float) -> dict[str, ParagraphStyle]:
    base = 8.6 * scale
    return {
        'h': ParagraphStyle('h', fontName=BOLD, fontSize=8.8 * scale, leading=11 * scale, textColor=NAVY,
                            spaceBefore=6 * scale, spaceAfter=1 * scale),
        'body': ParagraphStyle('body', fontName=FONT, fontSize=base, leading=base * 1.36, textColor=INK),
        'small': ParagraphStyle('small', fontName=FONT, fontSize=base - 0.9 * scale, leading=(base - 0.9 * scale) * 1.36,
                                textColor=MUTED),
        'item': ParagraphStyle('item', fontName=FONT, fontSize=base, leading=base * 1.36, textColor=INK,
                               spaceAfter=2.2 * scale),
        'period': ParagraphStyle('period', fontName=BOLD, fontSize=base - 0.6 * scale, leading=base * 1.36,
                                 textColor=GOLD_TEXT),
        'cert': ParagraphStyle('cert', fontName=FONT, fontSize=base - 1.2 * scale, leading=(base - 1.2 * scale) * 1.38,
                               textColor=INK),
        'certlabel': ParagraphStyle('certlabel', fontName=BOLD, fontSize=base - 1.0 * scale,
                                    leading=(base - 1.0 * scale) * 1.38, textColor=NAVY),
    }


def heading(text: str, st: dict[str, ParagraphStyle], width: float) -> list:
    return [
        Paragraph(escape(text.upper()), st['h']),
        HRFlowable(width=width, thickness=1.3, color=GOLD, spaceAfter=3, hAlign='LEFT'),
    ]


def draw_header(c, locale_data: dict) -> None:
    c.saveState()
    c.setFillColor(NAVY)
    c.rect(0, PAGE_H - BAND_H, PAGE_W, BAND_H, stroke=0, fill=1)
    c.setFillColor(GOLD)
    c.rect(0, PAGE_H - BAND_H - 1.6 * mm, PAGE_W, 1.6 * mm, stroke=0, fill=1)

    top = PAGE_H - 9 * mm
    c.setFillColor(white)
    c.setFont(BOLD, 25)
    c.drawString(MARGIN, top - 17, DATA['name'])
    c.setFillColor(HexColor('#e8b24a'))
    c.setFont(BOLD, 10.2)
    c.drawString(MARGIN, top - 33, locale_data['title'])

    c.setFillColor(SOFT)
    c.setFont(FONT, 9.2)
    lines = [
        [(DATA['location'], None), (DATA['email'], 'mailto:' + DATA['email'])],
        [(DATA['linkedinLabel'], DATA['linkedin']), (DATA['githubLabel'], DATA['github'])],
        [(DATA['portfolioLabel'], DATA['portfolio'])],
    ]
    y = top - 51
    for parts in lines:
        x = MARGIN
        for i, (label, url) in enumerate(parts):
            if i:
                c.drawString(x, y, '  ·  ')
                x += pdfmetrics.stringWidth('  ·  ', FONT, 9.2)
            c.drawString(x, y, label)
            w = pdfmetrics.stringWidth(label, FONT, 9.2)
            if url:
                c.linkURL(url, (x, y - 2, x + w, y + 8), relative=0, thickness=0)
            x += w
        y -= 13

    diameter = 35 * mm
    cx = PAGE_W - MARGIN - diameter / 2
    cy = PAGE_H - BAND_H / 2
    c.saveState()
    path = c.beginPath()
    path.circle(cx, cy, diameter / 2)
    c.clipPath(path, stroke=0, fill=0)
    c.drawImage(PHOTO, cx - diameter / 2, cy - diameter / 2, diameter, diameter)
    c.restoreState()
    c.setStrokeColor(GOLD)
    c.setLineWidth(2.2)
    c.circle(cx, cy, diameter / 2, stroke=1, fill=0)
    c.restoreState()


def build(locale: str, scale: float) -> bytes:
    c = DATA['locales'][locale]
    st = styles(scale)
    h = c['headings']

    left: list = []
    left += heading(h['skills'], st, LEFT_W) + [Paragraph(escape(s), st['item']) for s in c['skills']]
    left += heading(h['tools'], st, LEFT_W) + [Paragraph(escape(', '.join(DATA['tools'])), st['body'])]
    left += heading(h['languages'], st, LEFT_W) + [Paragraph(escape(s), st['item']) for s in c['languages']]
    left += heading(h['education'], st, LEFT_W) + [Paragraph(escape(c['education']), st['body'])]

    exp_table = Table(
        [[Paragraph(escape(e['period']), st['period']), Paragraph(escape(e['text']), st['body'])]
         for e in c['experience']],
        colWidths=[34 * mm, None],
    )
    exp_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 1), ('BOTTOMPADDING', (0, 0), (-1, -1), 1.5),
    ]))

    right: list = []
    right += heading(h['profile'], st, RIGHT_W) + [Paragraph(escape(c['profile']), st['body'])]
    right += heading(h['projects'], st, RIGHT_W)
    right += [Paragraph(f"<b>{escape(p['name'])}</b> — {escape(p['text'])}", st['item']) for p in c['projectsList']]
    right += heading(h['experience'], st, RIGHT_W) + [exp_table]

    mode = c['dateFormat']
    cert_rows = []
    for group in DATA['certificationGroups']:
        text = ' · '.join(
            f"{escape(i['title'])} ({fmt_date(i['date'], mode)})" for i in group['items']
        )
        cert_rows.append([Paragraph(escape(c['certGroupLabels'][group['id']]), st['certlabel']),
                          Paragraph(text, st['cert'])])
    cert_table = Table(cert_rows, colWidths=[35 * mm, None])
    cert_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 1), ('BOTTOMPADDING', (0, 0), (-1, -1), 1.5),
    ]))
    certs: list = heading(h['certifications'], st, CONTENT_W) + [Paragraph(escape(c['certNote']), st['small']),
                                                                 Spacer(1, 2), cert_table]
    cert_h = sum(f.wrap(CONTENT_W, 1000)[1] + f.getSpaceBefore() + f.getSpaceAfter() for f in certs) + 2
    cols_bottom = BOTTOM + cert_h + 4 * mm
    col_h = BODY_TOP - cols_bottom

    frames = [
        Frame(MARGIN, cols_bottom, LEFT_W, col_h, 0, 0, 0, 0, id='left'),
        Frame(MARGIN + LEFT_W + GAP, cols_bottom, RIGHT_W, col_h, 0, 0, 0, 0, id='right'),
        Frame(MARGIN, BOTTOM, CONTENT_W, cert_h + 2, 0, 0, 0, 0, id='certs'),
    ]
    buffer = io.BytesIO()
    doc = BaseDocTemplate(buffer, pagesize=A4, title=f"{DATA['name']} - CV", author=DATA['name'],
                          leftMargin=MARGIN, rightMargin=MARGIN, topMargin=0, bottomMargin=0)
    doc.addPageTemplates([PageTemplate(id='cv', frames=frames, onPage=lambda cv, d: draw_header(cv, c))])
    story = [KeepInFrame(LEFT_W, col_h, left, mode='error'), FrameBreak(),
             KeepInFrame(RIGHT_W, col_h, right, mode='error'), FrameBreak(),
             KeepInFrame(CONTENT_W, cert_h + 1, certs, mode='error')]
    doc.build(story)
    return buffer.getvalue()


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for locale in DATA['locales']:
        scale = 1.3
        while True:
            try:
                pdf = build(locale, scale)
                pages = len(PdfReader(io.BytesIO(pdf)).pages)
                if pages == 1:
                    break
            except Exception as exc:  # débordement d'une colonne : on réduit l'échelle
                if 'too large' not in str(exc) and 'KeepInFrame' not in str(exc):
                    raise
            scale -= 0.02
            if scale < 0.8:
                raise SystemExit(f'{locale}: contenu trop long')
        target = OUT / f"Steeve-Donald-Compaore-CV-{locale}.pdf"
        target.write_bytes(pdf)
        print(f'{target.name}: {pages} page(s), echelle {scale:.2f}')


if __name__ == '__main__':
    main()
