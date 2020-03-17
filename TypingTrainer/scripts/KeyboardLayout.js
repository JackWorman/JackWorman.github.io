"use strict";

export const KEYBOARD_LAYOUT = [
  [
    {value: `\``, shiftValue: `~`, bottomDisplay: `\``, topDisplay: `~`,      size: 1},
    {value: `1`,  shiftValue: `!`, bottomDisplay: `1`,  topDisplay: `!`,      size: 1},
    {value: `2`,  shiftValue: `@`, bottomDisplay: `2`,  topDisplay: `@`,      size: 1},
    {value: `3`,  shiftValue: `#`, bottomDisplay: `3`,  topDisplay: `#`,      size: 1},
    {value: `4`,  shiftValue: `$`, bottomDisplay: `4`,  topDisplay: `$`,      size: 1},
    {value: `5`,  shiftValue: `%`, bottomDisplay: `5`,  topDisplay: `%`,      size: 1},
    {value: `6`,  shiftValue: `^`, bottomDisplay: `6`,  topDisplay: `^`,      size: 1},
    {value: `7`,  shiftValue: `&`, bottomDisplay: `7`,  topDisplay: `&`,      size: 1},
    {value: `8`,  shiftValue: `*`, bottomDisplay: `8`,  topDisplay: `*`,      size: 1},
    {value: `9`,  shiftValue: `(`, bottomDisplay: `9`,  topDisplay: `(`,      size: 1},
    {value: `0`,  shiftValue: `)`, bottomDisplay: `0`,  topDisplay: `)`,      size: 1},
    {value: `-`,  shiftValue: `_`, bottomDisplay: `-`,  topDisplay: `_`,      size: 1},
    {value: `=`,  shiftValue: `+`, bottomDisplay: `=`,  topDisplay: `+`,      size: 1},
    {value: ``,   shiftValue: ``,  bottomDisplay: ``,   topDisplay: `&#8592`, size: 2}
  ],
  [
    {value: ``,   shiftValue: ``,  bottomDisplay: ``,   topDisplay: `Tab`, size: 1.5},
    {value: `q`,  shiftValue: `Q`, bottomDisplay: ``,   topDisplay: `Q`,   size: 1},
    {value: `w`,  shiftValue: `W`, bottomDisplay: ``,   topDisplay: `W`,   size: 1},
    {value: `e`,  shiftValue: `E`, bottomDisplay: ``,   topDisplay: `E`,   size: 1},
    {value: `r`,  shiftValue: `R`, bottomDisplay: ``,   topDisplay: `R`,   size: 1},
    {value: `t`,  shiftValue: `T`, bottomDisplay: ``,   topDisplay: `T`,   size: 1},
    {value: `y`,  shiftValue: `Y`, bottomDisplay: ``,   topDisplay: `Y`,   size: 1},
    {value: `u`,  shiftValue: `U`, bottomDisplay: ``,   topDisplay: `U`,   size: 1},
    {value: `i`,  shiftValue: `I`, bottomDisplay: ``,   topDisplay: `I`,   size: 1},
    {value: `o`,  shiftValue: `O`, bottomDisplay: ``,   topDisplay: `O`,   size: 1},
    {value: `p`,  shiftValue: `P`, bottomDisplay: ``,   topDisplay: `P`,   size: 1},
    {value: `[`,  shiftValue: `{`, bottomDisplay: `[`,  topDisplay: `{`,   size: 1},
    {value: `]`,  shiftValue: `}`, bottomDisplay: `]`,  topDisplay: `}`,   size: 1},
    {value: `\\`, shiftValue: `|`, bottomDisplay: `\\`, topDisplay: `|`,   size: 1.5}
  ],
  [
    {value: ``,  shiftValue: ``,  bottomDisplay: ``,  topDisplay: `Caps`,  size: 1.75},
    {value: `a`, shiftValue: `A`, bottomDisplay: ``,  topDisplay: `A`,     size: 1},
    {value: `s`, shiftValue: `S`, bottomDisplay: ``,  topDisplay: `S`,     size: 1},
    {value: `d`, shiftValue: `D`, bottomDisplay: ``,  topDisplay: `D`,     size: 1},
    {value: `f`, shiftValue: `F`, bottomDisplay: ``,  topDisplay: `F`,     size: 1},
    {value: `g`, shiftValue: `G`, bottomDisplay: ``,  topDisplay: `G`,     size: 1},
    {value: `h`, shiftValue: `H`, bottomDisplay: ``,  topDisplay: `H`,     size: 1},
    {value: `j`, shiftValue: `J`, bottomDisplay: ``,  topDisplay: `J`,     size: 1},
    {value: `k`, shiftValue: `K`, bottomDisplay: ``,  topDisplay: `K`,     size: 1},
    {value: `l`, shiftValue: `L`, bottomDisplay: ``,  topDisplay: `L`,     size: 1},
    {value: `;`, shiftValue: `:`, bottomDisplay: `;`, topDisplay: `:`,     size: 1},
    {value: `'`, shiftValue: `"`, bottomDisplay: `'`, topDisplay: `"`,     size: 1},
    {value: ``,  shiftValue: ``,  bottomDisplay: ``,  topDisplay: `Enter`, size: 2.25},
  ],
  [
    {value: ``,  shiftValue: ``,  bottomDisplay: ``,  topDisplay: `Shift`, size: 2.25},
    {value: `z`, shiftValue: `Z`, bottomDisplay: ``,  topDisplay: `Z`,     size: 1},
    {value: `x`, shiftValue: `X`, bottomDisplay: ``,  topDisplay: `X`,     size: 1},
    {value: `c`, shiftValue: `C`, bottomDisplay: ``,  topDisplay: `C`,     size: 1},
    {value: `v`, shiftValue: `V`, bottomDisplay: ``,  topDisplay: `V`,     size: 1},
    {value: `b`, shiftValue: `B`, bottomDisplay: ``,  topDisplay: `B`,     size: 1},
    {value: `n`, shiftValue: `N`, bottomDisplay: ``,  topDisplay: `N`,     size: 1},
    {value: `m`, shiftValue: `M`, bottomDisplay: ``,  topDisplay: `M`,     size: 1},
    {value: `,`, shiftValue: `<`, bottomDisplay: `,`, topDisplay: `<`,     size: 1},
    {value: `.`, shiftValue: `>`, bottomDisplay: `.`, topDisplay: `>`,     size: 1},
    {value: `/`, shiftValue: `?`, bottomDisplay: `/`, topDisplay: `?`,     size: 1},
    {value: ``,  shiftValue: ``,  bottomDisplay: ``,  topDisplay: `Shift`, size: 2.75},
  ],
  [
    {value: ``, shiftValue: ``, bottomDisplay: ``, topDisplay: `Ctrl`, size: 1.25},
    {value: ``, shiftValue: ``, bottomDisplay: ``, topDisplay: `Win`,  size: 1.25},
    {value: ``, shiftValue: ``, bottomDisplay: ``, topDisplay: `Alt`,  size: 1.25},
    {value: ``, shiftValue: ``, bottomDisplay: ``, topDisplay: ` `,    size: 6.25},
    {value: ``, shiftValue: ``, bottomDisplay: ``, topDisplay: `Alt`,  size: 1.25},
    {value: ``, shiftValue: ``, bottomDisplay: ``, topDisplay: `Win`,  size: 1.25},
    {value: ``, shiftValue: ``, bottomDisplay: ``, topDisplay: `Menu`, size: 1.25},
    {value: ``, shiftValue: ``, bottomDisplay: ``,  opDisplay: `Ctrl`, size: 1.25}
  ]
];
