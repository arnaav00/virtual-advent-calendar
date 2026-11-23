import { playlistCard } from './playlist-gift.js';

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
  const soundClips = new Map();
  let activeSound = null;
  let audioContext = null;
  let soundboardUnlocked = false;
  for (const [name, position] of members) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `bts-member bts-member-${position}`;
    button.setAttribute('aria-label', `Play ${name}'s Christmas soundbyte`);
    button.disabled = true;
    const filename = name === 'jhope' ? 'jhope-xmas.mp3' : `${name}_xmas.mp3`;
    const sound = new Audio(`./assets/bts-members/soundbytes/${filename}`);
    sound.preload = 'none';
    soundClips.set(button, { sound, gain: name === 'rm' ? 2 : name === 'jin' ? 1.5 : 1, source: null, gainNode: null });
    button.addEventListener('click', () => {
      if (!element.classList.contains('bts-members-ready')) return;
      if (activeSound) {
        activeSound.pause();
        activeSound.currentTime = 0;
      }
      const clip = soundClips.get(button);
      if (clip.gain > 1 && window.AudioContext) {
        audioContext ||= new AudioContext();
        if (!clip.source) {
          clip.source = audioContext.createMediaElementSource(sound);
          clip.gainNode = audioContext.createGain();
          clip.gainNode.gain.value = clip.gain;
          clip.source.connect(clip.gainNode).connect(audioContext.destination);
        }
        audioContext.resume().catch(() => {});
      }
      activeSound = sound;
      const playback = sound.play();
      playback?.catch(() => {});
    });
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

  const unlockSoundboard = () => {
    if (soundboardUnlocked) return;
    soundboardUnlocked = true;
    element.classList.add('bts-members-ready');
    membersLayer.querySelectorAll('.bts-member').forEach(button => { button.disabled = false; });
  };
  const unlockAtEndOfVideo = () => {
    const remaining = video.duration - video.currentTime;
    if (video.ended || (Number.isFinite(remaining) && remaining <= 1)) unlockSoundboard();
  };
  video.addEventListener('timeupdate', unlockAtEndOfVideo);
  video.addEventListener('seeked', unlockAtEndOfVideo);
  video.addEventListener('ended', unlockSoundboard);

  // Use the shared camera implementation so Gift 10 has the same working
  // capture modal and Firebase save flow as the other gifts.
  const camera = playlistCard(10);
  camera.element.remove();
  camera.captureButton.setAttribute('aria-label', 'Capture your reaction');
  camera.captureButton.dataset.tooltip = 'Capture your reaction';
  camera.reactionDialog.setAttribute('aria-label', 'Gift #10 photo capture');

  let priorMusicPaused = false;
  const play = () => {
    status.textContent = '';
    video.currentTime = 0;
    video.volume = 1;
    video.muted = false;
    video.play().catch(() => { status.textContent = 'Tap the video to start playback.'; });
  };

  return {
    element, captureButton: camera.captureButton,
    show() {
      element.hidden = false;
      soundboardUnlocked = false;
      element.classList.remove('bts-members-ready');
      membersLayer.querySelectorAll('.bts-member').forEach(button => { button.disabled = true; });
      for (const { sound } of soundClips.values()) { sound.pause(); sound.currentTime = 0; }
      activeSound = null;
      camera.captureButton.hidden = false;
      void camera.show();
      status.textContent = '';
      priorMusicPaused = true;
      window.dispatchEvent(new Event('pause-calendar-music'));
      if (!video.hasAttribute('src')) video.src = './assets/bts_xmas.mp4';
      play();
    },
    stop() {
      video.pause();
      camera.stop();
      for (const { sound } of soundClips.values()) { sound.pause(); sound.currentTime = 0; }
      activeSound = null;
    },
    hide() {
      camera.hide();
      video.pause();
      video.currentTime = 0;
      soundboardUnlocked = false;
      element.classList.remove('bts-members-ready');
      membersLayer.querySelectorAll('.bts-member').forEach(button => { button.disabled = true; });
      for (const { sound } of soundClips.values()) { sound.pause(); sound.currentTime = 0; }
      activeSound = null;
      element.hidden = true;
      camera.captureButton.hidden = true;
      if (priorMusicPaused) {
        priorMusicPaused = false;
        window.dispatchEvent(new Event('resume-calendar-music'));
      }
    }
  };
}
