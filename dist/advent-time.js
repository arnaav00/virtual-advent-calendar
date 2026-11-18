// Preview stays explicitly enabled until the defrost has been approved.
export const ADVENT={mode:'preview',year:2026,previewStepMs:1000};
const DAY=24*60*60*1000;
// 06:00 India Standard Time is 00:30 UTC, independent of the viewer's timezone.
export function adventDay(now,year=ADVENT.year){
  const start=Date.UTC(year,11,1,0,30);
  return Math.max(0,Math.min(25,Math.floor((Number(now)-start)/DAY)+1));
}
// Preview mode keeps every door clickable while the experience is being tested.
// Calendar mode unlocks one gift at each 06:00 IST boundary.
export function isDayAvailable(day,now=Date.now(),config=ADVENT){
  return config.mode==='preview'||adventDay(now,config.year)>=day;
}
export function defrostStage(elapsedMs,now=Date.now(),config=ADVENT){
  return config.mode==='preview'?Math.min(25,Math.max(0,Math.floor(elapsedMs/config.previewStepMs))):adventDay(now,config.year);
}
export function iceShape(progress){
  const p=Math.max(0,Math.min(1,progress)),top=-158*(1-p),half=42*(1-.52*p),depth=9*(1-p);
  // A softened, uneven melting edge; the block recedes down toward the feet.
  const d=`M${-half} ${top+7}Q${-half+2} ${top-2} ${-half+11} ${top+1}Q-13 ${top+6*p} -3 ${top+2}Q10 ${top-3*p} ${half-8} ${top+4*p}Q${half} ${top+2} ${half} ${top+12}L${half-2} -3Q${half-4} 3 ${half-12} 3H${-half+10}Q${-half-2} 2 ${-half} -7Z`;
  return{d,top,half,depth};
}
