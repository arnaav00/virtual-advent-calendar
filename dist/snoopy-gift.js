import { playlistCard } from './playlist-gift.js';

const driveUrl = 'https://drive.google.com/file/d/1Urnw5fwRnYmE-zRbduCoRG_WUW2JfXDz/view?usp=sharing';
const members = [
  ['Charlie Brown', 'charlie_brown_dancing_3d_by_disneyfanwithautism_dldy83m'],
  ['Snoopy and Woodstock', 'snoopy_and_woodstock_dancing_3d_by_disneyfanwithautism_dleao8r'],
  ['Franklin', 'franklin_dancing_3d_by_disneyfanwithautism_dldy6gy'],
  ['Linus', 'linus_dancing_3d_by_disneyfanwithautism_dldy6j6'],
  ['Lucy', 'lucy_dancing_3d_free_to_use__by_disneyfanwithautism_dldy6hc'],
  ['Marcie', 'marcie_dancing_3d_by_disneyfanwithautism_dleal8l'],
  ['AA', 'AA_dance'],
  ['DD', 'DD_dance'],
  ['Patty', 'patty_dancing_3d_by_disneyfanwithautism_dleaidc'],
  ['Schroeder', 'schroeder_dancing_3d_by_disneyfanwithautism_dldy6gh'],
  ['Shermy', 'shermy_dancing_3d_by_disneyfanwithautism_dleao7s'],
  ['Fifi', 'fifi_dancing_3d_by_disneyfanwithautism_dleapni'],
  ['Little Red-Haired Girl', 'little_red_haired_girl_dancing_3d_by_disneyfanwithautism_dleao85'],
];

export function snoopyCard() {
  const theme = new Audio(new URL('./assets/Peanuts Theme.mp3', import.meta.url).href);
  theme.loop = true;
  theme.preload = 'auto';
  theme.volume = 1;
  let otherAudioPaused = false;
  const element = document.createElement('section');
  element.className = 'snoopy-gift';
  element.hidden = true;
  element.setAttribute('aria-label', 'Snoopy Presents: 12 Days of Snoopy');
  element.innerHTML = `
    <img class="snoopy-background-art" src="./assets/snoopy-background.png" alt="">
    <div class="snoopy-scene-shade" aria-hidden="true"></div>
    <article class="snoopy-movie-tile">
      <img class="snoopy-poster" src="./assets/snoopy-poster.png" alt="12 Days of Snoopy poster">
      <div class="snoopy-movie-copy">
        <h1>Snoopy Presents: 12 Days of Snoopy</h1>
        <p class="snoopy-metadata"><span>TV Special</span><i>·</i><span>Animation</span><i>·</i><a href="https://www.imdb.com/title/tt47791876/releaseinfo/?ref_=tt_ov_rdat" target="_blank" rel="noopener">2026</a><i>·</i><a href="https://www.imdb.com/title/tt47791876/parentalguide/?ref_=tt_ov_pg#certificates" target="_blank" rel="noopener">TV-G</a><i>·</i><span>32m</span></p>
        <p class="snoopy-synopsis">The Peanuts kids are on their best behavior — but Snoopy has landed on Santa's naughty list. With just 12 days until Christmas, he sets out to prove he's not such a bad beagle after all, discovering along the way that the season is about more than gifts.</p>
        <a class="snoopy-watch" href="${driveUrl}" target="_blank" rel="noopener noreferrer">Watch Now <span aria-hidden="true">▶</span></a>
      </div>
    </article>
    <div class="snoopy-dancers" aria-label="Dancing Peanuts characters"></div>`;

  const dancers = element.querySelector('.snoopy-dancers');
  const dancerImages = members.map(([name, asset]) => {
    const img = document.createElement('img');
    img.className = `snoopy-dancer${name === 'AA' || name === 'DD' ? ' snoopy-oc' : ''}`;
    img.alt = name;
    img.dataset.asset = asset;
    img.loading = 'lazy';
    img.decoding = 'async';
    dancers.append(img);
    return img;
  });

  const camera = playlistCard(12);
  camera.element.remove();
  camera.captureButton.setAttribute('aria-label', 'Open camera');
  camera.captureButton.dataset.tooltip = 'Open camera';
  camera.reactionDialog.setAttribute('aria-label', 'Gift #12 camera');
  document.body.append(camera.reactionDialog);

  return {
    element,
    captureButton: camera.captureButton,
    show() {
      element.hidden = false;
      for (const img of dancerImages) img.src = `./assets/snoopy_dancers/optimized/${img.dataset.asset}.webp`;
      camera.captureButton.hidden = false;
      camera.show();
      window.dispatchEvent(new Event('pause-calendar-music'));
      otherAudioPaused = true;
      theme.currentTime = 0;
      theme.muted = false;
      theme.play().catch(() => {});
    },
    stop() {
      camera.stop();
      theme.pause();
    },
    hide() {
      theme.pause();
      theme.currentTime = 0;
      camera.hide();
      element.hidden = true;
      camera.captureButton.hidden = true;
      for (const img of dancerImages) img.removeAttribute('src');
      if (otherAudioPaused) {
        otherAudioPaused = false;
        window.dispatchEvent(new Event('resume-calendar-music'));
      }
    },
  };
}
