import { playlistCard } from './playlist-gift.js';

export function christmillionCard() {
  const element = document.createElement('section');
  element.className = 'christmillion-gift';
  element.hidden = true;
  element.setAttribute('aria-label', 'Christmillion game');
  const frame = document.createElement('iframe');
  frame.title = 'Christmillion, Gift #9';
  frame.allow = 'camera; fullscreen';
  frame.src = 'about:blank';
  element.append(frame);

  // Reuse the calendar's existing reaction camera control and photo flow.
  const camera = playlistCard(9);
  camera.element.remove();
  camera.captureButton.setAttribute('aria-label', 'Open camera');
  camera.captureButton.dataset.tooltip = 'Open camera';
  camera.reactionDialog.setAttribute('aria-label', 'Gift #9 camera');
  document.body.append(camera.reactionDialog);
  window.addEventListener('message', event => {
    if (event.source === frame.contentWindow && event.data?.type === 'christmillion-close') {
      document.dispatchEvent(new Event('christmillion-close'));
    }
  });

  return {
    element,
    captureButton: camera.captureButton,
    stop: camera.stop,
    show() {
      element.hidden = false;
      frame.src = './christmillion/index.html';
      camera.captureButton.hidden = false;
      camera.show();
    },
    hide() {
      camera.hide();
      frame.src = 'about:blank';
      element.hidden = true;
    },
  };
}
