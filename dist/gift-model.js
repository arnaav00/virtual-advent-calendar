// A stable, varied jewel tone for each calendar day, including on repeat visits.
export function giftPalette(day){
  const hue=(343+(day-1)*137.508)%360,saturation=38+(day*7%15),light=27+(day*3%7);
  return{front:`hsl(${hue} ${saturation}% ${light}%)`,top:`hsl(${hue} ${saturation}% ${light+9}%)`,side:`hsl(${hue} ${saturation}% ${light-7}%)`};
}
export const RIBBON_PULL_DISTANCE=90;
export function pullProgress(dx,dy){return Math.min(1,Math.hypot(dx,dy)/RIBBON_PULL_DISTANCE);}
