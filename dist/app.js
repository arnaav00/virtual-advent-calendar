import {setupBackgroundMusic} from './background-music.js';
import {setupSpeaker} from './speaker.js';
import { skaterPose, santaPose } from './motion.js';
import { setupEasterEggs } from './interactions.js';
import { appa } from './characters.js';
import { setupSnowballGame } from './snowball-game.js';
import { setupSantaGifts } from './santa-gifts.js';
import { setupMariah } from './mariah.js';
import { setupGiftModal } from './gift-modal.js';
import { ADVENT, isDayAvailable } from './advent-time.js';
import { initializeGiftState } from './gift-state.js';
import { setupHomeSnowglobe } from './home-snowglobe.js';
const svg = document.querySelector('#landscape');
const ink = '#354d49', snow = '#fffdf3';
const stroke = `stroke="${ink}" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"`;
const path = (d, fill = 'none', extra = '') => {
  const attributes = {stroke: ink, 'stroke-width': '2.3', 'stroke-linecap': 'round', 'stroke-linejoin': 'round'};
  for (const match of extra.matchAll(/([\w-]+)="([^"]*)"/g)) attributes[match[1]] = match[2];
  return `<path d="${d}" fill="${fill}" ${Object.entries(attributes).map(([key,value])=>`${key}="${value}"`).join(' ')}/>`;
};
const rect = (x,y,w,h,fill,rx=0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${stroke}/>`;
const houseBody = (x,y,w,h,fill,rx=0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="none"/><path d="M${x} ${y}V${y+h-rx}Q${x} ${y+h} ${x+rx} ${y+h}H${x+w-rx}Q${x+w} ${y+h} ${x+w} ${y+h-rx}V${y}" fill="none" ${stroke}/>`;
const gable = (x,y,w,h,fill) => `<path d="M${x} ${y}L${x+w/2} ${y-h}L${x+w} ${y}Z" fill="${fill}" stroke="none"/>${path(`M${x} ${y}L${x+w/2} ${y-h}L${x+w} ${y}`)}`;
const circle = (x,y,r,fill,extra='') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${stroke} ${extra}/>`;
function fence(x,y,width,side){
  const count=7,step=(width-16)/(count-1);
  return `<g class="village-fence" data-side="${side}" transform="translate(${x} ${y})">
    ${rect(0,-35,width,8,'#a7b39a',2)}${rect(0,-16,width,8,'#a7b39a',2)}
    ${Array.from({length:count},(_,i)=>{const px=8+i*step;return `<g transform="translate(${px} 0)">
      ${path('M-7 0V-47L0 -55L7 -47V0Z','#c1c9ae','stroke-width="1.8"')}
      ${path('M-7 -47L0 -55L7 -47','none',`stroke="${snow}" stroke-width="4"`)}
      ${path('M-2 -40V-21M2 -17V-5','none','stroke="#91a086" stroke-width="1" opacity=".6"')}
      ${circle(0,-31,1.2,'#657764','stroke="none"')}${circle(0,-12,1.2,'#657764','stroke="none"')}
    </g>`;}).join('')}
    ${path(`M0 -36H${width}`,'none',`stroke="${snow}" stroke-width="3"`)}
    ${path(`M-4 1Q${width*.3} -4 ${width*.5} 1T${width+4} 1`,'none',`stroke="${snow}" stroke-width="5"`)}
  </g>`;
}
function tree(x,y,s=1,paint='#54796b',side=''){
  return `<g ${side?`class="interactive-tree" data-side="${side}"`:''} transform="translate(${x} ${y}) scale(${s})">${path('M0 0L0 -170',ink)}${path('M0 -190Q-12 -160 -33 -139L-19 -140Q-34 -105 -57 -84L-37 -88Q-51 -54 -77 -23Q-20 -4 0 -9Q35 -3 77 -23Q49 -54 38 -88L58 -84Q34 -110 20 -140L34 -139Q12 -166 0 -190',paint)}${path('M0 -190Q-12 -160 -33 -139Q-23 -132 -13 -143Q-2 -134 7 -144Q17 -134 34 -139Q12 -166 0 -190',snow)}${path('M-37 -101Q-24 -91 -10 -102Q0 -92 12 -101Q26 -90 40 -101','none',`stroke="${snow}" stroke-width="8"`)}${path('M-60 -43Q-44 -32 -27 -44Q-11 -32 3 -44Q22 -31 37 -43Q47 -34 61 -43','none',`stroke="${snow}" stroke-width="9"`)}</g>`;
}
function wreath(x,y,s=1){
  return `<g class="wreath" transform="translate(${x} ${y}) scale(${s})">${circle(0,0,15,'#547463')}${circle(0,0,8,'#e8c4b3')}${path('M0 14Q-22 4 -14 22Q-7 28 0 14Q20 4 15 23Q8 28 0 14','#aa584b')}${path('M-3 21L-7 33M3 21L8 30','none','stroke="#aa584b" stroke-width="5"')}${[[-9,-8],[10,-7],[-12,5],[12,5]].map(([a,b])=>circle(a,b,2.5,'#e9c98b')).join('')}</g>`;
}
function chimney(x,y,paint){return `<g class="chimney">${rect(x,y,28,77,paint)}${rect(x-5,y-4,38,10,snow,4)}${path(`M${x+5} ${y+20}h10m-1 12h12m-20 14h12`,'none','opacity=".35"')}</g>`;}
function roof(x,y,w,h,color){return `${path(`M${x-13} ${y+7}L${x+w/2} ${y-h}L${x+w+13} ${y+7}L${x+w+6} ${y+20}L${x+w/2} ${y-h+20}L${x-6} ${y+20}Z`,color)}${path(`M${x-18} ${y+5}Q${x-24} ${y-3} ${x-12} ${y-9}L${x+w/2-9} ${y-h-11}Q${x+w/2} ${y-h-18} ${x+w/2+11} ${y-h-9}L${x+w+18} ${y-4}Q${x+w+27} ${y+9} ${x+w+13} ${y+12}Q${x+w+3} ${y+16} ${x+w-1} ${y+6}L${x+w/2} ${y-h+5}L${x+8} ${y+7}Q${x+1} ${y+23} ${x-6} ${y+11}Z`,snow)}`;}
function attic(x,y,r=18){return `${circle(x,y,r,'#f0d79b')}${path(`M${x-r+2} ${y}h${r*2-4}M${x} ${y-r+2}v${r*2-4}`)}${circle(x,y,r+5,'none')}`;}
let art = `<defs><radialGradient id="sun"><stop stop-color="#fff2b0"/><stop offset="1" stop-color="#f3d179"/></radialGradient><linearGradient id="ground" x2="0" y2="1"><stop stop-color="#fffdf3"/><stop offset="1" stop-color="#e9ede4"/></linearGradient></defs>`;
// A sunny winter sky and distant snowy hills.
art += `<g class="winter-sun celestial-toggle" role="button" tabindex="0" aria-label="Switch to night-time" transform-origin="1116px 168px"><circle cx="1116" cy="168" r="61" fill="#fff1b7" opacity=".15"/><circle cx="1116" cy="168" r="49" fill="#ffe9a2" opacity=".22"/><circle cx="1116" cy="168" r="39" fill="url(#sun)" stroke="#e4bc69" stroke-width="1.5"/></g>`;
art += path('M-1440 590H0Q85 455 205 525Q337 359 470 501Q596 414 722 495Q914 405 1042 502Q1207 393 1440 556H2880V1800H-1440Z','#dce4d9','stroke="none"');
art += path('M-1440 650H0Q163 547 293 610Q446 513 575 601Q804 479 995 584Q1217 518 1440 617H2880V1800H-1440Z','#ceddce','stroke="none"');
art += [tree(137,683,.9,'#8ba493'),tree(1271,689,.95,'#8ba493'),tree(345,605,.72,'#a5b7a1'),tree(1018,595,.8,'#9aaf9c')].join('');
art += path('M-1440 738H0Q115 684 252 711Q472 659 694 710Q917 667 1119 700Q1310 669 1440 726H2880V1800H-1440Z','url(#ground)','stroke="none"');
// Five houses, each with its own silhouette and small architectural details.
art += chimney(215,310,'#c3cdb6');
art += houseBody(183,431,190,288,'#b8c7b4',3);
art += gable(183,431,190,103,'#b8c7b4');
art += roof(183,431,190,110,'#54776a');
art += attic(278,397,15);
art += path('M193 444V706M363 444V706M183 578H373','none','opacity=".45"');
art += rect(173,710,211,15,snow,5);
art += chimney(540,264,'#cb967d');
art += houseBody(397,358,192,368,'#e9c79e',2);
art += gable(397,358,192,104,'#e9c79e');
art += roof(397,358,192,110,'#ac6554');
art += attic(493,321,17);
art += path('M407 372V715M579 372V715M398 491H589M398 612H589','none','opacity=".3"');
art += rect(387,717,213,16,snow,5);
// The pink house is the heart of the village.
art += chimney(791,189,'#c58176');
art += houseBody(613,302,231,428,'#e1ada1',2);
art += gable(613,302,231,128,'#e1ada1');
art += roof(613,302,231,135,'#875349');
art += attic(728,252,22);
art += path('M625 315V716M831 315V716M613 439H844M613 554H844','none','opacity=".4"');
art += rect(600,720,257,16,snow,5);
art += path('M668 731L659 747H800L791 731','#e7d7c3');
art += path('M659 747L650 757H809L800 747',snow);
art += wreath(729,586,1.05);
art += chimney(1000,282,'#80a397');
art += houseBody(867,373,178,352,'#9db8ae',3);
art += gable(867,373,178,101,'#9db8ae');
art += roof(867,373,178,109,'#4b7067');
art += attic(956,338,16);
art += path('M878 388V714M1034 388V714M867 499H1045M867 612H1045','none','opacity=".35"');
art += rect(857,716,198,16,snow,5);
art += chimney(1173,330,'#c89376');
art += houseBody(1065,459,174,267,'#e5c6a1',3);
art += gable(1065,459,174,99,'#e5c6a1');
art += roof(1065,459,174,107,'#aa6b53');
art += attic(1152,421,14);
art += path('M1076 475V713M1228 475V713M1065 583H1239','none','opacity=".4"');
art += rect(1055,718,195,15,snow,5);
// Small masonry flecks and frosted roof icicles.
[[198,680],[338,601],[419,581],[553,384],[630,472],[807,679],[880,582],[1016,636],[1082,614],[1203,493]].forEach(([x,y])=>{art+=path(`M${x} ${y}h13m-6 7h13`,'none','opacity=".25" stroke-width="1.5"');});
[[189,442],[357,439],[406,367],[576,367],[622,312],[830,313],[877,384],[1031,384],[1072,469],[1225,469]].forEach(([x,y],i)=>{art+=path(`M${x} ${y}l3 ${12+i%3*3}l3 -${12+i%3*3}`,snow,'stroke-width="1.2"');});
// One continuous cable; fixed bulb colors chase in half-second groups.
art += '<g class="ambient christmas-lights">';
const lightPoints=[[183,431,190,110],[397,358,192,110],[613,302,231,135],[867,373,178,109],[1065,459,174,107]].flatMap(([x,y,w,h])=>
  Array.from({length:9},(_,i)=>{const t=i/8;return [x+3+t*(w-6),y+11-(1-Math.abs(2*t-1))*(h-11)];})
);
let lightWire=`M${lightPoints[0][0]} ${lightPoints[0][1]}`;
lightPoints.slice(1).forEach(([bx,by],i)=>{const [ax,ay]=lightPoints[i];lightWire+=`Q${(ax+bx)/2} ${(ay+by)/2+10} ${bx} ${by}`;});
art+=path(lightWire,'none','class="light-wire" stroke="#3b542d" stroke-width="1.5"');
const bulbColors=[['red','#f04447',0],['blue','#45add4',-1.5],['green','#8cca51',-1],['yellow','#ffd645',-.5]];
lightPoints.forEach(([bx,by],i)=>{
  const [name,color,delay]=bulbColors[i%4];
  art+=`<g class="festive-light" data-color="${name}" style="color:${color};--phase:${delay}s" transform="translate(${bx} ${by}) rotate(${i%2?-28:22})"><ellipse class="light-halo" cy="10" rx="10" ry="15" fill="currentColor"/><g class="bulb-glass">${path('M-4 3C-9 8 -5 17 0 22C5 17 9 8 4 3Z','currentColor','stroke="none"')}${path('M-3 7Q-5 12 -1 17','none','stroke="#fff8de" stroke-width="1.2" opacity=".85"')}</g>${path('M-4 -2H4L4 4Q0 6 -4 4Z','#3d592c','stroke="#304727" stroke-width=".7"')}</g>`;
});
art += '</g>';
// Snow banks, fir trees, and a little frozen village pond.
art += path('M35 776Q111 739 192 752M259 752Q338 728 405 746M849 750Q945 731 1033 748M1224 754Q1312 736 1381 769','none','stroke="#bdcdbf" stroke-width="1.5"');
art += `<g class="pond">${path('M475 802C517 766 615 772 695 775C800 769 925 771 982 807C1050 853 924 882 768 881C618 887 449 867 459 832Q459 813 475 802Z','#dce9e4','stroke="#a6beb5" stroke-width="1.5"')}${path('M475 799C534 770 613 775 695 778M784 779Q925 775 981 810M987 852Q921 882 787 883M682 880Q521 879 472 852','none',`stroke="${snow}" stroke-width="10"`)}${path('M524 819C584 793 884 790 947 819C994 852 662 877 539 840M576 836C647 861 895 850 916 827','none','stroke="#b8d0c7" stroke-width="1.4"')}${path('M563 807h43m242 57h39m29 -53h23m-262 58h20','none','stroke="#fffdf3" stroke-width="2.5"')}</g>`;
art += tree(115,768,1.17,'#4d7062','left');
art += tree(1303,759,1.24,'#597968','right');
art += tree(65,807,.64,'#78917b');
// Snow-capped timber pickets, rails and small nail heads on both sides.
art += fence(190,799,160,'left');
art += fence(1057,796,166,'right');
// Three snowy tiers between the first two houses; each piece can tumble separately.
art += `<g class="snowman" transform="translate(385 797)">
  <g class="snowman-arms">${path('M-20 -65L-46 -88M-39 -81L-40 -94M20 -65L46 -86M40 -81L52 -82','none','stroke="#856c54" stroke-width="3"')}</g>
  <g class="snowman-base">${circle(0,-21,30,snow)}${circle(0,-18,2,ink)}</g>
  <g class="snowman-middle">${circle(0,-62,23,snow)}${circle(0,-62,2,ink)}${circle(0,-49,2,ink)}</g>
  <g class="snowman-head">${circle(0,-97,18,snow)}${circle(-6,-100,1.4,ink)}${circle(6,-100,1.4,ink)}${path('M-6 -89Q0 -85 6 -89','none','stroke-width="1.3"')}</g>
  <g class="snowman-scarf">${path('M-18 -84Q0 -77 18 -85L19 -77Q0 -67 -19 -76Z','#b56856')}${path('M10 -77L14 -54L25 -58L20 -79Z','#b56856')}${path('M15 -59l8 -3','none','stroke="#dfb48b" stroke-width="2"')}</g>
  <g class="snowman-hat">${path('M-20 -111L21 -114L12 -118L9 -137L-11 -135L-12 -115Z','#3e6055')}${path('M-11 -121L11 -123','none','stroke="#b56856" stroke-width="4"')}${path('M-12 -136L8 -138','none',`stroke="${snow}" stroke-width="3"`)}</g>
  <g class="snowman-carrot">${path('M0 -97L19 -94L0 -91Z','#cf9361')}</g>
</g>`;
// Snoopy rests on his red doghouse, with Woodstock on his tummy.
art += `<g class="snoopy-house" transform="translate(1122 787) scale(.74)">
  ${rect(-48,10,96,68,'#b9544b',1)}${path('M-48 30H48M-48 49H48M-48 67H48','none','stroke="#783f37" stroke-width="1.8"')}
  ${path('M-63 -31H59L75 15H-76Z','#c76054','stroke="#443f38" stroke-width="2"')}${path('M-68 -9H65M-76 15Q-8 21 75 15','none','stroke="#783f37" stroke-width="1.8"')}
  ${path('M-65 -29Q-55 -37 -41 -30H45Q59 -38 62 -29','none',`stroke="${snow}" stroke-width="7"`)}
  ${path('M-49 -32Q-58 -38 -56 -50Q-50 -61 -50 -76Q-50 -92 -39 -99Q-30 -105 -19 -96Q-6 -84 -9 -62L-5 -42Q6 -55 21 -50Q34 -44 40 -40L43 -68Q43 -81 52 -78Q61 -74 61 -57L59 -31Z',snow,'stroke="#343b37" stroke-width="2.6"')}
  ${path('M-29 -99Q-35 -110 -42 -104Q-48 -97 -40 -96Z','#343b37','stroke-width="1.5"')}${path('M-45 -47Q-42 -26 -43 -4Q-44 17 -37 16Q-30 11 -34 -10L-33 -44Z','#343b37','stroke="#343b37" stroke-width="1.8"')}
  ${path('M-39 -69l6 3M5 -40Q20 -44 24 -35L26 -26M20 -34L20 -25M15 -34L15 -27M49 -66l10 -2M49 -57l11 -1','none','stroke="#343b37" stroke-width="2"')}
  <g class="woodstock">${path('M12 -56L7 -66Q-7 -69 -3 -78Q0 -85 11 -85L7 -95L16 -91L20 -100L23 -88L31 -93L27 -81L32 -77L26 -70L20 -68L22 -59L31 -55L24 -52L16 -56Z','#edc94c','stroke="#343b37" stroke-width="1.7"')}${path('M8 -78l5 -1M13 -60l-3 8M18 -58l-1 7M8 -52h13','none','stroke="#343b37" stroke-width="1.3"')}</g>
  ${path('M-57 78Q-38 70 -18 78Q8 73 24 78Q46 71 57 79','none',`stroke="${snow}" stroke-width="7"`)}
</g>`;
// Tiny boot prints and winter sprigs make the snow feel lived in.
[[563,766],[553,777],[541,779],[532,790],[519,792],[510,803],[1029,789],[1041,796],[1053,796]].forEach(([x,y])=>{art+=`<ellipse cx="${x}" cy="${y}" rx="3" ry="6" fill="#bfcec0" transform="rotate(38 ${x} ${y})"/>`;});
[[197,824],[1221,817],[397,837],[1020,856],[872,764]].forEach(([x,y])=>{art+=path(`M${x} ${y}v-18m0 12l-8 -7m8 3l7 -10`,'none','stroke="#8d9e85" stroke-width="1.7"');});
art += path('M54 831Q93 817 137 829M1185 851Q1225 837 1251 846','none','stroke="#c4cfc0" stroke-width="1.5"');
// Articulated knees and grounded blades, driven by the shared motion model.
art += `<defs><pattern id="elf-stockings" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#fff0d5"/><rect width="8" height="4" fill="#b95f54"/></pattern></defs><g class="ambient skater-travel"><ellipse cy="3" rx="18" ry="3" fill="#9dbab0" opacity=".22"/>
  ${[-1,1].map((side,i)=>`<path class="skater-leg" data-leg="${i}" d="M${side*4} -27L${side*7} -15L${side*7} -5" fill="none" stroke="url(#elf-stockings)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><g class="skater-boot" data-boot="${i}" transform="translate(${side*7} 0)">${path('M-3 -8H3V-5Q8 -1 9 -6Q14 -3 10 -1H-4Z','#527769','stroke-width="1.2"')}${path('M-5 1H8L10 -1M-2 -1v2M5 -1v2','none','stroke="#647b78" stroke-width="1.2"')}</g>`).join('')}
  <g class="skater-upper">${path('M-6 -48Q0 -51 7 -47L12 -26L5 -29L0 -24L-5 -29L-12 -26Z','#527b66','stroke-width="1.5"')}${path('M-6 -44L-16 -36L-25 -38M7 -44L17 -37L25 -41','none','stroke="#527b66" stroke-width="5"')}${circle(-26,-38,2.8,'#b76658')}${circle(26,-42,2.8,'#b76658')}
  ${path('M-7 -61L-16 -65Q-15 -56 -8 -56M7 -61L16 -65Q15 -56 8 -56','#e8c8a5','stroke-width="1.2"')}
  ${circle(0,-59,8.5,'#e8c8a5')}${path('M-10 -63Q-10 -76 0 -85Q10 -86 16 -74L17 -69Q10 -78 7 -73L10 -62Z','#527b66','stroke-width="1.5"')}${path('M-10 -62L0 -65L10 -62','none','stroke="#b76658" stroke-width="4"')}${circle(17,-69,3,'#edc98d','stroke-width="1"')}${circle(-3,-57,.8,ink)}${circle(3,-57,.8,ink)}${path('M-2 -53Q0 -51 2 -53','none','stroke-width="1"')}
  <g class="skater-scarf">${path('M-4 -48Q-16 -54 -24 -50L-25 -44Q-15 -48 -5 -43Z','#b76658','stroke-width="1.2"')}</g>${path('M-7 -49L-4 -42L0 -47L4 -42L7 -48','#edc98d','stroke-width="1"')}${path('M-8 -34H9','none','stroke="#354d49" stroke-width="4"')}${rect(-2,-37,5,5,'#e7c584',.5)}
</g></g>`;
// Santa and Appa cross the sky in a continuous loop.
art += `<g class="ambient santa-flight"><g class="santa-float" transform="scale(.78)">
  ${path('M44 -9Q129 12 272 -29M43 -5Q147 28 280 -5','none','stroke="#987b53" stroke-width="1.3"')}
  ${appa(path,circle)}
  ${path('M-41 -14Q-63 -44 -39 -53Q-43 -65 -33 -62Q-22 -68 -25 -54Q-3 -44 -14 -12Z','#7c9372','stroke-width="1.8"')}
  ${path('M-14 -18Q-25 -40 -4 -43Q12 -43 19 -16Z','#b75d50','stroke-width="1.8"')}${path('M4 -34L21 -25L34 -28','none','stroke="#b75d50" stroke-width="7"')}${circle(35,-28,3,'#e7c8a1')}
  ${circle(-2,-49,10,'#e7c8a1')}${path('M-11 -47Q-12 -28 3 -34Q12 -40 7 -49L2 -45Z',snow,'stroke-width="1.2"')}${path('M-13 -54Q-7 -80 9 -65L16 -55Q5 -65 -3 -54Z','#b75d50','stroke-width="1.5"')}${path('M-13 -53H8','none',`stroke="${snow}" stroke-width="5"`)}${circle(16,-55,4,snow)}${circle(4,-50,1,ink)}
  ${path('M-57 -21Q-30 -13 24 -18Q39 -19 39 -32Q54 -31 48 -12Q44 8 18 10H-35Q-53 7 -57 -21Z','#ad594e','stroke-width="2"')}${path('M-50 -11Q-11 -3 30 -10','none','stroke="#edc98d" stroke-width="2"')}${path('M-35 12v8M21 11l6 9M-54 21H39Q56 21 57 11Q57 4 51 8','none','stroke="#b4935e" stroke-width="4"')}
</g></g>`;
svg.innerHTML=art;
const nightSky=document.querySelector('#night-sky');
const stars=[[92,102,2.2],[178,215,1.5],[260,115,1.8],[342,255,2.3],[418,102,1.6],[506,190,2.1],[587,93,1.4],[678,196,2.4],[761,112,1.7],[844,244,1.8],[940,92,2.2],[1012,247,1.5],[1262,101,1.9],[1348,220,2.3],[127,330,1.6],[286,362,2.1],[487,310,1.4],[656,365,1.8],[836,330,2.2],[976,376,1.6],[1236,338,1.5],[1378,392,1.8],[218,185,1.3],[565,248,1.4],[884,160,1.5],[1305,288,1.4]];
nightSky.innerHTML=`<defs><radialGradient id="attic-amber-glow"><stop offset="0" stop-color="#ffc45b" stop-opacity=".9"/><stop offset=".34" stop-color="#ffb83f" stop-opacity=".52"/><stop offset="1" stop-color="#ffb83f" stop-opacity="0"/></radialGradient></defs><g class="attic-window-glows" aria-hidden="true">${[[278,397,68],[493,321,76],[728,252,88],[956,338,72],[1152,421,65]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="url(#attic-amber-glow)"/>`).join('')}</g><g class="night-stars" aria-hidden="true">${stars.map(([x,y,r],i)=>`<g class="night-star" style="--twinkle:${(i%7)*.31}s"><circle cx="${x}" cy="${y}" r="${r}"/><path d="M${x} ${y-r*2.6}V${y+r*2.6}M${x-r*2.6} ${y}H${x+r*2.6}"/></g>`).join('')}</g>`;
svg.querySelectorAll('.festive-light').forEach(light=>nightSky.appendChild(light.cloneNode(true)));
const celestialSun=svg.querySelector('.winter-sun');
const celestialMoon=document.createElementNS('http://www.w3.org/2000/svg','g');
celestialMoon.setAttribute('class','winter-moon celestial-toggle');
celestialMoon.setAttribute('role','button');
celestialMoon.setAttribute('tabindex','0');
celestialMoon.setAttribute('aria-label','Switch to daytime');
celestialMoon.innerHTML='<circle class="moon-halo" cx="1116" cy="168" r="62"/><path class="moon-crescent" d="M1148 168A32 32 0 1 1 1116 136A24 24 0 0 0 1148 168Z"/>';
svg.insertBefore(celestialMoon,svg.querySelector('.santa-flight'));
let nightMode=false,celestialBusy=false;
celestialMoon.setAttribute('aria-hidden','true');celestialMoon.setAttribute('tabindex','-1');
function toggleNight(){
  if(celestialBusy)return;
  celestialBusy=true;
  const enteringNight=!nightMode;
  document.body.classList.toggle('night-mode',enteringNight);
  document.body.classList.add(enteringNight?'night-switching-to-night':'night-switching-to-day');
  celestialSun.setAttribute('aria-label',enteringNight?'Switch to daytime':'Switch to night-time');
  celestialMoon.setAttribute('aria-label',enteringNight?'Switch to daytime':'Switch to night-time');
  celestialSun.setAttribute('aria-hidden',String(enteringNight));celestialSun.setAttribute('tabindex',enteringNight?'-1':'0');
  celestialMoon.setAttribute('aria-hidden',String(!enteringNight));celestialMoon.setAttribute('tabindex',enteringNight?'0':'-1');
  window.setTimeout(()=>{document.body.classList.remove('night-switching-to-night','night-switching-to-day');celestialBusy=false;},760);
  nightMode=enteringNight;
}
for(const body of [celestialSun,celestialMoon]){
  body.addEventListener('click',event=>{event.stopPropagation();toggleNight();});
  body.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();event.stopPropagation();toggleNight();}});
}
// The flying team and presents sit behind the village; chimney cats sit above it.
svg.insertBefore(svg.querySelector('.santa-flight'),svg.querySelector('.chimney'));
svg.insertBefore(celestialMoon,svg.querySelector('.santa-flight'));
const eggs=setupEasterEggs(svg);
setupSantaGifts(svg);
setupSnowballGame(svg);
setupMariah(svg);
setupBackgroundMusic();
setupSpeaker(svg);
setupHomeSnowglobe(svg);

// Door coordinates share the illustration's 1440 × 900 design space.
// Future surprises can be connected by day without changing the scene.
const doors = [
  [1,213,475,54,76,'#dce1c2'],[2,293,475,54,76,'#dce1c2'],
  [3,213,605,54,78,'#d4dcc3'],[4,293,605,54,78,'#d4dcc3'],
  [5,423,389,55,77,'#f5dfa9'],[6,509,389,55,77,'#f5dfa9'],
  [7,423,518,55,68,'#f5dfa9'],[8,509,518,55,68,'#f5dfa9'],
  [9,423,632,55,62,'#f5dfa9'],[10,509,632,55,62,'#f5dfa9'],
  [11,650,331,57,82,'#f2cbb1'],[12,752,331,57,82,'#f2cbb1'],
  [13,637,467,49,64,'#f3d0b7'],[14,704,467,49,64,'#f3d0b7'],[15,771,467,49,64,'#f3d0b7'],
  [25,688,628,81,92,'#a65e50','grand'],
  [16,892,410,53,66,'#cfddc7'],[17,970,410,53,66,'#cfddc7'],
  [18,892,525,53,64,'#cfddc7'],[19,970,525,53,64,'#cfddc7'],
  [20,931,631,54,61,'#cfddc7'],
  [21,1089,495,51,63,'#f1d9ac'],[22,1163,495,51,63,'#f1d9ac'],
  [23,1089,615,51,63,'#f1d9ac'],[24,1163,615,51,63,'#f1d9ac']
];
const holder=document.querySelector('#doors');
const gifts=setupGiftModal();
await initializeGiftState();
const doorButtons=new Map();
function updateDoorAvailability(){
  for(const [day,button]of doorButtons){
    button.disabled=!isDayAvailable(day);
    button.setAttribute('aria-label',`Day ${day}${button.disabled?' — not yet available':''}`);
  }
}
function scheduleDoorUnlock(){
  if(ADVENT.mode!=='calendar'||isDayAvailable(25))return;
  const start=Date.UTC(ADVENT.year,11,1,0,30),next=start+(Math.floor((Date.now()-start)/(24*60*60*1000))+1)*24*60*60*1000;
  setTimeout(()=>{updateDoorAvailability();scheduleDoorUnlock();},Math.max(50,next-Date.now()+50));
}
window.addEventListener('focus',updateDoorAvailability);
// Days read across each row, then down each house, from left to right.
doors.sort((a,b)=>a[0]-b[0]).forEach(([day,x,y,w,h,paint,kind='window'])=>{
  const button=document.createElement('button');
  button.className=`door ${kind}`;
  button.style.cssText=`left:${x/14.4}%;top:${y/9}%;width:${w/14.4}%;height:${h/9}%;--paint:${paint};--tilt:${day%4===0?-4:day%3===0?3:0}deg;${kind==='grand'?'--ink:#f7ddba;':''}`;
  button.setAttribute('aria-label',`Day ${day}`);
  button.setAttribute('aria-expanded','false');
  button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-controls','day-gift');
  button.dataset.day=day;
  doorButtons.set(day,button);button.disabled=!isDayAvailable(day);button.setAttribute('aria-label',`Day ${day}${button.disabled?' — not yet available':''}`);
  button.dataset.kind=kind==='grand'?'door':'window';
  button.innerHTML=`<span class="panel"><span class="number">${day}</span></span>`;
  button.addEventListener('click',()=>{
    document.querySelectorAll('.door[data-open="true"]').forEach(other=>{other.dataset.open='false';other.setAttribute('aria-expanded','false');});
    button.dataset.open='true';button.setAttribute('aria-expanded','true');gifts.open(day,button);
  });
  holder.append(button);
});
updateDoorAvailability();scheduleDoorUnlock();
document.addEventListener('keydown',event=>{if(event.key==='Escape'){document.querySelectorAll('.door').forEach(door=>{door.dataset.open='false';door.setAttribute('aria-expanded','false');});document.activeElement?.blur();}});
document.addEventListener('pointerdown',event=>{if(!event.target.closest('.door,dialog')) document.querySelectorAll('.door[data-open="true"]').forEach(door=>{door.dataset.open='false';door.setAttribute('aria-expanded','false');});});

// Lightweight, layered snowfall: capped pixel density and no per-frame DOM work.
const canvas=document.querySelector('#snow'),ctx=canvas.getContext('2d');
const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
const skater=document.querySelector('.skater-travel');
const santa=document.querySelector('.santa-flight');
const skaterUpper=document.querySelector('.skater-upper');
const skaterScarf=document.querySelector('.skater-scarf');
const skaterLegs=[...document.querySelectorAll('.skater-leg')];
const skaterBoots=[...document.querySelectorAll('.skater-boot')];
let width,height,flakes=[],frame,last=0,sceneSeconds=3,skaterSeconds=3;
function poseScene(){
  const flight=santaPose(sceneSeconds+3);
  santa.setAttribute('transform',`translate(${flight.x} ${flight.y}) rotate(${flight.rotation})`);
  const pose=skaterPose(skaterSeconds);
  if(eggs.skaterWaiting){
    pose.lean=0;pose.dip=0;pose.scarf=0;
    pose.feet=pose.feet.map((foot,i)=>({...foot,x:i?8:-8,y:0,kneeX:i?6:-6,kneeY:-15}));
  }
  skater.setAttribute('transform',`translate(${pose.x} ${pose.y}) scale(${pose.scale})`);
  skaterUpper.setAttribute('transform',`translate(0 ${pose.dip}) rotate(${pose.lean} 0 -27)`);
  skaterScarf.setAttribute('transform',`rotate(${pose.scarf} -4 -48)`);
  pose.feet.forEach((foot,i)=>{
    skaterLegs[i].setAttribute('d',`M${i?4:-4} ${-27+pose.dip}L${foot.kneeX} ${foot.kneeY}L${foot.x} ${foot.y-6}`);
    skaterBoots[i].setAttribute('transform',`translate(${foot.x} ${foot.y})`);
  });
}
function resize(){
  width=innerWidth;height=innerHeight;
  const dpr=Math.min(devicePixelRatio||1,2);
  canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
  const count=2*Math.min(155,Math.max(65,Math.round(width*height/8500)));
  flakes=Array.from({length:count},()=>({x:Math.random()*width,y:Math.random()*height,r:2*(.8+Math.random()*2.1),s:17+Math.random()*32,phase:Math.random()*Math.PI*2,opacity:.35+Math.random()*.5}));
  canvas.dataset.flakeCount=String(count);
  canvas.dataset.sizeMultiplier='2';
  if(motion.matches) draw(0);
}
function draw(delta){ctx.clearRect(0,0,width,height);flakes.forEach(f=>{f.y+=f.s*delta;f.x+=(Math.sin(f.y/90+f.phase)*8+8)*delta;if(f.y>height+5){f.y=-5;f.x=Math.random()*width;}if(f.x>width+5)f.x=-5;ctx.beginPath();ctx.arc(f.x,f.y,f.r,0,Math.PI*2);ctx.fillStyle=`rgba(255,255,248,${f.opacity})`;ctx.fill();});}
function animate(time){const delta=last?Math.min((time-last)/1000,.05):0;sceneSeconds+=delta;if(!eggs.skaterWaiting)skaterSeconds+=delta;draw(delta);poseScene();last=time;frame=requestAnimationFrame(animate);}
function syncMotion(){cancelAnimationFrame(frame);last=0;poseScene();document.body.classList.toggle('scene-paused',document.hidden);if(!motion.matches&&!document.hidden)frame=requestAnimationFrame(animate);else draw(0);}
window.addEventListener('resize',resize);motion.addEventListener('change',syncMotion);document.addEventListener('visibilitychange',syncMotion);resize();syncMotion();
