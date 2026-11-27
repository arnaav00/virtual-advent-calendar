import { playlistCard } from './playlist-gift.js';

export function gift24Card() {
  const element = document.createElement('section');
  element.className = 'gift24-card';
  element.hidden = true;
  element.setAttribute('aria-label', 'Gift 24');
  element.innerHTML = `
    <div class="gift24-door-stage">
      <div class="gift24-door-frame">
        <button class="gift24-door" type="button" aria-label="Open the door">
          <svg viewBox="0 0 360 560" aria-hidden="true" focusable="false">
            <defs>
              <linearGradient id="gift24-wood" x1="0" x2="1" y2="0"><stop stop-color="#633a29"/><stop offset=".2" stop-color="#986342"/><stop offset=".48" stop-color="#774831"/><stop offset=".76" stop-color="#a16b46"/><stop offset="1" stop-color="#5e3829"/></linearGradient>
              <linearGradient id="gift24-panel" x1="0" x2="1" y2="0"><stop stop-color="#71442f"/><stop offset=".5" stop-color="#966342"/><stop offset="1" stop-color="#68412f"/></linearGradient>
              <linearGradient id="gift24-brass" x1="0" x2="1" y2="1"><stop stop-color="#fff1b3"/><stop offset=".45" stop-color="#c99b4d"/><stop offset="1" stop-color="#805b25"/></linearGradient>
            </defs>
            <rect x="0" y="0" width="360" height="560" rx="3" fill="url(#gift24-wood)"/>
            <path d="M16 16H344V544H16Z" fill="none" stroke="#d0a474" stroke-opacity=".7" stroke-width="5"/>
            <path d="M38 36H166Q180 36 180 52V245Q180 260 166 260H38Q24 260 24 245V52Q24 36 38 36Z" fill="url(#gift24-panel)" stroke="#4e3024" stroke-width="7"/>
            <path d="M194 36H322Q336 36 336 52V245Q336 260 322 260H194Q180 260 180 245V52Q180 36 194 36Z" fill="url(#gift24-panel)" stroke="#4e3024" stroke-width="7"/>
            <path d="M38 287H166Q180 287 180 303V508Q180 524 166 524H38Q24 524 24 508V303Q24 287 38 287Z" fill="url(#gift24-panel)" stroke="#4e3024" stroke-width="7"/>
            <path d="M194 287H322Q336 287 336 303V508Q336 524 322 524H194Q180 524 180 508V303Q180 287 194 287Z" fill="url(#gift24-panel)" stroke="#4e3024" stroke-width="7"/>
            <path d="M12 20V540" stroke="#d5ad79" stroke-opacity=".42" stroke-width="3"/>
            <circle cx="292" cy="282" r="15" fill="url(#gift24-brass)" stroke="#5b3b21" stroke-width="4"/>
            <circle cx="292" cy="282" r="4" fill="#72502b"/>
          </svg>
        </button>
      </div>
      <span class="gift24-floor-shadow" aria-hidden="true"></span>
    </div>
    <div class="gift24-video-stage" hidden>
      <video class="gift24-video" controls playsinline preload="auto" aria-label="A sample video message"></video>
    </div>`;

  const camera = playlistCard(24);
  camera.element.remove();
  camera.captureButton.setAttribute('aria-label', 'Capture your reaction');
  camera.captureButton.dataset.tooltip = 'Capture your reaction';
  camera.reactionDialog.setAttribute('aria-label', 'Gift #24 photo capture');
  document.body.append(camera.reactionDialog);

  const doorStage = element.querySelector('.gift24-door-stage');
  const doorFrame = element.querySelector('.gift24-door-frame');
  const door = element.querySelector('.gift24-door');
  const videoStage = element.querySelector('.gift24-video-stage');
  const video = element.querySelector('.gift24-video');
  video.src = './assets/bonu_video.mp4';
  const knocking = new Audio('./assets/door_knock.mp3');
  knocking.loop = true;
  knocking.preload = 'auto';
  let opening = false;

  function stopKnocking() {
    knocking.pause();
    knocking.currentTime = 0;
  }

  function startKnocking() {
    stopKnocking();
    if (element.hidden || opening) return;
    void knocking.play().catch(() => {});
  }

  function pauseCalendarMusic() {
    window.dispatchEvent(new Event('pause-calendar-music'));
  }

  function resumeCalendarMusic() {
    window.dispatchEvent(new Event('resume-calendar-music'));
  }

  video.addEventListener('play', pauseCalendarMusic);
  video.addEventListener('pause', resumeCalendarMusic);
  video.addEventListener('ended', resumeCalendarMusic);

  async function openDoor() {
    if (opening || element.hidden) return;
    opening = true;
    stopKnocking();
    door.disabled = true;
    doorFrame.classList.add('is-opening');
    const animation = door.animate(
      [{ transform: 'rotateY(0deg)' }, { transform: 'rotateY(-108deg)' }],
      { duration: 1050, easing: 'cubic-bezier(.45,0,.8,.35)', fill: 'forwards' }
    );
    try { await animation.finished; } catch { return; }
    if (element.hidden) return;
    doorStage.hidden = true;
    videoStage.hidden = false;
    video.currentTime = 0;
    void video.play().catch(() => {});
  }

  door.addEventListener('click', openDoor);
  return {
    element,
    captureButton: camera.captureButton,
    async show() {
      element.hidden = false;
      doorStage.hidden = false;
      videoStage.hidden = true;
      door.disabled = false;
      opening = false;
      doorFrame.classList.remove('is-opening');
      door.getAnimations().forEach(animation => animation.cancel());
      video.pause();
      video.currentTime = 0;
      camera.captureButton.hidden = false;
      void camera.show();
      startKnocking();
    },
    hide() {
      stopKnocking();
      video.pause();
      video.currentTime = 0;
      videoStage.hidden = true;
      doorStage.hidden = false;
      door.disabled = false;
      opening = false;
      doorFrame.classList.remove('is-opening');
      door.getAnimations().forEach(animation => animation.cancel());
      element.hidden = true;
      camera.hide();
      resumeCalendarMusic();
    },
    stop() {
      stopKnocking();
      video.pause();
      resumeCalendarMusic();
    }
  };
}
