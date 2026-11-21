import { playlistCard } from './playlist-gift.js';

const SHAPES = {
  I: [[0,1],[1,1],[2,1],[3,1]],
  O: [[0,0],[1,0],[0,1],[1,1]],
  T: [[1,0],[0,1],[1,1],[2,1]],
  L: [[0,0],[0,1],[0,2],[1,2]],
  J: [[1,0],[1,1],[0,2],[1,2]],
  S: [[1,0],[2,0],[0,1],[1,1]],
  Z: [[0,0],[1,0],[1,1],[2,1]]
};
const WIDTH = 10, HEIGHT = 20;

export function tetrisCard() {
  const day = 18;
  const card = document.createElement('section');
  card.className = 'silk-gift';
  card.hidden = true;
  card.setAttribute('aria-label', 'Dairy Milk Silk and chocolate Tetris');
  card.innerHTML = `
    <div class="silk-intro">
      <p class="silk-note">I'm so proud of you for crushing that conference, and you should be too. You deserve a lil treat.</p>
      <button class="silk-wrapper-button" type="button" aria-label="Open chocolate Tetris game"><img class="silk-wrapper" src="./assets/gift18-dairy-milk-silk.png" alt="Dairy Milk Silk chocolate bar"></button>
    </div>
    <div class="silk-tetris" hidden>
      <aside class="silk-side silk-left">
        <div class="silk-controls"><div><kbd>←</kbd><kbd>→</kbd><span>Move</span></div><div><kbd>↑</kbd><span>Rotate</span></div><div><kbd>Space</kbd><span>Drop</span></div></div>
        <div class="silk-stats"><div class="silk-timer">00:00</div><div class="silk-score">0</div></div>
      </aside>
      <div class="silk-board" role="grid" aria-label="Chocolate Tetris playfield"></div>
      <aside class="silk-side silk-right"><div class="silk-next-label">Next</div><div class="silk-next" aria-label="Next chocolate piece"></div></aside>
      <div class="silk-end" hidden></div>
    </div>`;

  const camera = playlistCard(day);
  camera.element.remove();
  camera.captureButton.setAttribute('aria-label', 'Capture your reaction');
  camera.captureButton.dataset.tooltip = 'Capture your reaction';
  camera.reactionDialog.setAttribute('aria-label', `Gift #${day} photo capture`);

  const wrapperButton = card.querySelector('.silk-wrapper-button');
  const intro = card.querySelector('.silk-intro');
  const game = card.querySelector('.silk-tetris');
  const boardElement = card.querySelector('.silk-board');
  const previewElement = card.querySelector('.silk-next');
  const scoreElement = card.querySelector('.silk-score');
  const timerElement = card.querySelector('.silk-timer');
  const endElement = card.querySelector('.silk-end');
  const boardNodes = Array.from({ length: WIDTH * HEIGHT }, (_, index) => {
    const cell = document.createElement('div');
    cell.className = 'silk-cell';
    cell.setAttribute('role', 'gridcell');
    cell.dataset.index = index;
    boardElement.append(cell);
    return cell;
  });
  const previewNodes = Array.from({ length: 16 }, () => {
    const cell = document.createElement('div');
    cell.className = 'silk-preview-cell';
    previewElement.append(cell);
    return cell;
  });

  let settled, current, nextShape, bag = [], gravityTimer = 0, clockTimer = 0, startedAt = 0, score = 0, running = false;
  function refillBag() {
    bag = Object.keys(SHAPES);
    for (let i=bag.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [bag[i],bag[j]]=[bag[j],bag[i]]; }
  }
  function takeShape() {
    if (!bag.length) refillBag();
    return bag.pop();
  }
  function rotated(cells) {
    const transformed = cells.map(([x,y]) => [y,-x]);
    const minX = Math.min(...transformed.map(([x]) => x));
    const minY = Math.min(...transformed.map(([,y]) => y));
    return transformed.map(([x,y]) => [x-minX,y-minY]);
  }
  function collides(piece, dx = 0, dy = 0, shape = piece.cells) {
    return shape.some(([x,y]) => {
      const px = piece.x + x + dx, py = piece.y + y + dy;
      return px < 0 || px >= WIDTH || py >= HEIGHT || (py >= 0 && settled[py][px]);
    });
  }
  function spawn() {
    current = { type: nextShape || takeShape(), cells: null, x: 3, y: 0 };
    current.cells = SHAPES[current.type].map(([x,y]) => [x,y]);
    nextShape = takeShape();
    renderPreview();
    if (collides(current)) finishGame();
  }
  function renderPreview() {
    previewNodes.forEach(node => node.classList.remove('is-filled'));
    const cells = SHAPES[nextShape];
    const minX = Math.min(...cells.map(([x]) => x)), minY = Math.min(...cells.map(([,y]) => y));
    cells.forEach(([x,y]) => previewNodes[(y-minY)*4 + x-minX]?.classList.add('is-filled'));
  }
  function render() {
    const filled = new Set();
    settled.forEach((row,y) => row.forEach((occupied,x) => { if (occupied) filled.add(y*WIDTH+x); }));
    if (current) current.cells.forEach(([x,y]) => {
      const px=current.x+x, py=current.y+y;
      if (py>=0&&py<HEIGHT&&px>=0&&px<WIDTH) filled.add(py*WIDTH+px);
    });
    boardNodes.forEach((node,index) => node.classList.toggle('is-filled',filled.has(index)));
    scoreElement.textContent = String(score);
  }
  function lockPiece() {
    current.cells.forEach(([x,y]) => {
      const px=current.x+x, py=current.y+y;
      if (py < 0) { finishGame(); return; }
      settled[py][px] = true;
    });
    if (!running) return;
    let cleared=0;
    for(let y=HEIGHT-1;y>=0;){
      if(settled[y].every(Boolean)){settled.splice(y,1);settled.unshift(Array(WIDTH).fill(false));cleared++;}
      else y--;
    }
    score += [0,40,100,300,1200][cleared];
    spawn();
    render();
  }
  function move(dx) { if (!collides(current,dx,0)) { current.x+=dx; render(); } }
  function rotate() {
    if(current.type==='O')return;
    const shape=rotated(current.cells);
    for(const kick of [0,-1,1,-2,2]) if(!collides(current,kick,0,shape)){current.x+=kick;current.cells=shape;render();return;}
  }
  function drop() {
    while(!collides(current,0,1))current.y++;
    lockPiece();
  }
  function formatTime(seconds) { return `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`; }
  function finishGame() {
    running=false;clearInterval(gravityTimer);clearInterval(clockTimer);
    endElement.textContent='GAME OVER · SPACE TO RESTART';endElement.hidden=false;
  }
  function startGame() {
    clearInterval(gravityTimer);clearInterval(clockTimer);
    settled=Array.from({length:HEIGHT},()=>Array(WIDTH).fill(false));
    score=0;bag=[];current=null;nextShape=takeShape();startedAt=Date.now();running=true;endElement.hidden=true;timerElement.textContent='00:00';
    spawn();render();
    gravityTimer=setInterval(()=>{if(!running)return;if(!collides(current,0,1)){current.y++;render();}else lockPiece();},850);
    clockTimer=setInterval(()=>{if(running)timerElement.textContent=formatTime(Math.floor((Date.now()-startedAt)/1000));},250);
  }
  function onKeyDown(event) {
    if(card.hidden||game.hidden)return;
    if(['ArrowLeft','ArrowRight','ArrowUp',' '].includes(event.key))event.preventDefault();
    if(!running){if(event.code==='Space'||event.key===' ')startGame();return;}
    if(event.key==='ArrowLeft')move(-1);
    else if(event.key==='ArrowRight')move(1);
    else if(event.key==='ArrowUp')rotate();
    else if(event.code==='Space'||event.key===' ')drop();
  }
  wrapperButton.addEventListener('click',()=>{intro.hidden=true;game.hidden=false;startGame();});
  document.addEventListener('keydown',onKeyDown);

  return {
    element: card,
    captureButton: camera.captureButton,
    show() { card.hidden=false;intro.hidden=false;game.hidden=true;void camera.show(); },
    hide() { card.hidden=true;clearInterval(gravityTimer);clearInterval(clockTimer);running=false;camera.hide(); },
    stop() { clearInterval(gravityTimer);clearInterval(clockTimer);running=false;camera.stop(); }
  };
}
