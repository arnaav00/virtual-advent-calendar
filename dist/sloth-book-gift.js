import { playlistCard } from './playlist-gift.js';

export function slothBookCard() {
  const day = 19;
  const element = document.createElement('section');
  element.className = 'sloth-book-gift';
  element.hidden = true;
  element.setAttribute('aria-label', 'A rotatable 3D book');
  element.innerHTML = `
    <p class="sloth-book-note">Hiya, lazy bum. Here's a self-help book to living your best sloth life.<br>Now you don't have feel bad about it anymore :)</p>
    <img class="sloth-book-greeting" src="./assets/gift19-sloth-hi.png" alt="A sloth sliding in to say hi" hidden>
    <div class="sloth-book-stage" role="group" aria-label="Drag to rotate the book and see its front, spine, and back">
      <div class="sloth-book-model">
        <div class="sloth-book-pages"></div>
        <div class="sloth-book-face sloth-book-front"><img src="./assets/gift19-sloth-book-front.png" alt="The Little Book of Sloth Philosophy front cover"><button class="sloth-book-sloth-trigger" type="button" aria-label="Say hi to the sloth on the cover"></button></div>
        <div class="sloth-book-face sloth-book-back"><img src="./assets/gift19-sloth-book-back.png" alt="The Little Book of Sloth Philosophy back cover"></div>
        <div class="sloth-book-edge sloth-book-spine"></div>
        <div class="sloth-book-edge sloth-book-foreedge"></div>
        <div class="sloth-book-edge sloth-book-top"></div>
        <div class="sloth-book-edge sloth-book-bottom"></div>
      </div>
    </div>`;
  const camera = playlistCard(day);
  camera.element.remove();
  camera.captureButton.setAttribute('aria-label', 'Capture your reaction');
  camera.captureButton.dataset.tooltip = 'Capture your reaction';
  camera.reactionDialog.setAttribute('aria-label', `Gift #${day} photo capture`);

  const stage = element.querySelector('.sloth-book-stage');
  const model = element.querySelector('.sloth-book-model');
  const slothTrigger = element.querySelector('.sloth-book-sloth-trigger');
  const greeting = element.querySelector('.sloth-book-greeting');
  let greetingTimer;
  slothTrigger.addEventListener('pointerdown', event => event.stopPropagation());
  slothTrigger.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    if (!greeting.hidden) return;
    greeting.hidden = false;
    greeting.classList.remove('is-sliding');
    void greeting.offsetWidth;
    greeting.classList.add('is-sliding');
    clearTimeout(greetingTimer);
    greetingTimer = setTimeout(() => {
      greeting.hidden = true;
      greeting.classList.remove('is-sliding');
    }, 2600);
  });
  let drag = null, rotateY = -18, rotateX = 2, didRotate = false;
  const render = () => { model.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`; };
  stage.addEventListener('pointerdown', event => {
    if (event.button !== 0 || event.target === stage) return;
    didRotate = false;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, rotateY, rotateX };
    stage.setPointerCapture(event.pointerId);
    stage.classList.add('is-dragging');
    event.preventDefault();
  });
  stage.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    if (Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > 4) didRotate = true;
    rotateY = drag.rotateY + (event.clientX - drag.x) * .72;
    rotateX = Math.max(-18, Math.min(18, drag.rotateX - (event.clientY - drag.y) * .22));
    render();
  });
  function release(event) {
    if (!drag || event.pointerId !== drag.id) return;
    if (stage.hasPointerCapture(drag.id)) stage.releasePointerCapture(drag.id);
    drag = null;
    stage.classList.remove('is-dragging');
  }
  stage.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', release);
  stage.addEventListener('click', event => {
    if (didRotate) event.stopPropagation();
    didRotate = false;
  });
  return {
    element,
    captureButton: camera.captureButton,
    show() { element.hidden = false; rotateY = -18; rotateX = 2; render(); void camera.show(); },
    hide() { element.hidden = true; clearTimeout(greetingTimer); greeting.hidden = true; greeting.classList.remove('is-sliding'); if (drag && stage.hasPointerCapture(drag.id)) stage.releasePointerCapture(drag.id); drag = null; stage.classList.remove('is-dragging'); camera.hide(); },
    stop() { clearTimeout(greetingTimer); drag = null; camera.stop(); }
  };
}
