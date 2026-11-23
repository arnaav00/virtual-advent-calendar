import { playlistCard } from './playlist-gift.js';
import { christmasTreeImage, saveChristmasTreeImage } from './gift-state.js';

export function gift23Card() {
  const day = 23;
  const element = document.createElement('section');
  element.className = 'gift23-card';
  element.hidden = true;
  element.setAttribute('aria-label', 'Gift 23: decorate a Christmas tree');
  element.innerHTML = `
    <div class="gift23-intro">
      <p>Oh dear! It's two days to Christmas and you don't have your Christmas tree set up yet! A sloth philosophy is cool and all, but this is recklessly lazy. Tch tch.</p>
      <p>Go ahead and decorate it at <a href="https://ringnorthpole.com/workshop/decorate-tree/" target="_blank" rel="noopener noreferrer">Santa's Workshop</a> already, then give it to the elf here to set it up.</p>
      <label class="gift23-upload gift23-upload-main" aria-label="Upload your decorated Christmas tree image">
        <img src="./assets/elf_upload.gif" alt="">
        <input type="file" accept="image/*">
      </label>
      <p class="gift23-sync-status" role="status" aria-live="polite"></p>
    </div>
    <figure class="gift23-polaroid" hidden>
      <img class="gift23-tree-image" alt="Your decorated Christmas tree">
      <figcaption>2026 Christmas Devangtree</figcaption>
    </figure>
    <label class="gift23-upload gift23-upload-again" aria-label="Upload a different decorated Christmas tree image" hidden>
      <img src="./assets/elf_upload.gif" alt="">
      <input type="file" accept="image/*">
    </label>`;

  const camera = playlistCard(day);
  camera.element.remove();
  camera.captureButton.setAttribute('aria-label', 'Capture your reaction');
  camera.captureButton.dataset.tooltip = 'Capture your reaction';
  camera.reactionDialog.setAttribute('aria-label', 'Gift #23 photo capture');
  document.body.append(camera.reactionDialog);

  const intro = element.querySelector('.gift23-intro');
  const polaroid = element.querySelector('.gift23-polaroid');
  const image = element.querySelector('.gift23-tree-image');
  const syncStatus = element.querySelector('.gift23-sync-status');
  const inputs = [...element.querySelectorAll('input[type="file"]')];
  const smallElf = element.querySelector('.gift23-upload-again');
  let imageUrl = '';

  async function useImage(file) {
    if (!file?.type.startsWith('image/')) return;
    syncStatus.textContent = 'Saving your Christmas tree…';
    const sourceUrl = URL.createObjectURL(file);
    let treeBlob = file;
    try {
      const source = new Image();
      source.src = sourceUrl;
      await source.decode();

      // The North Pole export is 1200×1580. Keep the illustration inside its
      // frame (x 50–1150, y 87–1373) and drop the outer frame and footer.
      // Fractions keep the crop consistent when uploads use other resolutions.
      const left = 50 / 1200;
      const top = 87 / 1580;
      const right = 1150 / 1200;
      const bottom = 1373 / 1580;
      const sx = source.naturalWidth * left;
      const sy = source.naturalHeight * top;
      const sw = source.naturalWidth * (right - left);
      const sh = source.naturalHeight * (bottom - top);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(sw);
      canvas.height = Math.round(sh);
      canvas.getContext('2d').drawImage(source, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
      treeBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png')) || file;
    } catch (error) {
      console.error('Could not crop the uploaded tree image:', error);
    } finally {
      URL.revokeObjectURL(sourceUrl);
    }
    try {
      await saveChristmasTreeImage(treeBlob);
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      imageUrl = URL.createObjectURL(treeBlob);
      image.src = imageUrl;
      syncStatus.textContent = 'Your tree is saved for Christmas Day.';
    } catch (error) {
      console.error('Could not save the Christmas tree to Firebase:', error);
      syncStatus.textContent = error?.code === 'permission-denied'
        ? 'Firebase rejected the tree save. Publish the latest firebase.rules, then upload the tree again.'
        : error?.message || 'Could not save your Christmas tree. Please try again.';
      return;
    }
    intro.hidden = true;
    polaroid.hidden = false;
    smallElf.hidden = false;
    polaroid.classList.remove('is-arriving');
    void polaroid.offsetWidth;
    polaroid.classList.add('is-arriving');
    inputs.forEach(input => { input.value = ''; });
  }
  inputs.forEach(input => input.addEventListener('change', () => { void useImage(input.files?.[0]); }));

  return {
    element,
    captureButton: camera.captureButton,
    async show() {
      element.hidden = false; camera.captureButton.hidden = false; void camera.show();
      syncStatus.textContent = 'Loading your saved Christmas tree…';
      try {
        const saved = await christmasTreeImage();
        if (saved) {
          if (imageUrl) URL.revokeObjectURL(imageUrl);
          imageUrl = URL.createObjectURL(saved); image.src = imageUrl;
          intro.hidden = true; polaroid.hidden = false; smallElf.hidden = false;
          syncStatus.textContent = 'Your tree is saved for Christmas Day.';
        } else syncStatus.textContent = '';
      } catch (error) {
        console.error('Could not load the saved Christmas tree:', error);
        syncStatus.textContent = '';
      }
    },
    hide() {
      element.hidden = true;
      camera.hide();
      intro.hidden = false;
      polaroid.hidden = true;
      smallElf.hidden = true;
      syncStatus.textContent = '';
      polaroid.classList.remove('is-arriving');
      image.removeAttribute('src');
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      imageUrl = '';
      inputs.forEach(input => { input.value = ''; });
    },
    stop() { camera.stop(); }
  };
}
