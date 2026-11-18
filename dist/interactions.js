import { doveMarkup } from './characters.js';
import { dovePose } from './motion.js';
const NS='http://www.w3.org/2000/svg';
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function group(parent,children,className){
  const g=document.createElementNS(NS,'g');g.setAttribute('class',className);
  parent.append(g);children.forEach(child=>g.append(child));return g;
}
async function tween(element,frames,duration,easing='ease-in-out'){
  const animation=element.animate(frames,{duration,easing,fill:'forwards'});
  await animation.finished;return animation;
}
function button(element,label,action){
  element.classList.add('easter-egg');element.setAttribute('role','button');
  element.setAttribute('tabindex','0');element.setAttribute('aria-label',label);
  const activate=async()=>{
    if(element.dataset.busy==='true')return;
    element.dataset.busy='true';element.setAttribute('aria-busy','true');
    try{await action();}finally{element.dataset.busy='false';element.removeAttribute('aria-busy');}
  };
  element.addEventListener('click',activate);
  element.addEventListener('keydown',event=>{
    if(event.key==='Enter'||event.key===' '){event.preventDefault();activate();}
  });
}
export function setupEasterEggs(svg){
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const state={skaterWaiting:false};
  // A stable transparent target prevents hover flicker as her arms change pose.
  const skater=svg.querySelector('.skater-travel');
  skater.classList.add('easter-egg');skater.setAttribute('tabindex','0');
  skater.setAttribute('role','button');skater.setAttribute('aria-label','Pause the ice skater');
  const hit=document.createElementNS(NS,'rect');
  for(const [key,value]of Object.entries({x:-36,y:-90,width:72,height:100,fill:'transparent',class:'skater-hit'}))hit.setAttribute(key,value);
  skater.append(hit);
  const upper=skater.querySelector('.skater-upper'),arms=[...upper.children].slice(1,4);
  group(upper,arms,'skater-moving-arms');
  const waitingArms=document.createElementNS(NS,'g');waitingArms.setAttribute('class','skater-waiting-arms');
  waitingArms.innerHTML='<path d="M-6 -44L-18 -36L-9 -29M7 -44L16 -48" fill="none" stroke="#527b66" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="-9" cy="-29" r="2.8" fill="#b76658"/><g transform="translate(16 -48)"><g class="skater-wave"><path d="M0 0L2 -14" fill="none" stroke="#527b66" stroke-width="4.5" stroke-linecap="round"/><path d="M0 -12L-1 -17Q0 -19 2 -17L4 -19Q7 -19 7 -16L5 -11Z" fill="#b76658" stroke="#354d49" stroke-width="1"/></g></g>';
  upper.append(waitingArms);
  let hovered=false,focused=false;
  const update=()=>{state.skaterWaiting=hovered||focused;skater.classList.toggle('waiting',state.skaterWaiting);skater.setAttribute('aria-pressed',String(state.skaterWaiting));};
  skater.addEventListener('pointerenter',()=>{hovered=true;update();});
  skater.addEventListener('pointerleave',()=>{hovered=false;update();});
  skater.addEventListener('focus',()=>{focused=skater.matches(':focus-visible');update();});
  skater.addEventListener('blur',()=>{focused=false;update();});

  const snowman=svg.querySelector('.snowman');
  const specs=[['arms',-68,-12,62,35],['base',-21,-28,0,-20],['middle',-62,28,48,35],['head',-97,70,88,-28],['carrot',-94,102,101,145],['scarf',-78,13,85,78],['hat',-125,-68,127,-28]];
  const parts=specs.map(([name,origin,x,y,rotation])=>{
    const element=snowman.querySelector(`.snowman-${name}`);
    element.style.transformOrigin=`0px ${origin}px`;
    return{element,fallen:`translate(${x}px,${y}px) rotate(${rotation}deg)`};
  });
  button(snowman,'Make the snowman tumble and rebuild',async()=>{
    snowman.dataset.state='falling';
    const fallen=await Promise.all(parts.map(({element,fallen})=>tween(element,reduced.matches?[{opacity:1},{opacity:.5}]:[{transform:'translate(0px,0px) rotate(0deg)'},{transform:fallen}],reduced.matches?150:600,'cubic-bezier(.45,0,.85,.45)')));
    snowman.dataset.state='scattered';await wait(1000);
    snowman.dataset.state='reforming';
    const restored=await Promise.all(parts.map(({element,fallen})=>tween(element,reduced.matches?[{opacity:.5},{opacity:1}]:[{transform:fallen},{transform:'translate(0px,0px) rotate(0deg)'}],reduced.matches?150:650,'cubic-bezier(.18,.75,.25,1)')));
    [...fallen,...restored].forEach(animation=>animation.cancel());snowman.dataset.state='idle';
  });

  svg.querySelectorAll('.interactive-tree').forEach(tree=>{
    const snowParts=[...tree.children].slice(2).map(part=>group(tree,[part],'tree-snow-part'));
    const crown=group(tree,[tree.children[1],...snowParts],'tree-crown');
    crown.style.transformOrigin='0px 0px';
    button(tree,`Shake snow from the ${tree.dataset.side} tree`,async()=>{
      tree.dataset.state='shedding';
      const falling=[];
      if(reduced.matches){
        falling.push(...await Promise.all(snowParts.map(element=>tween(element,[{opacity:1},{opacity:0}],150))));
      }else{
        const shake=crown.animate([
          {transform:'rotate(0deg)'},{transform:'rotate(-2.5deg)'},{transform:'rotate(2.8deg)'},
          {transform:'rotate(-1.8deg)'},{transform:'rotate(1.1deg)'},{transform:'rotate(0deg)'}
        ],{duration:620,easing:'ease-in-out'});
        await wait(150);
        const debris=group(tree,[],'falling-snow');
        const definitions=document.createElementNS(NS,'defs');debris.append(definitions);
        const drops=[];
        snowParts.forEach((element,layer)=>{
          const source=element.firstElementChild,bounds=source.getBBox(),count=layer===0?5:7,rows=layer===0?2:1;
          for(let piece=0;piece<count*rows;piece++){
            const i=piece%count,row=Math.floor(piece/count),sliceHeight=(bounds.height+16)/rows;
            const cutY=bounds.y-8+row*sliceHeight,cy=cutY+sliceHeight/2;
            const sliceWidth=(bounds.width+10)/count,x=bounds.x-5+i*sliceWidth,cx=x+sliceWidth/2;
            const clip=document.createElementNS(NS,'clipPath');
            clip.id=`snow-clump-${tree.dataset.side}-${layer}-${piece}`;clip.setAttribute('clipPathUnits','userSpaceOnUse');
            const cut=document.createElementNS(NS,'rect');
            for(const [key,value]of Object.entries({x,y:cutY,width:sliceWidth+.5,height:sliceHeight,rx:3,ry:3}))cut.setAttribute(key,value);
            clip.append(cut);definitions.append(clip);
            const shard=source.cloneNode(true);shard.setAttribute('clip-path',`url(#${clip.id})`);
            const chunk=group(debris,[shard],'snow-clump');chunk.style.transformOrigin=`${cx}px ${cy}px`;
            const drift=(i-(count-1)/2)*5+(layer%2?3:-3),drop=-8-cy,spin=(i%2?-1:1)*(12+i*4);
            const frames=Array.from({length:7},(_,step)=>{
              const t=step/6;
              return{offset:t*.74,transform:`translate(${drift*t}px,${drop*t*t}px) rotate(${spin*t}deg)`,opacity:1};
            });
            frames.push({offset:.84,transform:`translate(${drift*1.12}px,${drop+5}px) rotate(${spin}deg) scale(1.2,.24)`,opacity:.8});
            frames.push({offset:1,transform:`translate(${drift*1.3}px,${drop+6}px) rotate(${spin}deg) scale(1.5,.12)`,opacity:0});
            const animation=chunk.animate(frames,{duration:680+layer*65,delay:layer*75+(i%3)*40,easing:'linear',fill:'both'});
            drops.push(animation.finished);
          }
          element.style.opacity='0';
        });
        await Promise.all([shake.finished,...drops]);debris.remove();
      }
      tree.dataset.state='bare';await wait(1000);
      tree.dataset.state='snowing';
      const settling=await Promise.all(snowParts.map(element=>tween(element,[{transform:`translate(0px,${reduced.matches?0:-25}px)`,opacity:0},{transform:'translate(0px,0px)',opacity:1}],reduced.matches?150:650,'ease-out')));
      snowParts.forEach(element=>element.style.removeProperty('opacity'));
      [...falling,...settling].forEach(animation=>animation.cancel());tree.dataset.state='idle';
    });
  });

  const wreath=svg.querySelector('.wreath');
  const bough=group(wreath,[...wreath.children],'wreath-bough');
  const wreathHit=document.createElementNS(NS,'circle');
  for(const [key,value]of Object.entries({r:23,cy:5,fill:'transparent'}))wreathHit.setAttribute(key,value);
  wreath.append(wreathHit);
  const birdLayer=document.createElementNS(NS,'svg');
  birdLayer.setAttribute('class','bird-layer');birdLayer.setAttribute('viewBox','0 0 1440 900');birdLayer.setAttribute('aria-hidden','true');
  svg.parentElement.append(birdLayer);
  button(wreath,'Release two turtle doves from the wreath',async()=>{
    wreath.dataset.state='shaking';
    const shake=await tween(bough,reduced.matches?[{opacity:1},{opacity:.7},{opacity:1}]:[
      {transform:'rotate(0deg)'},{transform:'rotate(-9deg)'},{transform:'rotate(8deg)'},
      {transform:'rotate(-6deg)'},{transform:'rotate(4deg)'},{transform:'rotate(0deg)'}
    ],reduced.matches?180:500);
    shake.cancel();
    wreath.dataset.state='flying';
    const bounds=svg.getBoundingClientRect(),scale=bounds.width/1440;
    const birds=[-1,1].map(direction=>{
      const bird=group(birdLayer,[],'turtle-dove');
      const facing=group(bird,[],'dove-facing');facing.setAttribute('transform',`scale(${direction*.78} .78)`);facing.innerHTML=doveMarkup();
      return{element:bird,direction,edge:direction===1?(innerWidth-bounds.left)/scale+70:-bounds.left/scale-70,
        near:bird.querySelector('.dove-near-wing'),far:bird.querySelector('.dove-far-wing')};
    });
    await new Promise(resolve=>{
      let previous=0,elapsed=0;
      const fly=time=>{
        const delta=previous?Math.min((time-previous)/1000,.05):0;previous=time;
        if(!document.hidden)elapsed+=delta;
        const duration=reduced.matches?1.2:4.8,progress=Math.min(1,elapsed/duration);
        birds.forEach(({element,direction,edge,near,far})=>{
          const pose=dovePose(progress,direction,edge);
          element.setAttribute('transform',`translate(${pose.x} ${pose.y}) rotate(${pose.tilt})`);
          const phase=elapsed*Math.PI*2*4.5+(direction===1?.35:0);
          // Shoulder rotation and foreshortening model wings moving above/below the body.
          const flap=reduced.matches?.6:Math.cos(phase);
          near.setAttribute('transform',`rotate(${8+12*Math.sin(phase)}) scale(${.9+.1*Math.abs(flap)} ${flap})`);
          far.setAttribute('transform',`rotate(-8) scale(.85 ${reduced.matches?.6:Math.cos(phase-.3)*.85})`);
          if(reduced.matches)element.style.opacity=String(1-progress);
        });
        if(progress<1)requestAnimationFrame(fly);
        else{birds.forEach(bird=>bird.element.remove());resolve();}
      };
      requestAnimationFrame(fly);
    });
    wreath.dataset.state='idle';
  });

  const house=svg.querySelector('.snoopy-house'),houseParts=[...house.children];
  const snoopy=group(house,houseParts.slice(5,9),'sleeping-snoopy');
  const woodstock=house.querySelector('.woodstock');
  // Keep the GIF intact; key out its green backdrop at render time.
  const filter=document.createElementNS(NS,'filter');
  filter.id='snoopy-green-screen';filter.setAttribute('color-interpolation-filters','sRGB');
  filter.innerHTML='<feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 -4 4 1 0"/>';
  svg.querySelector('defs').append(filter);
  const dancing=document.createElementNS(NS,'image');
  for(const [key,value]of Object.entries({href:'assets/snoopy-dance.gif',x:1158,y:728,width:150,height:150,filter:'url(#snoopy-green-screen)',class:'dancing-snoopy',visibility:'hidden'}))dancing.setAttribute(key,value);
  svg.append(dancing);
  button(snoopy,'Let Snoopy do his happy dance',async()=>{
    house.dataset.state='dancing';snoopy.style.opacity='0';
    // Woodstock lands on the roof while Snoopy dances beside the house.
    const perch=await tween(woodstock,[{transform:'translateY(0px)'},{transform:'translateY(22px)'}],reduced.matches?0:180);
    dancing.setAttribute('visibility','visible');
    await wait(5000);
    dancing.setAttribute('visibility','hidden');snoopy.style.opacity='1';
    const returnPerch=await tween(woodstock,[{transform:'translateY(22px)'},{transform:'translateY(0px)'}],reduced.matches?0:180);
    perch.cancel();returnPerch.cancel();house.dataset.state='sleeping';
  });
  return state;
}
