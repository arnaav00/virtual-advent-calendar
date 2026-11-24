import { acceptTerms, giftProgressExists, termsWereAccepted } from './gift-state.js';

export async function requireTermsAgreement() {
  if (giftProgressExists() || termsWereAccepted()) return;
  const dialog = document.createElement('dialog');
  dialog.className = 'terms-agreement';
  dialog.setAttribute('aria-labelledby', 'terms-title');
  dialog.innerHTML = `
    <section class="terms-agreement-content">
      <h1 id="terms-title">Welcome to Devangshi's Winter Wonderland!</h1>
      <div class="terms-checklist-group">
        <p class="terms-intro">As Devangshi, you must agree to the following Terms &amp; Conditions:</p>
        <div class="terms-list">
          <label class="terms-item"><input type="checkbox"><span class="terms-checkbox" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="M3.2 10.1 C4.4 10.5 6.5 13.8 8.2 15 C10.5 12.5 12.1 8 16.9 4"/></svg></span><span class="terms-text">I will, to the best of my ability, open every gift in order on their respective day.</span></label>
          <label class="terms-item"><input type="checkbox"><span class="terms-checkbox" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="M3.2 10.1 C4.4 10.5 6.5 13.8 8.2 15 C10.5 12.5 12.1 8 16.9 4"/></svg></span><span class="terms-text">I will remember to capture my reaction to every gift using the web app's photo capture.</span></label>
          <label class="terms-item"><input type="checkbox"><span class="terms-checkbox" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="M3.2 10.1 C4.4 10.5 6.5 13.8 8.2 15 C10.5 12.5 12.1 8 16.9 4"/></svg></span><span class="terms-text">I consent to any image of mine being saved in my boyfriend's gallery.</span></label>
          <label class="terms-item"><input type="checkbox"><span class="terms-checkbox" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="M3.2 10.1 C4.4 10.5 6.5 13.8 8.2 15 C10.5 12.5 12.1 8 16.9 4"/></svg></span><span class="terms-text">I absolutely will not feel guilty about anything at any point regarding this Advent Calendar.</span></label>
          <label class="terms-item"><input type="checkbox"><span class="terms-checkbox" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="M3.2 10.1 C4.4 10.5 6.5 13.8 8.2 15 C10.5 12.5 12.1 8 16.9 4"/></svg></span><span class="terms-text">I will wholeheartedly embrace the spirit of Christmas, separating the religion from the festivities.</span></label>
          <label class="terms-item"><input type="checkbox"><span class="terms-checkbox" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="M3.2 10.1 C4.4 10.5 6.5 13.8 8.2 15 C10.5 12.5 12.1 8 16.9 4"/></svg></span><span class="terms-text">I will, by Christmas day, provide my boyfriend with a video recording of my rendition of &quot;Jingle Bells&quot; performed in meow.</span></label>
        </div>
      </div>
      <footer class="terms-footer"><p class="terms-warning">Violation of these Terms &amp; Conditions might break something in code or make your boyfriend very, very sad.</p>
      <button class="terms-enter" type="button" disabled>ENTER</button></footer>
    </section>`;
  document.body.append(dialog);
  const boxes = [...dialog.querySelectorAll('.terms-item input')];
  const enter = dialog.querySelector('.terms-enter');
  const update = () => { enter.disabled = !boxes.every(box => box.checked); };
  boxes.forEach(box => box.addEventListener('change', () => {
    box.closest('.terms-item').classList.toggle('is-checked', box.checked);
    update();
  }));
  dialog.addEventListener('cancel', event => event.preventDefault());
  enter.addEventListener('click', async () => {
    if (enter.disabled) return;
    enter.disabled = true;
    enter.classList.add('is-entering');
    try { await acceptTerms(); }
    catch (error) { console.warn('[Terms] Could not save acceptance to Firebase:', error.message); }
    dialog.close();
    dialog.remove();
  });
  dialog.showModal();
  boxes[0].focus({ preventScroll: true });
  await new Promise(resolve => dialog.addEventListener('close', resolve, { once: true }));
}
