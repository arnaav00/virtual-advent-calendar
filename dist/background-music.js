export function setupBackgroundMusic(){
 const audio=new Audio('./assets/default_bg_song.mp3');audio.loop=true;audio.preload='auto';audio.volume=.24;
 let stoppedForSpotify=false,started=false;
 document.addEventListener('keydown',event=>{if(event.repeat||event.altKey||event.ctrlKey||event.metaKey||event.key.toLowerCase()!=='m')return;const el=event.target;if(el instanceof HTMLElement&&(el.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)))return;audio.muted=!audio.muted;});
 const start=()=>{if(stoppedForSpotify||started)return;audio.play().then(()=>{started=true;document.removeEventListener('pointerdown',start,true);document.removeEventListener('keydown',start,true);}).catch(()=>{});};
 audio.play().then(()=>{started=true;}).catch(()=>{document.addEventListener('pointerdown',start,true);document.addEventListener('keydown',start,true);});
 const stop=()=>{stoppedForSpotify=true;audio.pause();audio.currentTime=0;document.removeEventListener('pointerdown',start,true);document.removeEventListener('keydown',start,true);};
 window.addEventListener('spotify-playback-started',stop);
 let pausedForGift=false;
 window.addEventListener('pause-calendar-music',()=>{pausedForGift=!audio.paused;audio.pause();});
 window.addEventListener('resume-calendar-music',()=>{if(pausedForGift&&started&&!stoppedForSpotify)audio.play().catch(()=>{});pausedForGift=false;});
 return{audio,stop};
}
