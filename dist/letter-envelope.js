import {isLetterOpened,markLetterOpened} from './gift-state.js';
export function setupEnvelope(card,day){
 const content=document.createElement('div');content.className='letter-content';while(card.firstChild)content.append(card.firstChild);card.append(content);
 const envelope=document.createElement('div');envelope.className='sealed-envelope';envelope.innerHTML=`<div class="envelope-body"><div class="envelope-inside"></div><div class="envelope-paper"><span>Dear Devangshi,</span><i></i><i></i><i></i></div><div class="envelope-pocket"></div><div class="envelope-flap"></div><button class="envelope-seal" aria-label="Open the heart-sealed envelope"><svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 49 15 34C0 19 22 7 32 22 42 7 64 19 49 34Z"/></svg></button></div>`;card.prepend(envelope);
 const button=envelope.querySelector('button');let generation=0,animations=[],opening=false;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function animate(node,frames,duration,delay=0){const animation=node.animate(frames,{duration:reduced.matches?0:duration,delay:reduced.matches?0:delay,easing:'cubic-bezier(.22,.7,.2,1)',fill:'forwards'});animations.push(animation);return animation.finished.catch(()=>{});}
 function cancel(){generation++;animations.forEach(a=>a.cancel());animations=[];opening=false;}
 function reset(){cancel();const opened=isLetterOpened(day);card.classList.toggle('awaiting-envelope',!opened);content.hidden=!opened;content.inert=!opened;envelope.hidden=opened;button.disabled=false;}
 button.onclick=async()=>{if(opening)return;opening=true;button.disabled=true;const token=generation;
  await animate(button,[{transform:'translate(-50%,-50%) scale(1)',opacity:1},{transform:'translate(-50%,-35%) rotate(-12deg) scale(1.12)',opacity:.8,offset:.55},{transform:'translate(-50%,70%) rotate(-24deg) scale(.9)',opacity:0}],360);
  if(token!==generation)return;
  const flap=envelope.querySelector('.envelope-flap');await animate(flap,[{transform:'rotateX(0deg)'},{transform:'rotateX(178deg)'}],720);flap.style.zIndex='0';
  if(token!==generation)return;
  await animate(envelope.querySelector('.envelope-paper'),[{transform:'translateY(0)'},{transform:'translateY(-130px) rotate(-2deg)'}],780);
  if(token!==generation)return;
  await animate(envelope,[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(65px) scale(.96)'}],360);
  if(token!==generation)return;
  markLetterOpened(day);envelope.hidden=true;content.hidden=false;content.inert=false;card.classList.remove('awaiting-envelope');card.dispatchEvent(new Event('letter-content-opened'));await animate(content,[{opacity:0,transform:'translateY(24px) scale(.96)'},{opacity:1,transform:'none'}],650);if(token===generation)content.querySelector('.letter-watch').focus({preventScroll:true});
 };
 return{reset(){reset();envelope.querySelector('.envelope-flap').style.zIndex='';},cancel};
}
