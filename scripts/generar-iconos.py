"""Genera los íconos de la app instalable (PNG). Uso: python scripts/generar-iconos.py

Necesita Pillow (pip install pillow). Los PNG resultantes se guardan en el repositorio, así que
solo hay que volver a ejecutar este script si cambia el diseño.
"""
import os
from PIL import Image, ImageDraw, ImageFont

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONDO = (28, 25, 23)  # #1c1917
TEXTO = (250, 250, 249)  # #fafaf9
ACENTO = (245, 158, 11)  # #f59e0b, ámbar neutro (sin colores de partidos)
SUPER = 4  # se dibuja a 4x y se reduce, para bordes suaves

FUENTES = [
    r"C:\Windows\Fonts\arialbd.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
]


def fuente(px):
    for ruta in FUENTES:
        if os.path.exists(ruta):
            return ImageFont.truetype(ruta, px)
    raise SystemExit("No encontré una fuente en negrita; edita FUENTES en este script.")


def icono(tamano, esquinas, zona):
    """esquinas: radio relativo (0 = cuadrado completo). zona: parte del lado que usa el contenido."""
    n = tamano * SUPER
    img = Image.new("RGBA", (n, n), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if esquinas:
        d.rounded_rectangle([0, 0, n - 1, n - 1], radius=int(n * esquinas), fill=FONDO)
    else:
        d.rectangle([0, 0, n, n], fill=FONDO)

    lado = n * zona
    f = fuente(int(lado * 0.50))
    caja = d.textbbox((0, 0), "AC", font=f)
    ancho, alto = caja[2] - caja[0], caja[3] - caja[1]
    barra_h = int(lado * 0.055)
    hueco = int(lado * 0.07)
    total = alto + hueco + barra_h
    x = (n - ancho) / 2 - caja[0]
    y = (n - total) / 2 - caja[1]
    d.text((x, y), "AC", font=f, fill=TEXTO)
    by = (n - total) / 2 + alto + hueco
    bw = int(ancho * 0.62)
    d.rounded_rectangle([(n - bw) / 2, by, (n + bw) / 2, by + barra_h], radius=barra_h // 2, fill=ACENTO)
    return img.resize((tamano, tamano), Image.LANCZOS)


SALIDAS = [
    ("public/icons/icon-192.png", 192, 0.22, 0.62),  # "any": esquinas redondeadas
    ("public/icons/icon-512.png", 512, 0.22, 0.62),
    ("public/icons/icon-maskable-512.png", 512, 0, 0.50),  # "maskable": cuadrado completo, contenido en zona segura
    ("app/apple-icon.png", 180, 0, 0.62),  # iOS aplica sus propias esquinas
]

for ruta, tam, esq, zona in SALIDAS:
    destino = os.path.join(RAIZ, ruta)
    os.makedirs(os.path.dirname(destino), exist_ok=True)
    icono(tam, esq, zona).save(destino, optimize=True)
    print(f"{ruta}  {tam}x{tam}  {os.path.getsize(destino)} bytes")
