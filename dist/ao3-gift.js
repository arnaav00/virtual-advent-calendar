import { playlistCard } from './playlist-gift.js';

const titleUrl = 'https://docs.google.com/document/d/10wQ6nA14eJit4HrIg25rZRksiitk3kSHO0zi4bp5RgY/edit?usp=sharing';
const tags = `No Archive Warnings, Arnaav Anand, Devangshi Debraj, Arnaav & Devangshi, Romance, Comedy, High Fantasy, Medieval Setting, Self-Insert, Swordplay, Banter, Two Knights on a Quest, Trolls, Goblins, Elves, Pegolas, Bannister/Stairwell, Sibling Rivalry, Betrayal, Happily Ever After, Slow Burn, Opposites Attract, Teasing as a Love Language, British Absurdism, Grumpy/Sunshine, Competent Woman / Bumbling Man, Diplomatic Relations, Verbal Jousting, Lute Playing, Woman in STEM (Swordplay, Tactics, Everything Medieval), Oblivious Idiots in Love, Gender Equality in the Workplace, Unconventional Negotiation Tactics, Arnaav Being Arnaav, Unwanted Marriage Proposals, Weaponised Pedantry, Garlic Bread, Extremely Unqualified Men in Positions of Authority, The Rich Eat Rich, devangshi is such a girlboss, please let arnaav finish his ballad, no dragons were harmed in the making of this quest`;

export function ao3Card() {
  const day = 17;
  const card = document.createElement('section');
  card.className = 'ao3-card';
  card.hidden = true;
  card.setAttribute('aria-label', 'Love At First Knight by Arnaav Anand');
  const camera = playlistCard(day);
  camera.element.remove();
  camera.captureButton.setAttribute('aria-label', 'Capture your reaction');
  camera.reactionDialog.setAttribute('aria-label', `Gift #${day} photo capture`);
  card.innerHTML = `<div class="ao3-heading">
    <img class="ao3-rating" src="./assets/gift17-collected.png" alt="Teen rating, F/M, no archive warning, complete">
    <div class="ao3-title-line"><div class="ao3-work-title"><a href="${titleUrl}" target="_blank" rel="noopener noreferrer">Love At First Knight</a> <span>by </span><span class="ao3-author">Arnaav Anand</span></div><time datetime="2026-12-17">17 Dec 2026</time></div>
    <div class="ao3-fandom">Our Stories</div>
  </div>
  <div class="ao3-tags">${tags.split(', ').map(tag => `<span>${tag}</span>`).join(', ')}</div>
  <p class="ao3-summary">Devangshi is Thimbledown's hardest working knight in a time of presumed peace. She finally catches a break with a real quest to prove the mettle of a female knight, but is unfortunately paired with a man by the name of Arnaav. Together, they embark on a wild adventure that determines the fate of their kingdom and all the lands between. A rom-com for the ages.</p>
  <div class="ao3-stats"><span>Language: <u>English</u></span><span>Words: <u>21990</u></span><span>Chapters: <u>5/5</u></span><span>Collections: <u>1</u></span><span>Comments: <u>?</u></span><span>Kudos: <u>67</u></span><span>Bookmarks: <u>1</u></span><span>Hits: <u>2</u></span></div>`;
  return {
    element: card,
    captureButton: camera.captureButton,
    show() { card.hidden = false; void camera.show(); },
    hide() { card.hidden = true; camera.hide(); },
    stop() { camera.stop(); }
  };
}
