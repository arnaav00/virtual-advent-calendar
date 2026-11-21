import { playlistCard } from './playlist-gift.js';

export function ghibliCard() {
  const day = 19;
  const element = document.createElement('section');
  element.className = 'ghibli-gift';
  element.hidden = true;
  element.setAttribute('aria-label', 'Ghibli desk calendars');
  element.innerHTML = `
    <p class="ghibli-note">Nitya's apparently not making a 2027 calendar for your desk, so you can sprinkle a little Ghibli magic to your workspace instead</p>
    <div class="ghibli-gallery">
      <div class="ghibli-calendar-stage" aria-label="Drag left or right to turn the wooden-base calendar">
        <div class="ghibli-calendar-bevel">
          <img class="ghibli-calendar" src="./assets/gift19-ghibli-desk-calendar.png" alt="A wooden-base Ghibli January desk calendar">
        </div>
      </div>
      <div class="ghibli-set-stage"><img class="ghibli-set" src="./assets/gift19-ghibli-calendar-set.png" alt="A collection of illustrated Ghibli desk calendars"></div>
    </div>`;

  const camera = playlistCard(day);
  camera.element.remove();
  camera.captureButton.setAttribute('aria-label', 'Capture your reaction');
  camera.captureButton.dataset.tooltip = 'Capture your reaction';
  camera.reactionDialog.setAttribute('aria-label', `Gift #${day} photo capture`);

  const stage = element.querySelector('.ghibli-calendar-stage');
  const bevel = element.querySelector('.ghibli-calendar-bevel');
  let drag = null, rotation = 0;
  stage.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    drag = { id: event.pointerId, x: event.clientX, rotation };
    stage.setPointerCapture(event.pointerId);
    stage.classList.add('is-dragging');
    event.preventDefault();
  });
  stage.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    rotation = Math.max(-30, Math.min(30, drag.rotation + (event.clientX - drag.x) * .32));
    bevel.style.setProperty('--calendar-turn', `${rotation}deg`);
  });
  function release(event) {
    if (!drag || event.pointerId !== drag.id) return;
    if (stage.hasPointerCapture(drag.id)) stage.releasePointerCapture(drag.id);
    drag = null;
    stage.classList.remove('is-dragging');
  }
  stage.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', release);

  return {
    element,
    captureButton: camera.captureButton,
    show() { element.hidden = false; rotation = 0; bevel.style.setProperty('--calendar-turn', '0deg'); void camera.show(); },
    hide() { element.hidden = true; if (drag && stage.hasPointerCapture(drag.id)) stage.releasePointerCapture(drag.id); drag = null; rotation = 0; bevel.style.setProperty('--calendar-turn', '0deg'); stage.classList.remove('is-dragging'); camera.hide(); },
    stop() { drag = null; camera.stop(); }
  };
}
