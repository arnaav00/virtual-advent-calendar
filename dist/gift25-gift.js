import { playlistCard } from './playlist-gift.js';
import { christmasTreeImage } from './gift-state.js';

export function gift25Card() {
  const element = document.createElement('section');
  element.className = 'gift25-card';
  element.hidden = true;
  element.setAttribute('aria-label', 'Gift 25: bring the dolls together');
  element.innerHTML = `
    <img class="gift25-table" src="./assets/table25.png" alt="">
    <img class="gift25-couple" src="./assets/arnangshi.png" alt="Arnaav and Devangshi">
    <div class="gift25-messages">
    <div class="gift25-greeting gift25-greeting-left" role="img" aria-label="Merry Christmas, baby">
      <svg class="gift25-handwriting" viewBox="0 0 430 205" aria-hidden="true">
        <g class="gift25-writing-ink" text-anchor="middle"><text x="215" y="64">Merry</text><text x="215" y="126">Christmas,</text><text x="215" y="184">baby</text></g>
      </svg>
    </div>
    <div class="gift25-greeting gift25-greeting-right" role="img" aria-label="I love you with a red heart">
      <svg class="gift25-handwriting" viewBox="0 0 430 190" aria-hidden="true">
        <g class="gift25-writing-ink" text-anchor="middle"><text x="215" y="52">I love you</text></g>
        <g transform="translate(215 153) scale(.6) translate(-105 -185)">
          <path class="gift25-heart-path" transform="translate(-110 55)" d="M215 174C200 160 160 137 161 115C162 93 190 87 215 113C240 87 268 93 269 115C270 137 230 160 215 174Z"/>
        </g>
      </svg>
    </div>
    </div>
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
  let centerGap = 0;
  let backgroundUrl = '';

  async function loadTreeBackground() {
    element.style.backgroundImage = '';
    if (backgroundUrl) URL.revokeObjectURL(backgroundUrl);
    backgroundUrl = '';
    try {
      const tree = await christmasTreeImage();
      if (!tree || element.hidden) return;
      backgroundUrl = URL.createObjectURL(tree);
      element.style.backgroundImage = `url("${backgroundUrl}")`;
    } catch (error) {
      // The card's dark base remains visible whenever Firebase or the photo fails.
      console.warn('Could not load the Gift 23 Christmas tree for Gift 25:', error);
    }
  }

  function tableBaseline() {
    // Keep the dolls on the usable wood plane, just above the front lip.
    return window.innerWidth * (80 / 857);
  }

  function tableBackEdge() {
    return window.innerWidth * (75/ 857);
  }

  function placeInitial(preserveCompletion = true) {
    const wasComplete = preserveCompletion && element.classList.contains('is-complete');
    const margin = Math.max(12, window.innerWidth * .07);
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
    couple.style.bottom = `${tableBackEdge() - couple.getBoundingClientRect().height * (42 / 468)}px`;
    element.style.setProperty('--gift25-heart-bottom', `${baseline + dolls[1].node.getBoundingClientRect().height * .65}px`);
    if (wasComplete) {
      for (const item of dolls) {
        const range = limitsFor(item);
        item.node.style.transform = `translateX(${item.side === 'left' ? range.end : range.start}px)`;
      }
      updateCompletion();
    } else {
      couple.classList.remove('is-visible');
      element.classList.remove('is-complete');
    }
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
    if (complete) {
      element.classList.add('is-celebrated');
    }
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
      element.classList.remove('is-celebrated');
      placeInitial(false);
      camera.captureButton.hidden = false;
      void camera.show();
      void loadTreeBackground();
    },
    hide() {
      activeDrag = null;
      element.hidden = true;
      element.style.backgroundImage = '';
      if (backgroundUrl) URL.revokeObjectURL(backgroundUrl);
      backgroundUrl = '';
      placeInitial(false);
      camera.hide();
    },
    stop() { camera.stop(); }
  };
}
