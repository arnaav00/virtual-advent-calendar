export const REACTION_SLIDE_MS=1600;

export function missingReactionDays(photos){
  const present=new Set(photos.map(photo=>Number(photo.day)));
  return Array.from({length:25},(_,index)=>index+1).filter(day=>!present.has(day));
}

export function missingReactionAlert(days){
  const formatted=days.length===2?`${days[0]} and ${days[1]}`:days.length>2?`${days.slice(0,-1).join(',')}, and ${days.at(-1)}`:String(days[0]);
  return `You forgot to take a selfie for days ${formatted}!`;
}
