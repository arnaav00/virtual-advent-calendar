const svg = document.querySelector('#landscape');
const ink = '#354d49', snow = '#fffdf3';
const stroke = `stroke="${ink}" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"`;
const path = (d, fill = 'none', extra = '') => {
  const attributes = {stroke: ink, 'stroke-width': '2.3', 'stroke-linecap': 'round', 'stroke-linejoin': 'round'};
  for (const match of extra.matchAll(/([\w-]+)="([^"]*)"/g)) attributes[match[1]] = match[2];
  return `<path d="${d}" fill="${fill}" ${Object.entries(attributes).map(([key,value])=>`${key}="${value}"`).join(' ')}/>`;
};
const rect = (x,y,w,h,fill,rx=0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${stroke}/>`;
const circle = (x,y,r,fill,extra='') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${stroke} ${extra}/>`;
function tree(x,y,s=1,paint='#54796b'){
  return `<g transform="translate(${x} ${y}) scale(${s})">${path('M0 0L0 -170',ink)}${path('M0 -190Q-12 -160 -33 -139L-19 -140Q-34 -105 -57 -84L-37 -88Q-51 -54 -77 -23Q-20 -4 0 -9Q35 -3 77 -23Q49 -54 38 -88L58 -84Q34 -110 20 -140L34 -139Q12 -166 0 -190',paint)}${path('M0 -190Q-12 -160 -33 -139Q-23 -132 -13 -143Q-2 -134 7 -144Q17 -134 34 -139Q12 -166 0 -190',snow)}${path('M-37 -101Q-24 -91 -10 -102Q0 -92 12 -101Q26 -90 40 -101','none',`stroke="${snow}" stroke-width="8"`)}${path('M-60 -43Q-44 -32 -27 -44Q-11 -32 3 -44Q22 -31 37 -43Q47 -34 61 -43','none',`stroke="${snow}" stroke-width="9"`)}</g>`;
}
function wreath(x,y,s=1){
  return `<g transform="translate(${x} ${y}) scale(${s})">${circle(0,0,15,'#547463')}${circle(0,0,8,'#e8c4b3')}${path('M0 14Q-22 4 -14 22Q-7 28 0 14Q20 4 15 23Q8 28 0 14','#aa584b')}${path('M-3 21L-7 33M3 21L8 30','none','stroke="#aa584b" stroke-width="5"')}${[[-9,-8],[10,-7],[-12,5],[12,5]].map(([a,b])=>circle(a,b,2.5,'#e9c98b')).join('')}</g>`;
}
function chimney(x,y,paint){return `<g>${rect(x,y,28,77,paint)}${rect(x-5,y-4,38,10,snow,4)}${path(`M${x+5} ${y+20}h10m-1 12h12m-20 14h12`,'none','opacity=".35"')}</g>`;}
function roof(x,y,w,h,color){return `${path(`M${x-13} ${y+7}L${x+w/2} ${y-h}L${x+w+13} ${y+7}L${x+w+6} ${y+20}L${x+w/2} ${y-h+20}L${x-6} ${y+20}Z`,color)}${path(`M${x-18} ${y+5}Q${x-24} ${y-3} ${x-12} ${y-9}L${x+w/2-9} ${y-h-11}Q${x+w/2} ${y-h-18} ${x+w/2+11} ${y-h-9}L${x+w+18} ${y-4}Q${x+w+27} ${y+9} ${x+w+13} ${y+12}Q${x+w+3} ${y+16} ${x+w-1} ${y+6}L${x+w/2} ${y-h+5}L${x+8} ${y+7}Q${x+1} ${y+23} ${x-6} ${y+11}Z`,snow)}`;}
function attic(x,y,r=18){return `${circle(x,y,r,'#f0d79b')}${path(`M${x-r+2} ${y}h${r*2-4}M${x} ${y-r+2}v${r*2-4}`)}${circle(x,y,r+5,'none')}`;}
let art = `<defs><radialGradient id="moon"><stop stop-color="#fff8da"/><stop offset="1" stop-color="#f6e3b5"/></radialGradient><linearGradient id="ground" x2="0" y2="1"><stop stop-color="#fffdf3"/><stop offset="1" stop-color="#e9ede4"/></linearGradient></defs>`;
// A quiet moonlit sky and distant snowy hills.
art += `<circle cx="1116" cy="168" r="53" fill="#f7e8bf" opacity=".25"/><circle cx="1116" cy="168" r="39" fill="url(#moon)"/>`;
art += path('M1125 136Q1094 168 1124 196Q1072 181 1083 151Q1095 128 1125 136','#ecece2','stroke="none"');
art += path('M-1440 590H0Q85 455 205 525Q337 359 470 501Q596 414 722 495Q914 405 1042 502Q1207 393 1440 556H2880V1800H-1440Z','#dce4d9','stroke="none"');
art += path('M-1440 650H0Q163 547 293 610Q446 513 575 601Q804 479 995 584Q1217 518 1440 617H2880V1800H-1440Z','#ceddce','stroke="none"');
art += [tree(137,683,.9,'#8ba493'),tree(1271,689,.95,'#8ba493'),tree(345,605,.72,'#a5b7a1'),tree(1018,595,.8,'#9aaf9c')].join('');
art += path('M-1440 738H0Q115 684 252 711Q472 659 694 710Q917 667 1119 700Q1310 669 1440 726H2880V1800H-1440Z','url(#ground)','stroke="none"');
// Five houses, each with its own silhouette and small architectural details.
art += chimney(215,344,'#c3cdb6');
art += rect(183,431,190,288,'#b8c7b4',3);
art += path('M183 431L278 328L373 431Z','#b8c7b4');
art += roof(183,431,190,110,'#54776a');
art += attic(278,397,15);
art += path('M193 444V706M363 444V706M183 578H373','none','opacity=".45"');
art += rect(173,710,211,15,snow,5);
art += chimney(540,264,'#cb967d');
art += rect(397,358,192,368,'#e9c79e',2);
art += path('M397 358L493 254L589 358Z','#e9c79e');
art += roof(397,358,192,110,'#ac6554');
art += attic(493,321,17);
art += path('M407 372V715M579 372V715M398 491H589M398 612H589','none','opacity=".3"');
art += rect(387,717,213,16,snow,5);
// The pink house is the heart of the village.
art += chimney(791,189,'#c58176');
art += rect(613,302,231,428,'#e1ada1',2);
art += path('M613 302L728 174L844 302Z','#e1ada1');
art += roof(613,302,231,135,'#875349');
art += attic(728,252,22);
art += path('M625 315V716M831 315V716M613 439H844M613 554H844','none','opacity=".4"');
art += rect(600,720,257,16,snow,5);
art += path('M668 731L659 747H800L791 731','#e7d7c3');
art += path('M659 747L650 757H809L800 747',snow);
art += wreath(729,586,1.05);
art += rect(867,373,178,352,'#9db8ae',3);
art += path('M867 373L956 272L1045 373Z','#9db8ae');
art += roof(867,373,178,109,'#4b7067');
art += attic(956,338,16);
art += path('M878 388V714M1034 388V714M867 499H1045M867 612H1045','none','opacity=".35"');
art += rect(857,716,198,16,snow,5);
art += chimney(1173,369,'#c89376');
art += rect(1065,459,174,267,'#e5c6a1',3);
art += path('M1065 459L1152 360L1239 459Z','#e5c6a1');
art += roof(1065,459,174,107,'#aa6b53');
art += attic(1152,421,14);
art += path('M1076 475V713M1228 475V713M1065 583H1239','none','opacity=".4"');
art += rect(1055,718,195,15,snow,5);
// Small masonry flecks and frosted roof icicles.
[[198,680],[338,601],[419,581],[553,384],[630,472],[807,679],[880,582],[1016,636],[1082,614],[1203,493]].forEach(([x,y])=>{art+=path(`M${x} ${y}h13m-6 7h13`,'none','opacity=".25" stroke-width="1.5"');});
[[189,442],[357,439],[406,367],[576,367],[622,312],[830,313],[877,384],[1031,384],[1072,469],[1225,469]].forEach(([x,y],i)=>{art+=path(`M${x} ${y}l3 ${12+i%3*3}l3 -${12+i%3*3}`,snow,'stroke-width="1.2"');});
// Color-changing Christmas lights follow every roof, clear of the windows.
art += '<g class="ambient christmas-lights">';
[[183,431,190,110],[397,358,192,110],[613,302,231,135],[867,373,178,109],[1065,459,174,107]].forEach(([x,y,w,h],house)=>{
  art += path(`M${x+4} ${y+16}L${x+w/2} ${y-h+27}L${x+w-4} ${y+16}`,'none','stroke-width="1.5"');
  for(let i=0;i<11;i++){
    const t=i/10,bx=x+4+t*(w-8),by=y+16-(1-Math.abs(2*t-1))*(h-11),delay=-(i*.43+house*1.2);
    art += `<g class="festive-light" style="--delay:${delay}s">${path(`M${bx} ${by}v5`,'none','stroke-width="1.2"')}<circle class="light-halo" cx="${bx}" cy="${by+9}" r="10" fill="currentColor"/><ellipse class="bulb" cx="${bx}" cy="${by+9}" rx="3.5" ry="5" fill="currentColor" stroke="${ink}" stroke-width="1"/><circle cx="${bx-1}" cy="${by+7}" r="1.2" fill="#fffdf3" opacity=".85"/></g>`;
  }
});
art += '</g>';
// Snow banks, fir trees, and a little frozen village pond.
art += path('M35 776Q111 739 192 752M259 752Q338 728 405 746M849 750Q945 731 1033 748M1224 754Q1312 736 1381 769','none','stroke="#bdcdbf" stroke-width="1.5"');
art += `<g class="pond">${path('M475 802C517 766 615 772 695 775C800 769 925 771 982 807C1050 853 924 882 768 881C618 887 449 867 459 832Q459 813 475 802Z','#dce9e4','stroke="#a6beb5" stroke-width="1.5"')}${path('M475 799C534 770 613 775 695 778M784 779Q925 775 981 810M987 852Q921 882 787 883M682 880Q521 879 472 852','none',`stroke="${snow}" stroke-width="10"`)}${path('M524 819C584 793 884 790 947 819C994 852 662 877 539 840M576 836C647 861 895 850 916 827','none','stroke="#b8d0c7" stroke-width="1.4"')}${path('M563 807h43m242 57h39m29 -53h23m-262 58h20','none','stroke="#fffdf3" stroke-width="2.5"')}</g>`;
art += tree(115,768,1.17,'#4d7062');
art += tree(1303,759,1.24,'#597968');
art += tree(1363,805,.72,'#78917b');
art += tree(65,807,.64,'#78917b');
// Little fence behind the snowman.
art += path('M192 767L346 774M192 783L346 790','none','stroke="#8b9a84" stroke-width="5"');
[200,227,254,281,308,335].forEach((x,i)=>{art+=rect(x,752+i,8,46,'#bdc6ab',3);});
art += path('M188 751Q266 755 348 760','none',`stroke="${snow}" stroke-width="8"`);
// A scarf-wearing snow friend.
art += `<g transform="translate(339 786) rotate(-6)">${path('M-25 -24L-54 -47M-47 -42L-48 -55M25 -25L49 -45M44 -40L56 -41','none','stroke="#856c54" stroke-width="3"')}${circle(0,-11,29,snow)}${circle(0,-48,21,snow)}${path('M-22 -36Q0 -26 22 -37L23 -28Q0 -17 -22 -27Z','#b56856')}${path('M11 -29L16 -5L28 -9L21 -32','#b56856')}${path('M-20 -64L21 -64L14 -70L12 -89L-11 -89L-13 -68Z','#3e6055')}${circle(-7,-51,1.5,ink)}${circle(7,-51,1.5,ink)}${path('M0 -47L18 -44L0 -40Z','#cf9361')}${circle(0,-12,2,ink)}${circle(0,1,2,ink)}</g>`;
// A little sleepy fox, curled up in the snow.
art += `<g transform="translate(1117 792)">${path('M-30 7Q-37 -15 -17 -23L-20 -41L-4 -30L12 -30L24 -41L23 -18Q48 -10 44 12Q11 33 -30 7','#bd7c54')}${path('M-20 -18Q0 -2 23 -18L14 2H-7Z','#f5e4c6')}${path('M43 10Q24 -8 -3 6Q-18 22 -29 8Q-18 35 17 27Q40 24 43 10','#d19465')}${path('M-3 6Q-18 22 -29 8Q-22 28 -4 29L6 22Z',snow)}${path('M-12 -13l5 2m14 0l5 -2','none','stroke-width="1.5"')}${circle(0,-3,2,ink)}</g>`;
// Tiny boot prints and winter sprigs make the snow feel lived in.
[[563,766],[553,777],[541,779],[532,790],[519,792],[510,803],[1029,789],[1041,796],[1053,796]].forEach(([x,y])=>{art+=`<ellipse cx="${x}" cy="${y}" rx="3" ry="6" fill="#bfcec0" transform="rotate(38 ${x} ${y})"/>`;});
[[197,824],[1221,817],[397,837],[1020,856],[872,764]].forEach(([x,y])=>{art+=path(`M${x} ${y}v-18m0 12l-8 -7m8 3l7 -10`,'none','stroke="#8d9e85" stroke-width="1.7"');});
art += path('M54 831Q93 817 137 829M1185 851Q1225 837 1251 846','none','stroke="#c4cfc0" stroke-width="1.5"');
// A scarf-wearing skater traces a continuous oval around the pond.
art += `<g class="ambient skater-travel"><ellipse cy="3" rx="18" ry="4" fill="#9dbab0" opacity=".26"/><g class="skater-facing"><g class="skater-bob">
  <g class="skate-leg back">${path('M-4 -19L-13 -8L-21 -6','none','stroke="#48665f" stroke-width="6"')}${path('M-25 -3L-15 -3L-12 -5','none','stroke="#6f8278" stroke-width="2"')}${path('M-24 -7h9v4h-11Z',snow,'stroke-width="1.3"')}</g>
  <g class="skate-leg front">${path('M3 -20L6 -10L13 -6','none','stroke="#48665f" stroke-width="6"')}${path('M7 -2H22L25 -5','none','stroke="#6f8278" stroke-width="2"')}${path('M8 -7h13v4H7Z',snow,'stroke-width="1.3"')}</g>
  ${path('M-7 -43Q0 -46 8 -40L14 -20Q1 -14 -13 -22Z','#bd6b61','stroke-width="1.6"')}${path('M6 -37L21 -30L29 -36M-7 -37L-21 -29L-29 -33','none','stroke="#bd6b61" stroke-width="6"')}${circle(30,-37,3,'#e8c8a5')}${circle(-30,-34,3,'#e8c8a5')}
  ${circle(0,-53,10,'#e8c8a5')}${path('M-10 -55Q-11 -69 2 -67Q13 -65 10 -54Z','#557b70','stroke-width="1.5"')}${path('M-11 -54H11','none','stroke="#d2ddbd" stroke-width="4"')}${circle(1,-69,4,'#d2ddbd')}${circle(5,-51,1,ink)}${path('M9 -50l4 2l-4 1','#e8c8a5','stroke-width="1"')}
  <g class="skater-scarf">${path('M-5 -42Q-25 -51 -33 -44L-31 -36Q-19 -44 -5 -37Z','#edc98d','stroke-width="1.3"')}</g>${path('M-8 -43L8 -41','none','stroke="#edc98d" stroke-width="5"')}
</g></g></g>`;
// Santa and two reindeer cross the clear sky, then return after a quiet pause.
function reindeer(x,y,delay){return `<g transform="translate(${x} ${y})"><g class="reindeer-bob" style="--delay:${delay}s">${path('M-22 -8Q-7 -19 9 -10L16 -27L26 -25L25 -9L14 1Q-3 10 -21 2Z','#b88a60','stroke-width="1.6"')}${path('M-22 -4l-9 -6','none','stroke="#b88a60" stroke-width="4"')}<g class="reindeer-legs" style="--delay:${delay}s">${path('M-16 1L-24 11L-15 17M-4 4L2 13L-3 20M12 0L23 8L31 4','none','stroke="#805e48" stroke-width="3"')}</g>${path('M18 -27L15 -38L10 -41M16 -34L23 -40M25 -26L30 -37L36 -40M31 -34L38 -33','none','stroke="#805e48" stroke-width="2"')}${circle(27,-21,2,'#a65e50')}${circle(22,-24,1,ink)}${path('M13 -13L26 -8','none','stroke="#a65e50" stroke-width="3"')}</g></g>`;}
art += `<g class="ambient santa-flight"><g class="santa-float" transform="scale(.78)">
  ${path('M44 -9Q112 4 156 -12M43 -5Q160 19 224 -20','none','stroke="#987b53" stroke-width="1.5"')}
  ${reindeer(139,-8,-.3)}${reindeer(211,-16,-.9)}
  ${path('M-41 -14Q-63 -44 -39 -53Q-43 -65 -33 -62Q-22 -68 -25 -54Q-3 -44 -14 -12Z','#7c9372','stroke-width="1.8"')}
  ${path('M-14 -18Q-25 -40 -4 -43Q12 -43 19 -16Z','#b75d50','stroke-width="1.8"')}${path('M4 -34L21 -25L34 -28','none','stroke="#b75d50" stroke-width="7"')}${circle(35,-28,3,'#e7c8a1')}
  ${circle(-2,-49,10,'#e7c8a1')}${path('M-11 -47Q-12 -28 3 -34Q12 -40 7 -49L2 -45Z',snow,'stroke-width="1.2"')}${path('M-13 -54Q-7 -80 9 -65L16 -55Q5 -65 -3 -54Z','#b75d50','stroke-width="1.5"')}${path('M-13 -53H8','none',`stroke="${snow}" stroke-width="5"`)}${circle(16,-55,4,snow)}${circle(4,-50,1,ink)}
  ${path('M-57 -21Q-30 -13 24 -18Q39 -19 39 -32Q54 -31 48 -12Q44 8 18 10H-35Q-53 7 -57 -21Z','#ad594e','stroke-width="2"')}${path('M-50 -11Q-11 -3 30 -10','none','stroke="#edc98d" stroke-width="2"')}${path('M-35 12v8M21 11l6 9M-54 21H39Q56 21 57 11Q57 4 51 8','none','stroke="#b4935e" stroke-width="4"')}
</g></g>`;
svg.innerHTML=art;

// Door coordinates share the illustration's 1440 × 900 design space.
// Future surprises can be connected by day without changing the scene.
const doors = [
  [7,213,475,54,76,'#dce1c2'],[18,293,475,54,76,'#dce1c2'],
  [3,213,605,54,78,'#d4dcc3'],[12,293,605,54,78,'#d4dcc3'],
  [14,423,389,55,77,'#f5dfa9'],[2,509,389,55,77,'#f5dfa9'],
  [21,423,518,55,68,'#f5dfa9'],[9,509,518,55,68,'#f5dfa9'],
  [16,423,632,55,62,'#f5dfa9'],[15,509,632,55,62,'#f5dfa9'],
  [5,650,331,57,82,'#f2cbb1'],[23,752,331,57,82,'#f2cbb1'],
  [11,637,467,49,64,'#f3d0b7'],[1,704,467,49,64,'#f3d0b7'],[19,771,467,49,64,'#f3d0b7'],
  [25,688,628,81,92,'#a65e50','grand'],
  [8,892,410,53,66,'#cfddc7'],[17,970,410,53,66,'#cfddc7'],
  [4,892,525,53,64,'#cfddc7'],[22,970,525,53,64,'#cfddc7'],
  [13,931,631,54,61,'#cfddc7'],
  [20,1089,495,51,63,'#f1d9ac'],[6,1163,495,51,63,'#f1d9ac'],
  [10,1089,615,51,63,'#f1d9ac'],[24,1163,615,51,63,'#f1d9ac']
];
const holder=document.querySelector('#doors');
// Tab order follows the days, while their visual arrangement stays playful.
doors.sort((a,b)=>a[0]-b[0]).forEach(([day,x,y,w,h,paint,kind='window'])=>{
  const button=document.createElement('button');
  button.className=`door ${kind}`;
  button.style.cssText=`left:${x/14.4}%;top:${y/9}%;width:${w/14.4}%;height:${h/9}%;--paint:${paint};--tilt:${day%4===0?-4:day%3===0?3:0}deg;${kind==='grand'?'--ink:#f7ddba;':''}`;
  button.setAttribute('aria-label',`Day ${day}`);
  button.setAttribute('aria-expanded','false');
  button.dataset.day=day;
  button.dataset.kind=kind==='grand'?'door':'window';
  button.innerHTML=`<span class="panel"><span class="number">${day}</span></span>`;
  button.addEventListener('click',()=>{
    const open=button.dataset.open!=='true';
    document.querySelectorAll('.door[data-open="true"]').forEach(other=>{other.dataset.open='false';other.setAttribute('aria-expanded','false');});
    button.dataset.open=String(open);button.setAttribute('aria-expanded',String(open));
  });
  holder.append(button);
});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){document.querySelectorAll('.door').forEach(door=>{door.dataset.open='false';door.setAttribute('aria-expanded','false');});document.activeElement?.blur();}});
document.addEventListener('pointerdown',event=>{if(!event.target.closest('.door')) document.querySelectorAll('.door[data-open="true"]').forEach(door=>{door.dataset.open='false';door.setAttribute('aria-expanded','false');});});

// Lightweight, layered snowfall: capped pixel density and no per-frame DOM work.
const canvas=document.querySelector('#snow'),ctx=canvas.getContext('2d');
const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
let width,height,flakes=[],frame,last=0;
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
function animate(time){draw(last?Math.min((time-last)/1000,.05):0);last=time;frame=requestAnimationFrame(animate);}
function syncMotion(){cancelAnimationFrame(frame);last=0;document.body.classList.toggle('scene-paused',document.hidden);if(!motion.matches&&!document.hidden)frame=requestAnimationFrame(animate);else draw(0);}
window.addEventListener('resize',resize);motion.addEventListener('change',syncMotion);document.addEventListener('visibilitychange',syncMotion);resize();syncMotion();
