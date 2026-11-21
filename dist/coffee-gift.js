import { playlistCard } from './playlist-gift.js';

export function coffeeCard() {
  const element = document.createElement('section');
  element.className = 'coffee-gift';
  element.hidden = true;
  element.setAttribute('aria-label', 'Gift #13 coffee questions');
  element.innerHTML = `
    <div class="coffee-content">
      <div class="coffee-question-area" aria-live="polite"></div>
      <div class="coffee-choices"></div>
    </div>`;

  const camera = playlistCard(13);
  camera.element.remove();
  camera.captureButton.setAttribute('aria-label', 'Capture your reaction');
  camera.captureButton.dataset.tooltip = 'Capture your reaction';
  camera.reactionDialog.setAttribute('aria-label', 'Gift #13 photo capture');
  document.body.append(camera.reactionDialog);

  const questionArea = element.querySelector('.coffee-question-area');
  const choices = element.querySelector('.coffee-choices');
  const prompt = text => `<p class="coffee-copy coffee-question">${text}</p>`;

  function finish(tooBad = false) {
    questionArea.innerHTML = `<p class="coffee-copy coffee-final-heading">${tooBad ? 'Too bad! Here\'s a Starbucks gift card.' : 'Splendid! Here\'s a Starbucks gift card just for you.'}</p>
      <div class="coffee-card-bevel"><img class="coffee-card-image" src="./assets/starbucks-gift-card.png" alt="Starbucks Coffee Company gift card"></div>
      <p class="coffee-copy coffee-final-note">${tooBad ? 'Get yourself something nice, if you change your mind.<br>Or, treat someone :)' : 'Keep an eye on your inbox. It should arrive momentarily.<br>Get yourself something nice :)'}</p>`;
    choices.replaceChildren();
    questionArea.classList.remove('coffee-enter');
    requestAnimationFrame(() => questionArea.classList.add('coffee-enter'));
  }

  function renderQuestion(number) {
    let text;
    let options;
    switch (number) {
      case 1:
        text = 'Do you like coffee?';
        options = [['Yes', () => renderQuestion(2)], ['No', () => renderQuestion(3)]];
        break;
      case 2:
        text = 'Do you really really like coffee?';
        options = [['Yes', () => renderQuestion(4)], ['No', () => renderQuestion(5)]];
        break;
      case 3:
        text = 'What nonsense. You have it like, every day. I shall ask again: Do you like coffee?';
        options = [['Yes', () => renderQuestion(2)], ['No', () => renderQuestion(3)]];
        break;
      case 4:
        text = 'Do you really really really like coffee?';
        options = [['Yes', () => renderQuestion(6)], ['No', () => renderQuestion(5)]];
        break;
      case 5:
        text = 'That\'s fair, you don\'t like it <i>that</i> much. Would you like some coffee?';
        options = [['Yes', () => renderQuestion(8)], ['Yes', () => renderQuestion(8)]];
        break;
      case 6:
        text = 'Oh, wow. Didn\'t know you liked it that much. Do you really really really really like coffee? Consider the number of really\'s.';
        options = [['Yes', () => renderQuestion(7)], ['No', () => renderQuestion(5)]];
        break;
      case 7:
        text = 'Well, alrighty then, coffee lover. Would you like some coffee?';
        options = [['Yes', () => renderQuestion(8)], ['Yes', () => renderQuestion(8)]];
        break;
      case 8:
        text = 'Is Starbucks okay?';
        options = [['Yes', () => finish(false)], ['No', () => renderQuestion(9)]];
        break;
      case 9:
        text = 'Come on, Starbucks is decent. They have other options besides coffee if you\'d like. So, is Starbucks okay?';
        options = [['Fine, I guess', () => finish(false)], ['Nah', () => finish(true)]];
        break;
    }

    questionArea.innerHTML = prompt(text);
    choices.replaceChildren(...options.map(([label, action]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'coffee-choice';
      button.textContent = label;
      button.addEventListener('click', action, { once: true });
      return button;
    }));
    questionArea.classList.remove('coffee-enter');
    requestAnimationFrame(() => questionArea.classList.add('coffee-enter'));
  }

  return {
    element,
    captureButton: camera.captureButton,
    show() {
      element.hidden = false;
      camera.captureButton.hidden = false;
      camera.show();
      renderQuestion(1);
    },
    stop: camera.stop,
    hide() {
      camera.hide();
      element.hidden = true;
      camera.captureButton.hidden = true;
      questionArea.replaceChildren();
      choices.replaceChildren();
      questionArea.classList.remove('coffee-enter');
    },
  };
}
