#!/usr/bin/env python3
"""Generate ASCII art for the hero section from context/assets/hero_source.jpg.

Writes:
- content/heroAscii.txt

Design goals:
- Deterministic output
- Looks good in a <pre> with small font
- Fits roughly in the left terminal pane

Usage:
  python3 scripts/generate_hero_ascii.py

Optional:
  HERO_SRC=path/to/image.jpg python3 scripts/generate_hero_ascii.py
"""

import os
from pathlib import Path

from PIL import Image, ImageOps, ImageEnhance

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SRC = ROOT / "context" / "assets" / "hero_source.jpg"
OUT_PATH = ROOT / "content" / "heroAscii.txt"

# Output mode:
# - "dot": single-character stipple (reference-style: same glyph everywhere, just density)
# - "ramp": classic ASCII ramp with Floyd–Steinberg dithering
# - "braille": very high resolution using Unicode braille (2x4 pixels per char)
# - "blocks": shaded blocks (lower detail, very compatible)
MODE = os.environ.get("ASCII_MODE", "dot")

# Ramps (dark → light)
# Default ramp tuned to avoid heavy '@' blocks; more dotty/halftone feel.
# You can override via ASCII_RAMP env var.
RAMP_CLASSIC = os.environ.get("ASCII_RAMP", " .,:;i1tfLCG08#")
RAMP_BLOCKS = "█▓▒░ "


def _prep_grayscale(img: Image.Image) -> Image.Image:
    img = ImageOps.exif_transpose(img)
    img = img.convert("L")
    img = ImageOps.autocontrast(img, cutoff=1)

    # Tuning for face clarity: boost contrast + slight sharpening, then lift mids.
    img = ImageEnhance.Contrast(img).enhance(1.45)
    img = ImageEnhance.Sharpness(img).enhance(1.25)
    img = ImageEnhance.Brightness(img).enhance(1.10)

    # Mild gamma lift (brighten midtones) to avoid an over-inked portrait.
    gamma = float(os.environ.get("ASCII_GAMMA", "0.90"))  # <1 brightens
    inv_gamma = 1.0 / max(0.01, gamma)
    img = img.point(lambda p: int(((p / 255.0) ** inv_gamma) * 255))

    # If ASCII_INVERT=1, swap light/dark so background becomes "ink" and
    # the subject becomes hollow/negative-space.
    invert = os.environ.get("ASCII_INVERT", "0") in ("1", "true", "yes", "on")
    if invert:
        img = ImageOps.invert(img)

    return img


def image_to_ascii_blocks(img: Image.Image, width_chars: int = 70) -> str:
    """Shaded-block ASCII (lower detail, very compatible)."""
    img = _prep_grayscale(img)

    aspect_correction = 0.55
    w, h = img.size
    target_w = max(20, int(width_chars))
    target_h = max(10, int((h / w) * target_w * aspect_correction))

    img = img.resize((target_w, target_h), resample=Image.BICUBIC)

    pixels = list(img.getdata())
    lines = []
    for y in range(target_h):
        row = pixels[y * target_w : (y + 1) * target_w]
        s = "".join(RAMP_BLOCKS[int((p / 255) * (len(RAMP_BLOCKS) - 1))] for p in row)
        lines.append(s)

    return "\n".join(lines)


def _resize_for_text(img: Image.Image, width_chars: int) -> Image.Image:
    # Characters are taller than wide.
    aspect_correction = 0.55
    w, h = img.size
    target_w = max(40, int(width_chars))
    target_h = max(20, int((h / w) * target_w * aspect_correction))
    return img.resize((target_w, target_h), resample=Image.LANCZOS)


def _fs_dither_to_palette(buf, palette_vals):
    """Floyd–Steinberg dithering on a 2D float buffer.

    palette_vals: list of allowed output intensities (0..255).
    Returns (indices, out_vals)
    """
    h = len(buf)
    w = len(buf[0]) if h else 0

    def nearest(v):
        return min(palette_vals, key=lambda pv: abs(pv - v))

    out = [[0.0] * w for _ in range(h)]
    for y in range(h):
        for x in range(w):
            old = buf[y][x]
            new = nearest(old)
            out[y][x] = new
            err = old - new
            if x + 1 < w:
                buf[y][x + 1] += err * 7 / 16
            if y + 1 < h:
                if x > 0:
                    buf[y + 1][x - 1] += err * 3 / 16
                buf[y + 1][x] += err * 5 / 16
                if x + 1 < w:
                    buf[y + 1][x + 1] += err * 1 / 16
    return out


def image_to_ascii_dot(img: Image.Image, width_chars: int = 110) -> str:
    """Single-glyph stippling using dithering.

    Uses one character (default '.') and space; density encodes brightness.
    """
    img = _prep_grayscale(img)
    img = _resize_for_text(img, width_chars)

    dot = os.environ.get("ASCII_DOT_CHAR", ".")

    # float buffer
    w, h = img.size
    buf = [[float(img.getpixel((x, y))) for x in range(w)] for y in range(h)]

    # Two-level palette: black(0) or white(255)
    dithered = _fs_dither_to_palette(buf, [0.0, 255.0])

    # Map: black -> dot, white -> space
    lines = []
    for y in range(h):
        row = dithered[y]
        s = "".join(dot if v < 128 else " " for v in row)
        lines.append(s.rstrip())

    return "\n".join(lines)


def image_to_ascii_ramp(img: Image.Image, width_chars: int = 110) -> str:
    """Classic ASCII ramp with Floyd–Steinberg dithering."""
    img = _prep_grayscale(img)
    img = _resize_for_text(img, width_chars)

    w, h = img.size
    buf = [[float(img.getpixel((x, y))) for x in range(w)] for y in range(h)]

    n = len(RAMP_CLASSIC) - 1
    palette = [(i / n) * 255.0 for i in range(n + 1)]
    dithered = _fs_dither_to_palette(buf, palette)

    lines = []
    for y in range(h):
        out = []
        for x in range(w):
            v = dithered[y][x]
            idx = int(round((v / 255.0) * n))
            idx = max(0, min(n, idx))
            out.append(RAMP_CLASSIC[idx])
        lines.append("".join(out).rstrip())

    return "\n".join(lines)


def image_to_ascii_braille(img: Image.Image, width_chars: int = 92) -> str:
    """High-detail portrait using Unicode braille.

    Each braille character encodes a 2x4 dot grid, so you get much more detail
    than standard ASCII at the same text width.
    """
    img = _prep_grayscale(img)

    # Braille cell: 2 (x) by 4 (y) pixels per character.
    # We'll resize to (width_chars*2, height_chars*4) pixels.
    w, h = img.size
    target_w_px = max(40, int(width_chars) * 2)

    # For braille, aspect is close to square in many monospace fonts,
    # but still slightly tall. This factor keeps faces from looking stretched.
    aspect_correction = 0.95
    target_h_px = max(40, int((h / w) * target_w_px * aspect_correction))

    img = img.resize((target_w_px, target_h_px), resample=Image.LANCZOS)

    # Threshold down to 1-bit for crisp dot patterns.
    # Higher threshold => fewer black dots (less "ink") => clearer facial features.
    # NOTE: ASCII_INVERT is handled in _prep_grayscale(), so this threshold
    # logic doesn't need to branch.
    thr = int(os.environ.get("ASCII_THRESHOLD", "175"))
    bw = img.point(lambda p: 255 if p > thr else 0).convert("1")

    px = bw.load()

    # Ensure dimensions are multiples of 2x4
    out_w = target_w_px // 2
    out_h = target_h_px // 4

    # Braille dot bit positions
    # (x,y) within cell -> bit
    bits = {
        (0, 0): 0x01,  # dot 1
        (0, 1): 0x02,  # dot 2
        (0, 2): 0x04,  # dot 3
        (0, 3): 0x40,  # dot 7
        (1, 0): 0x08,  # dot 4
        (1, 1): 0x10,  # dot 5
        (1, 2): 0x20,  # dot 6
        (1, 3): 0x80,  # dot 8
    }

    lines = []
    for cy in range(out_h):
        line_chars = []
        for cx in range(out_w):
            mask = 0
            base_x = cx * 2
            base_y = cy * 4
            for dy in range(4):
                for dx in range(2):
                    # In mode "1": 0=black, 255=white
                    v = px[base_x + dx, base_y + dy]
                    if v == 0:
                        mask |= bits[(dx, dy)]
            line_chars.append(chr(0x2800 + mask))
        # Trim trailing blanks for cleanliness
        lines.append("".join(line_chars).rstrip("\u2800"))

    return "\n".join(lines)


def main() -> None:
    src = Path(os.environ.get("HERO_SRC", str(DEFAULT_SRC))).expanduser()
    if not src.exists():
        raise SystemExit(f"Hero source image not found: {src}")

    # Tuning knobs
    # - HERO_ZOOM: >1 crops tighter (e.g. 1.25, 1.4)
    # - ASCII_WIDTH: target width in characters (braille chars for braille mode)
    zoom = float(os.environ.get("HERO_ZOOM", "1.35"))
    width_chars = int(os.environ.get("ASCII_WIDTH", "112" if MODE != "blocks" else "78"))

    img = Image.open(src)

    # Center-crop to square, then zoom-crop tighter.
    w, h = img.size
    side = min(w, h)
    left = (w - side) // 2
    top = (h - side) // 2
    img = img.crop((left, top, left + side, top + side))

    if zoom > 1.0:
        zw = int(side / zoom)
        zh = int(side / zoom)
        zl = (side - zw) // 2
        zt = (side - zh) // 2
        img = img.crop((zl, zt, zl + zw, zt + zh))

    if MODE == "blocks":
        ascii_core = image_to_ascii_blocks(img, width_chars=width_chars)
    elif MODE == "braille":
        ascii_core = image_to_ascii_braille(img, width_chars=width_chars)
    elif MODE == "ramp":
        ascii_core = image_to_ascii_ramp(img, width_chars=width_chars)
    else:
        # dot (default)
        ascii_core = image_to_ascii_dot(img, width_chars=width_chars)

    out = ascii_core + "\n[portrait generated from hero_source.jpg]"

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(out + "\n", encoding="utf-8")
    print(f"Wrote {OUT_PATH}")


if __name__ == "__main__":
    main()
