// Rounded, ink-outlined characters in the village's muted illustration palette.
export function appa(path,circle){
  const leg=(x,y,delay,far=false)=>`<g transform="translate(${x} ${y})"><g class="appa-leg" style="--delay:${delay}s">${path('M-11 -13Q0 -19 11 -11L10 12L7 18L3 15L0 19L-4 16L-8 18L-12 10Z',far?'#d3cfba':'#f3efdb','stroke="#626354" stroke-width="1.4"')}<g transform="translate(0 15)"><g class="appa-paw" style="--delay:${delay}s">${path('M-9 -1L8 -1L11 7Q10 13 0 13Q-12 14 -12 7Z',far?'#4d554b':'#62695b','stroke="#454e45" stroke-width="1.3"')}${path('M-5 7v4M1 7v5M6 6v4','none','stroke="#313e37" stroke-width="1"')}</g></g></g></g>`;
  return `<g class="appa"><g class="appa-bob">
    <g class="appa-tail">${path('M163 -38Q129 -30 101 -18L67 -8Q58 -2 70 4Q109 16 162 -9Z','#eee9d4','stroke="#626354" stroke-width="1.7"')}${path('M151 -31Q120 -21 93 -9L81 1L101 6Q128 -6 157 -15Z','#9d907d','stroke="none"')}${path('M71 3l6 -2m6 5l5 -3m9 5l5 -4','none','stroke="#c5bda5" stroke-width="1"')}</g>
    ${leg(171,-10,-.2,true)}${leg(212,-10,-.7,true)}${leg(253,-10,-1.2,true)}
    ${path('M145 -31Q142 -63 169 -74Q210 -90 244 -75Q271 -69 285 -43L289 -20L281 -8L274 -12L267 0L259 -5L251 4L243 -1L235 6L226 1L217 7L208 2L198 7L189 1L181 5L173 -3L164 0L159 -9L151 -6L150 -17L143 -16L146 -24L140 -25Z','#f3efdb','stroke="#626354" stroke-width="1.8"')}
    ${path('M188 -79Q205 -84 221 -80L247 -57L237 -52L209 -69L192 -65Z','#9d907f','stroke="none"')}
    ${path('M163 -36l3 6m16 -19l2 7m15 15l3 6m22 -17l3 6m19 -17l3 7','none','stroke="#c4bda7" stroke-width="1.3"')}
    ${path('M185 -75Q208 -71 237 -75L239 -84L230 -85L225 -92L211 -93L204 -84L187 -85Z','#657464','stroke="#46584a" stroke-width="1.5"')}${path('M177 -83Q176 -94 184 -95L198 -93L202 -83Z','#b99d78','stroke="#626354" stroke-width="1.3"')}${path('M184 -94L187 -84M194 -93L197 -84','none','stroke="#806e55" stroke-width="1.2"')}
    ${leg(177,-1,0)}${leg(218,0,-.5)}${leg(259,-2,-1)}
    <g class="appa-head">
    ${path('M272 -40Q252 -48 250 -61L252 -85Q256 -63 272 -61L280 -48Z','#626f63','stroke="#43554a" stroke-width="1.6"')}
    ${path('M324 -48Q342 -51 347 -65L346 -85Q359 -57 341 -43L327 -39Z','#626f63','stroke="#43554a" stroke-width="1.6"')}
    ${path('M263 -31Q249 -32 255 -22L270 -16M331 -29Q346 -33 341 -20L330 -16','#d9d4bd','stroke="#626354" stroke-width="1.3"')}
    ${path('M269 -33Q280 -46 306 -42Q331 -38 337 -20L335 -3Q322 13 299 11Q276 14 266 0L262 -17Z','#8e9080','stroke="#555f54" stroke-width="1.7"')}
    ${path('M265 -47Q262 -68 282 -76Q304 -87 324 -66Q338 -55 339 -31L336 -21L330 -25L327 -17L321 -22L317 -16L311 -21L307 -17L301 -22L297 -17L291 -23L287 -18L281 -24L276 -20L272 -28L266 -24L267 -33L261 -30Z','#f6f1de','stroke="#626354" stroke-width="1.8"')}
    ${path('M288 -77Q298 -80 306 -75L314 -49L327 -50L303 -27L278 -48L292 -48Z','#9c8b7b','stroke="none"')}
    ${path('M276 -23Q281 -19 286 -23Q282 -14 278 -19ZM320 -23Q325 -19 330 -23Q326 -14 322 -19Z','#f6f1de','stroke="#555f54" stroke-width="1"')}
    ${circle(282,-21,1.7,'#35473e')}${circle(325,-21,1.7,'#35473e')}
    ${path('M274 -5Q301 7 330 -4L324 6L318 4L312 10L305 7L300 12L293 8L286 10L281 5L275 7Z','#eee8d3','stroke="#626354" stroke-width="1.2"')}
    ${path('M278 -16Q287 -23 302 -21Q319 -22 329 -15L327 -4Q315 4 301 1Q284 4 276 -5Z','#737d72','stroke="#505c52" stroke-width="1.5"')}
    ${path('M287 -3Q302 3 318 -3','none','stroke="#3e4d44" stroke-width="1.4"')}
    <ellipse class="rudolph-glow" cx="303" cy="-12" rx="15" ry="11" fill="#ff6552"/>
    ${path('M292 -16Q296 -20 303 -17Q312 -20 315 -14Q316 -8 307 -8L303 -6L299 -8Q290 -7 292 -16Z','#d85c51','class="appa-nose" stroke="#7f4e43" stroke-width="1.3"')}
    ${path('M297 -15Q302 -17 306 -15','none','stroke="#ffd8bb" stroke-width="1.2"')}
    </g>
  </g></g>`;
}

export function doveMarkup(){
  return `<g stroke="#636b60" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
    <g class="dove-far-wing" opacity=".85"><path d="M-2 -2Q-14 -26 -5 -41Q5 -30 13 -9L9 1Z" fill="#b8b7a5"/></g>
    <path d="M-10 2L-30 5L-24 9L-30 12L-11 10L0 6Z" fill="#aaa993"/>
    <path d="M-16 1Q-14 -10 1 -9Q12 -10 17 -17Q20 -23 26 -20Q32 -18 30 -12L26 -8Q19 -6 16 3Q6 13 -7 9Q-15 7 -16 1Z" fill="#d9d3bc"/>
    <path d="M10 -6Q14 4 22 -8" fill="none" stroke="#b29b85" stroke-width="3"/>
    <path d="M17 -13l5 3m-7 0l4 3" fill="none" stroke="#69736a" stroke-width="1.5"/>
    <circle cx="26" cy="-16" r="1.2" fill="#354d49"/>
    <path d="M30 -15L38 -12L30 -10Z" fill="#8d8170"/>
    <g class="dove-near-wing"><path d="M-7 0Q-21 -13 -20 -37Q-10 -37 -6 -31L-3 -36L2 -27L5 -30L9 -20L12 -20L15 -8Q7 4 -7 0Z" fill="#c6bda4"/>
      <path d="M-15 -28L0 -7M-8 -26L4 -9M-1 -22L8 -10M-10 -10l4 -4m1 9l4 -4" fill="none" stroke="#a1957e" stroke-width="1"/>
    </g>
    <path d="M2 9L-2 12M8 8L4 12" fill="none" stroke="#a17c64"/>
  </g>`;
}
