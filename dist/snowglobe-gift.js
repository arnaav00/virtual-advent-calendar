import { playlistCard } from './playlist-gift.js';
import { compressSnowglobeImage, SNOWGLOBE_IMAGE_EVENT } from './home-snowglobe.js';
import { clearSnowglobeImage, saveSnowglobeImage } from './gift-state.js';

export function snowglobeCard() {
  const element = document.createElement('section');
  element.className = 'snowglobe-gift';
  element.hidden = true;
  element.setAttribute('aria-label', 'Gift #16: Shake Your Own Snowglobe');
  element.innerHTML = `
    <h1>Shake Your Own Snowglobe</h1>
    <div class="snowglobe-picker">
      <label class="snowglobe-upload">Choose a picture<input class="snowglobe-file" type="file" accept="image/*"></label>
      <label class="snowglobe-reference"><input class="snowglobe-use-reference" type="checkbox"> Use reference image from puzzle</label>
    </div>
    <div class="snowglobe-wrap">
      <div class="snowglobe" role="button" tabindex="0" aria-pressed="false" aria-label="Drag or tap to shake the snowglobe">
        <div class="snowglobe-image"></div><canvas class="snowglobe-snow" aria-hidden="true"></canvas>
        <div class="snowglobe-pile" aria-hidden="true"></div>
        <div class="snowglobe-glass" aria-hidden="true"></div>
        <div class="snowglobe-base" aria-hidden="true"><i></i></div>
      </div>
    </div>
    <button class="snowglobe-retake" type="button" hidden>Try another image</button>`;
  const camera = playlistCard(16);
  camera.element.remove();
  camera.captureButton.setAttribute('aria-label', 'Capture your reaction');
  camera.captureButton.dataset.tooltip = 'Capture your reaction';
  camera.reactionDialog.setAttribute('aria-label', 'Gift #16 photo capture');
  document.body.append(camera.reactionDialog);
  const picker = element.querySelector('.snowglobe-picker');
  const fileInput = element.querySelector('.snowglobe-file');
  const useReference = element.querySelector('.snowglobe-use-reference');
  const imageLayer = element.querySelector('.snowglobe-image');
  const wrap = element.querySelector('.snowglobe-wrap');
  const globe = element.querySelector('.snowglobe');
  const retakeButton = element.querySelector('.snowglobe-retake');
  const canvas = element.querySelector('.snowglobe-snow');
  const ctx = canvas.getContext('2d');
  const particles = [];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let raf = 0, pointer = null, last = null, velocity = { x: 0, y: 0 }, lastFrame = 0, objectUrl = '', imageSelectionSequence = 0, moved = false, suppressClick = false, suppressClickTimer = 0, grabOffset = { x: 0, y: 0 };
  function sizeCanvas() {
    const rect = globe.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr); canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function startSnow() {
    if (raf || element.hidden || wrap.hidden) return;
    const frame = now => {
      raf = 0;
      if (element.hidden || wrap.hidden) return;
      const rect = globe.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dt = Math.min(2, (now - (lastFrame || now)) / 16.67); lastFrame = now;
      ctx.clearRect(0, 0, rect.width, rect.height);
      const speed = Math.hypot(velocity.x, velocity.y);
      if (speed > .16 && !reduceMotion.matches) {
        const count = Math.min(13, Math.ceil(speed * .48));
        for (let i = 0; i < count; i++) particles.push({ x: rect.width * (.2 + Math.random() * .6), y: rect.height * (.24 + Math.random() * .62), vx: velocity.x * (.16 + Math.random() * .28) + (Math.random() - .5) * 1.1, vy: velocity.y * (.16 + Math.random() * .28) + (Math.random() - .5) * 1.1, r: 1.2 + Math.random() * 3.1, life: 90 + Math.random() * 100 });
      }
      velocity.x *= Math.pow(.965, dt); velocity.y *= Math.pow(.965, dt);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]; p.vy += .028 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
        if (p.y > rect.height * .88) { p.y = rect.height * .88; p.vy *= -.48; p.vx *= .82; }
        if (p.life <= 0 || p.x < 0 || p.x > rect.width) { particles.splice(i, 1); continue; }
        ctx.beginPath(); ctx.fillStyle = `rgba(255,255,255,${Math.min(.9, p.life / 55)})`; ctx.shadowColor = '#fff'; ctx.shadowBlur = 5; ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
  }
  function selectImage(src, { persist = true } = {}) {
    const sequence = ++imageSelectionSequence;
    imageLayer.style.backgroundImage = `url("${src}")`;
    picker.hidden = true; wrap.hidden = false; retakeButton.hidden = false; sizeCanvas(); particles.length = 0; startSnow();
    if (persist) void compressSnowglobeImage(src).then(async dataUrl => {
      if (sequence !== imageSelectionSequence) return;
      await saveSnowglobeImage(dataUrl);
      if (sequence !== imageSelectionSequence) return;
      imageLayer.style.backgroundImage = `url("${dataUrl}")`;
      window.dispatchEvent(new CustomEvent(SNOWGLOBE_IMAGE_EVENT, { detail: { src: dataUrl } }));
    }).catch(error => { console.warn('[Snowglobe] Could not save the image to Firebase:', error.message); window.alert('The snowglobe image could not be saved to Firebase. Please try again.'); });
  }
  fileInput.addEventListener('change', () => {
    const file = fileInput.files?.[0]; if (!file || !file.type.startsWith('image/')) return;
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = URL.createObjectURL(file); selectImage(objectUrl);
  });
  useReference.addEventListener('change', () => { if (useReference.checked) selectImage('./assets/gift14-photo.png'); });
  function toggleGlow() {
    const isOn = globe.classList.toggle('is-warm');
    globe.setAttribute('aria-pressed', String(isOn));
  }
  globe.addEventListener('click', () => {
    if (suppressClick) { suppressClick = false; clearTimeout(suppressClickTimer); return; }
    toggleGlow();
  });
  retakeButton.addEventListener('click', () => {
    imageSelectionSequence++;
    void clearSnowglobeImage().then(() => window.dispatchEvent(new CustomEvent(SNOWGLOBE_IMAGE_EVENT, { detail: { src: null } }))).catch(error => console.warn('[Snowglobe] Could not clear the saved Firebase image:', error.message));
    imageLayer.style.backgroundImage = '';
    picker.hidden = false; wrap.hidden = false; retakeButton.hidden = true;
    fileInput.value = ''; useReference.checked = false; globe.classList.remove('is-warm');
    globe.classList.remove('is-shaking'); globe.style.position = ''; globe.style.left = ''; globe.style.top = ''; globe.style.width = ''; globe.style.zIndex = '';
    velocity = { x: 0, y: 0 };
    globe.setAttribute('aria-pressed', 'false'); particles.length = 0; ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (objectUrl) { URL.revokeObjectURL(objectUrl); objectUrl = ''; }
    sizeCanvas(); startSnow();
  });
  globe.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    suppressClick = false; clearTimeout(suppressClickTimer);
    pointer = event.pointerId; last = { x: event.clientX, y: event.clientY, t: performance.now() }; velocity = { x: 0, y: 0 }; moved = false;
    const rect = globe.getBoundingClientRect(); grabOffset = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    globe.style.position = 'fixed'; globe.style.left = `${rect.left}px`; globe.style.top = `${rect.top}px`; globe.style.width = `${rect.width}px`; globe.style.zIndex = '1000';
    globe.setPointerCapture(pointer); globe.classList.add('is-shaking'); event.preventDefault();
  });
  globe.addEventListener('pointermove', event => {
    if (event.pointerId !== pointer) return;
    const now = performance.now(), dt = Math.max(8, now - last.t);
    const dx = event.clientX - last.x, dy = event.clientY - last.y;
    if (Math.abs(dx) + Math.abs(dy) > 2) moved = true;
    velocity = { x: dx / dt * 16, y: dy / dt * 16 };
    const w = globe.offsetWidth, h = globe.offsetHeight, baseExtra = h * .05;
    const edge = w * .04;
    const left = Math.max(edge, Math.min(innerWidth - w - edge, event.clientX - grabOffset.x));
    const top = Math.max(0, Math.min(innerHeight - h - baseExtra, event.clientY - grabOffset.y));
    globe.style.left = `${left}px`; globe.style.top = `${top}px`;
    last = { x: event.clientX, y: event.clientY, t: now }; startSnow();
  });
  function release(event) {
    if (event.pointerId !== pointer) return;
    if (globe.hasPointerCapture(pointer)) globe.releasePointerCapture(pointer);
    pointer = null; last = null; globe.classList.remove('is-shaking');
    if (event.type === 'pointerup') {
      suppressClick = true; clearTimeout(suppressClickTimer);
      suppressClickTimer = setTimeout(() => { suppressClick = false; }, 400);
      if (!moved) toggleGlow();
    }
  }
  globe.addEventListener('pointerup', release); globe.addEventListener('pointercancel', release);
  globe.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleGlow(); velocity = { x: 0, y: -13 }; startSnow(); } });
  window.addEventListener('resize', () => {
    if (globe.style.position === 'fixed') {
      globe.style.width = '';
      const rect = globe.getBoundingClientRect();
      const edge = rect.width * .04;
      const left = Math.max(edge, Math.min(innerWidth - rect.width - edge, Number.parseFloat(globe.style.left) || rect.left));
      const top = Math.max(0, Math.min(innerHeight - rect.height - rect.height * .05, Number.parseFloat(globe.style.top) || rect.top));
      globe.style.width = `${rect.width}px`; globe.style.left = `${left}px`; globe.style.top = `${top}px`;
    }
    if (!wrap.hidden) sizeCanvas();
  });
  return {
    element, captureButton: camera.captureButton,
    show() { this.resetForOpen(); element.hidden = false; camera.captureButton.hidden = false; camera.show(); },
    resetForOpen() {
      imageSelectionSequence++;imageLayer.style.backgroundImage='';picker.hidden=false;wrap.hidden=false;retakeButton.hidden=true;
      fileInput.value='';useReference.checked=false;globe.classList.remove('is-warm','is-shaking');globe.style.position='';globe.style.left='';globe.style.top='';globe.style.width='';globe.style.zIndex='';
      globe.setAttribute('aria-pressed','false');velocity={x:0,y:0};particles.length=0;ctx.clearRect(0,0,canvas.width,canvas.height);
      if(objectUrl){URL.revokeObjectURL(objectUrl);objectUrl='';}sizeCanvas();
    },
    stop() { cancelAnimationFrame(raf); raf = 0; camera.stop(); },
    hide() { cancelAnimationFrame(raf); raf = 0; particles.length = 0; camera.hide(); element.hidden = true; camera.captureButton.hidden = true; },
  };
}
