// Deadline-based countdown: delayed frames never add extra seconds.
export function startCountdown({onTick,onComplete,now=()=>performance.now(),schedule=setTimeout,cancel=clearTimeout}){
 const deadline=now()+5000;let timer,stopped=false,last;
 function tick(){if(stopped)return;const remaining=Math.max(0,Math.ceil((deadline-now())/1000));if(remaining!==last){last=remaining;onTick(remaining);}if(!remaining){stopped=true;onComplete();return;}timer=schedule(tick,100);}
 tick();return()=>{stopped=true;cancel(timer);};
}
