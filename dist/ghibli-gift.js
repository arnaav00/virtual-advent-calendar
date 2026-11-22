import { playlistCard } from './playlist-gift.js';

export function ghibliCard() {
  const day = 22;
  const theme = new Audio('./assets/totoro_theme.mp3');
  theme.loop = true;
  theme.preload = 'auto';
  const playTheme = () => {
    const seekToIntro = () => {
      if (!element.hidden) theme.currentTime = 3;
    };
    if (theme.readyState >= HTMLMediaElement.HAVE_METADATA) seekToIntro();
    else theme.addEventListener('loadedmetadata', seekToIntro, { once: true });
    const playback = theme.play();
    playback?.catch(() => {});
  };
  const element = document.createElement('section');
  element.className = 'ghibli-gift';
  element.hidden = true;
  element.setAttribute('aria-label', 'Ghibli desk calendars');
  element.innerHTML = `
    <img class="ghibli-modal-background" src="./assets/ghibli-gifs/studio-ghibli-stone-cottage-4k.jpg" alt="" aria-hidden="true">
    <div class="ghibli-modal-shade" aria-hidden="true"></div>
    <div class="ghibli-modal-scene" aria-hidden="true">
      <img class="ghibli-decor ghibli-calcifer" src="./assets/ghibli-gifs/calcifer.gif" alt="">
      <img class="ghibli-decor ghibli-kiki" src="./assets/ghibli-gifs/kiki.gif" alt="">
      <img class="ghibli-decor ghibli-ponyo" src="./assets/ghibli-gifs/ponyo.gif" alt="">
      <img class="ghibli-decor ghibli-haru" src="./assets/ghibli-gifs/haru.gif" alt="">
      <img class="ghibli-decor ghibli-howls" src="./assets/ghibli-gifs/howls.gif" alt="">
      <img class="ghibli-decor ghibli-spiritedaway" src="./assets/ghibli-gifs/spiritedaway.gif" alt="">
      <img class="ghibli-decor ghibli-soot" src="./assets/ghibli-gifs/soot%20sprite.gif" alt="">
      <img class="ghibli-decor ghibli-totoro" src="./assets/ghibli-gifs/totoro.gif" alt="">
      <img class="ghibli-decor ghibli-noface" src="./assets/ghibli-gifs/noface.gif" alt="">
    </div>
    <div class="ghibli-content">
    <p class="ghibli-note">Nitya's apparently not making a 2027 calendar for your desk, so you can sprinkle a little Ghibli magic to your workspace instead</p>
    <div class="ghibli-gallery">
      <div class="ghibli-calendar-stage" aria-label="Drag left or right to turn the wooden-base calendar">
        <div class="ghibli-calendar-bevel">
          <img class="ghibli-calendar" src="./assets/gift22-ghibli-desk-calendar.png" alt="A wooden-base Ghibli January desk calendar">
        </div>
      </div>
      <div class="ghibli-set-stage"><img class="ghibli-set" src="./assets/gift22-ghibli-calendar-set.png" alt="A collection of illustrated Ghibli desk calendars"></div>
    </div>
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
    show() { element.hidden = false; rotation = 0; bevel.style.setProperty('--calendar-turn', '0deg'); playTheme(); void camera.show(); },
    hide() { element.hidden = true; theme.pause(); theme.currentTime = 0; if (drag && stage.hasPointerCapture(drag.id)) stage.releasePointerCapture(drag.id); drag = null; rotation = 0; bevel.style.setProperty('--calendar-turn', '0deg'); stage.classList.remove('is-dragging'); camera.hide(); },
    stop() { theme.pause(); theme.currentTime = 0; drag = null; camera.stop(); }
  };
}
