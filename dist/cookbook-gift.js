import { playlistCard } from './playlist-gift.js';

const INGREDIENTS = [
  { text: '6 large egg yolks' },
  { text: '½ cup granulated sugar' },
  { text: '1 cup heavy whipping cream' },
  { text: '2 cups milk' },
  { text: '½ teaspoon ground nutmeg' },
  { text: 'Pinch of salt' },
  { text: '¼ teaspoon vanilla extract' },
  { text: 'Ground cinnamon, for topping' },
  { text: 'Bourbon alcohol (optional)', optional: true },
];

export function cookbookCard() {
  const element = document.createElement('section');
  element.className = 'cookbook-gift';
  element.hidden = true;
  element.setAttribute('aria-label', 'Gift #15 eggnog cookbook');
  element.innerHTML = `
    <div class="cookbook-stage">
      <button class="cookbook-cover" type="button" aria-label="Open How to Make Eggnog for Dummies">
        <img class="cookbook-cover-art" src="./assets/cookbook-cover.jpg" alt="How to Make Eggnog for Dummies vintage cookbook cover">
      </button>
      <div class="cookbook-spread" aria-live="polite" hidden>
        <article class="cookbook-page cookbook-left-page"></article>
        <article class="cookbook-page cookbook-right-page"></article>
        <div class="cookbook-spine" aria-hidden="true"></div>
        <div class="cookbook-page-turn" aria-hidden="true" hidden>
          <div class="cookbook-page-front"></div>
          <div class="cookbook-page-back"></div>
        </div>
      </div>
    </div>`;

  const camera = playlistCard(15);
  camera.element.remove();
  camera.captureButton.setAttribute('aria-label', 'Capture your reaction');
  camera.captureButton.dataset.tooltip = 'Capture your reaction';
  camera.reactionDialog.setAttribute('aria-label', 'Gift #15 photo capture');
  document.body.append(camera.reactionDialog);

  const cover = element.querySelector('.cookbook-cover');
  const spread = element.querySelector('.cookbook-spread');
  const leftPage = element.querySelector('.cookbook-left-page');
  const rightPage = element.querySelector('.cookbook-right-page');
  const pageTurn = element.querySelector('.cookbook-page-turn');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let phase = 'cover';
  let flipping = false;
  let coverTimer = 0;
  let eggCount = 0;
  let sugarAdded = false;
  let bourbonSelected = false;

  const chefNote = `Eggnog, historically also known as milk punch or egg milk punch, is a rich, chilled, sweetened, creamy dairy-based beverage traditionally made during Christmastime. The thought of raw eggs in a drink might make one revolt, but rest assured this follow-along recipe uses organic, data farm-grown digital eggs. It's quite simple, and the reward is just as gratifying as the process. Besides, your boyfriend will be making this every year for Christmas so it's best to know what goes into it. Let's get started!`;

  function ingredientMarkup(item, index) {
    return `<label class="cookbook-ingredient${item.optional ? ' is-optional' : ''}">
      <input type="checkbox" data-ingredient="${index}"${item.optional ? ' data-optional="true"' : ''}>
      <span class="cookbook-checkbox" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="m4 10 4 4 8-9"/></svg></span>
      <span class="cookbook-ingredient-text">${item.html || item.text}</span>
    </label>`;
  }

  function introMarkup() {
    return {
      left: `<div class="cookbook-page-content cookbook-note">
        <h1>Chef's Note</h1><div class="cookbook-rule"></div>
        <p>${chefNote}</p>
      </div>`,
      right: `<div class="cookbook-page-content cookbook-ingredients">
        <h1>Ingredients</h1><div class="cookbook-rule"></div>
        <div class="cookbook-ingredient-list">${INGREDIENTS.map(ingredientMarkup).join('')}</div>
        <button class="cookbook-next" type="button" hidden>Next <span aria-hidden="true">→</span></button>
      </div>`,
    };
  }

  function stepMarkup() {
    return {
      left: `<div class="cookbook-page-content cookbook-step-copy">
        <h1>Step 1</h1><div class="cookbook-rule"></div>
        <p>Whisk the egg yolks and sugar together in a medium bowl until light and creamy.</p>
      </div>`,
      right: `<div class="cookbook-page-content cookbook-activity-page">
        <div class="cookbook-activity" aria-label="Crack six eggs into the bowl, add sugar, then whisk">
          <button type="button" class="cookbook-egg" aria-label="Crack egg 1 into the bowl">
            <svg viewBox="0 0 76 96" aria-hidden="true">
              <defs><linearGradient id="cb-egg-shell" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fffdf5"/><stop offset=".58" stop-color="#f2e8cf"/><stop offset="1" stop-color="#d8c9a5"/></linearGradient></defs>
              <path class="cookbook-egg-whole" d="M38 5C22 5 8 38 8 59c0 20 12 31 30 31s30-11 30-31C68 38 54 5 38 5Z" fill="url(#cb-egg-shell)" stroke="#a99a7e" stroke-width="2"/>
              <path class="cookbook-egg-crack" d="m12 47 12-8 8 10 8-12 8 11 9-9 8 11" fill="none" stroke="#a99a7e" stroke-width="2.4" stroke-linejoin="round"/>
              <path class="cookbook-egg-yolk" d="M38 44c-8 0-13 7-13 14s5 12 13 12 13-5 13-12-5-14-13-14Z" fill="#f5ae25"/>
            </svg>
          </button>
          <button type="button" class="cookbook-sugar-cup" aria-label="Pour granulated sugar into the bowl" hidden>
            <svg viewBox="0 0 112 92" aria-hidden="true">
              <path d="M20 21h68l-9 61H29Z" fill="#f2eee5" fill-opacity=".82" stroke="#9b8d77" stroke-width="3"/>
              <path d="M22 28h64" stroke="#fff" stroke-width="4" opacity=".8"/>
              <path d="M87 31h9q13 0 10 13t-18 10" fill="none" stroke="#9b8d77" stroke-width="4"/>
              <path d="M24 22q30-12 60 0v12H24Z" fill="#fffdf6" stroke="#c7bda9" stroke-width="2"/>
              <g class="cookbook-sugar-pile" fill="#fffdf6"><path d="M28 28q8-11 17-4 8-10 17-2 10-7 18 4l-2 7H28Z"/><circle cx="34" cy="26" r="2"/><circle cx="47" cy="22" r="2.5"/><circle cx="60" cy="25" r="2"/><circle cx="72" cy="22" r="2.2"/></g>
            </svg>
          </button>
          <div class="cookbook-bowl" aria-label="Glass mixing bowl">
            <svg class="cookbook-bowl-glass" viewBox="0 0 360 220" aria-hidden="true">
              <defs>
                <linearGradient id="cb-glass" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff" stop-opacity=".62"/><stop offset=".35" stop-color="#d9eff0" stop-opacity=".18"/><stop offset=".7" stop-color="#fff" stop-opacity=".44"/><stop offset="1" stop-color="#a9c9cb" stop-opacity=".42"/></linearGradient>
              </defs>
              <ellipse cx="180" cy="196" rx="136" ry="14" fill="#694b2e" opacity=".13"/>
              <path d="M24 34Q180 57 336 34L308 165Q180 211 52 165Z" fill="url(#cb-glass)" stroke="#bacdca" stroke-width="5"/>
            </svg>
            <button type="button" class="cookbook-whisk" aria-label="Drag the whisk around the bowl to mix" hidden>
              <img src="./assets/whisk-reference.png" alt="" draggable="false">
              <span class="cookbook-whisk-head" aria-hidden="true"></span>
            </button>
            <svg class="cookbook-mixture" viewBox="0 0 360 220" aria-hidden="true">
              <defs>
                <clipPath id="cb-bowl-inside"><path d="M24 34Q180 57 336 34L308 165Q180 211 52 165Z"/></clipPath>
                <linearGradient id="cb-yolk" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#ffc04b"/><stop offset="1" stop-color="#eb8e1c"/></linearGradient>
              </defs>
              <g class="cookbook-liquid" clip-path="url(#cb-bowl-inside)">
                <path class="cookbook-liquid-fill" d="M24 220Q180 220 336 220V220H24Z" fill="url(#cb-yolk)"/>
                <path class="cookbook-liquid-surface" d="M24 220Q96 208 165 220T336 220" fill="none" stroke="#ffd571" stroke-width="7"/>
                <g class="cookbook-yolks"></g>
                <g class="cookbook-sugar-grains"></g>
                <path class="cookbook-fluid-swirl" d="M74 140Q119 107 159 143T249 141" fill="none" stroke="#fff3c3" stroke-opacity=".45" stroke-width="5"/>
              </g>
            </svg>
            <svg class="cookbook-bowl-glass-overlay" viewBox="0 0 360 220" aria-hidden="true">
              <path d="M24 34Q180 57 336 34" fill="none" stroke="#faffff" stroke-width="10" stroke-linecap="round" opacity=".95"/>
              <path d="M47 53Q63 125 78 157M314 53Q299 126 284 158" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".5"/>
              <path d="M52 165Q180 211 308 165" fill="none" stroke="#afc3c3" stroke-width="4" opacity=".75"/>
            </svg>
            <div class="cookbook-mix-target" aria-hidden="true"></div>
          </div>
          <div class="cookbook-activity-status" aria-live="polite">Click an egg to crack it into the bowl.</div>
          <button class="cookbook-next cookbook-step-next" type="button" hidden>Next <span aria-hidden="true">→</span></button>
        </div>
      </div>`,
    };
  }

  function step2Markup() {
    return {
      left: `<div class="cookbook-page-content cookbook-step-copy">
        <h1>Step 2</h1><div class="cookbook-rule"></div>
        <p>In a saucepan over medium-high heat, combine the cream, milk, nutmeg and salt. Stir often until mixture reaches a bare simmer.</p>
      </div>`,
      right: `<div class="cookbook-page-content cookbook-activity-page">
        <div class="cookbook-activity cookbook-step2-activity" aria-label="Add cream, milk, nutmeg and salt to the saucepan, then stir">
          <button type="button" class="cookbook-ingredient-tool cookbook-cream-tool" data-step-ingredient="0" aria-label="Pour heavy cream into the saucepan">
            <svg viewBox="0 0 120 100" aria-hidden="true"><path d="M22 22h58l-7 68H30Z" fill="#eef7f5" fill-opacity=".62" stroke="#9aaca9" stroke-width="3"/><path d="M79 31h12q17 2 13 17t-22 16" fill="none" stroke="#9aaca9" stroke-width="4"/><path d="M25 50h51l-4 35H29Z" fill="#fff8e8" fill-opacity=".76"/><path d="M25 22q27-9 54 0v9H25Z" fill="#fffdf6" stroke="#bac5bd" stroke-width="2"/><path d="M33 37v39M42 37v39" stroke="#fff" stroke-width="3" opacity=".75"/></svg>
          </button>
          <button type="button" class="cookbook-ingredient-tool cookbook-milk-tool" data-step-ingredient="1" aria-label="Pour milk into the saucepan" hidden>
            <svg viewBox="0 0 140 105" aria-hidden="true"><path d="M22 22h76l-8 72H30Z" fill="#eff8f7" fill-opacity=".68" stroke="#96aaa8" stroke-width="3"/><path d="M97 31h13q18 1 14 17t-22 16" fill="none" stroke="#96aaa8" stroke-width="4"/><path d="M25 54h68l-5 34H30Z" fill="#fffdf2" fill-opacity=".84"/><path d="M24 22q36-10 73 0v10H24Z" fill="#fff" stroke="#bdc8c5" stroke-width="2"/><path d="M39 38v43M49 38v43" stroke="#fff" stroke-width="3" opacity=".8"/></svg>
          </button>
          <button type="button" class="cookbook-ingredient-tool cookbook-nutmeg-tool" data-step-ingredient="2" aria-label="Add ground nutmeg with a spoon" hidden>
            <svg viewBox="0 0 150 96" aria-hidden="true"><defs><linearGradient id="cb-spoon-metal" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fff"/><stop offset=".34" stop-color="#c9d3d1"/><stop offset=".7" stop-color="#879491"/><stop offset="1" stop-color="#edf1ed"/></linearGradient></defs><path d="M28 72Q57 60 98 38" fill="none" stroke="#71807d" stroke-width="10" stroke-linecap="round"/><path d="M28 69Q58 56 98 36" fill="none" stroke="url(#cb-spoon-metal)" stroke-width="7" stroke-linecap="round"/><ellipse cx="119" cy="25" rx="21" ry="13" transform="rotate(-28 119 25)" fill="url(#cb-spoon-metal)" stroke="#71807d" stroke-width="2.5"/><ellipse cx="119" cy="24" rx="14" ry="7" transform="rotate(-28 119 24)" fill="#e9e5da"/><path d="M108 18q10-7 19-3" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/><g fill="#80552d"><circle cx="113" cy="21" r="2.1"/><circle cx="119" cy="19" r="2.3"/><circle cx="124" cy="22" r="1.8"/><circle cx="117" cy="25" r="1.6"/></g></svg>
          </button>
          <button type="button" class="cookbook-ingredient-tool cookbook-salt-tool" data-step-ingredient="3" aria-label="Add a pinch of salt to the saucepan" hidden>
            <svg viewBox="0 0 100 110" aria-hidden="true"><path d="M37 16h26v12H37ZM31 30h38l7 64H24Z" fill="#f1efe8" fill-opacity=".85" stroke="#8e918b" stroke-width="3"/><path d="M31 30h38" stroke="#fff" stroke-width="4"/><path d="M38 22h24" stroke="#8e918b" stroke-width="2"/><circle cx="41" cy="12" r="2" fill="#8e918b"/><circle cx="50" cy="12" r="2" fill="#8e918b"/><circle cx="59" cy="12" r="2" fill="#8e918b"/></svg>
          </button>
          <div class="cookbook-pan" aria-label="Top view of saucepan">
            <svg class="cookbook-pan-base" viewBox="0 0 260 280" aria-hidden="true"><defs><linearGradient id="cb-pan-metal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#4b4e4c"/><stop offset=".4" stop-color="#252a29"/><stop offset="1" stop-color="#151a19"/></linearGradient><radialGradient id="cb-pan-interior"><stop stop-color="#e7e3d7"/><stop offset=".86" stop-color="#b8b5aa"/><stop offset="1" stop-color="#6e716f"/></radialGradient></defs><path d="M105 51h50l-6-64q-19-17-38 0Z" fill="url(#cb-pan-metal)" stroke="#131716" stroke-width="5"/><path d="M105 193h50l-6 64q-19 17-38 0Z" fill="url(#cb-pan-metal)" stroke="#131716" stroke-width="5"/><path d="M115 205h30l-4 45q-11 9-22 0Z" fill="#555a57" opacity=".75"/><circle cx="130" cy="122" r="103" fill="url(#cb-pan-metal)" stroke="#111615" stroke-width="5"/><circle cx="130" cy="122" r="88" fill="url(#cb-pan-interior)" stroke="#d0d0c8" stroke-width="4"/></svg>
            <button type="button" class="cookbook-whisk cookbook-pan-whisk" aria-label="Drag the whisk around the saucepan to stir" hidden><img src="./assets/whisk-reference.png" alt="" draggable="false"><span class="cookbook-whisk-head" aria-hidden="true"></span></button>
            <svg class="cookbook-pan-mixture" viewBox="0 0 260 280" aria-hidden="true"><defs><clipPath id="cb-pan-inside"><circle cx="130" cy="122" r="84"/></clipPath><radialGradient id="cb-pan-liquid"><stop stop-color="#fff5e7"/><stop offset="1" stop-color="#e3d1b7"/></radialGradient></defs><g clip-path="url(#cb-pan-inside)"><circle class="cookbook-pan-liquid" cx="130" cy="122" r="0" fill="url(#cb-pan-liquid)"/><g class="cookbook-pan-spices"></g><path class="cookbook-pan-swirl" d="M74 121q35-36 67 0t58 0" fill="none" stroke="#fff9ed" stroke-opacity=".5" stroke-width="5"/></g></svg>
            <svg class="cookbook-pan-glass" viewBox="0 0 260 280" aria-hidden="true"><circle cx="130" cy="122" r="92" fill="none" stroke="#e1e2dc" stroke-width="5"/><path d="M67 54Q102 31 147 35M61 184q-9-20-10-38" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".42"/></svg>
            <div class="cookbook-mix-target" aria-hidden="true"></div>
          </div>
          <div class="cookbook-activity-status" aria-live="polite">Click the heavy cream to pour it into the pan.</div>
          <button class="cookbook-next cookbook-step-next" type="button" hidden>Next <span aria-hidden="true">→</span></button>
        </div>
      </div>`,
    };
  }

  function step3Markup() {
    return {
      left: `<div class="cookbook-page-content cookbook-step-copy">
        <h1>Step 3</h1><div class="cookbook-rule"></div>
        <p>Add a big spoonful of the hot mixture to the egg mixture, whisking vigorously. Repeat, adding a big spoonful at a time, to temper the eggs.</p>
      </div>`,
      right: `<div class="cookbook-page-content cookbook-activity-page">
        <div class="cookbook-activity cookbook-temper-activity" aria-label="Temper the egg mixture with three spoonfuls of warm mixture, whisking after each">
          <button type="button" class="cookbook-temper-spoon" aria-label="Add a spoonful of warm mixture" >
            <svg viewBox="0 0 150 96" aria-hidden="true"><defs><linearGradient id="cb-temper-spoon-metal" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fff"/><stop offset=".34" stop-color="#c9d3d1"/><stop offset=".7" stop-color="#879491"/><stop offset="1" stop-color="#edf1ed"/></linearGradient></defs><path d="M28 72Q57 60 98 38" fill="none" stroke="#71807d" stroke-width="10" stroke-linecap="round"/><path d="M28 69Q58 56 98 36" fill="none" stroke="url(#cb-temper-spoon-metal)" stroke-width="7" stroke-linecap="round"/><ellipse cx="119" cy="25" rx="21" ry="13" transform="rotate(-28 119 25)" fill="#d5b991" stroke="#71807d" stroke-width="2.5"/><ellipse cx="119" cy="24" rx="14" ry="7" transform="rotate(-28 119 24)" fill="#e9cfaa"/><path d="M108 18q10-7 19-3" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></svg>
          </button>
          <div class="cookbook-bowl cookbook-temper-bowl" aria-label="Finished light egg mixture">
            <svg class="cookbook-bowl-glass" viewBox="0 0 360 220" aria-hidden="true"><defs><linearGradient id="cb-temper-glass" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff" stop-opacity=".62"/><stop offset=".45" stop-color="#d9eff0" stop-opacity=".18"/><stop offset="1" stop-color="#a9c9cb" stop-opacity=".4"/></linearGradient></defs><ellipse cx="180" cy="196" rx="136" ry="14" fill="#694b2e" opacity=".13"/><path d="M24 34Q180 57 336 34L308 165Q180 211 52 165Z" fill="url(#cb-temper-glass)" stroke="#bacdca" stroke-width="5"/></svg>
            <button type="button" class="cookbook-whisk cookbook-temper-whisk" aria-label="Drag the whisk through the egg mixture" hidden><img src="./assets/whisk-reference.png" alt="" draggable="false"><span class="cookbook-whisk-head" aria-hidden="true"></span></button>
            <svg class="cookbook-mixture" viewBox="0 0 360 220" aria-hidden="true"><defs><clipPath id="cb-temper-inside"><path d="M24 34Q180 57 336 34L308 165Q180 211 52 165Z"/></clipPath><linearGradient id="cb-temper-liquid" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f5df94"/><stop offset="1" stop-color="#e5c76d"/></linearGradient></defs><g clip-path="url(#cb-temper-inside)"><path class="cookbook-temper-liquid" d="M24 92Q180 80 336 92V220H24Z" fill="url(#cb-temper-liquid)"/><path class="cookbook-temper-surface" d="M24 92Q96 80 165 92T336 92" fill="none" stroke="#fbe9b0" stroke-width="7"/><path class="cookbook-fluid-swirl" d="M74 140Q119 107 159 143T249 141" fill="none" stroke="#fff8dc" stroke-opacity=".5" stroke-width="5"/></g></svg>
            <svg class="cookbook-bowl-glass-overlay" viewBox="0 0 360 220" aria-hidden="true"><path d="M24 34Q180 57 336 34" fill="none" stroke="#faffff" stroke-width="10" stroke-linecap="round" opacity=".95"/><path d="M47 53Q63 125 78 157M314 53Q299 126 284 158" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".5"/><path d="M52 165Q180 211 308 165" fill="none" stroke="#afc3c3" stroke-width="4" opacity=".75"/></svg>
            <div class="cookbook-mix-target" aria-hidden="true"></div>
          </div>
          <div class="cookbook-activity-status" aria-live="polite">Click the spoon to add the first spoonful.</div>
          <button class="cookbook-next cookbook-step-next" type="button" hidden>Next <span aria-hidden="true">→</span></button>
        </div>
      </div>`,
    };
  }

  function step4Markup() {
    return {
      left: `<div class="cookbook-page-content cookbook-step-copy">
        <h1>Step 4</h1><div class="cookbook-rule"></div>
        <p>Pour the mixture back into the saucepan and whisk constantly until the mixture is just slightly thickened. Don't overdo it! The mixture will thicken more as it cools.</p>
      </div>`,
      right: `<div class="cookbook-page-content cookbook-activity-page">
        <div class="cookbook-activity cookbook-return-activity" aria-label="Pour the tempered egg mixture into the saucepan, then whisk">
          <button type="button" class="cookbook-temper-bowl cookbook-return-bowl" aria-label="Pour the egg mixture into the saucepan">
            <svg viewBox="0 0 360 220" aria-hidden="true"><defs><linearGradient id="cb-return-glass" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff" stop-opacity=".62"/><stop offset=".45" stop-color="#d9eff0" stop-opacity=".18"/><stop offset="1" stop-color="#a9c9cb" stop-opacity=".4"/></linearGradient><clipPath id="cb-return-bowl-inside"><path d="M24 34Q180 57 336 34L308 165Q180 211 52 165Z"/></clipPath></defs><path d="M24 34Q180 57 336 34L308 165Q180 211 52 165Z" fill="url(#cb-return-glass)" stroke="#bacdca" stroke-width="5"/><path class="cookbook-return-bowl-liquid" d="M31 112Q180 100 329 112V154Q180 190 47 154Z" fill="#e9cf8b" clip-path="url(#cb-return-bowl-inside)"/><path d="M24 34Q180 57 336 34" fill="none" stroke="#faffff" stroke-width="10" stroke-linecap="round"/><path d="M52 165Q180 211 308 165" fill="none" stroke="#afc3c3" stroke-width="4"/></svg>
          </button>
          <div class="cookbook-pan cookbook-return-pan" aria-label="Saucepan with the warm mixture">
            <svg class="cookbook-pan-base" viewBox="0 0 260 280" aria-hidden="true"><defs><linearGradient id="cb-return-pan-metal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#4b4e4c"/><stop offset=".4" stop-color="#252a29"/><stop offset="1" stop-color="#151a19"/></linearGradient><radialGradient id="cb-return-pan-interior"><stop stop-color="#e7e3d7"/><stop offset=".86" stop-color="#b8b5aa"/><stop offset="1" stop-color="#6e716f"/></radialGradient></defs><path d="M105 51h50l-6-64q-19-17-38 0Z" fill="url(#cb-return-pan-metal)" stroke="#131716" stroke-width="5"/><path d="M105 193h50l-6 64q-19 17-38 0Z" fill="url(#cb-return-pan-metal)" stroke="#131716" stroke-width="5"/><path d="M115 205h30l-4 45q-11 9-22 0Z" fill="#555a57" opacity=".75"/><circle cx="130" cy="122" r="103" fill="url(#cb-return-pan-metal)" stroke="#111615" stroke-width="5"/><circle cx="130" cy="122" r="88" fill="url(#cb-return-pan-interior)" stroke="#d0d0c8" stroke-width="4"/></svg>
            <button type="button" class="cookbook-whisk cookbook-return-whisk" aria-label="Drag the whisk around the saucepan" hidden><img src="./assets/whisk-reference.png" alt="" draggable="false"><span class="cookbook-whisk-head" aria-hidden="true"></span></button>
            <svg class="cookbook-pan-mixture" viewBox="0 0 260 280" aria-hidden="true"><defs><clipPath id="cb-return-inside"><circle cx="130" cy="122" r="84"/></clipPath><radialGradient id="cb-return-liquid"><stop stop-color="#fff5e7"/><stop offset="1" stop-color="#e3d1b7"/></radialGradient></defs><g clip-path="url(#cb-return-inside)"><circle class="cookbook-return-liquid" cx="130" cy="122" r="57" fill="url(#cb-return-liquid)"/><path class="cookbook-pan-swirl" d="M74 121q35-36 67 0t58 0" fill="none" stroke="#fff9ed" stroke-opacity=".5" stroke-width="5"/></g></svg>
            <svg class="cookbook-pan-glass" viewBox="0 0 260 280" aria-hidden="true"><circle cx="130" cy="122" r="92" fill="none" stroke="#e1e2dc" stroke-width="5"/><path d="M67 54Q102 31 147 35M61 184q-9-20-10-38" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".42"/></svg>
            <div class="cookbook-mix-target" aria-hidden="true"></div>
          </div>
          <div class="cookbook-activity-status" aria-live="polite">Click the bowl to pour the mixture into the saucepan.</div>
          <button class="cookbook-next cookbook-step-next" type="button" hidden>Next <span aria-hidden="true">→</span></button>
        </div>
      </div>`,
    };
  }

  function step5Markup() {
    const alcoholText = bourbonSelected ? ' and alcohol' : '';
    return {
      left: `<div class="cookbook-page-content cookbook-step-copy">
        <h1>Step 5</h1><div class="cookbook-rule"></div>
        <p>Remove from heat, and after it cools for about a minute, pour the mixture into a container. Add in the vanilla extract${alcoholText}.</p>
      </div>`,
      right: `<div class="cookbook-page-content cookbook-activity-page">
        <div class="cookbook-activity cookbook-step5-activity" aria-label="Pour the cooled mixture into a pitcher, then add vanilla">
          <button type="button" class="cookbook-step5-pan" aria-label="Pour the cooled eggnog from the saucepan">
            <svg viewBox="0 0 260 140" aria-hidden="true"><defs><linearGradient id="cb-step5-pan" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#454a48"/><stop offset="1" stop-color="#171c1b"/></linearGradient><linearGradient id="cb-step5-pan-mixture" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#e8d8b8"/><stop offset="1" stop-color="#cbb792"/></linearGradient></defs><path d="M154 57q39-10 74-24l12 18q-40 25-79 27Z" fill="url(#cb-step5-pan)" stroke="#111615" stroke-width="4"/><path d="M51 44Q130 18 209 44L197 116Q130 139 63 116Z" fill="url(#cb-step5-pan)" stroke="#141918" stroke-width="5"/><path d="M61 71Q130 49 199 71L193 107Q130 128 67 107Z" fill="url(#cb-step5-pan-mixture)" stroke="#c7c8bf" stroke-width="3"/><path d="M66 69Q130 49 194 69" fill="none" stroke="#fff9e9" stroke-width="4" opacity=".7"/></svg>
          </button>
          <div class="cookbook-step5-pitcher" aria-label="Glass pitcher for the eggnog">
            <svg viewBox="0 0 180 220" aria-hidden="true"><defs><linearGradient id="cb-pitcher-glass" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#e6f4ef" stop-opacity=".3"/><stop offset=".18" stop-color="#fff" stop-opacity=".62"/><stop offset=".74" stop-color="#d8ece8" stop-opacity=".24"/><stop offset="1" stop-color="#fff" stop-opacity=".65"/></linearGradient><linearGradient id="cb-pitcher-liquid" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#e7d5aa"/><stop offset="1" stop-color="#c5a875"/></linearGradient><clipPath id="cb-pitcher-interior"><path d="M41 40H133L127 189Q85 205 47 188Z"/></clipPath></defs><path d="M133 65q38-1 31 38t-39 28" fill="none" stroke="#b7cdca" stroke-width="8"/><path d="M41 40H133L127 189Q85 205 47 188Z" fill="url(#cb-pitcher-glass)" stroke="#a9c2c0" stroke-width="5"/><g clip-path="url(#cb-pitcher-interior)"><path class="cookbook-pitcher-liquid" d="M35 190H139V197H35Z" fill="url(#cb-pitcher-liquid)"/><path class="cookbook-pitcher-surface" d="M35 190Q85 184 139 190" fill="none" stroke="#f7e8c5" stroke-width="5"/></g><path d="M38 42Q86 51 137 42" fill="none" stroke="#faffff" stroke-width="8" stroke-linecap="round"/><path d="M57 58v105M119 57l-4 102" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".54"/><path d="M49 189Q85 208 127 189" fill="none" stroke="#a9c2c0" stroke-width="4"/></svg>
          </div>
          <button type="button" class="cookbook-vanilla-vial" aria-label="Add a drop of vanilla extract" hidden>
            <svg viewBox="0 0 80 120" aria-hidden="true"><defs><linearGradient id="cb-vial-glass" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#d8ebe7" stop-opacity=".45"/><stop offset=".5" stop-color="#fff" stop-opacity=".8"/><stop offset="1" stop-color="#a9c7c2" stop-opacity=".7"/></linearGradient></defs><path d="M30 8h20v18l8 10v63q-18 14-36 0V36l8-10Z" fill="url(#cb-vial-glass)" stroke="#80928e" stroke-width="3"/><path d="M29 7h22v14H29Z" fill="#66503b" stroke="#463626" stroke-width="2"/><path d="M26 69h28v28q-14 8-28 0Z" fill="#7d4c2c" opacity=".82"/><path d="M28 42v18M51 40v18" stroke="#fff" stroke-width="3" opacity=".76"/></svg>
          </button>
          <img class="cookbook-jim-beam" src="./assets/jim-beam.png" alt="Jim Beam bourbon bottle" hidden>
          <div class="cookbook-activity-status" aria-live="polite">Click the saucepan to pour the cooled mixture into the pitcher.</div>
          <button class="cookbook-next cookbook-step-next" type="button" hidden>Next <span aria-hidden="true">→</span></button>
        </div>
      </div>`,
    };
  }

  function step6Markup() {
    return {
      left: `<div class="cookbook-page-content cookbook-step-copy">
        <h1>Step 6</h1><div class="cookbook-rule"></div>
        <p>After 2-4 hours in the refrigerator, add in the final, most important ingredient: <strong class="cookbook-love-word">Love</strong>.<br>Pour into a glass and serve.</p>
      </div>`,
      right: `<div class="cookbook-page-content cookbook-activity-page">
        <div class="cookbook-activity cookbook-step6-activity" aria-label="Add love to the eggnog, then pour a glass">
          <button type="button" class="cookbook-love-heart" aria-label="Add love to the eggnog">
            <svg viewBox="0 0 100 90" aria-hidden="true"><path d="M50 84 12 48C-9 26 16-3 39 14l11 10 11-10c23-17 48 12 27 34Z" fill="#d6363d" stroke="#aa202d" stroke-width="4"/><path d="M25 25q9-11 19-4" fill="none" stroke="#ffb0a6" stroke-width="5" stroke-linecap="round" opacity=".8"/></svg>
          </button>
          <button type="button" class="cookbook-serving-pitcher" aria-label="Pour the eggnog into the glass" disabled>
            <svg viewBox="0 0 180 220" aria-hidden="true"><defs><linearGradient id="cb-serving-glass" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#e6f4ef" stop-opacity=".3"/><stop offset=".18" stop-color="#fff" stop-opacity=".65"/><stop offset=".74" stop-color="#d8ece8" stop-opacity=".25"/><stop offset="1" stop-color="#fff" stop-opacity=".72"/></linearGradient><linearGradient id="cb-serving-liquid" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#e8d7b3"/><stop offset="1" stop-color="#c9b182"/></linearGradient><clipPath id="cb-serving-inside"><path d="M41 40H133L127 189Q85 205 47 188Z"/></clipPath></defs><path d="M133 65q38-1 31 38t-39 28" fill="none" stroke="#b7cdca" stroke-width="8"/><path d="M41 40H133L127 189Q85 205 47 188Z" fill="url(#cb-serving-glass)" stroke="#a9c2c0" stroke-width="5"/><g clip-path="url(#cb-serving-inside)"><path class="cookbook-serving-pitcher-liquid" d="M35 49H139V197H35Z" fill="url(#cb-serving-liquid)"/><path class="cookbook-serving-pitcher-surface" d="M35 49Q85 42 139 49" fill="none" stroke="#fff4df" stroke-width="5"/></g><path d="M38 42Q86 51 137 42" fill="none" stroke="#faffff" stroke-width="8" stroke-linecap="round"/><path d="M57 58v105M119 57l-4 102" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".54"/><path d="M49 189Q85 208 127 189" fill="none" stroke="#a9c2c0" stroke-width="4"/></svg>
          </button>
          <button type="button" class="cookbook-serving-glass" aria-label="Small serving glass" hidden>
          <svg viewBox="0 0 120 150" aria-hidden="true"><defs><linearGradient id="cb-serve-glass" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#dcefeb" stop-opacity=".32"/><stop offset=".25" stop-color="#fff" stop-opacity=".75"/><stop offset=".8" stop-color="#d5e8e5" stop-opacity=".26"/><stop offset="1" stop-color="#fff" stop-opacity=".72"/></linearGradient><linearGradient id="cb-serve-liquid" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f5ebd9"/><stop offset="1" stop-color="#eadcc2"/></linearGradient><clipPath id="cb-serve-inside"><path d="M22 24H98L87 127Q60 139 33 127Z"/></clipPath></defs><path d="M22 24H98L87 127Q60 139 33 127Z" fill="url(#cb-serve-glass)" stroke="#a9c2c0" stroke-width="4"/><g clip-path="url(#cb-serve-inside)"><path class="cookbook-serving-glass-liquid" d="M18 130H102V142H18Z" fill="url(#cb-serve-liquid)"/></g><path d="M20 25Q60 32 100 25" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/><path d="M34 42 40 111M84 42 78 111" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".62"/><path d="M34 127Q60 140 87 127" fill="none" stroke="#9db9b6" stroke-width="3"/></svg>
          </button>
          <div class="cookbook-completion-result" hidden>
          <div class="cookbook-final-glass" aria-hidden="true">
            <svg viewBox="0 0 120 150"><defs><linearGradient id="cb-final-glass" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#dcefeb" stop-opacity=".32"/><stop offset=".25" stop-color="#fff" stop-opacity=".8"/><stop offset=".8" stop-color="#d5e8e5" stop-opacity=".26"/><stop offset="1" stop-color="#fff" stop-opacity=".78"/></linearGradient><linearGradient id="cb-final-liquid" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f5ebd9"/><stop offset="1" stop-color="#eadcc2"/></linearGradient></defs><path d="M22 24H98L87 127Q60 139 33 127Z" fill="url(#cb-final-glass)" stroke="#a9c2c0" stroke-width="4"/><path d="M27 58H93L87 127Q60 139 33 127Z" fill="url(#cb-final-liquid)"/><path d="M20 25Q60 32 100 25" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/><path d="M34 42 40 111M84 42 78 111" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".62"/><path d="M34 127Q60 140 87 127" fill="none" stroke="#9db9b6" stroke-width="3"/></svg>
          </div>
          <p class="cookbook-final-message">Voila! Your eggnog is ready!</p>
          </div>
        </div>
      </div>`,
    };
  }

  function setPages(content) {
    leftPage.innerHTML = content.left;
    rightPage.innerHTML = content.right;
  }

  function flipTo(nextPhase) {
    if (flipping) return;
    flipping = true;
    spread.classList.add('is-page-flipping');
    pageTurn.hidden = false;
    pageTurn.classList.remove('is-turning');
    void pageTurn.offsetWidth;
    pageTurn.classList.add('is-turning');
    const finishFlip = () => {
      pageTurn.classList.remove('is-turning');
      pageTurn.hidden = true;
      phase = nextPhase;
      if (nextPhase === 'step1') setPages(stepMarkup());
      if (nextPhase === 'step2') setPages(step2Markup());
      if (nextPhase === 'step3') setPages(step3Markup());
      if (nextPhase === 'step4') setPages(step4Markup());
      if (nextPhase === 'step5') setPages(step5Markup());
      if (nextPhase === 'step6') setPages(step6Markup());
      spread.classList.remove('is-page-flipping');
      flipping = false;
      if (nextPhase === 'step1') bindStepActivity();
      if (nextPhase === 'step2') bindStep2Activity();
      if (nextPhase === 'step3') bindStep3Activity();
      if (nextPhase === 'step4') bindStep4Activity();
      if (nextPhase === 'step5') bindStep5Activity();
      if (nextPhase === 'step6') bindStep6Activity();
    };
    if (reduceMotion.matches) finishFlip();
    else pageTurn.addEventListener('animationend', finishFlip, { once: true });
  }

  function startOpen() {
    if (phase !== 'cover') return;
    phase = 'opening';
    spread.hidden = false;
    setPages(introMarkup());
    cover.hidden = true;
    spread.classList.add('is-opening');
    if (reduceMotion.matches) {
      spread.classList.remove('is-opening');
      phase = 'ingredients';
      bindIngredients();
      return;
    }
    coverTimer = window.setTimeout(() => {
      spread.classList.remove('is-opening');
      phase = 'ingredients';
      bindIngredients();
    }, 560);
  }

  function bindIngredients() {
    const checkboxes = [...rightPage.querySelectorAll('[data-ingredient]')];
    const next = rightPage.querySelector('.cookbook-next');
    const updateNext = () => {
      const required = checkboxes.filter(input => !input.dataset.optional);
      const allReady = required.every(input => input.checked);
      if (allReady && next.hidden) {
        next.hidden = false;
        requestAnimationFrame(() => next.classList.add('is-visible'));
      } else if (!allReady) {
        next.classList.remove('is-visible');
        next.hidden = true;
      }
    };
    checkboxes.forEach(input => input.addEventListener('change', updateNext));
    next.addEventListener('click', () => {
      bourbonSelected = Boolean(rightPage.querySelector('[data-optional]')?.checked);
      flipTo('step1');
    }, { once: true });
  }

  function bindWhiskMixing({ whisk, vessel, target, fill, surface, status, next, duration, color, successText, showNext = true, onComplete }) {
    let touchedMs = 0;
    let lastTime = 0;
    let lastPoint = null;
    let lastInside = false;
    let drag = null;
    let turns = 0;
    let complete = false;

    function finish() {
      if (complete) return;
      complete = true;
      whisk.disabled = true;
      whisk.classList.add('is-finished');
      vessel.classList.remove('is-mixing');
      vessel.classList.add('is-mixed');
      if (fill) {
        fill.setAttribute('fill', color);
        fill.style.fill = color;
      }
      if (surface) surface.style.stroke = color;
      vessel.querySelectorAll('.cookbook-yolks,.cookbook-sugar-grains,.cookbook-pan-spices').forEach(node => node.replaceChildren());
      window.setTimeout(() => { whisk.hidden = true; }, reduceMotion.matches ? 0 : 520);
      status.textContent = successText;
      if (showNext && next) {
        next.hidden = false;
        requestAnimationFrame(() => next.classList.add('is-visible'));
      }
      onComplete?.();
    }

    whisk.addEventListener('pointerdown', event => {
      if (complete || (event.pointerType === 'mouse' && event.button !== 0)) return;
      event.preventDefault();
      whisk.setPointerCapture(event.pointerId);
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY, left: whisk.offsetLeft, top: whisk.offsetTop };
      lastTime = performance.now();
      lastPoint = { x: event.clientX, y: event.clientY };
      lastInside = false;
      whisk.classList.add('is-dragging');
    });

    whisk.addEventListener('pointermove', event => {
      if (!drag || drag.id !== event.pointerId) return;
      const bounds = vessel.getBoundingClientRect();
      const localX = drag.left + event.clientX - drag.x;
      const localY = drag.top + event.clientY - drag.y;
      const maxX = Math.max(0, bounds.width - whisk.offsetWidth);
      const maxY = Math.max(0, bounds.height - whisk.offsetHeight);
      let nextLeft = Math.max(0, Math.min(maxX, localX));
      let nextTop = Math.max(0, Math.min(maxY, localY));
      whisk.style.left = `${nextLeft}px`;
      whisk.style.top = `${nextTop}px`;
      let whiskRect = whisk.querySelector('.cookbook-whisk-head').getBoundingClientRect();
      const isBowl = vessel.classList.contains('cookbook-bowl');
      const safeLeft = bounds.left + bounds.width * (isBowl ? .16 : .17);
      const safeRight = bounds.right - bounds.width * (isBowl ? .16 : .17);
      const safeTop = bounds.top + bounds.height * (isBowl ? .24 : .16);
      const correctedLeft = Math.max(0, safeLeft - whiskRect.left) + Math.min(0, safeRight - whiskRect.right);
      nextLeft += correctedLeft;
      whisk.style.left = `${nextLeft}px`;
      whiskRect = whisk.querySelector('.cookbook-whisk-head').getBoundingClientRect();
      let safeBottom = bounds.bottom - bounds.height * .12;
      if (isBowl) {
        const u = Math.max(.15, Math.min(.85, (whiskRect.left + whiskRect.width / 2 - bounds.left) / bounds.width));
        const curve = .75 + .22 * (1 - ((u - .5) / .35) ** 2);
        safeBottom = bounds.top + bounds.height * (curve - .08);
      }
      const correctedTop = Math.max(0, safeTop - whiskRect.top) + Math.min(0, safeBottom - whiskRect.bottom);
      nextTop += correctedTop;
      whisk.style.top = `${nextTop}px`;
      whisk.style.top = `${nextTop}px`;
      const targetBounds = target.getBoundingClientRect();
      let whiskBounds = whisk.querySelector('.cookbook-whisk-head').getBoundingClientRect();
      if (vessel.classList.contains('cookbook-pan')) {
        const insetX = targetBounds.width * .08;
        const insetY = targetBounds.height * .08;
        const clampHead = () => whisk.querySelector('.cookbook-whisk-head').getBoundingClientRect();
        let headBounds = clampHead();
        const panDx = Math.max(0, targetBounds.left + insetX - headBounds.left) + Math.min(0, targetBounds.right - insetX - headBounds.right);
        nextLeft += panDx;
        whisk.style.left = `${nextLeft}px`;
        headBounds = clampHead();
        const panDy = Math.max(0, targetBounds.top + insetY - headBounds.top) + Math.min(0, targetBounds.bottom - insetY - headBounds.bottom);
        nextTop += panDy;
        whisk.style.top = `${nextTop}px`;
        whiskBounds = clampHead();
      }
      const inside = whiskBounds.right > targetBounds.left + 4 && whiskBounds.left < targetBounds.right - 4 && whiskBounds.bottom > targetBounds.top + 4 && whiskBounds.top < targetBounds.bottom - 4;
      const now = performance.now();
      const moved = lastPoint && Math.hypot(event.clientX - lastPoint.x, event.clientY - lastPoint.y) > 1;
      if (inside && lastInside && moved) touchedMs += Math.min(120, now - lastTime);
      lastInside = inside;
      lastTime = now;
      lastPoint = { x: event.clientX, y: event.clientY };
      turns += Math.abs(event.movementX || 0) + Math.abs(event.movementY || 0);
      vessel.style.setProperty('--stir-turn', `${turns * .65}deg`);
      vessel.classList.toggle('is-mixing', inside);
      if (touchedMs >= duration) finish();
    });

    const release = event => {
      if (!drag || drag.id !== event.pointerId) return;
      if (whisk.hasPointerCapture(event.pointerId)) whisk.releasePointerCapture(event.pointerId);
      drag = null;
      lastInside = false;
      lastPoint = null;
      whisk.classList.remove('is-dragging');
      vessel.classList.remove('is-mixing');
    };
    whisk.addEventListener('pointerup', release);
    whisk.addEventListener('pointercancel', release);
  }

  function bindStepActivity() {
    const egg = rightPage.querySelector('.cookbook-egg');
    const sugarCup = rightPage.querySelector('.cookbook-sugar-cup');
    const activity = rightPage.querySelector('.cookbook-activity');
    const bowl = rightPage.querySelector('.cookbook-bowl');
    const fill = rightPage.querySelector('.cookbook-liquid-fill');
    const surface = rightPage.querySelector('.cookbook-liquid-surface');
    const yolks = rightPage.querySelector('.cookbook-yolks');
    const grains = rightPage.querySelector('.cookbook-sugar-grains');
    const whisk = rightPage.querySelector('.cookbook-whisk');
    const target = bowl.querySelector('.cookbook-mix-target');
    const status = rightPage.querySelector('.cookbook-activity-status');
    const stepNext = rightPage.querySelector('.cookbook-step-next');
    const svgNS = 'http://www.w3.org/2000/svg';

    const updateYolkLevel = () => {
      const surfaceY = 149 - eggCount * 9.5;
      fill.setAttribute('d', `M24 ${surfaceY}Q180 ${surfaceY - 12} 336 ${surfaceY}V220H24Z`);
      surface.setAttribute('d', `M24 ${surfaceY}Q96 ${surfaceY - 12} 165 ${surfaceY}T336 ${surfaceY}`);
      const yolk = document.createElementNS(svgNS, 'ellipse');
      yolk.setAttribute('cx', `${138 + Math.random() * 84}`);
      yolk.setAttribute('cy', `${surfaceY + 9 + Math.random() * 13}`);
      yolk.setAttribute('rx', `${13 + Math.random() * 6}`);
      yolk.setAttribute('ry', `${7 + Math.random() * 4}`);
      yolk.setAttribute('fill', '#f79f21');
      yolk.setAttribute('class', 'cookbook-yolk-blob');
      yolks.append(yolk);
    };

    egg.addEventListener('click', () => {
      if (eggCount >= 6 || egg.classList.contains('is-cracking')) return;
      egg.classList.add('is-cracking');
      egg.disabled = true;
      const activityRect = activity.getBoundingClientRect();
      const eggRect = egg.getBoundingClientRect();
      const bowlRect = bowl.getBoundingClientRect();
      const nextSurfaceY = 149 - (eggCount + 1) * 9.5;
      const drop = document.createElement('span');
      drop.className = 'cookbook-yolk-drop';
      drop.style.left = `${eggRect.left + eggRect.width / 2 - activityRect.left}px`;
      drop.style.top = `${eggRect.bottom - activityRect.top - 4}px`;
      drop.style.setProperty('--drop-distance', `${Math.max(25, bowlRect.top - activityRect.top + nextSurfaceY * bowlRect.height / 220 - (eggRect.bottom - activityRect.top))}px`);
      activity.append(drop);
      window.setTimeout(() => {
        drop.remove();
        eggCount += 1;
        updateYolkLevel();
        egg.classList.remove('is-cracking');
        if (eggCount < 6) {
          egg.setAttribute('aria-label', `Crack egg ${eggCount + 1} into the bowl`);
          egg.disabled = false;
        } else {
          egg.hidden = true;
          status.textContent = 'Now pour in the granulated sugar.';
          sugarCup.hidden = false;
        }
      }, reduceMotion.matches ? 0 : 520);
    });

    sugarCup.addEventListener('click', () => {
      if (sugarAdded) return;
      sugarAdded = true;
      sugarCup.classList.add('is-pouring');
      sugarCup.disabled = true;
      const activityRect = activity.getBoundingClientRect();
      const cupRect = sugarCup.getBoundingClientRect();
      const bowlRect = bowl.getBoundingClientRect();
      const surfaceY = 149 - eggCount * 9.5;
      const surfaceTop = bowlRect.top - activityRect.top + surfaceY * bowlRect.height / 220;
      for (let i = 0; i < 340; i++) {
        const grain = document.createElement('span');
        const startX = cupRect.left + cupRect.width * (.35 + Math.random() * .3) - activityRect.left;
        const endX = bowlRect.left + bowlRect.width * (.38 + Math.random() * .24) - activityRect.left;
        grain.className = 'cookbook-sugar-falling';
        grain.style.left = `${startX}px`;
        grain.style.top = `${cupRect.bottom - activityRect.top - 8}px`;
        grain.style.setProperty('--grain-dx', `${endX - startX + (Math.random() - .5) * 12}px`);
        grain.style.setProperty('--grain-distance', `${surfaceTop - (cupRect.bottom - activityRect.top) + Math.random() * 15}px`);
        grain.style.setProperty('--grain-delay', `${Math.random() * .72}s`);
        grain.style.setProperty('--grain-size', `${.65 + Math.random() * .8}px`);
        activity.append(grain);
        window.setTimeout(() => grain.remove(), reduceMotion.matches ? 0 : 1900);
      }
      sugarCup.classList.add('is-emptying');
      for (let i = 0; i < 460; i++) {
        const grain = document.createElementNS(svgNS, 'circle');
        grain.setAttribute('cx', `${139 + Math.random() * 82}`);
        grain.setAttribute('cy', `${surfaceY - 2 + Math.random() * 15}`);
        grain.setAttribute('r', `${.28 + Math.random() * .5}`);
        grain.setAttribute('class', 'cookbook-sugar-grain');
        grain.style.setProperty('--grain-delay', `${Math.random() * .72}s`);
        grains.append(grain);
      }
      window.setTimeout(() => {
        sugarCup.hidden = true;
        whisk.hidden = false;
        status.textContent = 'Drag the whisk through the mixture until it turns light and creamy.';
      }, reduceMotion.matches ? 0 : 1850);
    });

    bindWhiskMixing({ whisk, vessel: bowl, target, fill, surface, status, next: stepNext, duration: 5000, color: '#f3d66f', successText: 'Light, creamy, and ready!' });
    stepNext.addEventListener('click', () => flipTo('step2'), { once: true });
  }

  function bindStep2Activity() {
    const activity = rightPage.querySelector('.cookbook-step2-activity');
    const tools = [...activity.querySelectorAll('.cookbook-ingredient-tool')];
    const pan = activity.querySelector('.cookbook-pan');
    const liquid = activity.querySelector('.cookbook-pan-liquid');
    const spices = activity.querySelector('.cookbook-pan-spices');
    const whisk = activity.querySelector('.cookbook-pan-whisk');
    const target = pan.querySelector('.cookbook-mix-target');
    const status = activity.querySelector('.cookbook-activity-status');
    const next = activity.querySelector('.cookbook-step-next');
    let current = 0;
    let dairyAdded = 0;
    const svgNS = 'http://www.w3.org/2000/svg';
    const prompts = ['Click the milk to pour it into the pan.', 'Click the spoon to add ground nutmeg.', 'Click the shaker to add a pinch of salt.'];

    tools.forEach((tool, index) => tool.addEventListener('click', () => {
      if (index !== current || tool.classList.contains('is-pouring')) return;
      tool.classList.add('is-pouring');
      tool.disabled = true;
      const activityRect = activity.getBoundingClientRect();
      const toolRect = tool.getBoundingClientRect();
      const panRect = pan.getBoundingClientRect();
      const ingredientColor = index === 2 ? '#8c5d38' : '#fff9ec';
      for (let i = 0; i < (index < 2 ? 46 : index === 2 ? 30 : 0); i++) {
        const particle = document.createElement('span');
        const startX = toolRect.left + toolRect.width * (.3 + Math.random() * .4) - activityRect.left;
        const endX = panRect.left + panRect.width * (.37 + Math.random() * .26) - activityRect.left;
        particle.className = 'cookbook-pan-pour';
        particle.style.background = ingredientColor;
        particle.style.left = `${startX}px`;
        particle.style.top = `${toolRect.bottom - activityRect.top - 5}px`;
        particle.style.setProperty('--grain-dx', `${endX - startX + (Math.random() - .5) * 15}px`);
        particle.style.setProperty('--grain-distance', `${panRect.top - activityRect.top + panRect.height * (.36 + Math.random() * .18) - (toolRect.bottom - activityRect.top)}px`);
        particle.style.setProperty('--grain-delay', `${Math.random() * .38}s`);
        activity.append(particle);
        window.setTimeout(() => particle.remove(), reduceMotion.matches ? 0 : 1250);
      }
      if (index < 2) {
        dairyAdded += 1;
        liquid.setAttribute('r', dairyAdded === 1 ? '58' : '75');
      } else if (index === 2) {
        for (let i = 0; i < (index === 2 ? 38 : 26); i++) {
          const grain = document.createElementNS(svgNS, 'circle');
          grain.setAttribute('cx', `${98 + Math.random() * 64}`);
          grain.setAttribute('cy', `${94 + Math.random() * 58}`);
          grain.setAttribute('r', `${index === 2 ? 1 + Math.random() * 1.5 : .7 + Math.random()}`);
          grain.setAttribute('fill', ingredientColor);
          grain.setAttribute('class', 'cookbook-pan-spice');
          spices.append(grain);
        }
      }
      pan.classList.add('is-mixing');
      window.setTimeout(() => {
        tool.hidden = true;
        current += 1;
        pan.classList.remove('is-mixing');
        if (current < tools.length) {
          tools[current].hidden = false;
          status.textContent = prompts[current - 1];
        } else {
          whisk.hidden = false;
          status.textContent = 'Drag the whisk through the pan for a slow, steady stir.';
        }
      }, reduceMotion.matches ? 0 : 820);
    }));

    bindWhiskMixing({ whisk, vessel: pan, target, fill: liquid, status, next, duration: 8000, color: '#d7c59f', successText: 'The mixture has reached a bare simmer.' });
    next.addEventListener('click', () => flipTo('step3'), { once: true });
  }

  function bindStep3Activity() {
    const activity = rightPage.querySelector('.cookbook-temper-activity');
    const spoon = activity.querySelector('.cookbook-temper-spoon');
    const bowl = activity.querySelector('.cookbook-temper-bowl');
    const fill = activity.querySelector('.cookbook-temper-liquid');
    const surface = activity.querySelector('.cookbook-temper-surface');
    const status = activity.querySelector('.cookbook-activity-status');
    const next = activity.querySelector('.cookbook-step-next');
    const target = bowl.querySelector('.cookbook-mix-target');
    let rounds = 0;
    let pouring = false;

    function showWhisk() {
      const whisk = document.createElement('button');
      whisk.type = 'button';
      whisk.className = 'cookbook-whisk cookbook-temper-whisk';
      whisk.setAttribute('aria-label', `Drag the whisk through the egg mixture, round ${rounds + 1}`);
      whisk.innerHTML = '<img src="./assets/whisk-reference.png" alt="" draggable="false"><span class="cookbook-whisk-head" aria-hidden="true"></span>';
      bowl.append(whisk);
      bindWhiskMixing({
        whisk, vessel: bowl, target, fill, surface, status, next, duration: 3000, color: '#f0d982',
        successText: 'The mixture is tempered. Add the next spoonful.', showNext: false,
        onComplete: () => {
          rounds += 1;
          window.setTimeout(() => {
            whisk.remove();
            if (rounds >= 3) {
              fill.setAttribute('fill', '#e5cc80');
              fill.style.fill = '#e5cc80';
              surface.style.stroke = '#f3df9f';
              status.textContent = 'Three spoonfuls are whisked in. The eggs are tempered.';
              next.hidden = false;
              requestAnimationFrame(() => next.classList.add('is-visible'));
            } else {
              spoon.hidden = false;
              spoon.disabled = false;
              spoon.classList.remove('is-pouring');
              status.textContent = 'Click the spoon to add another spoonful.';
            }
          }, reduceMotion.matches ? 0 : 540);
        },
      });
    }

    spoon.addEventListener('click', () => {
      if (pouring || spoon.hidden) return;
      pouring = true;
      spoon.disabled = true;
      spoon.classList.add('is-pouring');
      status.textContent = 'Adding a spoonful…';
      window.setTimeout(() => {
        spoon.hidden = true;
        fill.setAttribute('d', `M24 ${92 - (rounds + 1) * 2}Q180 ${80 - (rounds + 1) * 2} 336 ${92 - (rounds + 1) * 2}V220H24Z`);
        surface.setAttribute('d', `M24 ${92 - (rounds + 1) * 2}Q96 ${80 - (rounds + 1) * 2} 165 ${92 - (rounds + 1) * 2}T336 ${92 - (rounds + 1) * 2}`);
        pouring = false;
        status.textContent = 'Drag the whisk through the bowl until it comes together.';
        showWhisk();
      }, reduceMotion.matches ? 0 : 1050);
    });

    next.addEventListener('click', () => flipTo('step4'), { once: true });
  }

  function bindStep4Activity() {
    const activity = rightPage.querySelector('.cookbook-return-activity');
    const bowl = activity.querySelector('.cookbook-return-bowl');
    const pan = activity.querySelector('.cookbook-return-pan');
    const liquid = activity.querySelector('.cookbook-return-liquid');
    const whisk = activity.querySelector('.cookbook-return-whisk');
    const target = pan.querySelector('.cookbook-mix-target');
    const status = activity.querySelector('.cookbook-activity-status');
    const next = activity.querySelector('.cookbook-step-next');
    let poured = false;

    bowl.addEventListener('click', () => {
      if (poured) return;
      poured = true;
      bowl.disabled = true;
      bowl.classList.add('is-pouring');
      status.textContent = 'Adding the tempered egg mixture to the saucepan…';
      window.setTimeout(() => {
        bowl.classList.add('is-emptied');
        const bowlLiquid = bowl.querySelector('.cookbook-return-bowl-liquid');
        if (bowlLiquid) bowlLiquid.style.opacity = '0';
        liquid.setAttribute('r', '79');
        liquid.style.fill = '#e9d9b8';
        liquid.setAttribute('fill', '#e9d9b8');
        whisk.hidden = false;
        status.textContent = 'Drag the whisk constantly until the mixture thickens slightly.';
      }, reduceMotion.matches ? 0 : 1450);
    });

    bindWhiskMixing({ whisk, vessel: pan, target, fill: liquid, status, next, duration: 8000, color: '#e6d6b7', successText: 'Just slightly thickened. Don’t overdo it!' });
    next.addEventListener('click', () => flipTo('step5'), { once: true });
  }

  function bindStep5Activity() {
    const activity = rightPage.querySelector('.cookbook-step5-activity');
    const pan = activity.querySelector('.cookbook-step5-pan');
    const pitcher = activity.querySelector('.cookbook-step5-pitcher');
    const pitcherLiquid = activity.querySelector('.cookbook-pitcher-liquid');
    const pitcherSurface = activity.querySelector('.cookbook-pitcher-surface');
    const vial = activity.querySelector('.cookbook-vanilla-vial');
    const bottle = activity.querySelector('.cookbook-jim-beam');
    const status = activity.querySelector('.cookbook-activity-status');
    const next = activity.querySelector('.cookbook-step-next');
    let panPoured = false;
    let vanillaAdded = false;

    pan.addEventListener('click', () => {
      if (panPoured) return;
      panPoured = true;
      pan.disabled = true;
      pan.classList.add('is-pouring');
      status.textContent = 'Adding the cooled mixture to the pitcher…';
      window.setTimeout(() => {
        pan.hidden = true;
        pitcherLiquid.setAttribute('d', 'M35 49H139V197H35Z');
        pitcherSurface.setAttribute('d', 'M35 49Q85 42 139 49');
        vial.hidden = false;
        status.textContent = 'Click the vanilla vial to add a drop.';
      }, reduceMotion.matches ? 0 : 1650);
    });

    vial.addEventListener('click', () => {
      if (vanillaAdded) return;
      vanillaAdded = true;
      vial.disabled = true;
      vial.classList.add('is-pouring');
      status.textContent = 'Adding the vanilla extract…';
      window.setTimeout(() => {
        vial.hidden = true;
        if (bourbonSelected) {
          bottle.hidden = false;
          status.textContent = 'Add in the bourbon';
        } else {
          status.textContent = 'The mixture is ready to be chilled.';
          next.hidden = false;
          requestAnimationFrame(() => next.classList.add('is-visible'));
        }
      }, reduceMotion.matches ? 0 : 740);
    });

    bottle.addEventListener('click', () => {
      if (!bourbonSelected || bottle.classList.contains('is-empty')) return;
      bottle.classList.add('is-empty');
      bottle.setAttribute('aria-disabled', 'true');
      status.textContent = 'Unfortunately, someone drank all the bourbon.\nFortunately, your boyfriend prefers it without the bourbon.';
      next.hidden = false;
      requestAnimationFrame(() => next.classList.add('is-visible'));
    });

    next.addEventListener('click', () => flipTo('step6'), { once: true });
  }

  function bindStep6Activity() {
    const activity = rightPage.querySelector('.cookbook-step6-activity');
    const heart = activity.querySelector('.cookbook-love-heart');
    const pitcher = activity.querySelector('.cookbook-serving-pitcher');
    const pitcherLiquid = activity.querySelector('.cookbook-serving-pitcher-liquid');
    const pitcherSurface = activity.querySelector('.cookbook-serving-pitcher-surface');
    const glass = activity.querySelector('.cookbook-serving-glass');
    const glassLiquid = activity.querySelector('.cookbook-serving-glass-liquid');
    const completionResult = activity.querySelector('.cookbook-completion-result');
    const finalGlass = activity.querySelector('.cookbook-final-glass');
    const finalMessage = activity.querySelector('.cookbook-final-message');
    let loveAdded = false;
    let served = false;

    heart.addEventListener('click', () => {
      if (loveAdded) return;
      loveAdded = true;
      heart.disabled = true;
      heart.classList.add('is-exploding');
      glass.hidden = false;
      glass.classList.add('is-appearing');
      pitcher.classList.add('has-love');
      pitcherLiquid.setAttribute('fill', '#eee1ca');
      pitcherSurface.setAttribute('stroke', '#f8efdf');
      for (let i = 0; i < 24; i++) {
        const piece = document.createElement('span');
        const angle = Math.random() * Math.PI * 2;
        const distance = 56 + Math.random() * 100;
        piece.className = 'cookbook-heart-fragment';
        piece.textContent = '♥';
        piece.style.setProperty('--heart-x', `${Math.cos(angle) * distance}px`);
        piece.style.setProperty('--heart-y', `${Math.sin(angle) * distance}px`);
        piece.style.setProperty('--heart-delay', `${Math.random() * 90}ms`);
        heart.append(piece);
      }
      window.setTimeout(() => { heart.hidden = true; }, reduceMotion.matches ? 0 : 720);
      pitcher.disabled = false;
    });

    pitcher.addEventListener('click', () => {
      if (!loveAdded || served) return;
      served = true;
      pitcher.disabled = true;
      pitcher.classList.add('is-serving');
      glass.classList.add('is-filling');
      pitcherLiquid.setAttribute('d', 'M35 190H139V197H35Z');
      pitcherSurface.setAttribute('d', 'M35 190Q85 184 139 190');
      glassLiquid.setAttribute('d', 'M18 67H102V142H18Z');
      window.setTimeout(() => {
        pitcher.hidden = true;
        glass.hidden = true;
        completionResult.hidden = false;
        finalGlass.classList.add('is-revealed');
        finalMessage.classList.add('is-visible');
        activity.classList.add('is-complete');
      }, reduceMotion.matches ? 0 : 1200);
    });
  }

  cover.addEventListener('click', startOpen);

  return {
    element,
    captureButton: camera.captureButton,
    show() {
      element.hidden = false;
      camera.captureButton.hidden = false;
      camera.show();
      if (phase === 'cover') {
        cover.hidden = false;
        spread.classList.remove('is-opening');
        spread.hidden = true;
      }
    },
    stop: camera.stop,
    hide() {
      camera.hide();
      element.hidden = true;
      camera.captureButton.hidden = true;
      window.clearTimeout(coverTimer);
    },
  };
}
