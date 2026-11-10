// Hand-drawn block bitmaps. '.' is empty; every other character is a colour key.
export const NINJA = [
  '................',
  '.....kkkkkk.....',
  '....kkkkkkkk....',
  '...kkkkkkkkkk...',
  '...iiiiiiiiii.ii',
  '...kkikkkkikk.i.',
  '...kkkkkkkkkk...',
  '....kkkkkkkk....',
  '...kkkkkkkkkk...',
  '..kkkkkkkkkkkk..',
  '..kk.kkkkkk.kk..',
  '..kk.kkkkkk.kk..',
  '.....kkkkkk.....',
  '.....kk..kk.....',
  '.....kk..kk.....',
  '....kkk..kkk....',
]
export const HOOK = ['...kk', '...kk', '...kk', '...kk', '...kk', 'k..kk', 'kk.kk', 'kkkkk', '.kkk.']

export const ICONS: Record<string, string[]> = {
  Gaming: ['..iiiiiiii..', '.iiiiiiiiii.', 'ii.iiiiiaiii', 'i...iiiiiiai', 'ii.iiiiiaiii', 'iiiiiiiiiiii', 'iii......iii', '.i........i.'],
  Music: ['....iiiiiiii', '....iiiiiiii', '....i......i', '....i......i', '....i......i', '.aaai...aaai', 'aaaai..aaaai', '.aaa....aaa.'],
  Sport: ['...iiiiii...', '.iiiaiiiiii.', 'iiiiaaiiiiii', 'iiiiiaaiiiii', 'iiiiiiaaiiii', 'iiiiiiiaiiii', '.iiiiiiiiii.', '...iiiiii...'],
  Mountains: ['.....a......', '....aaa.....', '...aiiia..a.', '..iiiiiiiaaa', '.iiiiiiiiiia', 'iiiiiiiiiiii', 'iiiiiiiiiiii', 'iiiiiiiiiiii'],
}

// Gujarati letter અ as an outline (y up, 1000 units per em, glyph box 17..972 × 0..602), so no device font is needed.
// Outline from Noto Sans Gujarati Black, © The Noto Project Authors, SIL Open Font License 1.1.
export const GUJARATI_A =
  'M364 88Q307 88 259 106Q211 125 172 158Q134 190 107 232L138 333Q185 338 208 356Q232 374 232 405Q232 433 212 448Q193 464 157 464Q136 464 117 460Q98 455 77 446L27 572Q67 587 104 594Q141 602 181 602Q251 602 302 579Q353 556 381 514Q409 472 409 414Q409 355 374 306Q340 258 280 230Q219 201 141 201Q105 201 77 211Q49 221 33 242Q17 263 17 295Q17 333 42 356Q68 379 108 379Q152 379 182 360Q212 342 234 316L249 291Q269 260 296 243Q323 226 354 226Q387 226 408 234Q430 242 446 261Q461 279 469 306Q477 333 477 377V460L654 450V378Q654 279 620 214Q587 150 522 119Q457 88 364 88ZM673 192Q648 192 627 198Q606 204 589 216Q572 228 559 247L644 351Q650 341 659 336Q668 330 682 330Q702 330 718 342Q734 355 744 377L761 230Q748 211 726 202Q704 192 673 192ZM919 0Q865 0 828 10Q790 20 767 43Q744 66 734 103Q723 140 723 194V602L900 592V209Q900 187 903 173Q906 159 915 151Q923 144 936 141Q950 138 972 138L959 0Z'

// The hero name as coarse blocks (10 per em, measured from Big Shoulders 900 with the heading's tracking).
// Server-rendered so the very first frame already shows the name in low resolution, before any script runs.
// Regenerate if the name, the display font or its tracking changes.
export const NAME_BLOCKS: Record<string, string[]> = {
  RISHI: [
    '....................',
    '....................',
    '####.##.######.##.##',
    '##############.##.##',
    '##.######.####.##.##',
    '##.########.#####.##',
    '#######.#########.##',
    '####.####.####.##.##',
    '##############.##.##',
    '##.####.######.##.##',
    '....................',
    '....................',
  ],
  KANERIA: [
    '.................................',
    '.................................',
    '##.##.###.###############.##.###.',
    '#####.##############.####.##.###.',
    '####..############...####.######.',
    '####..###################.######.',
    '####..##############.####.######.',
    '#####.############...####.#######',
    '##.#################.####.#######',
    '##.####.####.############.####.##',
    '.................................',
    '.................................',
  ],
}
