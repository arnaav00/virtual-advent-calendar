import { playlistCard } from './playlist-gift.js';

const AUDIO_URL = './assets/musicbox_xmas.mp3';
const BOX_VIEW = { width: 473, height: 841, pivotX: 354, pivotY: 431 };

export function musicBoxCard() {
  const element = document.createElement('section');
  element.className = 'musicbox-gift';
  element.hidden = true;
  element.setAttribute('aria-label', 'A hand-cranked Christmas music box');
  element.innerHTML = `
    <p class="musicbox-note">Now you can take a little snippet of Christmas music wherever you go!</p>
    <div class="musicbox-stage">
      <button type="button" class="musicbox-image-button" aria-label="Open the music box">
        <img class="musicbox-closed" src="./assets/gift21-musicbox-closed.png" alt="Closed wooden Christmas music box">
      </button>
      <div class="musicbox-open" hidden>
        <img class="musicbox-open-image" src="./assets/gift21-musicbox-open-prepared.png" alt="Open wooden Christmas music box">
        <svg class="musicbox-crank" viewBox="0 0 473 841" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="musicbox-steel" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fff4cd"/><stop offset=".2" stop-color="#d1b779"/><stop offset=".46" stop-color="#fff0bf"/><stop offset=".72" stop-color="#9b7946"/><stop offset="1" stop-color="#e8d199"/></linearGradient>
            <linearGradient id="musicbox-brass" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#684728"/><stop offset=".28" stop-color="#d8ae63"/><stop offset=".58" stop-color="#f4dc9b"/><stop offset="1" stop-color="#87603a"/></linearGradient>
          </defs>
          <g class="musicbox-crank-arm">
            <path class="musicbox-crank-metal" d="M354 431c5 14 14 22 26 25l37 0"/>
            <path class="musicbox-crank-highlight" d="M356 433c5 11 14 17 24 19l31 0"/>
            <rect class="musicbox-crank-grip" x="414" y="446" width="32" height="19" rx="7"/>
            <path class="musicbox-grip-highlight" d="M420 450h18"/>
          </g>
          <circle class="musicbox-crank-hub" cx="354" cy="431" r="9"/>
          <circle class="musicbox-crank-hub-core" cx="354" cy="431" r="3"/>
        </svg>
        <button type="button" class="musicbox-crank-grab" aria-label="Drag to turn the music box crank"></button>
      </div>
    </div>`;

  const camera = playlistCard(21);
  camera.element.remove();
  camera.captureButton.setAttribute('aria-label', 'Capture your reaction');
  camera.captureButton.dataset.tooltip = 'Capture your reaction';
  camera.reactionDialog.setAttribute('aria-label', 'Gift #21 photo capture');

  const closedButton = element.querySelector('.musicbox-image-button');
  const closedImg = element.querySelector('.musicbox-closed');
  const openBox = element.querySelector('.musicbox-open');
  const stage = element.querySelector('.musicbox-stage');
  const arm = element.querySelector('.musicbox-crank-arm');
  const crankGrab = element.querySelector('.musicbox-crank-grab');
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  let audioContext = null;
  let bufferPromise = null;
  let audioBuffer = null;
  let source = null;
  let offset = 1;
  let baseOffset = 1;
  let baseTime = 0;
  let currentRate = 1;
  let drag = null;
  let starting = false;
  let idleTimer = 0;
  let angle = 0;
  let shown = false;

  function songPosition(now = audioContext?.currentTime || 0) {
    if (!source || !audioBuffer) return offset;
    const end = audioBuffer.duration - 1;
    const span = end - 1;
    if (span <= 0) return 0;
    return 1 + (((baseOffset - 1 + (now - baseTime) * currentRate) % span) + span) % span;
  }

  async function loadSong() {
    if (!AudioContextClass) return null;
    if (!audioContext) audioContext = new AudioContextClass();
    if (!bufferPromise) {
      bufferPromise = fetch(AUDIO_URL)
        .then(response => { if (!response.ok) throw new Error('Music box audio could not be loaded'); return response.arrayBuffer(); })
        .then(data => audioContext.decodeAudioData(data))
        .then(buffer => { audioBuffer = buffer; return buffer; });
    }
    return bufferPromise;
  }

  function stopSong() {
    clearTimeout(idleTimer);
    element.dataset.musicPlaying = 'false';
    if (!audioContext || !source) return;
    // Persist the exact loop position so the next crank movement resumes here.
    offset = songPosition();
    baseOffset = offset;
    baseTime = audioContext.currentTime;
    const oldSource = source;
    source = null;
    try { oldSource.stop(); } catch {}
    oldSource.disconnect();
  }

  async function startSong() {
    if (!shown || !drag || source || starting) return;
    starting = true;
    try {
      const buffer = await loadSong();
      if (!shown || !drag || !buffer || source) return;
      await audioContext.resume();
      // The pointer may have been released while the audio was loading or
      // while the browser resumed its audio context. Never start afterward.
      if (!shown || !drag || !buffer || source) return;
      const end = buffer.duration - 1;
      if (end <= 1) return;
      if (offset < 1 || offset >= end) offset = 1;
      const next = audioContext.createBufferSource();
      next.buffer = buffer;
      next.loop = true;
      next.loopStart = 1;
      next.loopEnd = end;
      next.playbackRate.value = currentRate;
      next.connect(audioContext.destination);
      source = next;
      element.dataset.musicPlaying = 'true';
      element.dataset.musicPlayed = 'true';
      element.dataset.musicRate = String(currentRate);
      baseOffset = offset;
      baseTime = audioContext.currentTime;
      next.start(0, offset);
    } finally {
      starting = false;
    }
  }

  function setRate(rate) {
    if (rate === currentRate) return;
    if (source) {
      offset = songPosition();
      baseOffset = offset;
      baseTime = audioContext.currentTime;
      source.playbackRate.setValueAtTime(rate, audioContext.currentTime);
    }
    currentRate = rate;
    element.dataset.musicRate = String(rate);
  }

  function renderCrank() {
    arm.setAttribute('transform', `rotate(${angle * 180 / Math.PI} ${BOX_VIEW.pivotX} ${BOX_VIEW.pivotY})`);
    const dx = 430 - BOX_VIEW.pivotX;
    const dy = 455 - BOX_VIEW.pivotY;
    const tipX = BOX_VIEW.pivotX + dx * Math.cos(angle) - dy * Math.sin(angle);
    const tipY = BOX_VIEW.pivotY + dx * Math.sin(angle) + dy * Math.cos(angle);
    crankGrab.style.left = `${tipX / BOX_VIEW.width * 100}%`;
    crankGrab.style.top = `${tipY / BOX_VIEW.height * 100}%`;
  }

  function getPointerAngle(event) {
    const rect = openBox.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * BOX_VIEW.width;
    const y = ((event.clientY - rect.top) / rect.height) * BOX_VIEW.height;
    return Math.atan2(y - BOX_VIEW.pivotY, x - BOX_VIEW.pivotX);
  }

  closedButton.addEventListener('click', () => {
    closedButton.hidden = true;
    openBox.hidden = false;
    openBox.classList.add('is-opening');
    window.setTimeout(() => openBox.classList.remove('is-opening'), 520);
  });

  crankGrab.addEventListener('pointerdown', event => {
    if (!shown || event.button !== 0) return;
    event.preventDefault();
    crankGrab.setPointerCapture(event.pointerId);
    drag = { id: event.pointerId, pointerAngle: getPointerAngle(event), lastTime: performance.now() };
    crankGrab.classList.add('is-grabbing');
  });
  crankGrab.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    const now = performance.now();
    const pointerAngle = getPointerAngle(event);
    let delta = pointerAngle - drag.pointerAngle;
    while (delta > Math.PI) delta -= Math.PI * 2;
    while (delta < -Math.PI) delta += Math.PI * 2;
    drag.pointerAngle = pointerAngle;
    angle += delta;
    renderCrank();
    const elapsed = Math.max(1, now - drag.lastTime) / 1000;
    const speed = Math.abs(delta) / elapsed;
    setRate(speed > 4.5 ? 1.5 : 1);
    drag.lastTime = now;
    clearTimeout(idleTimer);
    void startSong().catch(() => {});
    idleTimer = window.setTimeout(stopSong, 180);
  });
  function releaseCrank(event) {
    if (!drag || event.pointerId !== drag.id) return;
    drag = null;
    crankGrab.classList.remove('is-grabbing');
    if (crankGrab.hasPointerCapture(event.pointerId)) crankGrab.releasePointerCapture(event.pointerId);
    stopSong();
  }
  crankGrab.addEventListener('pointerup', releaseCrank);
  crankGrab.addEventListener('pointercancel', releaseCrank);
  crankGrab.addEventListener('lostpointercapture', releaseCrank);
  window.addEventListener('blur', () => {
    if (!drag) return;
    const pointerId = drag.id;
    drag = null;
    crankGrab.classList.remove('is-grabbing');
    if (crankGrab.hasPointerCapture(pointerId)) crankGrab.releasePointerCapture(pointerId);
    stopSong();
  });

  function resetView() {
    stopSong();
    if (drag && crankGrab.hasPointerCapture(drag.id)) crankGrab.releasePointerCapture(drag.id);
    drag = null;
    crankGrab.classList.remove('is-grabbing');
  }

  return {
    element,
    captureButton: camera.captureButton,
    show() {
      shown = true;
      element.hidden = false;
      closedButton.hidden = false;
      closedImg.src = './assets/gift21-musicbox-closed.png';
      openBox.hidden = true;
      angle = 0;
      renderCrank();
      void camera.show();
    },
    hide() {
      shown = false;
      resetView();
      element.hidden = true;
      camera.hide();
    },
    stop() {
      shown = false;
      resetView();
      camera.stop();
    }
  };
}
