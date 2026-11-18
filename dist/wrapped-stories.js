const clips=Array.from({length:7},(_,i)=>new URL(`./assets/spotify_wrapped/dd_spotify${i+1}.mp4`,import.meta.url).href);

export function setupWrappedStories(card){
 const viewer=document.createElement('div');viewer.className='wrapped-stories';viewer.setAttribute('aria-label','Spotify Wrapped stories');
 viewer.innerHTML='<video class="wrapped-story-video" muted playsinline autoplay preload="auto"></video><div class="wrapped-story-progress" aria-label="Story progress"></div><button class="wrapped-story-arrow wrapped-story-previous" type="button" aria-label="Previous story" hidden><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14.5 5-7 7 7 7"/></svg></button><button class="wrapped-story-arrow wrapped-story-next" type="button" aria-label="Next story"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9.5 5 7 7-7 7"/></svg></button><span class="wrapped-story-live" role="status" aria-live="polite"></span>';
 card.insertBefore(viewer,card.querySelector('.reaction-area'));
 const video=viewer.querySelector('video'),progress=viewer.querySelector('.wrapped-story-progress'),previous=viewer.querySelector('.wrapped-story-previous'),next=viewer.querySelector('.wrapped-story-next');
 const fills=[];
 for(let i=0;i<clips.length;i++){const segment=document.createElement('span');segment.className='wrapped-story-segment';segment.setAttribute('aria-label',`Story ${i+1}`);const fill=document.createElement('i');fill.className='wrapped-story-fill';segment.append(fill);progress.append(segment);fills.push(fill);}
 let index=0,generation=0,active=false;
 function updateProgress(){const fraction=index===0?1:(video.duration>0?Math.max(0,Math.min(1,video.currentTime/video.duration)):0);for(let i=0;i<fills.length;i++)fills[i].style.transform=`scaleX(${i<index?1:i===index?fraction:0})`;}
 function loadStory(nextIndex){index=Math.max(0,Math.min(clips.length-1,nextIndex));const token=++generation;video.pause();video.loop=index===0;video.src=clips[index];video.load();previous.hidden=index===0;next.hidden=index===clips.length-1;progress.setAttribute('aria-label',`Story ${index+1} of ${clips.length}`);updateProgress();if(!active)return;const attempt=video.play();attempt?.catch(()=>{if(token===generation)viewer.querySelector('.wrapped-story-live').textContent='The story could not start automatically.';});}
 previous.addEventListener('click',event=>{event.stopPropagation();loadStory(index-1);});
 next.addEventListener('click',event=>{event.stopPropagation();loadStory(index+1);});
 video.addEventListener('timeupdate',updateProgress);video.addEventListener('durationchange',updateProgress);video.addEventListener('ended',()=>{if(index>0)updateProgress();});
 viewer.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'&&index>0){event.preventDefault();loadStory(index-1);}else if(event.key==='ArrowRight'&&index<clips.length-1){event.preventDefault();loadStory(index+1);}});
 return{start(){active=true;loadStory(0);},stop(){active=false;generation++;video.pause();video.removeAttribute('src');video.load();index=0;previous.hidden=true;next.hidden=false;updateProgress();}};
}
