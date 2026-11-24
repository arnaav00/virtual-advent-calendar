import { ADVENT, defrostStage, iceShape } from './advent-time.js';
import { allReactions } from './gift-state.js';
import { missingReactionAlert, missingReactionDays, REACTION_SLIDE_MS } from './reaction-slideshow.js';
const NS='http://www.w3.org/2000/svg';
export function setupMariah(svg){
  const figure=document.createElementNS(NS,'g');figure.setAttribute('class','mariah-surprise');
  figure.setAttribute('transform','translate(1370 837) scale(1.52)');
  figure.setAttribute('role','img');figure.setAttribute('aria-label','Mariah Carey defrosting in an ice block');
  figure.innerHTML=`
    <defs>
      <linearGradient id="mariah-ice-paint" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#edfafa" stop-opacity=".84"/><stop offset=".45" stop-color="#b9dcdc" stop-opacity=".52"/><stop offset="1" stop-color="#a1cdd3" stop-opacity=".8"/></linearGradient>
      <clipPath id="mariah-ice-clip"><path/></clipPath>
    </defs>
    <ellipse class="mariah-puddle" cy="5" rx="37" ry="7" fill="#c3deda" stroke="#a6c7c3" stroke-width="1" opacity=".3"/>
    <path class="puddle-glint" d="M-30 6Q-16 10 -7 7M16 5h14" fill="none" stroke="#fffdf3" stroke-width="2" opacity="0"/>
    <g class="mariah-person" stroke="#4e5c52" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <path d="M-20 -108Q-31 -97 -24 -83Q-31 -72 -19 -66Q-7 -70 0 -74Q15 -63 26 -71Q31 -78 24 -86Q31 -99 21 -112Z" fill="#c4a16e"/>
      <path d="M-13 -55L-16 -29L-13 -6H-3L0 -42L4 -6H14L15 -31L12 -55Z" fill="#b75d57"/>
      <path d="M-14 -10L-3 -10L-2 1Q-4 6 -21 4L-22 0L-15 -4ZM4 -10H15L15 -4L22 0L21 4Q6 6 3 1Z" fill="#435650"/>
      <path d="M-8 -94L-14 -87L-12 -69L-16 -53Q0 -47 16 -53L12 -69L14 -87L8 -94Z" fill="#bd615a"/>
      <g class="mariah-arm mariah-arm-left" transform="translate(-12 -85)"><g class="arm-lift"><path d="M0 0L-11 11L-13 25" fill="none" stroke="#b75d57" stroke-width="10"/><path d="M-17 21L-8 23" stroke="#fff0db" stroke-width="5"/><path d="M-16 26L-18 30Q-20 37 -14 37L-10 32L-10 27Z" fill="#435650"/></g></g>
      <g class="mariah-arm mariah-arm-right" transform="translate(12 -85)"><g class="arm-lift"><path d="M0 0L11 11L13 25" fill="none" stroke="#b75d57" stroke-width="10"/><path d="M17 21L8 23" stroke="#fff0db" stroke-width="5"/><path d="M16 26L18 30Q20 37 14 37L10 32L10 27Z" fill="#435650"/></g></g>
      <path d="M-14 -61Q0 -57 14 -61L15 -53Q0 -49 -15 -53Z" fill="#435650"/>
      <rect x="-4" y="-61" width="8" height="9" rx="1" fill="#d6b779" stroke-width="1"/>
      <path d="M-2 -59H2V-54H-2Z" fill="#435650" stroke="none"/>
      <path d="M-7 -100L-7 -91Q0 -84 7 -91L7 -101" fill="#e3b995"/>
      <path d="M-12 -91Q-7 -88 -3 -90Q0 -86 4 -90Q8 -87 12 -91" fill="none" stroke="#fff0db" stroke-width="6"/>
      <path d="M-18 -119Q-17 -140 1 -140Q21 -137 19 -117L15 -101Q1 -88 -13 -101Z" fill="#e6bc98"/>
      <path d="M-18 -113Q-23 -125 -18 -137Q-9 -149 4 -144Q25 -145 26 -126Q24 -119 26 -110Q33 -98 24 -91Q30 -81 21 -74L12 -80Q23 -88 16 -97Q12 -105 17 -114Q18 -130 6 -135Q-3 -121 -18 -119Z" fill="#c9a675"/>
      <path d="M-12 -137Q-27 -129 -23 -113Q-29 -105 -24 -96Q-29 -84 -20 -76Q-14 -74 -10 -80Q-20 -85 -16 -96Q-12 -106 -18 -113Q-18 -128 -7 -134" fill="#d2b184"/>
      <path d="M-19 -128Q-24 -119 -19 -110M-20 -105Q-25 -96 -19 -91M19 -128Q24 -117 20 -111M22 -103Q26 -94 21 -87" fill="none" stroke="#edcc9c" stroke-width="2"/>
      <path class="mariah-eyes" d="M-10 -113Q-7 -115 -4 -113M4 -113Q7 -115 10 -113" fill="none" stroke="#594e45" stroke-width="1.5"/>
      <path d="M0 -112L-2 -107L1 -106" fill="none" stroke="#c38b6f" stroke-width="1"/>
      <path class="mariah-smile" d="M-4 -102Q0 -99 5 -103" fill="none" stroke="#a86360" stroke-width="1.8"/>
      <path class="mariah-singing-mouth" d="M-5 -103Q0 -105 5 -103Q5 -95 0 -95Q-5 -95 -5 -103Z" fill="#89534e" stroke-width="1"/>
      <path class="mariah-singing-mouth" d="M-3 -102H3" stroke="#fff5dc" stroke-width="1.8"/>
      <path d="M-16 -108L-16 -102M16 -108L16 -102" stroke="#fff2cb" stroke-width="2.5"/>
    </g>
    <g class="mariah-ice" stroke-linecap="round" stroke-linejoin="round">
      <path class="ice-side" fill="#9ac4cb" fill-opacity=".65" stroke="#83b0b7" stroke-width="1.5"/>
      <path class="ice-front" fill="url(#mariah-ice-paint)" stroke="#8ebbc0" stroke-width="1.8"/>
      <g clip-path="url(#mariah-ice-clip)">
        <path d="M-28 -153L-37 -131V-16M-21 -147L-27 -138M31 -140V-30" fill="none" stroke="#f7ffff" stroke-opacity=".7" stroke-width="3"/>
        <path d="M-34 -32L34 -122M-32 -15L35 -105" stroke="#f1ffff" stroke-opacity=".2" stroke-width="11"/>
        <g class="ice-frost" fill="#f5ffff" opacity=".7">
          <path d="M-41 -154H41L35 -141L25 -144L18 -133L9 -141L-2 -135L-14 -145L-25 -137L-34 -143Z"/>
          <path d="M-42 -23L-29 -17L-24 -24L-14 -12L-3 -17L7 -9L18 -20L26 -12L41 -22V6H-43Z"/>
          <circle cx="-32" cy="-95" r="3"/><circle cx="25" cy="-67" r="2.5"/><circle cx="32" cy="-119" r="2"/>
        </g>
        <path class="ice-cracks" d="M-40 -76L-22 -68L-28 -55L-12 -49M-22 -68L-13 -79M40 -117L24 -104L30 -90L18 -83M24 -104L11 -108" fill="none" stroke="#f4ffff" stroke-width="1.5" opacity=".5"/>
      </g>
      <path class="ice-top" fill="none" stroke="#f0ffff" stroke-width="2.8" opacity=".85"/>
    </g>
    <g class="melt-drops" fill="#b0d6d9" stroke="#effafa" stroke-width=".6"/>
    <rect class="mariah-hit" x="-38" y="-150" width="76" height="159" rx="24" fill="transparent"/>
  `;
  svg.append(figure);
  const front=figure.querySelector('.ice-front'),side=figure.querySelector('.ice-side'),top=figure.querySelector('.ice-top'),clip=figure.querySelector('#mariah-ice-clip path');
  const ice=figure.querySelector('.mariah-ice'),puddle=figure.querySelector('.mariah-puddle'),person=figure.querySelector('.mariah-person');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const itsTimeAudio=document.createElement('audio');itsTimeAudio.src='assets/its-time.mp3';itsTimeAudio.preload='auto';itsTimeAudio.volume=.6;itsTimeAudio.className='mariah-audio mariah-itstime-audio';itsTimeAudio.hidden=true;document.body.append(itsTimeAudio);
  const songAudio=document.createElement('audio');songAudio.src='assets/mariah_carrey.mp3';songAudio.preload='auto';songAudio.volume=.6;songAudio.className='mariah-audio mariah-song-audio';songAudio.hidden=true;document.body.append(songAudio);
  const attic=svg.querySelector('.central-attic');
  const atticUnlockKey='snowglobe-mariah-attic-unlocked';
  let atticUnlocked=false;
  try{atticUnlocked=localStorage.getItem(atticUnlockKey)==='yes';}catch{}
  if(atticUnlocked){attic.classList.add('is-enabled');attic.setAttribute('tabindex','0');}
  const slideshow=document.createElement('dialog');slideshow.className='mariah-slideshow';slideshow.setAttribute('aria-label','Christmas reaction slideshow');
  slideshow.innerHTML='<img alt="Reaction photo for day 1"><p class="mariah-slideshow-day" aria-live="polite">Day 1</p>';
  document.body.append(slideshow);
  const slideImage=slideshow.querySelector('img'),slideLabel=slideshow.querySelector('.mariah-slideshow-day');
  let slideTimer=0,slideUrls=[],slideshowOpening=false;
  function fitSlideshowToPhoto(){
    if(!slideImage.naturalWidth||!slideImage.naturalHeight)return;
    const mobile=window.innerWidth<=640;
    const maxWidth=Math.min(window.innerWidth*(mobile ? .88 : .55),840);
    const maxHeight=Math.min(window.innerHeight*(mobile ? .62 : .55),600);
    const scale=Math.min(1,maxWidth/slideImage.naturalWidth,maxHeight/slideImage.naturalHeight);
    slideshow.style.width=`${Math.round(slideImage.naturalWidth*scale)}px`;
    slideshow.style.height=`${Math.round(slideImage.naturalHeight*scale)}px`;
  }
  window.addEventListener('resize',fitSlideshowToPhoto);
  function closeSlideshow(){clearTimeout(slideTimer);slideTimer=0;if(slideshow.open)slideshow.close();itsTimeAudio.pause();itsTimeAudio.currentTime=0;songAudio.pause();songAudio.currentTime=0;songAudio.volume=.6;finish();slideUrls.forEach(url=>URL.revokeObjectURL(url));slideUrls=[];slideImage.removeAttribute('src');slideshow.style.removeProperty('width');slideshow.style.removeProperty('height');}
  slideshow.addEventListener('cancel',event=>{event.preventDefault();closeSlideshow();});
  slideshow.addEventListener('click',event=>{if(event.target===slideshow)closeSlideshow();});
  async function openSlideshow(){
    if(slideshowOpening||slideshow.open)return;
    slideshowOpening=true;
    closeSlideshow();
    itsTimeAudio.pause();
    songAudio.currentTime=0;songAudio.volume=0;
    // Begin silently within the click gesture so browsers allow playback after
    // Firebase finishes loading the saved photos; unmute only on a valid show.
    const songPlayback=songAudio.play().then(()=>true,error=>{console.warn('[Mariah] Could not play the slideshow song:',error);return false;});
    try{
      const photos=await allReactions();
      const missing=missingReactionDays(photos);
      if(missing.length){songAudio.pause();songAudio.currentTime=0;songAudio.volume=.6;window.alert(missingReactionAlert(missing));return;}
      slideUrls=photos.map(photo=>URL.createObjectURL(photo.blob));
      let index=0;const show=async()=>{slideImage.src=slideUrls[index];slideImage.alt=`Reaction photo for day ${photos[index].day}`;try{await slideImage.decode();}catch{}if(!slideshow.open)return;fitSlideshowToPhoto();slideLabel.textContent=`Day ${photos[index].day}`;index++;if(index===photos.length){slideTimer=setTimeout(closeSlideshow,REACTION_SLIDE_MS);return;}slideTimer=setTimeout(show,REACTION_SLIDE_MS);};
      songAudio.currentTime=0;
      slideshow.showModal();show();
      figure.dataset.singing='true';figure.classList.add('is-singing');
      songPlayback.then(playing=>{if(playing&&slideshow.open)songAudio.volume=.6;else if(!playing)finish();});
    }catch(error){
      songAudio.pause();songAudio.currentTime=0;songAudio.volume=.6;
      console.warn('[Mariah] Could not load the slideshow photos:',error);
      window.alert('The Christmas slideshow could not be loaded. Please try again.');
    }finally{slideshowOpening=false;}
  }
  attic.addEventListener('click',()=>{if(figure.dataset.state==='free')openSlideshow();});
  attic.addEventListener('keydown',event=>{if(figure.dataset.state==='free'&&(event.key==='Enter'||event.key===' ')){event.preventDefault();openSlideshow();}});
  attic.addEventListener('pointerleave',()=>attic.classList.remove('is-open'));
  itsTimeAudio.addEventListener('error',()=>{console.warn('[Mariah] Could not load the “It’s time” clip.');});
  songAudio.addEventListener('error',()=>{console.warn('[Mariah] Could not load the slideshow song.');});
  let elapsed=0,previous=0,stage=-1,shown=0,free=false;
  function droplets(progress){
    if(reduced.matches||progress<=0||progress>=1)return;
    const layer=figure.querySelector('.melt-drops'),shape=iceShape(progress);
    [-1,1].forEach((direction,i)=>{
      const drop=document.createElementNS(NS,'path');drop.setAttribute('d','M0 -5Q-6 2 0 5Q6 2 0 -5Z');
      const x=direction*(shape.half-3),y=shape.top+15;drop.setAttribute('transform',`translate(${x} ${y})`);layer.append(drop);
      const fall=drop.animate([{transform:`translate(${x}px,${y}px) scale(.65)`,opacity:.9},{transform:`translate(${x+direction*2}px,0px) scale(.65)`,opacity:.7,offset:.82},{transform:`translate(${x+direction*4}px,4px) scale(1.5,.15)`,opacity:0}],{duration:620,delay:i*110,easing:'cubic-bezier(.45,0,.85,.5)',fill:'both'});
      fall.finished.then(()=>drop.remove());
    });
  }
  function draw(progress){
    const shape=iceShape(progress),{half,depth}=shape;
    front.setAttribute('d',shape.d);clip.setAttribute('d',shape.d);
    side.setAttribute('d',`M${half} ${shape.top+9}L${half+depth} ${shape.top+2}V-3L${half-2} 3Z`);
    top.setAttribute('d',`M${-half+5} ${shape.top+5}Q0 ${shape.top-1} ${half-5} ${shape.top+5}`);
    ice.style.opacity=String(progress>.92?(1-progress)/.08:1);
    figure.querySelector('.ice-frost').style.opacity=String(.7*(1-progress));
    figure.querySelector('.ice-cracks').style.opacity=String(.3+.6*progress);
    puddle.setAttribute('rx',String(37+17*progress));puddle.style.opacity=String(.3+.4*progress);
    figure.querySelector('.puddle-glint').style.opacity=String(progress);
    person.style.opacity=String(.76+.24*progress);
  }
  function release(){
    free=true;figure.dataset.state='free';figure.classList.add('is-free','easter-egg');
    figure.setAttribute('role','button');figure.setAttribute('tabindex','0');figure.setAttribute('aria-label','Mariah Carey: it’s time');
  }
  function frame(now){
    const delta=previous?Math.min(now-previous,100):0;previous=now;
    if(!document.hidden){
      elapsed+=delta;
      const next=defrostStage(elapsed);
      if(next!==stage){
        if(stage===-1 && ADVENT.mode!=='preview')shown=next/25;
        stage=next;figure.dataset.day=String(stage);figure.dataset.mode=ADVENT.mode;figure.dataset.state='defrosting';droplets(stage/25);
      }
      const target=stage/25;
      shown=reduced.matches?target:Math.min(target,shown+delta/650/25);
      draw(shown);
      if(stage===25 && shown>=1){release();return;}
    }
    requestAnimationFrame(frame);
  }
  function sing(){
    if(!free)return;
    itsTimeAudio.currentTime=0;
    itsTimeAudio.play().catch(error=>console.warn('[Mariah] Could not play the “It’s time” clip:',error));
    if(!atticUnlocked){atticUnlocked=true;attic.classList.add('is-enabled','is-open');attic.setAttribute('tabindex','0');try{localStorage.setItem(atticUnlockKey,'yes');}catch{}}
  }
  function finish(){figure.dataset.singing='false';figure.classList.remove('is-singing');}
  songAudio.addEventListener('ended',finish);
  songAudio.addEventListener('timeupdate',()=>{if(Number.isFinite(songAudio.duration)&&songAudio.duration-songAudio.currentTime<=1.5)songAudio.volume=Math.max(0,.6*(songAudio.duration-songAudio.currentTime)/1.5);});
  figure.addEventListener('click',event=>{if(attic.contains(event.target))return;sing();});
  figure.addEventListener('keydown',event=>{if(attic.contains(event.target))return;if(free&&(event.key==='Enter'||event.key===' ')){event.preventDefault();sing();}});
  document.addEventListener('visibilitychange',()=>{previous=0;});
  draw(0);requestAnimationFrame(frame);
}
