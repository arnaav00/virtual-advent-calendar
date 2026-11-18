import {setupEnvelope} from './letter-envelope.js';
import {openLetterVideo} from './letter-video.js';
import {startCountdown} from './reaction-countdown.js';
import {reaction,saveReaction,isLetterOpened} from './gift-state.js';
import {setupEarringTryOn} from './earring-gift.js';
import {setupEarringRack} from './earring-rack-gift.js';
import {setupWrappedStories} from './wrapped-stories.js';
import {setupLibraryGift} from './library-gift.js';
export const PLAYLIST='https://open.spotify.com/playlist/7KY1TlIfzTBCUvLbAeUWRq';
export function playlistCard(day=1,giftKind=day){
 const card=document.createElement('section');card.className='playlist-card';card.hidden=true;
 let mirrorStream=null,startMirror=null,storyController=null,libraryController=null;
 const stopMirror=()=>{mirrorStream?.getTracks().forEach(track=>track.stop());mirrorStream=null;};
 card.innerHTML=`<div class="card-stamp" aria-hidden="true">♪</div><p class="playlist-letter">The festive season would be a lot quieter without some groovy classics. Here's a curated playlist of some of the popular Christmas songs as well as those from your childhood.</p><div class="playlist-tile"><a class="playlist-cover-link" href="${PLAYLIST}" target="_blank" rel="noopener noreferrer" aria-label="Open Devangshi’s Christmas Wonderland playlist on Spotify"><img class="playlist-cover" src="https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84d1cc165a172ad0632f57400e" alt="Devangshi’s Christmas Wonderland cover"></a><div class="playlist-details"><strong>Devangshi’s Christmas Wonderland</strong><span>Playlist by Arnaav Anand</span></div><div class="playlist-brand" aria-label="Spotify"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="currentColor"/><path d="M5 9q7-3 14 1M6 12q6-2 12 1M7 15q5-1.5 10 1" fill="none" stroke="#8b624a" stroke-width="1.5" stroke-linecap="round"/></svg>Spotify</div></div><p class="playlist-boombox-hint">You may now connect the boombox next to the snowman for some sensational christmas bops.</p><div class="reaction-area"><div class="reaction-camera" hidden><div class="reaction-viewfinder"><video autoplay playsinline muted hidden></video><img class="reaction-photo" alt="Your reaction to gift 1" hidden><div class="reaction-countdown" role="timer" aria-live="assertive" hidden></div><span class="reaction-flash" aria-hidden="true"></span></div><div class="reaction-actions"><button class="reaction-shutter" aria-label="Start five-second photo timer" title="Take photo in 5 seconds" hidden><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h4l2-3h4l2 3h4v13H4Z"/><circle cx="12" cy="13" r="4"/></svg></button><button class="reaction-retake reaction-icon" aria-label="Retake photo" title="Retake photo" data-tooltip="Retake" hidden><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 2v6h6M3.05 13A9 9 0 1 0 5.64 5.64L3 8"/></svg></button><button class="reaction-save reaction-icon" aria-label="Finalise photo" title="Finalise photo" data-tooltip="Finalise" hidden><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 12 5 5L20 6"/></svg></button></div></div><p class="reaction-status" role="status"></p></div>`;
 if(giftKind===2){
  card.classList.add('letter-card');
  card.querySelector('.card-stamp').remove();card.querySelector('.playlist-letter').remove();card.querySelector('.playlist-tile').remove();card.querySelector('.playlist-boombox-hint').remove();
  const letter=document.createElement('div');letter.className='north-pole-letter';letter.innerHTML=`<p>Dear Devangshi,</p><p>The North Pole has received your application, and we are delighted to inform you that you qualify for our 2026 Good List program. Your kind soul and noble actions have not gone unnoticed this year, and the committee is willing to overlook all offences of boyfriend bullying.</p><p>Furthermore, our CEO Santa included a personal video message for your achievement of recognition. Kindly note that any similarity with real personalities is merely a coincidence.</p><p class="letter-signature">Yours Truly,<br>The North Pole</p>`;card.prepend(letter);
  const watch=document.createElement('button');watch.className='letter-watch';watch.textContent='▷  A message from Santa';card.querySelector('.reaction-area').before(watch);watch.onclick=()=>{stop();openLetterVideo(watch);};
 }else if(giftKind===3){
  card.classList.add('mirror-gift-card');
  card.querySelector('.card-stamp').remove();
  const message=card.querySelector('.playlist-letter');message.innerHTML="<span>And now you're dressed for the occasion!</span><span>See for yourself :)</span>";message.className='gift-two-message';
  card.querySelector('.playlist-tile').remove();
  card.querySelector('.playlist-boombox-hint').remove();
  const mirror=document.createElement('section');mirror.className='christmas-mirror';mirror.setAttribute('aria-label','Live webcam mirror');mirror.innerHTML='<video class="mirror-video" autoplay playsinline muted aria-label="Live mirror view"></video><img class="mirror-frame-art" src="./assets/gift2-mirror-frame.png" alt=""><p class="mirror-status" role="status">Allow camera access to see your reflection.</p>';
  card.append(mirror);
  const mirrorVideo=mirror.querySelector('video'),mirrorStatus=mirror.querySelector('.mirror-status');
  startMirror=async()=>{stopMirror();mirrorStatus.hidden=false;mirrorStatus.textContent='Allow camera access to see your reflection.';try{if(!navigator.mediaDevices?.getUserMedia)throw Error('unavailable');const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:960},height:{ideal:1200}},audio:false});if(card.hidden){stream.getTracks().forEach(track=>track.stop());return;}mirrorStream=stream;mirrorVideo.srcObject=stream;await mirrorVideo.play();mirrorStatus.hidden=true;}catch(error){mirrorStatus.hidden=false;mirrorStatus.textContent=error.name==='NotAllowedError'?'Camera access is blocked. Allow it in your browser to use the mirror.':'The camera is not available right now.';}};
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopMirror();});
 }else if(giftKind===4){
  card.classList.add('birthday-card');
  card.querySelector('.card-stamp').remove();card.querySelector('.playlist-letter').remove();card.querySelector('.playlist-tile').remove();card.querySelector('.playlist-boombox-hint').remove();
  const book=document.createElement('div');book.className='birthday-book is-folded';book.innerHTML=`
   <div class="birthday-spread">
    <section class="birthday-panel birthday-message" aria-label="Fold the birthday card closed" role="button" tabindex="-1" aria-hidden="true">
     <div class="birthday-letter-mark" aria-hidden="true">♡</div>
     <p class="birthday-message-lead">I saved a slice for you</p>
     <p>Don't worry, I got the endlessly regenerating variety so you can eat to your heart's content.</p>
    </section>
    <section class="birthday-panel birthday-cake-panel" aria-label="A slice of cake">
     <div class="birthday-cake-scene">
      <svg class="birthday-plate" viewBox="0 0 300 70" aria-hidden="true"><ellipse cx="150" cy="35" rx="124" ry="23" fill="#fff" stroke="#d9d4c9" stroke-width="3"/><ellipse cx="150" cy="34" rx="91" ry="13" fill="#faf8f2" stroke="#e4dfd5" stroke-width="2"/></svg>
      <button class="birthday-cake-bite" type="button" aria-label="Eat the black forest cake slice" title="Take a bite">
       <img src="./assets/birthday-cake-slice.png" alt="" draggable="false">
      </button>
      <svg class="birthday-spoon" viewBox="0 0 240 84" aria-hidden="true"><defs><linearGradient id="spoon-steel" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6f7c81"/><stop offset=".18" stop-color="#f8fbfa"/><stop offset=".36" stop-color="#aeb9bb"/><stop offset=".53" stop-color="#fff"/><stop offset=".72" stop-color="#89999e"/><stop offset=".9" stop-color="#e8eeee"/><stop offset="1" stop-color="#69777b"/></linearGradient><linearGradient id="spoon-glint" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><path d="M8 44C43 37 78 35 126 36l28-1c7-19 25-30 45-27 20 3 31 17 29 34-2 18-19 33-39 32-17-1-30-12-35-27-10 0-18 1-28 2-41 4-76 7-111 10-9 1-14-2-14-7 0-4 3-7 7-8Z" fill="url(#spoon-steel)" stroke="#829094" stroke-width="2"/><path d="M20 45c35-5 68-7 105-7" fill="none" stroke="url(#spoon-glint)" stroke-width="3" stroke-linecap="round"/><path d="M180 20c7-7 19-9 29-5 8 3 14 10 15 18-11-7-26-10-44-8Z" fill="#fff" opacity=".78"/><ellipse cx="198" cy="42" rx="17" ry="22" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2"/></svg>
     </div>
     <video class="birthday-cake-video" muted playsinline preload="metadata" hidden></video>
     <p class="birthday-video-status" role="status" hidden></p>
    </section>
   </div>
   <button class="birthday-cover" type="button" aria-label="Open the birthday card">
    <span class="birthday-cover-title">Happy birthday<br>to me!</span>
    <svg class="birthday-cover-art" viewBox="0 0 360 260" aria-hidden="true">
     <path d="M61 84c3 38 8 71 16 102M300 82c-7 43-11 76-14 106" fill="none" stroke="#9d968a" stroke-width="2"/>
     <path d="M61 84c-18-8-22-27-12-41 10-13 29-12 39 1 11 14 2 32-27 40Z" fill="#e9989e" stroke="#8e625f" stroke-width="2.5"/><path d="M53 51q12-9 24 1" fill="none" stroke="#ffd9d6" stroke-width="3" stroke-linecap="round"/>
     <path d="M300 82c-24-3-33-19-27-34 6-16 25-20 38-9 14 12 8 31-11 43Z" fill="#98b8a4" stroke="#637d6b" stroke-width="2.5"/><path d="M282 49q12-12 25-5" fill="none" stroke="#e3f0df" stroke-width="3" stroke-linecap="round"/>
     <path d="m61 84 9 5m230-7-8 5" fill="none" stroke="#a98c77" stroke-width="2"/>
     <ellipse cx="181" cy="211" rx="96" ry="18" fill="#f2eee6" stroke="#cfc5b6" stroke-width="3"/>
     <path d="M115 193h132v-43H115Z" fill="#e6a0a0" stroke="#876963" stroke-width="3"/><path d="M115 164c12-11 19 11 32 0s20 11 33 0 20 11 33 0 22 10 34-1v14H115Z" fill="#fff8ed" stroke="#876963" stroke-width="2.5"/>
     <path d="M135 150v-38M181 150v-44M226 150v-35" stroke="#f7e5bd" stroke-width="7" stroke-linecap="round"/><path d="M135 116c-7-7 1-10 0-16m46 12c-7-7 1-10 0-16m45 19c-7-7 1-10 0-16" fill="none" stroke="#e6a34f" stroke-width="3" stroke-linecap="round"/>
     <path d="M139 129h8m30-8h8m37 11h8" stroke="#dc8a8b" stroke-width="3" stroke-linecap="round"/><circle cx="159" cy="179" r="3" fill="#f8e4c6"/><circle cx="213" cy="184" r="3" fill="#f8e4c6"/>
     <path d="m90 119 4 9 10 1-8 6 3 10-9-6-8 6 2-10-8-6 10-1Z" fill="#e5bd73"/><path d="m270 119 3 7 8 1-6 5 2 8-7-5-7 5 2-8-6-5 8-1Z" fill="#e5bd73"/>
    </svg>
    <span class="birthday-cover-hint" aria-hidden="true">♡</span>
   </button>`;
  card.prepend(book);
  const cover=book.querySelector('.birthday-cover'),audio=new Audio(new URL('./assets/blackforest.mp3',import.meta.url));audio.preload='auto';
  const leftPanel=book.querySelector('.birthday-message');
  cover.addEventListener('click',()=>{if(book.classList.contains('is-open'))return;book.classList.remove('is-folded');book.classList.add('is-open');cover.setAttribute('aria-hidden','true');cover.tabIndex=-1;leftPanel.removeAttribute('aria-hidden');leftPanel.tabIndex=0;audio.currentTime=0;audio.play().catch(()=>{});});
  const bite=book.querySelector('.birthday-cake-bite'),cakeVideo=book.querySelector('.birthday-cake-video'),videoStatus=book.querySelector('.birthday-video-status');cakeVideo.src=new URL('./assets/eat_cake.mp4',import.meta.url).href;
  function resetCake(){cakeVideo.pause();cakeVideo.currentTime=0;cakeVideo.hidden=true;bite.hidden=false;videoStatus.hidden=true;videoStatus.textContent='';}
  function foldCard(){if(!book.classList.contains('is-open'))return;audio.pause();audio.currentTime=0;resetCake();book.classList.remove('is-open');book.classList.add('is-folded');cover.removeAttribute('aria-hidden');cover.tabIndex=0;leftPanel.setAttribute('aria-hidden','true');leftPanel.tabIndex=-1;}
  leftPanel.addEventListener('click',foldCard);leftPanel.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();foldCard();}});
  cakeVideo.addEventListener('ended',resetCake);
  cakeVideo.addEventListener('error',()=>{cakeVideo.hidden=true;bite.hidden=false;videoStatus.hidden=false;videoStatus.textContent='The little cake video could not be loaded.';});
  bite.addEventListener('click',()=>{videoStatus.hidden=true;bite.hidden=true;cakeVideo.hidden=false;cakeVideo.currentTime=0;cakeVideo.play().catch(()=>{cakeVideo.hidden=true;bite.hidden=false;videoStatus.hidden=false;videoStatus.textContent='The little cake video could not be played.';});});
 }else if(giftKind===5){
  card.classList.add('earring-card');
  card.querySelector('.card-stamp').remove();card.querySelector('.playlist-letter').remove();card.querySelector('.playlist-tile').remove();card.querySelector('.playlist-boombox-hint').remove();
  setupEarringTryOn(card);
 }else if(giftKind===6){
  card.classList.add('earring-card','earring-rack-card');
  card.querySelector('.card-stamp').remove();card.querySelector('.playlist-letter').remove();card.querySelector('.playlist-tile').remove();card.querySelector('.playlist-boombox-hint').remove();
  setupEarringRack(card);
 }else if(giftKind===7){
  card.classList.add('wrapped-stories-card');
  card.querySelector('.card-stamp').remove();card.querySelector('.playlist-letter').remove();card.querySelector('.playlist-tile').remove();card.querySelector('.playlist-boombox-hint').remove();
  storyController=setupWrappedStories(card);
 }else if(giftKind===8){
  card.classList.add('library-card');
  libraryController=setupLibraryGift(card);
 }
 const captureButton=document.createElement('button');captureButton.type='button';captureButton.className='reaction-start';captureButton.hidden=true;captureButton.setAttribute('aria-label','Capture your reaction');captureButton.dataset.tooltip='Capture your reaction';captureButton.innerHTML=`<svg class="reaction-orbit" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="43"/><g class="reaction-camera-icon" transform="translate(50 50) scale(1.2)"><path d="M-14 -7h5l3-5h12l3 5h5v17h-28z"/><circle r="5"/></g></svg>`;
 const reactionDialog=document.createElement('dialog');reactionDialog.className='reaction-dialog';reactionDialog.setAttribute('aria-label','Capture your reaction');reactionDialog.innerHTML='<button type="button" class="reaction-close" aria-label="Close camera">×</button>';
 const reactionArea=card.querySelector('.reaction-area');reactionDialog.append(reactionArea);document.body.append(reactionDialog);
 const envelope=giftKind===2?setupEnvelope(card,day):null;card.addEventListener('letter-content-opened',()=>{captureButton.hidden=false;});
 reactionDialog.querySelector('.reaction-photo').alt=`Your reaction to gift ${day}`;
 let stream=null,epoch=0,url=null,draft=null,savedPhoto=null,cancelCountdown=()=>{},starting=false;
 const q=s=>reactionDialog.querySelector(s),status=q('.reaction-status'),video=q('video'),photo=q('.reaction-photo'),camera=q('.reaction-camera'),shutter=q('.reaction-shutter'),retake=q('.reaction-retake'),save=q('.reaction-save'),count=q('.reaction-countdown'),startButton=captureButton;
 function stop(){epoch++;cancelCountdown();count.hidden=true;stream?.getTracks().forEach(t=>t.stop());stream=null;video.pause();video.srcObject=null;shutter.disabled=true;starting=false;startButton.disabled=false;}
 function preview(blob){if(url)URL.revokeObjectURL(url);url=URL.createObjectURL(blob);photo.src=url;photo.hidden=false;video.hidden=true;}
 function resetActions(){shutter.hidden=true;retake.hidden=true;save.hidden=true;save.disabled=false;}
 async function start(){if(starting)return;stop();const token=epoch;starting=true;startButton.disabled=true;draft=null;resetActions();camera.hidden=false;video.hidden=false;photo.hidden=true;status.textContent='Opening your camera…';
  try{
   if(!navigator.mediaDevices?.getUserMedia)throw Error('unavailable');
   const next=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:960},height:{ideal:720}},audio:false});
   if(token!==epoch){next.getTracks().forEach(t=>t.stop());return;}
   stream=next;video.muted=true;video.playsInline=true;video.srcObject=next;
   // Show the video before play(): hidden video may never start in embedded browsers.
   await Promise.race([video.play(),new Promise((_,reject)=>setTimeout(()=>reject(Error('Camera playback timed out')),12000))]);
   if(token!==epoch)return;
   if(!video.videoWidth||video.readyState<2)await new Promise((resolve,reject)=>{const ready=()=>{if(video.videoWidth&&video.readyState>=2){cleanup();resolve();}};const timeout=setTimeout(()=>{cleanup();reject(Error('No camera frames'));},8000);function cleanup(){clearTimeout(timeout);video.removeEventListener('loadeddata',ready);video.removeEventListener('resize',ready);}video.addEventListener('loadeddata',ready);video.addEventListener('resize',ready);ready();});
   if(token!==epoch)return;
   shutter.hidden=false;shutter.disabled=false;status.textContent='Strike a pose. You’ll have 5 seconds.';camera.scrollIntoView({behavior:'smooth',block:'nearest'});
  }catch(error){if(token!==epoch)return;stop();video.hidden=true;status.textContent=error.name==='NotAllowedError'?'Camera access is blocked. Allow it in your browser, then try again.':error.name==='NotReadableError'?'Your camera may be in use by another app. Close it there and try again.':error.name==='NotFoundError'?'No camera was found on this device.':'The camera couldn’t show a live view. Try again, or open this page in Chrome or Edge.';
  }finally{if(token===epoch){starting=false;startButton.disabled=false;}}
 }
 async function openCapture(){
  if(!reactionDialog.open)reactionDialog.showModal();
  camera.hidden=false;resetActions();status.textContent='';
  if(draft){preview(draft);retake.hidden=false;save.hidden=false;return;}
  try{const saved=await reaction(day);if(!reactionDialog.open)return;if(saved){savedPhoto=saved.blob;draft=null;preview(savedPhoto);retake.hidden=false;status.textContent='Saved ♡';return;}}catch{if(reactionDialog.open)status.textContent='Photo storage isn’t available in this browser.';return;}
  start();
 }
 function closeCapture(){if(reactionDialog.open)reactionDialog.close();stop();if(savedPhoto){preview(savedPhoto);camera.hidden=false;retake.hidden=false;save.hidden=true;}else if(draft){preview(draft);camera.hidden=false;retake.hidden=false;save.hidden=false;}else{video.hidden=true;shutter.hidden=true;camera.hidden=true;}}
 startButton.onclick=openCapture;retake.onclick=start;
 reactionDialog.querySelector('.reaction-close').onclick=closeCapture;
 reactionDialog.addEventListener('cancel',event=>{event.preventDefault();closeCapture();});
 reactionDialog.addEventListener('click',event=>{if(event.target===reactionDialog)closeCapture();});
 function capture(token){if(token!==epoch)return;if(!video.videoWidth||video.readyState<2){shutter.disabled=false;count.hidden=true;status.textContent='The camera isn’t ready yet. Please try again.';return;}
  const canvas=document.createElement('canvas');canvas.width=video.videoWidth;canvas.height=video.videoHeight;const ctx=canvas.getContext('2d');ctx.translate(canvas.width,0);ctx.scale(-1,1);ctx.drawImage(video,0,0);q('.reaction-flash').animate([{opacity:.8},{opacity:0}],{duration:350});
  canvas.toBlob(blob=>{if(token!==epoch)return;if(!blob){count.hidden=true;shutter.disabled=false;status.textContent='Couldn’t capture that photo. Try again.';return;}stop();draft=blob;preview(blob);resetActions();retake.hidden=false;save.hidden=false;status.textContent='';save.focus({preventScroll:true});},'image/jpeg',.9);
 }
 shutter.onclick=()=>{if(shutter.disabled||!stream)return;shutter.disabled=true;startButton.disabled=true;const token=epoch;count.hidden=false;status.textContent='';cancelCountdown=startCountdown({onTick:value=>{count.textContent=value||'';if(value)count.animate([{transform:'scale(1.18)',opacity:.6},{transform:'scale(1)',opacity:1}],{duration:250});},onComplete:()=>capture(token)});};
 save.onclick=async()=>{if(!draft||save.disabled)return;const token=epoch;save.disabled=true;retake.disabled=true;startButton.disabled=true;try{await saveReaction(day,draft);if(token!==epoch)return;savedPhoto=draft;draft=null;save.hidden=true;retake.hidden=false;status.textContent='Saved ♡';}catch{if(token===epoch)status.textContent='Couldn’t save this photo. Please try again.';}finally{save.disabled=false;retake.disabled=false;startButton.disabled=false;}};
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&stream){stop();video.hidden=true;shutter.hidden=true;status.textContent='Camera paused. Tap Capture Your Reaction to try again.';}});
 return{element:card,captureButton,reactionDialog,stop,async show(){envelope?.reset();card.hidden=false;captureButton.hidden=giftKind===2&&!isLetterOpened(day);const token=++epoch;status.textContent='';resetActions();if(startMirror)startMirror();storyController?.start();libraryController?.show();try{const saved=await reaction(day);if(token===epoch)savedPhoto=saved?.blob||null;}catch{savedPhoto=null;}},hide(){envelope?.cancel();stopMirror();storyController?.stop();libraryController?.hide();closeCapture();draft=null;savedPhoto=null;captureButton.hidden=true;card.hidden=true;camera.hidden=true;resetActions();if(url){URL.revokeObjectURL(url);url=null;}photo.removeAttribute('src');}};
}
