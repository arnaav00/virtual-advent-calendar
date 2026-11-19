const members = [
  ['jungkook', 'left-top'], ['rm', 'right-top'], ['jin', 'right-mid'], ['v', 'left-mid'],
  ['jhope', 'bottom-left'], ['suga', 'bottom-center'], ['jimin', 'bottom-right']
];

export function btsCard() {
  const element = document.createElement('section');
  element.className = 'bts-gift-card';
  element.hidden = true;
  element.setAttribute('aria-label', 'BTS Christmas video');
  const video = document.createElement('video');
  video.className = 'bts-gift-video';
  video.controls = true;
  video.playsInline = true;
  video.preload = 'metadata';
  video.volume = 1;
  video.muted = false;
  video.setAttribute('aria-label', 'BTS Christmas video');
  const status = document.createElement('p');
  status.className = 'bts-video-status';
  status.setAttribute('role', 'status');
  const membersLayer = document.createElement('div');
  membersLayer.className = 'bts-members';
  for (const [name, position] of members) {
    const button = document.createElement('div');
    button.className = `bts-member bts-member-${position}`;
    button.setAttribute('aria-label', name);
    const image = document.createElement('img');
    image.src = `./assets/bts-members/trimmed/${name}-removebg-preview.png`;
    image.alt = name;
    button.append(image);
    membersLayer.append(button);
  }
  const frame = document.createElement('div');
  frame.className = 'bts-video-frame';
  frame.append(video, status);
  element.append(membersLayer, frame);

  const captureButton = document.createElement('button');
  captureButton.type = 'button';
  captureButton.className = 'reaction-start';
  captureButton.hidden = true;
  captureButton.setAttribute('aria-label', 'Capture your reaction');
  captureButton.dataset.tooltip = 'Capture your reaction';
  captureButton.innerHTML = '<svg class="reaction-orbit" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="43"/><g class="reaction-camera-icon" transform="translate(50 50) scale(1.2)"><path d="M-14 -7h5l3-5h12l3 5h5v17h-28z"/><circle r="5"/></g></svg>';

  let priorMusicPaused = false;
  const play = () => {
    status.textContent = '';
    video.currentTime = 0;
    video.volume = 1;
    video.muted = false;
    video.play().catch(() => { status.textContent = 'Tap the video to start playback.'; });
  };

  return {
    element, captureButton,
    show() {
      element.hidden = false;
      captureButton.hidden = false;
      status.textContent = '';
      priorMusicPaused = true;
      window.dispatchEvent(new Event('pause-calendar-music'));
      if (!video.hasAttribute('src')) video.src = './assets/bts_xmas.mp4';
      play();
    },
    stop() { video.pause(); },
    hide() {
      video.pause();
      video.currentTime = 0;
      element.hidden = true;
      captureButton.hidden = true;
      if (priorMusicPaused) {
        priorMusicPaused = false;
        window.dispatchEvent(new Event('resume-calendar-music'));
      }
    }
  };
}
