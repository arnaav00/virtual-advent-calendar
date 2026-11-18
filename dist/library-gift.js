const COLORS=['#76505a','#375c63','#ab6645','#526b4e','#c28b47','#665876','#365776','#8a4e43','#587b79','#a8784c','#465a75','#7a6850','#576c52','#9b5856','#526879'];
const TILTS=[-31,18,54,-12,37,82,-46,9,-67,28,-22,62,-8,43,-52];
const FLOOR_POSITIONS=[[5,28],[20,3],[36,20],[53,1],[75,25],[0,48],[18,35],[36,54],[57,40],[77,48],[7,66],[25,68],[43,66],[61,62],[78,67]];

export function setupLibraryGift(card){
 const scene=document.createElement('div');scene.className='library-gift-scene';scene.innerHTML=`
  <header class="library-gift-heading"><h2>You're little and you love books, so here's a little library just for you!</h2><p>Unfortunately, you'll have to stack them here as well.</p></header>
  <div class="library-play-area">
   <div class="library-cabinet-stage" data-open="false">
    <img class="library-cupboard library-cupboard-closed" src="./assets/WhatsApp_Image_2026-11-18_at_10.35.19_PM-removebg-preview.png" alt="A small wooden glass-front book cupboard">
    <img class="library-cupboard library-cupboard-open" src="./assets/WhatsApp_Image_2026-11-18_at_10.35.41_PM-removebg-preview.png" alt="The cupboard open, showing three shelves">
    <img class="library-cupboard library-cupboard-complete" src="./assets/full-library.png" alt="The little library filled with books">
    <button type="button" class="library-glass-hitbox" aria-label="Open the little library"></button>
    <div class="library-shelf-slots" aria-label="Fifteen book spaces across three shelves"></div>
    <div class="library-glass-gleam" aria-hidden="true"></div>
   </div>
   <div class="library-floor" aria-label="Books scattered on the floor"></div>
  </div>
  <button type="button" class="library-start-over" hidden>START OVER</button>
  <div class="library-drag-layer" aria-hidden="true"></div>`;
 card.classList.add('library-card');
 card.querySelector('.card-stamp').remove();card.querySelector('.playlist-letter').remove();card.querySelector('.playlist-tile').remove();card.querySelector('.playlist-boombox-hint').remove();
 card.insertBefore(scene,card.querySelector('.reaction-area'));

 const cabinet=scene.querySelector('.library-cabinet-stage'),floor=scene.querySelector('.library-floor'),slotsRoot=scene.querySelector('.library-shelf-slots'),glass=scene.querySelector('.library-glass-hitbox'),restart=scene.querySelector('.library-start-over'),dragLayer=scene.querySelector('.library-drag-layer');
 const rows=[{bottom:60,height:16.4},{bottom:45.2,height:14.8},{bottom:29.2,height:16.1}],slotEls=[],books=[];
 rows.forEach((row,r)=>{for(let c=0;c<5;c++){const slot=document.createElement('div');slot.className='library-shelf-slot';slot.dataset.index=String(r*5+c);slot.setAttribute('aria-label',`Shelf ${r+1}, position ${c+1}`);slot.style.left=`${23.5+c*7.3}%`;slot.style.width='7.3%';slot.style.bottom=`${row.bottom}%`;slot.style.height=`${row.height}%`;slotsRoot.append(slot);slotEls.push(slot);}});
 for(let i=0;i<15;i++){
  const tile=document.createElement('div');tile.className='library-floor-tile';tile.dataset.index=String(i);tile.style.setProperty('--floor-x',`${FLOOR_POSITIONS[i][0]}%`);tile.style.setProperty('--floor-y',`${FLOOR_POSITIONS[i][1]}%`);
  const book=document.createElement('button');book.type='button';book.className='library-book';book.dataset.index=String(i);book.style.setProperty('--book-color',COLORS[i]);book.style.setProperty('--scatter-tilt',`${TILTS[i]}deg`);book.setAttribute('aria-label',`Pick up book ${i+1}`);
  book.innerHTML='<span class="library-book-face" aria-hidden="true"></span><span class="library-book-pages" aria-hidden="true"></span><span class="library-book-spine" aria-hidden="true"></span>';
  tile.append(book);floor.append(tile);books.push(book);
 }
 let state='closed',drag=null,finishTimer=0,run=0;
 const setOpen=value=>{cabinet.classList.toggle('is-open',value);cabinet.dataset.open=String(value);glass.hidden=value;slotsRoot.classList.toggle('is-active',value);};
 function reset(){
  run++;clearTimeout(finishTimer);state='closed';setOpen(false);restart.hidden=true;cabinet.classList.remove('is-closing','is-complete');
  slotEls.forEach(slot=>{slot.replaceChildren();slot.removeAttribute('data-filled');});
  books.forEach((book,i)=>{const tile=floor.querySelector(`.library-floor-tile[data-index="${i}"]`);tile.replaceChildren(book);book.className='library-book';book.disabled=false;book.style.left='';book.style.top='';book.style.width='';book.style.height='';book.style.zIndex='';book.style.transform='';book.style.setProperty('--scatter-tilt',`${TILTS[i]}deg`);});
 }
 function openCabinet(){if(state!=='closed')return;state='sorting';setOpen(true);restart.hidden=true;}
 glass.addEventListener('click',openCabinet);
 function complete(){
  if(state!=='sorting'||slotEls.some(slot=>!slot.hasAttribute('data-filled')))return;
  state='closing';const token=run;cabinet.classList.add('is-closing');
  finishTimer=setTimeout(()=>{if(token!==run)return;setOpen(false);cabinet.classList.remove('is-closing');cabinet.classList.add('is-complete');state='complete';finishTimer=setTimeout(()=>{if(token===run&&state==='complete')restart.hidden=false;},1150);},740);
 }
 restart.addEventListener('click',()=>{
  if(state!=='complete')return;const token=++run;restart.hidden=true;cabinet.classList.remove('is-complete');state='resetting';setOpen(true);
  slotEls.forEach(slot=>{const book=slot.querySelector('.library-book');if(!book)return;const i=Number(book.dataset.index),tile=floor.querySelector(`.library-floor-tile[data-index="${i}"]`);slot.removeAttribute('data-filled');tile.append(book);book.classList.remove('is-shelved');book.classList.add('is-falling');book.disabled=false;setTimeout(()=>book.classList.remove('is-falling'),720+i%5*28);});
  setTimeout(()=>{if(token===run){state='sorting';}},780);
 });
 function upBook(book,event){
  if(state!=='sorting'||book.classList.contains('is-shelved')||drag)return;
  event.preventDefault();
  drag={book,id:event.pointerId,offsetX:11,offsetY:34,startX:event.clientX,startY:event.clientY};
  book.classList.add('is-dragging','is-upright');book.style.position='fixed';book.style.left=`${event.clientX-drag.offsetX}px`;book.style.top=`${event.clientY-drag.offsetY}px`;book.style.width='22px';book.style.height='68px';book.style.zIndex='20';dragLayer.append(book);
  moveBook(event);document.addEventListener('pointermove',moveBook);document.addEventListener('pointerup',dropBook,{once:true});document.addEventListener('pointercancel',dropBook,{once:true});
 }
 function moveBook(event){if(!drag||event.pointerId!==drag.id)return;drag.book.style.left=`${event.clientX-drag.offsetX}px`;drag.book.style.top=`${event.clientY-drag.offsetY}px`;}
 function dropBook(event){
  if(!drag||event.pointerId!==drag.id)return;const book=drag.book;drag=null;document.removeEventListener('pointermove',moveBook);document.removeEventListener('pointerup',dropBook);document.removeEventListener('pointercancel',dropBook);
  const target=document.elementFromPoint(event.clientX,event.clientY)?.closest('.library-shelf-slot');
  book.classList.remove('is-dragging','is-upright');book.style.position='';book.style.left='';book.style.top='';book.style.width='';book.style.height='';book.style.zIndex='';
  if(target&&state==='sorting'&&!target.hasAttribute('data-filled')){
   target.setAttribute('data-filled','true');target.append(book);book.classList.add('is-shelved');book.disabled=true;
   const i=Number(book.dataset.index);book.style.setProperty('--shelf-tone',COLORS[i]);complete();return;
  }
  const tile=floor.querySelector(`.library-floor-tile[data-index="${book.dataset.index}"]`);tile.append(book);book.classList.add('is-falling');setTimeout(()=>book.classList.remove('is-falling'),580);
 }
 books.forEach(book=>book.addEventListener('pointerdown',event=>upBook(book,event)));
 return{reset,show(){reset();card.hidden=false;},hide(){run++;clearTimeout(finishTimer);drag=null;}};
}
