# -*- coding: utf-8 -*-
"""
Builds a single WOFF2 subset of Noto Sans JP Variable (SIL OFL 1.1) for this site.

Coverage = every character that appears in the site's source text (src/data, src/pages,
src/components, src/layouts) + ASCII + full hiragana/katakana + common Japanese punctuation
and symbols. The wght axis (100–900) is kept so 400/500/600 all come from one file.

Because coverage follows the source text, re-run the build after changing names, prices or
copy (it runs automatically in `pnpm build` / `pnpm dev` via scripts/build-fonts-css.mjs).
A kanji that is not in the subset falls back to the system Japanese font for that glyph only.

Usage: python scripts/subset-font.py <out.woff2>
Requires: fonttools + brotli  (pip install fonttools brotli)
"""
import glob
import sys
from fontTools import subset
from fontTools.ttLib import TTFont

SRC = 'tools/fonts/NotoSansJP[wght].ttf'
out = sys.argv[1]

chars = set()
for pattern in ('src/data/**/*.ts', 'src/pages/**/*.astro', 'src/components/**/*.astro', 'src/layouts/**/*.astro', 'src/content/**/*.md', 'src/lib/**/*.ts'):
    for f in glob.glob(pattern, recursive=True):
        with open(f, encoding='utf8') as fh:
            chars.update(fh.read())

def rng(a, b):
    return ''.join(chr(c) for c in range(a, b + 1))

base = (
    rng(0x20, 0x7E)                    # ASCII
    + rng(0x3041, 0x3096) + rng(0x30A1, 0x30FA)  # hiragana / katakana
    + '　、。，．・：；？！゛゜´｀¨＾￣＿ヽヾゝゞ〃仝々〆〇ー―‐／＼～∥｜…‥‘’“”（）〔〕［］｛｝〈〉《》「」『』【】＋－±×÷＝≠＜＞≦≧∞∴♂♀°′″℃￥＄¢£％＃＆＊＠§☆★○●◎◇◆□■△▲▽▼※〒→←↑↓〓'
    + rng(0xFF10, 0xFF19) + rng(0xFF21, 0xFF3A) + rng(0xFF41, 0xFF5A)  # full-width digits / latin
    + '‐–—―‘’“”…‥〜～¥→←'
)
text = ''.join(sorted(set(base) | chars))

opts = subset.Options()
opts.flavor = 'woff2'
opts.layout_features = ['kern', 'palt', 'ccmp']
opts.hinting = False
opts.desubroutinize = True
opts.notdef_outline = True
opts.name_IDs = [0, 1, 2, 3, 4, 5, 6, 13, 14]  # keep license name records (OFL)

font = TTFont(SRC)
s = subset.Subsetter(opts)
s.populate(text=text)
s.subset(font)
font.save(out)
print(f'{out}: {len(font.getGlyphOrder())} glyphs, {len(set(text))} characters')
