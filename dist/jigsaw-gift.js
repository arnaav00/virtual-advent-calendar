import { playlistCard } from './playlist-gift.js';

const COLS = 8;
const ROWS = 8;
const COUNT = COLS * ROWS;
const SAVE_KEY = 'snowglobe:gift14:jigsaw:v2';

export function jigsawCard() {
  const element = document.createElement('section');
  element.className = 'jigsaw-gift';
  element.hidden = true;
  element.setAttribute('aria-label', 'Gift #14 custom jigsaw puzzle');
  element.addEventListener('click', event => event.stopPropagation());
  element.innerHTML = `
    <header class="jigsaw-header">
      <div class="jigsaw-reference"><img src="./assets/gift14-photo.png" alt="Puzzle reference photo"></div>
      <h1>PUZZLE TIME!</h1>
      <div class="jigsaw-clock-controls">
        <output class="jigsaw-time" aria-label="Elapsed time">00:00</output>
        <button type="button" class="jigsaw-timer-toggle">Start timer</button>
      </div>
    </header>
    <div class="jigsaw-play-area">
      <div class="jigsaw-board" aria-label="Jigsaw board">
        <img class="jigsaw-reveal" src="./assets/gift14-photo.png" alt="Completed puzzle photo">
      </div>
      <div class="jigsaw-pieces" aria-label="Scattered puzzle pieces"></div>
      <button type="button" class="jigsaw-reset">Reset Puzzle</button>
    </div>
    <div class="jigsaw-finish" hidden>
      <div class="jigsaw-finish-board"><img src="./assets/gift14-photo.png" alt="Completed puzzle"></div>
      <h2>You did it!</h2>
      <output class="jigsaw-finish-time"></output>
      <button type="button" class="jigsaw-play-again">Play Again</button>
    </div>
    <div class="jigsaw-confetti" aria-hidden="true"></div>`;

  const camera = playlistCard(14);
  camera.element.remove();
  camera.captureButton.setAttribute('aria-label', 'Capture your reaction');
  camera.captureButton.dataset.tooltip = 'Capture your reaction';
  camera.reactionDialog.setAttribute('aria-label', 'Gift #14 photo capture');
  document.body.append(camera.reactionDialog);

  const board = element.querySelector('.jigsaw-board');
  const piecesLayer = element.querySelector('.jigsaw-pieces');
  const clock = element.querySelector('.jigsaw-time');
  const timerButton = element.querySelector('.jigsaw-timer-toggle');
  const resetButton = element.querySelector('.jigsaw-reset');
  const finish = element.querySelector('.jigsaw-finish');
  const finishClock = element.querySelector('.jigsaw-finish-time');
  const playAgain = element.querySelector('.jigsaw-play-again');
  const title = element.querySelector('.jigsaw-header');
  const playArea = element.querySelector('.jigsaw-play-area');
  const reveal = element.querySelector('.jigsaw-reveal');
  const loaded = new Image();
  loaded.src = './assets/gift14-photo.png';
  loaded.decoding = 'async';

  let timerId = 0;
  let elapsed = 0;
  let runStartedAt = 0;
  let timerRunning = false;
  let finished = false;
  let layoutFrame = 0;
  let session = 0;
  let pieces = [];
  let lastPieceDims = null;
  let lastBoardRect = null;
  let lastViewport = null;
  let scatterHomes = [];
  loaded.addEventListener('load', () => {
    if (!element.hidden && !finished && !pieces.length) renderPieces();
  });

  function formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  }

  function updateClock() {
    const current = elapsed + (timerRunning ? Date.now() - runStartedAt : 0);
    clock.value = formatTime(current);
    clock.textContent = clock.value;
    finishClock.value = formatTime(elapsed);
    finishClock.textContent = finishClock.value;
  }

  function saveResult() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify({ completed: finished, elapsed })); } catch {}
  }

  function savedResult() {
    try {
      const data = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
      return data?.completed && Number.isFinite(data.elapsed) ? data : null;
    } catch { return null; }
  }

  function setTimerRunning(running) {
    if (running === timerRunning) return;
    if (running) {
      runStartedAt = Date.now();
      timerRunning = true;
      timerButton.textContent = 'Pause timer';
      timerButton.setAttribute('aria-pressed', 'true');
      timerId = window.setInterval(updateClock, 250);
    } else {
      elapsed += Date.now() - runStartedAt;
      timerRunning = false;
      clearInterval(timerId);
      timerId = 0;
      timerButton.textContent = 'Start timer';
      timerButton.setAttribute('aria-pressed', 'false');
      updateClock();
    }
  }

  function makeEdge(ctx, start, end, normal, sign, width, height, seed) {
    const x = end.x - start.x;
    const y = end.y - start.y;
    const along = (t, offset = 0) => ({ x: start.x + x * t + normal.x * sign * offset, y: start.y + y * t + normal.y * sign * offset });
    if (!sign) { ctx.lineTo(end.x, end.y); return; }
    const depth = Math.min(width, height) * .22;
    const variation = ((seed * 37 + 11) % 5) * .012;
    const left = .29 - variation, right = .71 + variation;
    const neckLeft = left + .095 + variation * .3, neckRight = right - .095 - variation * .3;
    const shoulder = depth * (.44 + variation), crown = depth * (.92 + variation * 2);
    ctx.lineTo(along(left).x, along(left).y);
    const a = along(neckLeft, shoulder), b = along(neckRight, shoulder), mid = along(.5, crown);
    ctx.bezierCurveTo(along(.32).x, along(.32).y, along(.34, shoulder).x, along(.34, shoulder).y, a.x, a.y);
    ctx.bezierCurveTo(along(.42, crown * 1.08).x, along(.42, crown * 1.08).y, along(.43, crown).x, along(.43, crown).y, mid.x, mid.y);
    ctx.bezierCurveTo(along(.57, crown).x, along(.57, crown).y, along(.58, crown * 1.08).x, along(.58, crown * 1.08).y, b.x, b.y);
    const c = along(right);
    ctx.bezierCurveTo(along(.66, shoulder).x, along(.66, shoulder).y, along(.68).x, along(.68).y, c.x, c.y);
    ctx.lineTo(end.x, end.y);
  }

  function edgeSigns(row, col) {
    const horizontal = (r, c) => ((r * 17 + c * 31 + 3) % 2 ? 1 : -1);
    const vertical = (r, c) => ((r * 29 + c * 13 + 1) % 2 ? 1 : -1);
    return {
      top: row === 0 ? 0 : -horizontal(row - 1, col),
      right: col === COLS - 1 ? 0 : vertical(row, col),
      bottom: row === ROWS - 1 ? 0 : horizontal(row, col),
      left: col === 0 ? 0 : -vertical(row, col - 1),
    };
  }

  function drawPiece(canvas, index, metrics) {
    const { cellW, cellH, tab } = metrics;
    const margin = tab * 1.2 + 2;
    const logicalW = cellW + margin * 2;
    const logicalH = cellH + margin * 2;
    const scale = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(logicalW * scale);
    canvas.height = Math.round(logicalH * scale);
    canvas.style.width = `${logicalW}px`;
    canvas.style.height = `${logicalH}px`;
    canvas.dataset.width = logicalW;
    canvas.dataset.height = logicalH;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.clearRect(0, 0, logicalW, logicalH);
    const row = Math.floor(index / COLS), col = index % COLS;
    const signs = edgeSigns(row, col);
    const tl = { x: margin, y: margin }, tr = { x: margin + cellW, y: margin };
    const br = { x: margin + cellW, y: margin + cellH }, bl = { x: margin, y: margin + cellH };
    const path = new Path2D();
    path.moveTo(tl.x, tl.y);
    makeEdge(path, tl, tr, { x: 0, y: -1 }, signs.top, cellW, cellH, row * 101 + col);
    makeEdge(path, tr, br, { x: 1, y: 0 }, signs.right, cellW, cellH, 500 + row * 101 + col);
    makeEdge(path, br, bl, { x: 0, y: 1 }, signs.bottom, cellW, cellH, (row + 1) * 101 + col);
    makeEdge(path, bl, tl, { x: -1, y: 0 }, signs.left, cellW, cellH, 500 + row * 101 + col - 1);
    path.closePath();
    ctx.save();
    ctx.shadowColor = '#0009';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetY = 2;
    ctx.clip(path);
    const imageRect = board.getBoundingClientRect();
    const cropSize = Math.min(loaded.naturalWidth, loaded.naturalHeight);
    const sourceX = (loaded.naturalWidth - cropSize) / 2;
    const sourceY = (loaded.naturalHeight - cropSize) / 2;
    ctx.drawImage(loaded, sourceX, sourceY, cropSize, cropSize, margin - col * cellW, margin - row * cellH, imageRect.width, imageRect.height);
    ctx.restore();
    ctx.strokeStyle = '#fff9';
    ctx.lineWidth = 1.2;
    ctx.stroke(path);
  }

  function protectedAreas() {
    return [
      dialogClose(), camera.captureButton,
      timerButton, resetButton,
      element.querySelector('.jigsaw-time'),
    ].filter(node => node && !node.hidden).map(node => node.getBoundingClientRect());
  }

  function dialogClose() { return document.querySelector('#day-gift .gift-close'); }

  function touchesProtected(point) {
    const pad = 24;
    return protectedAreas().some(rect => point.x >= rect.left - pad && point.x <= rect.right + pad && point.y >= rect.top - pad && point.y <= rect.bottom + pad);
  }

  function homePosition(index, metrics, boardRect) {
    const { isLeft, x, y } = scatterHomes[index];
    const width = Number(metrics.logicalW), height = Number(metrics.logicalH);
    const pagePad = Math.max(10, window.innerWidth * .012);
    const leftStart = pagePad;
    const leftEnd = Math.max(leftStart, boardRect.left - width - 10);
    const rightStart = Math.min(window.innerWidth - width - pagePad, boardRect.right + 10);
    const cameraRect = camera.captureButton.getBoundingClientRect();
    const rightEnd = window.innerWidth - width - pagePad;
    const x0 = isLeft ? leftStart : rightStart;
    const x1 = isLeft ? leftEnd : Math.max(rightStart, rightEnd);
    const y0 = Math.max(268, title.getBoundingClientRect().bottom + 12);
    const bottomLimit = isLeft ? window.innerHeight - 90 : Math.min(window.innerHeight - 90, cameraRect.top - height - 16);
    return {
      left: x0 + Math.max(0, x1 - x0) * x,
      top: y0 + Math.max(0, bottomLimit - y0 - height) * y,
    };
  }

  function createPiece(index, metrics, boardRect) {
    const piece = document.createElement('canvas');
    piece.className = 'jigsaw-piece';
    piece.dataset.index = index;
    piece.setAttribute('role', 'button');
    piece.tabIndex = 0;
    piece.setAttribute('aria-label', `Puzzle piece ${index + 1}`);
    drawPiece(piece, index, metrics);
    const home = homePosition(index, metrics, boardRect);
    piece.style.left = `${home.left}px`;
    piece.style.top = `${home.top}px`;
    piece._home = home;
    piece._lastPosition = home;
    piece._index = index;
    piece._group = new Set([index]);
    piece.addEventListener('pointerdown', event => {
      if (finished || event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      const rect = piece.getBoundingClientRect();
      piece._offset = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      piece._pointer = event.pointerId;
      piece._dragGroup = [...piece._group].map(groupIndex => pieces[groupIndex]);
      piece._dragStarts = piece._dragGroup.map(member => ({
        member,
        left: Number.parseFloat(member.style.left) || 0,
        top: Number.parseFloat(member.style.top) || 0,
      }));
      piece.setPointerCapture(event.pointerId);
      piece.classList.add('is-dragging');
    });
    piece.addEventListener('pointermove', event => {
      if (piece._pointer !== event.pointerId) return;
      const left = event.clientX - piece._offset.x, top = event.clientY - piece._offset.y;
      const anchor = piece._dragStarts.find(item => item.member === piece);
      const dx = left - anchor.left, dy = top - anchor.top;
      for (const start of piece._dragStarts) {
        start.member.style.left = `${start.left + dx}px`;
        start.member.style.top = `${start.top + dy}px`;
      }
    });
    piece.addEventListener('pointerup', event => {
      if (piece._pointer !== event.pointerId) return;
      const rect = piece.getBoundingClientRect();
      const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      const currentBoard = board.getBoundingClientRect();
      piece.releasePointerCapture(event.pointerId);
      piece._pointer = null;
      piece.classList.remove('is-dragging');
      for (const member of piece._dragGroup || []) member.style.zIndex = '';
      if (touchesProtected(center)) {
        for (const start of piece._dragStarts || []) {
          start.member.style.left = `${start.left}px`;
          start.member.style.top = `${start.top}px`;
        }
      } else {
        joinTouchingGroups(piece._group, currentBoard);
        for (const memberIndex of piece._group) {
          const member = pieces[memberIndex];
          member._lastPosition = { left: Number.parseFloat(member.style.left), top: Number.parseFloat(member.style.top) };
        }
        if (piece._group.size === COUNT && groupIsAligned(piece._group, currentBoard.width / COLS, currentBoard.height / ROWS, 2)) completePuzzle(true);
      }
      piece._dragGroup = null;
      piece._dragStarts = null;
    });
    piece.addEventListener('pointercancel', () => {
      piece._pointer = null;
      piece.classList.remove('is-dragging');
      for (const start of piece._dragStarts || []) {
        start.member.style.left = `${start.left}px`;
        start.member.style.top = `${start.top}px`;
        start.member.style.zIndex = '';
      }
      piece._dragGroup = null;
      piece._dragStarts = null;
    });
    piece.addEventListener('keydown', event => {
      if ((event.key === 'Enter' || event.key === ' ') && !finished) {
        event.preventDefault();
        const currentBoard = board.getBoundingClientRect();
        joinTouchingGroups(piece._group, currentBoard);
        if (piece._group.size === COUNT && groupIsAligned(piece._group, currentBoard.width / COLS, currentBoard.height / ROWS, 2)) completePuzzle(true);
      }
    });
    return piece;
  }

  function cellOrigin(piece) {
    return { x: Number.parseFloat(piece.style.left) + lastPieceDims.margin, y: Number.parseFloat(piece.style.top) + lastPieceDims.margin };
  }

  function shiftGroup(group, dx, dy) {
    for (const index of group) {
      const member = pieces[index];
      member.style.left = `${Number.parseFloat(member.style.left) + dx}px`;
      member.style.top = `${Number.parseFloat(member.style.top) + dy}px`;
    }
  }

  function groupIsAligned(group, cellW, cellH, tolerance) {
    const members = [...group].map(index => pieces[index]);
    if (!members.length) return false;
    const anchor = members[0], anchorOrigin = cellOrigin(anchor);
    const anchorRow = Math.floor(anchor._index / COLS), anchorCol = anchor._index % COLS;
    return members.every(member => {
      const row = Math.floor(member._index / COLS), col = member._index % COLS;
      const origin = cellOrigin(member);
      return Math.abs(origin.x - (anchorOrigin.x + (col - anchorCol) * cellW)) <= tolerance
        && Math.abs(origin.y - (anchorOrigin.y + (row - anchorRow) * cellH)) <= tolerance;
    });
  }

  function joinTouchingGroups(activeGroup, boardRect) {
    const cellW = boardRect.width / COLS, cellH = boardRect.height / ROWS;
    // Join only when neighboring cut edges are effectively touching; the
    // small pixel allowance accounts for pointer coordinates and rounding.
    const tolerance = 2;
    let merged = true;
    while (merged) {
      merged = false;
      outer: for (let a = 0; a < COUNT; a++) {
        const first = pieces[a], row = Math.floor(a / COLS), col = a % COLS;
        const neighbors = [];
        if (col < COLS - 1) neighbors.push([a + 1, cellW, 0]);
        if (row < ROWS - 1) neighbors.push([a + COLS, 0, cellH]);
        for (const [b, expectedX, expectedY] of neighbors) {
          const second = pieces[b];
          if (first._group === second._group) continue;
          if (!activeGroup.has(a) && !activeGroup.has(b)) continue;
          const firstOrigin = cellOrigin(first), secondOrigin = cellOrigin(second);
          const errorX = secondOrigin.x - firstOrigin.x - expectedX;
          const errorY = secondOrigin.y - firstOrigin.y - expectedY;
          if (Math.abs(errorX) > tolerance || Math.abs(errorY) > tolerance) continue;
          const groupA = first._group, groupB = second._group;
          const movingGroup = groupA === activeGroup ? groupB : groupA;
          if (groupA === activeGroup) shiftGroup(movingGroup, -errorX, -errorY);
          else shiftGroup(movingGroup, errorX, errorY);
          for (const memberIndex of movingGroup) {
            activeGroup.add(memberIndex);
            pieces[memberIndex]._group = activeGroup;
          }
          merged = true;
          break outer;
        }
      }
    }
  }

  function throwConfetti() {
    const layer = element.querySelector('.jigsaw-confetti');
    layer.replaceChildren();
    const colors = ['#f6cf79', '#ec8e85', '#85c2b6', '#fff0c8', '#9b9bd0'];
    for (let i = 0; i < 68; i++) {
      const fleck = document.createElement('i');
      fleck.style.left = `${(i * 37 + 7) % 100}%`;
      fleck.style.setProperty('--fall', `${64 + (i * 19) % 60}vh`);
      fleck.style.setProperty('--spin', `${(i * 73) % 900 - 450}deg`);
      fleck.style.setProperty('--delay', `${(i % 13) * 24}ms`);
      fleck.style.setProperty('--confetti-color', colors[i % colors.length]);
      layer.append(fleck);
    }
    window.setTimeout(() => layer.replaceChildren(), 3000);
  }

  function showCompletion(animate) {
    finished = true;
    setTimerRunning(false);
    element.classList.add('is-complete');
    title.hidden = true;
    playArea.hidden = true;
    finish.hidden = false;
    finishClock.value = formatTime(elapsed);
    finishClock.textContent = finishClock.value;
    if (animate) {
      element.classList.remove('jigsaw-celebrate');
      void element.offsetWidth;
      element.classList.add('jigsaw-celebrate');
      throwConfetti();
    }
    saveResult();
  }

  function completePuzzle(animate = false) {
    if (finished) return;
    if (timerRunning) {
      elapsed += Date.now() - runStartedAt;
      timerRunning = false;
      clearInterval(timerId);
      timerId = 0;
      timerButton.textContent = 'Start timer';
      timerButton.setAttribute('aria-pressed', 'false');
    }
    updateClock();
    showCompletion(animate);
  }

  function renderPieces(preservePositions = false) {
    if (!loaded.complete || !loaded.naturalWidth) return;
    const bounds = board.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const oldPieces = preservePositions ? pieces : [];
    const oldPieceDims = lastPieceDims;
    const oldGroups = [...new Set(oldPieces.map(piece => piece._group))].map(group => [...group]);
    const oldPositions = oldPieces.map(piece => ({
      left: Number.parseFloat(piece.style.left) || 0,
      top: Number.parseFloat(piece.style.top) || 0,
    }));
    const scaleX = lastViewport?.width ? window.innerWidth / lastViewport.width : 1;
    const scaleY = lastViewport?.height ? window.innerHeight / lastViewport.height : 1;
    const cellW = bounds.width / COLS, cellH = bounds.height / ROWS;
    const tab = Math.max(6, Math.min(cellW, cellH) * .22);
    // Keep the logical piece box identical to the canvas box so cell alignment,
    // drag groups, and the rendered jigsaw edges all use the same origin.
    const margin = tab * 1.2 + 2;
    const metrics = { cellW, cellH, tab, margin, logicalW: cellW + 2 * margin, logicalH: cellH + 2 * margin };
    lastPieceDims = metrics;
    piecesLayer.replaceChildren();
    pieces = [];
    for (let i = 0; i < COUNT; i++) {
      const piece = createPiece(i, metrics, bounds);
      pieces.push(piece);
      piecesLayer.append(piece);
    }
    if (oldPieces.length) {
      for (const group of oldGroups) {
        const nextGroup = new Set(group.map(oldPiece => oldPiece._index));
        for (const index of nextGroup) pieces[index]._group = nextGroup;
        const anchorIndex = nextGroup.values().next().value;
        const anchorX = (oldPositions[anchorIndex].left + (oldPieceDims?.margin || margin)) * scaleX;
        const anchorY = (oldPositions[anchorIndex].top + (oldPieceDims?.margin || margin)) * scaleY;
        for (const index of nextGroup) {
          const row = Math.floor(index / COLS), col = index % COLS;
          const anchorRow = Math.floor(anchorIndex / COLS), anchorCol = anchorIndex % COLS;
          pieces[index].style.left = `${anchorX + (col - anchorCol) * cellW - margin}px`;
          pieces[index].style.top = `${anchorY + (row - anchorRow) * cellH - margin}px`;
        }
      }
    }
    lastBoardRect = { left: bounds.left, top: bounds.top, width: bounds.width, height: bounds.height };
    lastViewport = { width: window.innerWidth, height: window.innerHeight };
  }

  function resetPuzzle() {
    session++;
    if (timerRunning) setTimerRunning(false);
    elapsed = 0;
    timerRunning = false;
    clearInterval(timerId);
    timerId = 0;
    timerButton.textContent = 'Start timer';
    timerButton.setAttribute('aria-pressed', 'false');
    clock.textContent = '00:00';
    clock.value = '00:00';
    const slots = [
      ...Array.from({ length: Math.floor(COUNT / 2) }, () => ({ isLeft: true, x: Math.random(), y: Math.random() })),
      ...Array.from({ length: COUNT - Math.floor(COUNT / 2) }, () => ({ isLeft: false, x: Math.random(), y: Math.random() })),
    ];
    for (let i = slots.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [slots[i], slots[j]] = [slots[j], slots[i]];
    }
    scatterHomes = slots;
    finished = false;
    element.classList.remove('is-complete', 'jigsaw-celebrate');
    title.hidden = false;
    playArea.hidden = false;
    finish.hidden = true;
    element.querySelector('.jigsaw-confetti').replaceChildren();
    try { localStorage.removeItem(SAVE_KEY); } catch {}
    renderPieces();
  }

  function positionCapture() {
    camera.captureButton.style.left = 'auto';
    camera.captureButton.style.right = 'clamp(16px, 3vw, 38px)';
    camera.captureButton.style.top = 'auto';
    camera.captureButton.style.bottom = 'clamp(16px, 3vh, 32px)';
  }

  timerButton.addEventListener('click', () => setTimerRunning(!timerRunning));
  resetButton.addEventListener('click', resetPuzzle);
  playAgain.addEventListener('click', resetPuzzle);
  window.addEventListener('resize', () => {
    if (element.hidden || finished) return;
    cancelAnimationFrame(layoutFrame);
    layoutFrame = requestAnimationFrame(() => renderPieces(true));
    positionCapture();
  });

  return {
    element,
    captureButton: camera.captureButton,
    show() {
      session++;
      element.hidden = false;
      camera.captureButton.hidden = false;
      camera.show();
      positionCapture();
      const saved = savedResult();
      if (saved) {
        elapsed = saved.elapsed;
        updateClock();
        showCompletion(false);
      } else {
        resetPuzzle();
      }
    },
    stop() {
      session++;
      setTimerRunning(false);
      camera.stop();
    },
    hide() {
      session++;
      setTimerRunning(false);
      camera.hide();
      element.hidden = true;
      camera.captureButton.hidden = true;
      element.querySelector('.jigsaw-confetti').replaceChildren();
    },
  };
}
