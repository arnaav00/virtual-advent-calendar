// Timing and hit geometry live independently of drawing and browser input.
export const CHIMNEYS=[{x:229,y:306},{x:554,y:260},{x:805,y:185},{x:1014,y:278},{x:1187,y:326}];
export const CAT_RISE=.2, CAT_STAY=2, CAT_FALL=.2, CAT_LIFETIME=CAT_RISE+CAT_STAY+CAT_FALL;
export const CAT_HIDDEN_OFFSET=82;
const smooth=t=>t*t*(3-2*t);
export function catOffset(age){
  if(age<0||age>=CAT_LIFETIME)return CAT_HIDDEN_OFFSET;
  if(age<CAT_RISE)return CAT_HIDDEN_OFFSET*(1-smooth(age/CAT_RISE));
  if(age<=CAT_RISE+CAT_STAY)return 0;
  return CAT_HIDDEN_OFFSET*smooth((age-CAT_RISE-CAT_STAY)/CAT_FALL);
}
export function createRound(){return{cats:[],nextSpawn:0,lastChimney:-1,nextId:0,colors:[]};}
export function advanceRound(round,time,random=Math.random){
  round.cats=round.cats.filter(cat=>cat.hitAt===null?time-cat.born<CAT_LIFETIME:time-cat.hitAt<.42);
  if(time<round.nextSpawn)return;
  round.nextSpawn=time+1;
  if(round.cats.length>=2)return;
  const free=CHIMNEYS.map((_,i)=>i).filter(i=>i!==round.lastChimney&&!round.cats.some(cat=>cat.chimney===i));
  const chimney=free[Math.min(free.length-1,Math.floor(random()*free.length))];
  if(!round.colors.length){
    round.colors=['orange','black','white'];
    for(let i=2;i>0;i--){const j=Math.floor(random()*(i+1));[round.colors[i],round.colors[j]]=[round.colors[j],round.colors[i]];}
  }
  round.cats.push({id:round.nextId++,chimney,color:round.colors.pop(),born:time,hitAt:null});
  round.lastChimney=chimney;
}
export function hitCat(round,time,x,y){
  return round.cats.find(cat=>{
    if(cat.hitAt!==null)return false;
    const base=CHIMNEYS[cat.chimney],offset=catOffset(time-cat.born);
    // A little forgiveness around the ears; never hit the hidden part below the rim.
    const face=((x-base.x)/27)**2+((y-(base.y-29+offset))/30)**2<=1;
    const cap=((x-base.x-3)/23)**2+((y-(base.y-55+offset))/22)**2<=1;
    return y<=base.y+2 && (face||cap);
  });
}
export function snowballDuration(distance){return .24+Math.min(1,distance/1000)*.16;}
export function snowballPose(start,end,t){
  return{x:start.x+(end.x-start.x)*t,y:start.y+(end.y-start.y)*t-Math.sin(Math.PI*t)*65,r:17-12*t};
}
