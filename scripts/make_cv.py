"""Génère les CV PDF (fr, en, tr) à partir de content/cv-data.json.

Usage : py -3.11 scripts/make_cv.py
Dépendances : reportlab, pypdf (pip install --user reportlab pypdf)

// relecture native à faire : la version turque (clé "tr" de cv-data.json)
"""
import io
import json
from pathlib import Path

from pypdf import PdfReader
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import HRFlowable, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parent.parent
DATA = json.loads((ROOT / 'content' / 'cv-data.json').read_text(encoding='utf-8'))
OUT = ROOT / 'public' / 'cv'

GOLD = HexColor('#c07d10')
INK = HexColor('#0c1528')
MUTED = HexColor('#4e5f82')

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
            return 'CV', 'CV-Bold'
    raise SystemExit('Aucune police TrueType compatible turc trouvée.')


FONT, BOLD = register_fonts()


def styles(scale: float) -> dict[str, ParagraphStyle]:
    base = 9.2 * scale
    return {
        'name': ParagraphStyle('name', fontName=BOLD, fontSize=22 * scale, leading=26 * scale, textColor=INK),
        'title': ParagraphStyle('title', fontName=BOLD, fontSize=10.5 * scale, leading=14 * scale, textColor=GOLD),
        'contact': ParagraphStyle('contact', fontName=FONT, fontSize=8.6 * scale, leading=12 * scale, textColor=MUTED),
        'h': ParagraphStyle('h', fontName=BOLD, fontSize=9.4 * scale, leading=12 * scale, textColor=GOLD,
                            spaceBefore=7 * scale, spaceAfter=1.5 * scale),
        'body': ParagraphStyle('body', fontName=FONT, fontSize=base, leading=base * 1.38, textColor=INK, alignment=TA_LEFT),
        'period': ParagraphStyle('period', fontName=BOLD, fontSize=base - 0.4 * scale, leading=base * 1.38, textColor=MUTED),
    }


def heading(text: str, st: dict[str, ParagraphStyle]) -> list:
    return [
        Paragraph(escape(text.upper()), st['h']),
        HRFlowable(width='100%', thickness=0.6, color=GOLD, spaceAfter=3),
    ]


def rows(items: list[dict[str, str]], st: dict[str, ParagraphStyle], first_w: float) -> Table:
    table = Table(
        [[Paragraph(escape(i['period']), st['period']), Paragraph(escape(i['text']), st['body'])] for i in items],
        colWidths=[first_w, None],
    )
    table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 1),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 1),
    ]))
    return table


def link(url: str, label: str) -> str:
    return f'<a href="{escape(url)}" color="#0c1528">{escape(label)}</a>'


def build(locale: str, scale: float) -> bytes:
    c = DATA['locales'][locale]
    st = styles(scale)
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=A4, leftMargin=16 * mm, rightMargin=16 * mm, topMargin=13 * mm, bottomMargin=12 * mm,
        title=f"{DATA['name']} - CV", author=DATA['name'],
    )
    h = c['headings']
    story: list = [
        Paragraph(escape(DATA['name']), st['name']),
        Paragraph(escape(c['title']), st['title']),
        Spacer(1, 3 * scale),
        Paragraph(
            ' · '.join([
                escape(DATA['location']),
                link('mailto:' + DATA['email'], DATA['email']),
                link(DATA['linkedin'], DATA['linkedinLabel']),
                link(DATA['github'], DATA['githubLabel']),
            ]),
            st['contact'],
        ),
    ]
    story += heading(h['profile'], st) + [Paragraph(escape(c['profile']), st['body'])]
    story += heading(h['skills'], st) + [Paragraph('• ' + escape(s), st['body']) for s in c['skills']]
    story += heading(h['projects'], st)
    story += [Paragraph(f"<b>{escape(p['name'])}</b> — {escape(p['text'])}", st['body']) for p in c['projects']]
    story += heading(h['education'], st) + [rows(c['education'], st, 32 * mm)]
    story += heading(h['languages'], st) + [Paragraph(escape(c['languages']), st['body'])]
    story += heading(h['experience'], st) + [rows(c['experience'], st, 32 * mm)]
    doc.build(story)
    return buffer.getvalue()


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for locale in DATA['locales']:
        scale = 1.0
        while True:
            pdf = build(locale, scale)
            pages = len(PdfReader(io.BytesIO(pdf)).pages)
            if pages == 1 or scale < 0.7:
                break
            scale -= 0.03
        target = OUT / f"Steeve-Donald-Compaore-CV-{locale}.pdf"
        target.write_bytes(pdf)
        print(f'{target.name}: {pages} page(s), echelle {scale:.2f}')


if __name__ == '__main__':
    main()
