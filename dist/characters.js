// Rounded, ink-outlined characters in the village's muted illustration palette.
export function appa(path,circle){
  const leg=(x,y,delay,far=false)=>`<g transform="translate(${x} ${y})"><g class="appa-leg" style="--delay:${delay}s">${path('M-9 -8Q0 -12 9 -6L8 13L5 18H-7L-11 9Z',far?'#d7d0b8':'#f3ecd5','stroke="#626354" stroke-width="1.4"')}<g transform="translate(0 13)"><g class="appa-paw" style="--delay:${delay}s">${path('M-7 -1L6 -1L10 10Q4 15 -9 12L-11 7Z',far?'#b2ac98':'#d1c9ae','stroke="#626354" stroke-width="1.3"')}${path('M-4 8v4M2 8v4','none','stroke="#626354" stroke-width="1"')}</g></g></g></g>`;
  return `<g class="appa"><g class="appa-bob">
    <g class="appa-tail">${path('M164 -36Q123 -46 91 -32L68 -40L76 -26L65 -18Q115 -9 161 -18Z','#eee6cb','stroke="#626354" stroke-width="1.7"')}${path('M80 -26Q116 -26 153 -29','none','stroke="#b6a68a" stroke-width="8"')}</g>
    ${leg(171,-10,-.2,true)}${leg(212,-10,-.7,true)}${leg(253,-10,-1.2,true)}
    ${path('M144 -33Q142 -54 166 -59Q199 -69 236 -58Q267 -60 284 -41L286 -16L279 -6L272 -10L266 0L256 -5L248 3L239 -3L231 3L222 -2L213 5L205 -1L194 4L185 -2L176 2L168 -5L157 -3L154 -12L146 -10L149 -21L141 -23Z','#f3ecd5','stroke="#626354" stroke-width="1.8"')}
    ${path('M164 -57Q209 -66 252 -54L264 -38L248 -42Q211 -50 173 -45Z','#b09b7b','stroke="none"')}
    ${path('M164 -34l4 5m13 -11l3 5m12 18l4 4m23 -13l3 5m17 -13l4 6','none','stroke="#c4b99d" stroke-width="1.5"')}
    ${leg(177,-1,0)}${leg(218,0,-.5)}${leg(259,-2,-1)}
    <g class="appa-head" transform="translate(300 -25) scale(1.3 1.2) translate(-300 25)">
    ${path('M271 -38Q255 -50 267 -56L281 -49M312 -44Q328 -53 332 -43L320 -32','#ded6bd','stroke="#626354" stroke-width="1.5"')}
    ${path('M273 -48Q263 -63 270 -80Q271 -65 284 -59L284 -47Z','#777c6d','stroke="#50594e" stroke-width="1.5"')}
    ${path('M278 -57Q298 -68 316 -55L322 -46L319 -40L326 -33L323 -25L327 -18L321 -9L314 -8L309 -1L299 -4L292 1L285 -6L276 -5L273 -14L266 -18L270 -27L266 -34L273 -40Z','#f6efd9','stroke="#626354" stroke-width="1.8"')}
    ${path('M310 -52Q321 -63 317 -81Q329 -66 322 -49L316 -44Z','#777c6d','stroke="#50594e" stroke-width="1.5"')}
    ${path('M289 -59L302 -61L304 -45L313 -46L301 -32L285 -43L293 -44Z','#ac9775','stroke="none"')}
    ${path('M281 -23Q292 -32 312 -28Q329 -26 330 -14Q329 -3 311 -1Q287 2 279 -9Q274 -15 281 -23Z','#8b8b7a','stroke="#575e52" stroke-width="1.6"')}
    ${circle(284,-32,2,'#3e4840')}${circle(314,-33,2,'#3e4840')}
    ${path('M288 -12Q301 -5 316 -10','none','stroke="#4c554a" stroke-width="1.6"')}
    <circle class="rudolph-glow" cx="326" cy="-17" r="13" fill="#ff6552"/>
    ${circle(326,-17,4.8,'#e85d50','class="appa-nose"')}${path('M324 -19l2 -1','none','stroke="#ffd9b8" stroke-width="1.3"')}
    ${path('M272 -29Q267 -12 280 -5','none','stroke="#a36551" stroke-width="3"')}</g>
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
