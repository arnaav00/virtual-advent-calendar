// Each anchor is the point on the lower arm's last hole nearest its free end.
// Hangers are numbered left-to-right to keep each earring mapped unambiguously.
const hangerAnchors={
 1:{x:.315,y:.416}, // hanger 1, raised to meet its hole
 2:{x:.422,y:.350}, // hanger 2, nudged right
 3:{x:.539,y:.326}, // hanger 3
 4:{x:.635,y:.275}, // hanger 4
 5:{x:.705,y:.226}, // hanger 5, raised slightly to meet its arm
 6:{x:.840,y:.200}  // hanger 6, nudged down and right
};
const pieces=[
 {id:'heart',src:'./assets/earring-heart.png',hangers:[1,2],w:42,h:44},
 {id:'oreo',src:'./assets/earring-oreo.png',hangers:[3,4],w:43,h:43},
 {id:'egg',src:'./assets/earring-egg.png',hangers:[5,6],w:37,h:48},
 {id:'treble',src:'./assets/earring-treble.png',trayPoint:[.56,.68],w:26,h:64,tray:true},
 {id:'note',src:'./assets/earring-note.png',trayPoint:[.66,.64],w:37,h:45,tray:true}
];

export function setupEarringRack(card){
 const scene=document.createElement('div');scene.className='earring-rack-gift-scene';
 scene.innerHTML='<div class="earring-note-card rack-note-card"><p>I noticed you shove all your earrings into one pouch.<br>You should spotlight your favourite ones.</p></div><div class="rack-display"><img class="rack-art" src="./assets/earring-rack.png" alt="A pale blue earring rack with six hangers"><div class="rack-chimes" aria-label="Earrings displayed on the rack"></div></div>';
 card.insertBefore(scene,card.querySelector('.reaction-area'));
 const display=scene.querySelector('.rack-display'),layer=scene.querySelector('.rack-chimes');
 for(const piece of pieces){
  const assignments=piece.tray?[{point:piece.trayPoint}]:piece.hangers.map(hanger=>({hanger,point:[hangerAnchors[hanger].x,hangerAnchors[hanger].y]}));
  assignments.forEach(({hanger,point},index)=>{
   const item=document.createElement('button');item.type='button';item.className=`rack-chime rack-chime-${piece.id}${piece.tray?' rack-chime-tray':''}`;item.style.left=`${point[0]*100}%`;item.style.top=`${point[1]*100}%`;item.style.setProperty('--piece-w',`${piece.w}px`);item.style.setProperty('--piece-h',`${piece.h}px`);if(hanger)item.dataset.hanger=String(hanger);item.setAttribute('aria-label',hanger?`${piece.id} earring on hanger ${hanger}`:`${piece.id} earring on the tray`);item.innerHTML=`<svg class="rack-hook${piece.tray?' tray-hook':''}" viewBox="0 0 18 30" aria-hidden="true"><path d="M9 29V16C9 9 4 8 4 4C4 1 7 0 9 2"/></svg><img src="${piece.src}" alt="" draggable="false">`;
   layer.append(item);
   let angle=0,velocity=0,lastX=null,frame=0,lastTime=0;
   const impulse=amount=>{velocity=Math.max(-2.8,Math.min(2.8,velocity+amount));if(!frame){lastTime=performance.now();frame=requestAnimationFrame(tick);}};
   const baseTransform=piece.tray?'translate(-50%,-50%) rotate(-24deg)':'translate(-50%,-1px)';
   const tick=now=>{const dt=Math.min(.035,(now-lastTime)/1000);lastTime=now;velocity+=(-17*angle-4.1*velocity)*dt;angle+=velocity*dt;item.style.transform=`${baseTransform} rotate(${angle*57.2958}deg)`;if(Math.abs(angle)<.0015&&Math.abs(velocity)<.009){angle=0;velocity=0;item.style.transform=`${baseTransform} rotate(0deg)`;frame=0;return;}frame=requestAnimationFrame(tick);};
   item.addEventListener('pointerenter',event=>{lastX=event.clientX;impulse((Math.random()>.5?1:-1)*(1.25+Math.random()*.45));});
   item.addEventListener('pointermove',event=>{if(lastX!==null){const dx=event.clientX-lastX;if(Math.abs(dx)>1)impulse(dx*.018);}lastX=event.clientX;});
   item.addEventListener('pointerleave',()=>{lastX=null;});
   item.addEventListener('focus',()=>impulse((Math.random()>.5?1:-1)*1.2));
   item.addEventListener('click',()=>impulse((Math.random()>.5?1:-1)*1.5));
  });
 }
 return scene;
}
