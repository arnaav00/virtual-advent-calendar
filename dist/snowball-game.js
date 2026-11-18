import { CHIMNEYS, CAT_HIDDEN_OFFSET, createRound, advanceRound, catOffset, hitCat, snowballDuration, snowballPose } from './game-model.js';
const NS='http://www.w3.org/2000/svg';
function catDrawing(color){
  const fur={orange:'#d69a61',black:'#47534e',white:'#fffaf0'}[color];
  const muzzle=color==='black'?'#79877b':'#fff2d9',eye=color==='black'?'#ead79b':'#354d49';
  return `<g stroke="#354d49" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">
    <path d="M-17 10Q-23 -15 -12 -25H12Q24 -13 17 10Z" fill="${fur}"/>
    <path d="M-19 -29L-21 -54L-7 -45Q0 -48 8 -45L22 -54L20 -28Q18 -15 0 -15Q-18 -15 -19 -29Z" fill="${fur}"/>
    <path d="M-17 -47L-15 -37L-10 -42M17 -47L15 -37L10 -42" fill="#dba998" stroke="#dba998"/>
    ${color==='orange'?'<path d="M-5 -44L-3 -37M4 -44L3 -37M-20 -32L-14 -30M20 -32L14 -30" fill="none" stroke="#a96c44" stroke-width="2.5"/>':''}
    <ellipse cx="0" cy="-24" rx="10" ry="7" fill="${muzzle}" stroke="none"/>
    <g class="cat-eyes"><ellipse cx="-8" cy="-33" rx="2.2" ry="3.1" fill="${eye}" stroke="none"/><ellipse cx="8" cy="-33" rx="2.2" ry="3.1" fill="${eye}" stroke="none"/></g>
    <path class="cat-squint" d="M-11 -34L-6 -31L-11 -28M11 -34L6 -31L11 -28" fill="none" stroke="${eye}" stroke-width="2"/>
    <path d="M-3 -26H3L0 -23Z" fill="#c5827b" stroke="none"/>
    <path class="cat-smile" d="M0 -23v3m0 0q-3 3 -5 0m5 0q3 3 5 0" fill="none"/>
    <ellipse class="cat-meow-mouth" cy="-19" rx="3" ry="4" fill="#62564f" stroke="none"/>
    <path d="M-12 -25L-26 -28M-12 -22L-25 -21M12 -25L26 -28M12 -22L25 -21" stroke="#879288" stroke-width="1"/>
    <path d="M-17 -5Q-23 -12 -22 -2L-20 3Q-12 7 -10 0L-11 -4M17 -5Q23 -12 22 -2L20 3Q12 7 10 0L11 -4" fill="${fur}"/>
    <path class="cat-snow-splat" d="M-9 -33Q-14 -40 -6 -39Q-3 -48 2 -39Q12 -42 10 -35Q18 -30 9 -28Q10 -20 3 -25Q-4 -19 -6 -27Q-15 -26 -9 -33" fill="#fffdf8" stroke="#c9dad6" stroke-width="1"/>
    <g class="cat-santa-cap" transform="rotate(9 0 -46)">
      <path d="M-17 -47Q-17 -64 -6 -70Q9 -79 20 -60L25 -53Q14 -62 10 -59L15 -46Z" fill="#bd655b"/>
      <path d="M-17 -49Q0 -52 17 -48L17 -42Q0 -45 -17 -43Z" fill="#fff7e8"/>
      <circle cx="25" cy="-53" r="5" fill="#fff7e8"/>
      <path d="M-10 -61Q-8 -66 -3 -67" fill="none" stroke="#d89180" stroke-width="1.3"/>
    </g>
  </g>`;
}
export function setupSnowballGame(svg){
  const main=document.querySelector('main');
  const catLayer=document.createElementNS(NS,'g');catLayer.classList.add('chimney-cats');catLayer.setAttribute('aria-hidden','true');svg.append(catLayer);
  const defs=document.createElementNS(NS,'defs');catLayer.append(defs);
  CHIMNEYS.forEach(({x,y},i)=>{
    const clip=document.createElementNS(NS,'clipPath');clip.id=`cat-chimney-${i}`;clip.setAttribute('clipPathUnits','userSpaceOnUse');
    clip.innerHTML=`<rect x="${x-40}" y="${y-85}" width="80" height="86"/>`;defs.append(clip);
  });
  const canvas=document.createElement('canvas');canvas.className='snowball-canvas';canvas.setAttribute('aria-hidden','true');main.append(canvas);
  const ctx=canvas.getContext('2d'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let active=false,round=createRound(),clock=0,last=0,frame=0,shots=[],bursts=[];
  const nodes=new Map();
  let audioContext,meowBuffer;
  // Download locally once. Unlock audio in the key/click gesture, before any hit.
  const audioBytes=fetch('assets/meow.ogg').then(r=>{if(!r.ok)throw Error('Meow file missing');return r.arrayBuffer();}).catch(()=>null);
  function unlockAudio(){
    if(!audioContext){
      audioContext=new (window.AudioContext||window.webkitAudioContext)();
      const volume=audioContext.createGain();volume.gain.value=.35;volume.connect(audioContext.destination);
      audioContext.meowOutput=volume;
      audioBytes.then(bytes=>bytes?audioContext.decodeAudioData(bytes):null).then(buffer=>{meowBuffer=buffer;canvas.dataset.audio=buffer?'ready':'unavailable';}).catch(()=>{canvas.dataset.audio='unavailable';});
    }
    if(audioContext.state==='suspended')audioContext.resume().catch(()=>{});
  }
  function meow(){
    if(!meowBuffer)return;
    const voice=audioContext.createBufferSource();voice.buffer=meowBuffer;voice.connect(audioContext.meowOutput);voice.start();
    voice.onended=()=>voice.disconnect();
  }
  function resize(){
    const dpr=Math.min(devicePixelRatio||1,2);canvas.width=innerWidth*dpr;canvas.height=innerHeight*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  resize();window.addEventListener('resize',resize);
  function renderCats(){
    for(const [id,node]of nodes)if(!round.cats.some(cat=>cat.id===id)){node.remove();nodes.delete(id);}
    round.cats.forEach(cat=>{
      let node=nodes.get(cat.id);
      if(!node){
        node=document.createElementNS(NS,'g');node.classList.add('chimney-cat');node.dataset.chimney=cat.chimney;node.dataset.color=cat.color;node.dataset.catId=cat.id;
        node.setAttribute('clip-path',`url(#cat-chimney-${cat.chimney})`);
        node.innerHTML=`<g class="cat-position"><g class="cat-body">${catDrawing(cat.color)}</g></g>`;catLayer.append(node);nodes.set(cat.id,node);
      }
      const {x,y}=CHIMNEYS[cat.chimney],hit=cat.hitAt!==null;
      let offset=catOffset(clock-cat.born),rotation=0;
      if(hit){const t=(clock-cat.hitAt)/.42;offset=cat.hitOffset+Math.max(0,(t-.45)/.55)*CAT_HIDDEN_OFFSET;rotation=reduced.matches?0:Math.sin(t*Math.PI*4)*10*(1-t);}
      node.classList.toggle('is-hit',hit);node.dataset.state=hit?'hit':offset<1?'ready':'moving';
      node.querySelector('.cat-position').setAttribute('transform',`translate(${x} ${y+offset})`);
      node.querySelector('.cat-body').setAttribute('transform',`rotate(${rotation} 0 -20)`);
    });
  }
  function splash(x,y,hit){
    bursts.push({x,y,start:clock,hit});
  }
  function drawShots(){
    ctx.clearRect(0,0,innerWidth,innerHeight);
    shots=shots.filter(shot=>{
      const t=Math.min(1,(clock-shot.start)/shot.duration),pose=snowballPose(shot.from,shot.to,t);
      if(t>=1){
        const p=new DOMPoint(shot.to.x,shot.to.y).matrixTransform(svg.getScreenCTM().inverse());
        const cat=hitCat(round,clock,p.x,p.y);
        if(cat){cat.hitAt=clock;cat.hitOffset=catOffset(clock-cat.born);meow();}
        splash(shot.to.x,shot.to.y,!!cat);return false;
      }
      if(!reduced.matches){
        const tail=snowballPose(shot.from,shot.to,Math.max(0,t-.065));
        ctx.beginPath();ctx.moveTo(tail.x,tail.y);ctx.lineTo(pose.x,pose.y);ctx.lineWidth=pose.r*1.2;ctx.lineCap='round';ctx.strokeStyle='#ffffff65';ctx.stroke();
      }
      ctx.beginPath();ctx.arc(pose.x,pose.y,pose.r,0,Math.PI*2);ctx.fillStyle='#fffefa';ctx.fill();ctx.lineWidth=1.2;ctx.strokeStyle='#aecac7';ctx.stroke();
      ctx.beginPath();ctx.arc(pose.x+pose.r*.15,pose.y+pose.r*.12,pose.r*.62,.2,1.7);ctx.strokeStyle='#dce9e7';ctx.stroke();
      return true;
    });
    bursts=bursts.filter(burst=>{
      const t=(clock-burst.start)/.32;if(t>=1)return false;
      for(let i=0;i<8;i++){
        const a=i*Math.PI/4,d=(burst.hit?29:19)*t;
        ctx.beginPath();ctx.arc(burst.x+Math.cos(a)*d,burst.y+Math.sin(a)*d+10*t*t,3*(1-t)+.5,0,Math.PI*2);ctx.fillStyle=`rgba(255,255,250,${1-t})`;ctx.fill();
      }return true;
    });
    canvas.dataset.projectiles=String(shots.length);
  }
  function tick(now){
    const delta=last?Math.min((now-last)/1000,.05):0;last=now;
    if(!document.hidden){clock+=delta;advanceRound(round,clock);drawShots();renderCats();}
    if(active)frame=requestAnimationFrame(tick);
  }
  function toggle(value){
    active=value;document.body.classList.toggle('snowball-mode',active);canvas.dataset.active=String(active);
    cancelAnimationFrame(frame);last=0;clock=0;round=createRound();shots=[];bursts=[];
    nodes.forEach(node=>node.remove());nodes.clear();ctx.clearRect(0,0,innerWidth,innerHeight);canvas.dataset.projectiles='0';
    if(active){document.activeElement?.blur();unlockAudio();frame=requestAnimationFrame(tick);}
  }
  document.addEventListener('keydown',event=>{
    if(document.querySelector('dialog[open]'))return;
    if(event.repeat||event.ctrlKey||event.metaKey||event.altKey||event.target.closest('input,textarea,[contenteditable="true"]'))return;
    if(event.key.toLowerCase()==='t'){event.preventDefault();toggle(!active);}
    else if(event.key==='Escape'&&active)toggle(false);
  });
  document.addEventListener('pointerdown',event=>{
    if(!active||event.button!==0)return;
    event.preventDefault();event.stopImmediatePropagation();unlockAudio();
    const from={x:innerWidth/2,y:innerHeight+18},to={x:event.clientX,y:event.clientY};
    shots.push({from,to,start:clock,duration:snowballDuration(Math.hypot(to.x-from.x,to.y-from.y))});
  },true);
  // Consume the matching click so a snowball doesn't also open a window or trigger an egg.
  document.addEventListener('click',event=>{if(active){event.preventDefault();event.stopImmediatePropagation();}},true);
  document.addEventListener('visibilitychange',()=>{last=0;});
}
