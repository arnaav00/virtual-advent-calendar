import { playlistCard } from './playlist-gift.js';

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
    <div class="snowglobe-wrap" hidden>
      <div class="snowglobe" role="button" tabindex="0" aria-label="Drag or tap to shake the snowglobe">
        <div class="snowglobe-image"></div><canvas class="snowglobe-snow" aria-hidden="true"></canvas>
        <div class="snowglobe-pile" aria-hidden="true"></div>
        <div class="snowglobe-glass" aria-hidden="true"></div>
        <div class="snowglobe-base" aria-hidden="true"><i></i></div>
      </div>
      <p class="snowglobe-hint">Drag to shake · Tap for a warm glow</p>
    </div>`;
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
  const canvas = element.querySelector('.snowglobe-snow');
  const ctx = canvas.getContext('2d');
  const particles = [];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let raf = 0, pointer = null, last = null, velocity = { x: 0, y: 0 }, lastFrame = 0, glowTimer = 0, objectUrl = '';
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
  function selectImage(src) {
    imageLayer.style.backgroundImage = `url("${src}")`;
    picker.hidden = true; wrap.hidden = false; sizeCanvas(); particles.length = 0; startSnow();
  }
  fileInput.addEventListener('change', () => {
    const file = fileInput.files?.[0]; if (!file || !file.type.startsWith('image/')) return;
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = URL.createObjectURL(file); selectImage(objectUrl);
  });
  useReference.addEventListener('change', () => { if (useReference.checked) selectImage('./assets/gift14-photo.png'); });
  function warmGlow() {
    globe.classList.add('is-warm'); clearTimeout(glowTimer); glowTimer = setTimeout(() => globe.classList.remove('is-warm'), 2400);
  }
  globe.addEventListener('click', warmGlow);
  globe.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    pointer = event.pointerId; last = { x: event.clientX, y: event.clientY, t: performance.now() }; velocity = { x: 0, y: 0 };
    globe.setPointerCapture(pointer); globe.classList.add('is-shaking'); event.preventDefault();
  });
  globe.addEventListener('pointermove', event => {
    if (event.pointerId !== pointer) return;
    const now = performance.now(), dt = Math.max(8, now - last.t);
    velocity = { x: (event.clientX - last.x) / dt * 16, y: (event.clientY - last.y) / dt * 16 };
    last = { x: event.clientX, y: event.clientY, t: now }; startSnow();
  });
  function release(event) {
    if (event.pointerId !== pointer) return;
    if (globe.hasPointerCapture(pointer)) globe.releasePointerCapture(pointer);
    pointer = null; last = null; globe.classList.remove('is-shaking');
  }
  globe.addEventListener('pointerup', release); globe.addEventListener('pointercancel', release);
  globe.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); warmGlow(); velocity = { x: 0, y: -13 }; startSnow(); } });
  window.addEventListener('resize', () => { if (!wrap.hidden) sizeCanvas(); });
  return {
    element, captureButton: camera.captureButton,
    show() { element.hidden = false; camera.captureButton.hidden = false; camera.show(); if (!wrap.hidden) { sizeCanvas(); startSnow(); } },
    stop() { cancelAnimationFrame(raf); raf = 0; clearTimeout(glowTimer); camera.stop(); },
    hide() { cancelAnimationFrame(raf); raf = 0; particles.length = 0; camera.hide(); element.hidden = true; camera.captureButton.hidden = true; },
  };
}
