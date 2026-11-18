const designs=[
 {id:'heart',label:'Red crocheted heart',src:'./assets/earring-heart.png',width:52,height:56},
 {id:'oreo',label:'Chocolate sandwich cookie',src:'./assets/earring-oreo.png',width:48,height:56},
 {id:'egg',label:'Fried egg',src:'./assets/earring-egg.png',width:45,height:58},
 {id:'treble',label:'Treble clef',src:'./assets/earring-treble.png',width:34,height:58},
 {id:'note',label:'Double musical note',src:'./assets/earring-note.png',width:38,height:54}
];
const positions=[10,30,50,76,88];

export function setupEarringTryOn(card){
 const scene=document.createElement('div');scene.className='earring-tryon';
 scene.innerHTML=`<div class="earring-note-wrap"><div class="earring-note-card"><p>Your quirky face deserves quirky earrings. Go ahead and visualise how they'd look on our dates.</p><div class="earring-rack" role="group" aria-label="Drag an earring to try it on"></div></div></div><div class="earring-photo-stage"><img class="earring-face" src="./assets/devangshi_ear.jpg" alt="Devangshi wearing sunglasses, with her visible ear ready for an earring"><span class="earring-target" aria-hidden="true"></span></div>`;
 card.insertBefore(scene,card.querySelector('.reaction-area'));
 const rack=scene.querySelector('.earring-rack'),photo=scene.querySelector('.earring-photo-stage'),dragLayer=document.querySelector('#day-gift .earring-drag-layer')||document.createElement('div');
 if(!dragLayer.isConnected){dragLayer.className='earring-drag-layer';document.querySelector('#day-gift').append(dragLayer);}
 let placed=null,drag=null;
 for(let i=0;i<designs.length;i++){
  const design=designs[i],slot=document.createElement('div');slot.className='earring-slot';slot.dataset.earringSlot=design.id;slot.style.setProperty('--slot-x',`${positions[i]}%`);
  slot.innerHTML=`<span class="earring-piercing" aria-hidden="true"></span><button class="earring-item earring-${design.id}" type="button" aria-label="Drag to try the ${design.label.toLowerCase()} earring" style="--item-width:${design.width}px;--item-height:${design.height}px"><svg class="earring-hook" viewBox="0 0 28 46" aria-hidden="true"><path d="M14 45V24C14 14 6 12 5 6C4 1 9-2 13 1"/><path d="M15 43V24C15 15 8 13 7 7"/></svg><img src="${design.src}" alt="" draggable="false"></button>`;
  rack.append(slot);
 }
 const buttons=[...scene.querySelectorAll('.earring-item')];
 function measuredTarget(){const rect=photo.getBoundingClientRect();return{x:rect.width*.693,y:rect.height*.622,rect};}
 function returnToRack(item){
  if(!item)return;
  const old=item.getBoundingClientRect(),slot=item.closest('.earring-slot')||rack.querySelector(`[data-earring-slot="${item.dataset.design}"]`);
  if(!slot)return;
  slot.append(item);item.classList.remove('is-placed','is-dragging');item.style.position='';item.style.left='';item.style.top='';item.style.width='';item.style.height='';item.style.zIndex='';item.style.transformOrigin='';
  const next=item.getBoundingClientRect();item.style.transition='none';item.style.transform=`translate(${old.left-next.left}px,${old.top-next.top}px) rotate(9deg) scale(1.04)`;
  requestAnimationFrame(()=>{item.style.transition='transform .46s cubic-bezier(.2,.75,.25,1)';item.style.transform='';});
  setTimeout(()=>{item.style.transition='';},520);
  if(placed===item)placed=null;
 }
 function settleOnEar(item){
  const {x,y}=measuredTarget();photo.append(item);item.classList.remove('is-dragging');item.classList.add('is-placed');
  item.style.position='absolute';item.style.width='var(--item-width)';item.style.height='var(--item-height)';item.style.left=`calc(${x}px - var(--item-width) / 2)`;item.style.top=`${y-2}px`;item.style.zIndex='4';item.style.transformOrigin='50% 2px';item.style.transform='rotate(0deg)';
  item.animate([{transform:'rotate(12deg) translateY(-7px)'},{transform:'rotate(-5deg) translateY(2px)',offset:.62},{transform:'rotate(2deg)'},{transform:'rotate(0deg)'}],{duration:580,easing:'cubic-bezier(.2,.75,.25,1)'});
  placed=item;
 }
 function hitEar(clientX,clientY){const {x,y,rect}=measuredTarget(),radiusY=rect.height*.1125,centerY=rect.top+y;const dx=(clientX-(rect.left+x))/(rect.width*.14),dy=(clientY-centerY)/radiusY;return dx*dx+dy*dy<=1;}
 function fall(item,left,top,rotation){
  item.classList.remove('is-dragging');item.animate([{transform:`rotate(${rotation}deg)`,top:`${top}px`},{transform:`rotate(${rotation+180}deg) translateX(18px)`,top:`${Math.max(top+20,window.innerHeight*.62)}px`,offset:.45},{transform:`rotate(${rotation+390}deg) translateX(-12px)`,top:`${window.innerHeight+item.offsetHeight+50}px`}],{duration:980,easing:'cubic-bezier(.35,.05,.75,.55)'}).finished.catch(()=>{}).finally(()=>returnToRack(item));
 }
 function move(event){
  if(!drag||event.pointerId!==drag.id)return;const item=drag.item,dx=event.clientX-drag.lastX,dy=event.clientY-drag.lastY;drag.velocityX=drag.velocityX*.58+dx*.42;drag.velocityY=drag.velocityY*.58+dy*.42;drag.targetAngle=Math.max(-24,Math.min(24,drag.velocityX*.9+drag.velocityY*.14));
  item.style.left=`${event.clientX-drag.offsetX}px`;item.style.top=`${event.clientY-drag.offsetY}px`;drag.lastX=event.clientX;drag.lastY=event.clientY;
 }
 function drop(event){
  if(!drag||event.pointerId!==drag.id)return;
  const {item,velocityX,targetAngle}=drag;drag=null;photo.classList.remove('is-dragging');
  if(hitEar(event.clientX,event.clientY)){settleOnEar(item);return;}
  fall(item,parseFloat(item.style.left)||event.clientX,parseFloat(item.style.top)||event.clientY,Math.max(-18,Math.min(18,velocityX*.28+targetAngle)));
 }
 document.addEventListener('pointermove',move);document.addEventListener('pointerup',drop);document.addEventListener('pointercancel',drop);
 buttons.forEach(item=>{
  const slot=item.closest('.earring-slot');item.dataset.design=slot.dataset.earringSlot;
  item.addEventListener('pointerdown',event=>{
   if(event.button!==0||drag)return;event.preventDefault();
   if(placed&&placed!==item)returnToRack(placed);
   const r=item.getBoundingClientRect();drag={id:event.pointerId,item,offsetX:event.clientX-r.left,offsetY:event.clientY-r.top,lastX:event.clientX,lastY:event.clientY,velocityX:0,velocityY:0,targetAngle:0,angle:0,angularVelocity:0,lastFrame:performance.now()};
   item.classList.add('is-dragging');item.style.position='fixed';item.style.left=`${r.left}px`;item.style.top=`${r.top}px`;item.style.width=`${r.width}px`;item.style.height=`${r.height}px`;item.style.zIndex='1000';item.style.transformOrigin='50% 2px';dragLayer.append(item);photo.classList.add('is-dragging');
   const physics=now=>{if(!drag||drag.item!==item)return;const dt=Math.min(.04,(now-drag.lastFrame)/1000);drag.lastFrame=now;drag.angularVelocity+=(drag.targetAngle-drag.angle)*32*dt;drag.angularVelocity*=Math.exp(-9*dt);drag.angle+=drag.angularVelocity*dt;item.style.transform=`rotate(${drag.angle}deg)`;requestAnimationFrame(physics);};requestAnimationFrame(physics);
  });
  item.addEventListener('keydown',event=>{if(event.key!=='Enter'&&event.key!==' ')return;event.preventDefault();if(placed===item)returnToRack(item);else{if(placed)returnToRack(placed);settleOnEar(item);}});
 });
}
