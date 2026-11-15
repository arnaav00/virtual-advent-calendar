const NS='http://www.w3.org/2000/svg';
export function setupSantaGifts(svg){
  const santa=svg.querySelector('.santa-float');
  const gifts=document.createElementNS(NS,'g');gifts.classList.add('santa-gifts');gifts.setAttribute('aria-hidden','true');
  svg.insertBefore(gifts,svg.querySelector('path[fill="url(#ground)"]'));
  const target=document.createElementNS(NS,'g');
  target.setAttribute('class','santa-gift-trigger easter-egg');target.setAttribute('role','button');target.setAttribute('tabindex','0');target.setAttribute('aria-label','Drop presents from Santa’s sleigh');
  target.innerHTML='<rect x="-64" y="-82" width="122" height="110" rx="25" fill="transparent"/>';
  santa.append(target);
  const colors=['#bb655c','#78a497','#e3b85e','#8e91b5','#d296b0'];
  let lastDrop=-Infinity;
  function drop(){
    if(performance.now()-lastDrop<180)return;lastDrop=performance.now();
    const origin=new DOMPoint(-10,3).matrixTransform(svg.getScreenCTM().inverse().multiply(santa.getScreenCTM()));
    for(let i=0;i<5;i++){
      const box=document.createElementNS(NS,'g');box.setAttribute('class','falling-gift');
      box.innerHTML=`<rect x="-12" y="-10" width="24" height="22" rx="2" fill="${colors[i]}" stroke="#354d49" stroke-width="1.5"/><path d="M-13 -7H13M0 -10V12M0 -10Q-14 -22 -10 -12L0 -10Q13 -22 10 -12Z" fill="none" stroke="#fff0cf" stroke-width="3" stroke-linejoin="round"/>`;
      box.setAttribute('transform',`translate(${origin.x} ${origin.y})`);gifts.append(box);
      const drift=(i-2)*34+30;
      const frames=Array.from({length:15},(_,j)=>{const t=j/14;return{offset:t,transform:`translate(${origin.x+drift*t}px,${origin.y-40*t+(850-origin.y)*t*t}px) rotate(${(i-2)*80*t}deg)`,opacity:t>.85?(1-t)/.15:1};});
      const animation=box.animate(frames,{duration:1900,delay:i*100,easing:'linear',fill:'both'});
      animation.finished.then(()=>box.remove());
    }
  }
  target.addEventListener('click',drop);
  target.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();drop();}});
}
