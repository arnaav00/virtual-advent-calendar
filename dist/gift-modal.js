import {isOpened,markOpened} from './gift-state.js';
import {playlistCard} from './playlist-gift.js';
import { giftPalette, pullProgress } from './gift-model.js';
import { christmillionCard } from './christmillion-gift.js';
import { btsCard } from './bts-gift.js';
import { snoopyCard } from './snoopy-gift.js';
import { coffeeCard } from './coffee-gift.js';
import { jigsawCard } from './jigsaw-gift.js';
import { cookbookCard } from './cookbook-gift.js';
import { snowglobeCard } from './snowglobe-gift.js';
import { ao3Card } from './ao3-gift.js';
import { tetrisCard } from './tetris-gift.js';
export function setupGiftModal(){
  const dialog=document.createElement('dialog');dialog.id='day-gift';dialog.className='gift-dialog';dialog.setAttribute('aria-label','Open your present');
  dialog.innerHTML=`<button class="gift-close" aria-label="Close gift"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6L18 18M18 6L6 18"/></svg></button>
  <div class="gift-stage"><p class="gift-physical-instruction" hidden></p><svg class="gift-art" viewBox="0 0 600 620" role="group" aria-label="A wrapped present">
    <defs>
      <radialGradient id="gift-aura"><stop stop-color="#ffdc97" stop-opacity=".5"/><stop offset="1" stop-color="#ffdc97" stop-opacity="0"/></radialGradient>
      <linearGradient id="gift-ribbon" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#cba563"/><stop offset=".4" stop-color="#f7df9f"/><stop offset=".65" stop-color="#fbeac0"/><stop offset="1" stop-color="#d0ac6a"/></linearGradient>
      <linearGradient id="gift-inside" x2="0" y2="1"><stop stop-color="#ffd996"/><stop offset="1" stop-color="#a86a35"/></linearGradient>
    </defs>
    <ellipse class="gift-shadow" cx="307" cy="518" rx="186" ry="23" fill="#0b1818" opacity=".23"/>
    <g class="present-interactive" stroke-linejoin="round" stroke-linecap="round">
      <g class="gift-box">
        <path d="M150 315L186 285H486V477L450 508H150Z" fill="var(--gift-side)" stroke="#263c36" stroke-width="2.5"/>
        <path d="M150 315L186 285H486L450 315Z" fill="url(#gift-inside)" stroke="#84623d" stroke-width="2"/>
        <g class="gift-reveal">
          <circle cx="300" cy="232" r="150" fill="url(#gift-aura)" stroke="none"/>
          <g class="gift-heart">
            <path d="M300 266C283 251 236 225 240 194C244 163 282 158 300 186C318 158 356 163 360 194C364 225 317 251 300 266Z" fill="#d37e73" stroke="#714d47" stroke-width="2.5"/>
            <path d="M253 192Q259 177 274 180" fill="none" stroke="#f6b6a1" stroke-width="4"/>
            <path d="M300 266Q302 287 289 298T296 329" fill="none" stroke="#e6c68a" stroke-width="2"/>
          </g>
          <g fill="#ffe6a4" stroke="#c9a265" stroke-width="1.3">
            <path d="M218 211L222 222L233 226L222 230L218 241L214 230L203 226L214 222Z"/>
            <path d="M376 176L380 188L392 192L380 196L376 208L372 196L360 192L372 188Z"/>
            <path d="M347 282L350 290L358 293L350 296L347 304L344 296L336 293L344 290Z"/>
          </g>
        </g>
        <path d="M150 315H450V508H150Z" fill="var(--gift-front)" stroke="#263c36" stroke-width="2.5"/>
        <path d="M161 334V496H438M458 325V491" fill="none" stroke="#fff3cc" stroke-opacity=".16" stroke-width="1.5"/>
        <path d="M150 323H450" stroke="#152f2d" stroke-opacity=".3" stroke-width="9"/>
        <g class="gift-wrap"><path d="M280 318H319V508H280Z" fill="url(#gift-ribbon)" stroke="#b28a4f" stroke-width="1"/><path d="M285 324V500M314 324V500" stroke="#fff3c9" stroke-opacity=".65" stroke-width="1"/></g>
      </g>
      <g class="gift-lid">
        <path d="M137 278L173 246H484L449 278Z" fill="var(--gift-top)" stroke="#263c36" stroke-width="2.5"/>
        <path d="M449 278L484 246V289L449 322Z" fill="var(--gift-side)" stroke="#263c36" stroke-width="2.5"/>
        <path d="M137 278H449V322H137Z" fill="var(--gift-front)" stroke="#263c36" stroke-width="2.5"/>
        <path d="M145 285H439M178 253H473" fill="none" stroke="#fff2ce" stroke-opacity=".24" stroke-width="2"/>
        <g class="lid-ribbon"><path d="M280 278L315 246H354L319 278V322H280Z" fill="url(#gift-ribbon)" stroke="#b28a4f" stroke-width="1.2"/><path d="M286 278L320 250M286 283V316M313 283V316" fill="none" stroke="#fff1c2" stroke-width="1"/></g>
        <g class="gift-tag"><path d="M319 264Q349 278 362 306" fill="none" stroke="#ead4a4" stroke-width="2"/><g transform="rotate(14 374 337)"><path d="M353 310L373 301L395 312V360Q395 366 389 366H359Q353 366 353 360Z" fill="#f5e7c7" stroke="#b5986d" stroke-width="1.5"/><circle cx="373" cy="312" r="3" fill="var(--gift-front)"/><text class="gift-day" x="374" y="350" text-anchor="middle" fill="#584e41" stroke="none" font-family="Georgia,serif" font-size="28"></text></g></g>
        <g class="gift-bow">
          <g class="bow-left"><path d="M300 264C270 222 232 203 222 225C208 256 266 269 300 264Z" fill="url(#gift-ribbon)" stroke="#ad8550" stroke-width="2"/><path d="M287 257Q238 218 230 234Q236 250 272 255" fill="none" stroke="#fff0bf" stroke-width="2"/></g>
          <g class="bow-right"><path d="M302 264C327 222 366 208 374 228C385 255 334 270 302 264Z" fill="url(#gift-ribbon)" stroke="#ad8550" stroke-width="2"/><path d="M315 256Q360 222 365 235Q356 251 331 255" fill="none" stroke="#fff0bf" stroke-width="2"/></g>
          <path class="ribbon-tail-left" d="M295 265Q281 295 253 315L253 299L239 301Q270 281 282 260Z" fill="url(#gift-ribbon)" stroke="#ad8550" stroke-width="1.5"/>
          <path class="ribbon-tail-line" d="M308 264Q380 240 451 271" fill="none" stroke="#ad8550" stroke-width="17"/>
          <path class="ribbon-tail-shine" d="M308 264Q380 240 451 271" fill="none" stroke="url(#gift-ribbon)" stroke-width="14"/>
          <path class="bow-knot" d="M288 254Q300 249 312 254L314 269Q300 276 286 268Z" fill="url(#gift-ribbon)" stroke="#ad8550" stroke-width="2"/>
          <g class="ribbon-handle" role="button" tabindex="0" aria-label="Pull the ribbon to open your gift" transform="translate(451 271)">
            <rect x="-26" y="-25" width="55" height="52" rx="18" fill="transparent" stroke="none"/>
            <path d="M-12 -8L19 -4L10 4L17 14L-15 7Z" fill="url(#gift-ribbon)" stroke="#ad8550" stroke-width="1.5"/>
            <path d="M-8 -3L9 0" stroke="#fff5d5" stroke-width="2"/>
          </g>
        </g>
      </g>
      <g class="gift-confetti" aria-hidden="true"></g>
    </g>
  </svg></div>`;
  document.body.append(dialog);
  const cards={1:playlistCard(1),2:playlistCard(2,3),3:playlistCard(3,2),4:playlistCard(4),5:playlistCard(5),6:playlistCard(6),7:playlistCard(7),8:playlistCard(8),9:christmillionCard(),10:btsCard(),12:snoopyCard(),13:coffeeCard(),14:jigsawCard(),15:cookbookCard(),16:snowglobeCard(),17:ao3Card(),18:tetrisCard()};Object.values(cards).forEach(item=>dialog.append(item.element,item.captureButton));let card=cards[1],currentDay=0;
  const physicalInstruction=dialog.querySelector('.gift-physical-instruction');
  dialog.querySelector('.gift-close').addEventListener('click',()=>close());
  const art=dialog.querySelector('.gift-art'),handle=dialog.querySelector('.ribbon-handle'),left=dialog.querySelector('.bow-left'),right=dialog.querySelector('.bow-right');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let trigger=null,state='closed',drag=null,session=0,animations=[],springFrame=0,suppressClick=false;
  function positionCapture(){
    if(!dialog.open||card.element.hidden||card.captureButton.hidden)return;
    card.captureButton.style.left='auto';card.captureButton.style.right='clamp(16px, 3vw, 38px)';
    card.captureButton.style.top='auto';card.captureButton.style.bottom='clamp(16px, 3vh, 32px)';
  }
  function animate(node,keyframes,options){const animation=node.animate(keyframes,{fill:'forwards',...options});animations.push(animation);return animation.finished.catch(()=>{});}
  function ribbon(dx=0,dy=0){
    const p=pullProgress(dx,dy),x=451+dx,y=271+dy;
    handle.setAttribute('transform',`translate(${x} ${y}) rotate(${p*14})`);
    for(const name of ['.ribbon-tail-line','.ribbon-tail-shine'])dialog.querySelector(name).setAttribute('d',`M308 264Q${380+dx*.45} ${240+dy*.6} ${x} ${y}`);
    left.setAttribute('transform',`translate(300 264) scale(${1-p*.68} ${1-p*.32}) translate(-300 -264)`);
    right.setAttribute('transform',`translate(302 264) scale(${1-p*.9} ${1-p*.45}) translate(-302 -264)`);
    dialog.querySelector('.bow-knot').setAttribute('transform',`rotate(${p*18} 300 262)`);
  }
  function reset(){
    card.hide();Object.values(cards).forEach(item=>item.captureButton.hidden=true);dialog.classList.remove('has-card');
    physicalInstruction.hidden=true;dialog.classList.remove('physical-gift');
    cancelAnimationFrame(springFrame);animations.forEach(a=>a.cancel());animations=[];
    if(drag && handle.hasPointerCapture(drag.id))handle.releasePointerCapture(drag.id);
    drag=null;suppressClick=false;ribbon();dialog.querySelector('.gift-confetti').replaceChildren();
    dialog.classList.remove('unwrapping','revealed','dragging','closing');
    handle.setAttribute('tabindex','0');handle.removeAttribute('aria-disabled');
  }
  async function close(){
    if(state==='closed'||state==='closing')return;
    card.stop();state='closing';const token=++session;cancelAnimationFrame(springFrame);
    if(drag&&handle.hasPointerCapture(drag.id))handle.releasePointerCapture(drag.id);drag=null;
    dialog.classList.add('closing');
    await animate(dialog.classList.contains('has-card')?card.element:dialog.querySelector('.gift-stage'),[{opacity:1},{opacity:0,transform:'translateY(12px) scale(.96)'}],{duration:reduced.matches?0:200,easing:'ease-in'});
    if(token!==session)return;
    dialog.close();state='closed';document.body.classList.remove('gift-open');reset();
    if(trigger){trigger.dataset.open='false';trigger.setAttribute('aria-expanded','false');trigger.focus({preventScroll:true});}
  }
  document.addEventListener('christmillion-close',()=>{if(currentDay===9)void close();});
  async function unwrap(){
    if(state!=='wrapped')return;
    markOpened(currentDay);state='unwrapping';dialog.dataset.state=state;const token=session;
    if(drag&&handle.hasPointerCapture(drag.id))handle.releasePointerCapture(drag.id);drag=null;
    cancelAnimationFrame(springFrame);dialog.classList.remove('dragging');dialog.classList.add('unwrapping');
    handle.setAttribute('tabindex','-1');handle.setAttribute('aria-disabled','true');dialog.querySelector('.gift-close').focus({preventScroll:true});
    await Promise.race([Promise.all([
      animate(dialog.querySelector('.gift-bow'),[{opacity:1,transform:'translate(0,0) rotate(0deg)'},{opacity:0,transform:'translate(100px,80px) rotate(24deg)'}],{duration:reduced.matches?0:470,easing:'cubic-bezier(.4,0,.8,.3)'}),
      animate(dialog.querySelector('.gift-wrap'),[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(160px) rotate(5deg)'}],{duration:reduced.matches?0:580,easing:'cubic-bezier(.4,0,.8,.3)'}),
      animate(dialog.querySelector('.lid-ribbon'),[{opacity:1},{opacity:0}],{duration:reduced.matches?0:400}),
      physicalInstruction.hidden?Promise.resolve():animate(physicalInstruction,[{opacity:1,transform:'translate(-50%,0)'},{opacity:0,transform:'translate(-50%,-8px)'}],{duration:reduced.matches?0:480,easing:'ease-in'})
    ]),new Promise(resolve=>setTimeout(resolve,reduced.matches?0:1150))]);
    physicalInstruction.hidden=true;
    if(token!==session)return;
    animate(dialog.querySelector('.gift-lid'),[{transform:'translateY(0) rotate(0deg)'},{transform:'translateY(-12px) rotate(2deg)',offset:.15},{transform:'translate(-22px,-180px) rotate(-13deg)'}],{duration:reduced.matches?0:1000,easing:'cubic-bezier(.2,.8,.2,1)'});
    await Promise.race([animate(dialog.querySelector('.gift-reveal'),[{opacity:0,transform:'translateY(175px) scale(.5)'},{opacity:1,transform:'translateY(-12px) scale(1.04)',offset:.8},{opacity:1,transform:'translateY(0) scale(1)'}],{delay:reduced.matches?0:240,duration:reduced.matches?0:1050,easing:'cubic-bezier(.2,.7,.2,1)'}),new Promise(resolve=>setTimeout(resolve,reduced.matches?0:1400))]);
    if(token!==session)return;
    state='revealed';dialog.classList.add('revealed');dialog.dataset.state=state;
    if(cards[currentDay]){dialog.classList.add('has-card');card.show();positionCapture();}
    if(!reduced.matches){
      const confetti=dialog.querySelector('.gift-confetti');
      for(let i=0;i<18;i++){
        const piece=document.createElementNS('http://www.w3.org/2000/svg','path');piece.setAttribute('d',i%3?'M-3 -5H3V5H-3Z':'M0 -5L2 -1L6 0L2 2L0 6L-2 2L-6 0L-2 -1Z');piece.setAttribute('fill',['#ebc881','#e5b5a4','#f7e7c0'][i%3]);confetti.append(piece);
        const dx=(i-8.5)*22,dy=-65-Math.sin(i*2.3)*65;
        animate(piece,[{transform:'translate(300px,290px)',opacity:0},{transform:`translate(${300+dx*.7}px,${220+dy}px) rotate(${i*30}deg)`,opacity:1,offset:.35},{transform:`translate(${300+dx}px,${360+Math.abs(dx)*.2}px) rotate(${i*65}deg)`,opacity:0}],{duration:1400,delay:i%4*35,easing:'ease-out'}).then(()=>piece.remove());
      }
    }
  }
  function point(event){return new DOMPoint(event.clientX,event.clientY).matrixTransform(art.getScreenCTM().inverse());}
  handle.addEventListener('pointerdown',event=>{
    if(state!=='wrapped'||event.button!==0)return;
    event.preventDefault();event.stopPropagation();cancelAnimationFrame(springFrame);suppressClick=true;
    drag={id:event.pointerId,start:point(event),dx:0,dy:0};handle.setPointerCapture(event.pointerId);dialog.classList.add('dragging');
  });
  handle.addEventListener('pointermove',event=>{
    if(!drag||event.pointerId!==drag.id)return;
    const p=point(event);drag.dx=p.x-drag.start.x;drag.dy=p.y-drag.start.y;ribbon(drag.dx,drag.dy);
    if(pullProgress(drag.dx,drag.dy)>=1)unwrap();
  });
  function release(event){
    if(!drag||event.pointerId!==drag.id)return;
    const {dx,dy,id}=drag;drag=null;if(handle.hasPointerCapture(id))handle.releasePointerCapture(id);dialog.classList.remove('dragging');
    const start=performance.now();
    const spring=now=>{const p=Math.min(1,(now-start)/(reduced.matches?1:330)),remaining=(1-p)**3;ribbon(dx*remaining,dy*remaining);if(p<1)springFrame=requestAnimationFrame(spring);};
    springFrame=requestAnimationFrame(spring);
  }
  handle.addEventListener('pointerup',release);handle.addEventListener('pointercancel',event=>{release(event);suppressClick=false;});
  handle.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();unwrap();}});
  dialog.addEventListener('pointerdown',event=>{if(!event.target.closest('.ribbon-handle'))suppressClick=false;});
  dialog.addEventListener('click',event=>{if(suppressClick){suppressClick=false;return;}if(currentDay===17||currentDay===18){if(event.target===dialog)close();return;}if(currentDay===10||currentDay===13||currentDay===14||currentDay===16)return;if(!event.target.closest('.present-interactive,.playlist-card,.reaction-start,.bts-gift-card,.snoopy-gift,.coffee-gift,.jigsaw-gift,.cookbook-gift'))close();});
  dialog.addEventListener('cancel',event=>{event.preventDefault();if(currentDay!==10)close();});
  dialog.addEventListener('keydown',event=>{event.stopPropagation();if(event.key==='Escape'){event.preventDefault();if(currentDay!==10)close();}});
  return{
    open(day,source){
      ++session;reset();currentDay=day;card=cards[day]||cards[1];trigger=source;state='wrapped';dialog.dataset.state=state;
      const physicalGift=day===2||day===5||day===6||day===8;dialog.classList.toggle('physical-gift',physicalGift);physicalInstruction.textContent=`Please physically open Gift Box #${day} first before opening it here.`;physicalInstruction.hidden=!physicalGift;
      const colors=giftPalette(day);for(const [name,color]of Object.entries(colors))dialog.style.setProperty(`--gift-${name}`,color);
      dialog.querySelector('.gift-day').textContent=day;dialog.setAttribute('aria-label',`Gift for day ${day}`);
      document.body.classList.add('gift-open');if(!dialog.open)dialog.showModal();
      if(cards[day]&&isOpened(day)){physicalInstruction.hidden=true;state='revealed';dialog.dataset.state=state;dialog.classList.add('has-card','revealed');card.show();positionCapture();}
      animate(dialog.querySelector('.gift-stage'),[{opacity:0,transform:'translateY(32px) scale(.86)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:reduced.matches?0:580,easing:'cubic-bezier(.16,1,.3,1)'});
    }
  };
}
