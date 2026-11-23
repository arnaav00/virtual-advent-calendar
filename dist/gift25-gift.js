import { playlistCard } from './playlist-gift.js';

export function gift25Card() {
  const element = document.createElement('section');
  element.className = 'gift25-card';
  element.hidden = true;
  element.setAttribute('aria-label', 'Gift 25: bring the dolls together');
  element.innerHTML = `
    <img class="gift25-table" src="./assets/table25.png" alt="">
    <img class="gift25-couple" src="./assets/arnangshi.png" alt="Arnaav and Devangshi">
    <button class="gift25-doll gift25-doll-dev" type="button" aria-label="Drag the reindeer doll toward the center">
      <img src="./assets/devdoll.png" alt="Reindeer Santa doll">
    </button>
    <button class="gift25-doll gift25-doll-arn" type="button" aria-label="Drag the Santa doll toward the center">
      <img src="./assets/arndoll.png" alt="Santa doll holding a present">
    </button>`;

  const camera = playlistCard(25);
  camera.element.remove();
  camera.captureButton.setAttribute('aria-label', 'Capture your reaction');
  camera.captureButton.dataset.tooltip = 'Capture your reaction';
  camera.reactionDialog.setAttribute('aria-label', 'Gift #25 photo capture');
  document.body.append(camera.reactionDialog);

  const dolls = [
    { node: element.querySelector('.gift25-doll-dev'), side: 'left' },
    { node: element.querySelector('.gift25-doll-arn'), side: 'right' }
  ];
  const couple = element.querySelector('.gift25-couple');
  const table = element.querySelector('.gift25-table');
  let activeDrag = null;
  let centerGap = 32;

  function tableBaseline() {
    // Feet rest toward the front edge of the tabletop, not its distant back edge.
    return window.innerWidth * (45 / 857);
  }

  function placeInitial() {
    const margin = Math.max(12, window.innerWidth * .035);
    const baseline = tableBaseline();
    for (const { node, side } of dolls) {
      const figureHeight = node.getBoundingClientRect().height;
      const transparentFoot = side === 'left' ? figureHeight * (20 / 636) : figureHeight * (30 / 605);
      node.style.bottom = `${baseline - transparentFoot}px`;
      node.style.transform = 'translateX(0px)';
      const width = node.getBoundingClientRect().width;
      node.style.left = side === 'left' ? `${margin}px` : 'auto';
      node.style.right = side === 'right' ? `${margin}px` : 'auto';
      node.dataset.startX = side === 'left' ? String(margin) : String(window.innerWidth - margin - width);
    }
    couple.style.bottom = `${baseline - couple.getBoundingClientRect().height * (42 / 468)}px`;
    couple.classList.remove('is-visible');
    element.classList.remove('is-complete');
  }

  function limitsFor(item) {
    const { node, side } = item;
    const width = node.getBoundingClientRect().width;
    const start = Number(node.dataset.startX || 0);
    const center = window.innerWidth / 2;
    if (side === 'left') {
      const max = center - centerGap / 2 - width - start;
      return { start: 0, end: Math.max(0, max) };
    }
    const min = center + centerGap / 2 - start;
    return { start: Math.min(0, min), end: 0 };
  }

  function translation(node) {
    const match = node.style.transform.match(/translateX\((-?[\d.]+)px\)/);
    return match ? Number(match[1]) : 0;
  }

  function atCenter(item) {
    const bounds = limitsFor(item);
    const current = translation(item.node);
    const target = item.side === 'left' ? bounds.end : bounds.start;
    return Math.abs(current - target) < 2;
  }

  function updateCompletion() {
    const complete = dolls.every(atCenter);
    element.classList.toggle('is-complete', complete);
    couple.classList.toggle('is-visible', complete);
  }

  function onPointerDown(item, event) {
    if (event.button !== 0 || activeDrag) return;
    event.preventDefault();
    activeDrag = { ...item, pointerId: event.pointerId, startX: event.clientX, startOffset: translation(item.node) };
    item.node.setPointerCapture(event.pointerId);
    item.node.classList.add('is-dragging');
  }

  function onPointerMove(event) {
    if (!activeDrag || event.pointerId !== activeDrag.pointerId) return;
    const range = limitsFor(activeDrag);
    const next = Math.min(range.end, Math.max(range.start, activeDrag.startOffset + event.clientX - activeDrag.startX));
    activeDrag.node.style.transform = `translateX(${next}px)`;
    updateCompletion();
  }

  function onPointerUp(event) {
    if (!activeDrag || event.pointerId !== activeDrag.pointerId) return;
    const { node, pointerId } = activeDrag;
    activeDrag = null;
    node.classList.remove('is-dragging');
    if (node.hasPointerCapture(pointerId)) node.releasePointerCapture(pointerId);
    updateCompletion();
  }

  dolls.forEach(item => {
    item.node.addEventListener('pointerdown', event => onPointerDown(item, event));
    item.node.addEventListener('pointermove', onPointerMove);
    item.node.addEventListener('pointerup', onPointerUp);
    item.node.addEventListener('pointercancel', onPointerUp);
  });
  table.addEventListener('load', placeInitial, { once: true });
  window.addEventListener('resize', placeInitial);

  return {
    element,
    captureButton: camera.captureButton,
    show() {
      element.hidden = false;
      placeInitial();
      camera.captureButton.hidden = false;
      void camera.show();
    },
    hide() {
      activeDrag = null;
      element.hidden = true;
      placeInitial();
      camera.hide();
    },
    stop() { camera.stop(); }
  };
}
