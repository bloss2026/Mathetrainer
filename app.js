import { generateSingleTask } from './mathe.js';

const CATEGORIES = [
  'Alle Themen',
  'Kopfrechnen',
  'Terme',
  'Brüche',
  'Potenzen & Wurzeln',
  'Flächen & Volumen',
  'Prozent & Zinsen',
  'Lineare Funktionen',
  'Pythagoras',
  'Wahrscheinlichkeit'
];

const STATS_KEY = 'mathe9-stats';

let state = {
  selectedCategory: 'Alle Themen',
  currentTask: generateSingleTask('Alle Themen'),
  userInput: '',
  selectedOption: null,
  isEvaluated: false,
  isCorrect: false,
  stats: loadStats()
};

function loadStats() {
  try {
    return JSON.parse(localStorage.getItem(STATS_KEY)) || { solved: 0, correct: 0 };
  } catch (e) {
    return { solved: 0, correct: 0 };
  }
}

function saveStats(stats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    // Storage-Fehler ignorieren
  }
}

function normalize(val) {
  return String(val).trim().toLowerCase().replace(',', '.').replace(/\s+/g, '');
}

/**
 * Erzeugt ein DocumentFragment mit formatierten Brüchen und Text.
 */
function createMathFragment(text) {
  const frag = document.createDocumentFragment();
  if (!text) return frag;

  const wrapper = document.createElement('span');
  wrapper.className = 'math-text';

  const parts = String(text).split(/(-?\d+[a-zA-Z]*\/\d+[a-zA-Z]*)/g);
  for (const part of parts) {
    if (!part) continue;
    const match = part.match(/^(-?)(\d+[a-zA-Z]*)\/(\d+[a-zA-Z]*)$/);
    if (match) {
      const [, sign, numerator, denominator] = match;
      if (sign) {
        const signEl = document.createElement('span');
        signEl.className = 'frac-sign';
        signEl.textContent = sign;
        wrapper.appendChild(signEl);
      }
      const fracEl = document.createElement('span');
      fracEl.className = 'fraction';

      const numEl = document.createElement('span');
      numEl.className = 'frac-num';
      numEl.textContent = numerator;

      const denEl = document.createElement('span');
      denEl.className = 'frac-den';
      denEl.textContent = denominator;

      fracEl.appendChild(numEl);
      fracEl.appendChild(denEl);
      wrapper.appendChild(fracEl);
    } else {
      wrapper.appendChild(document.createTextNode(part));
    }
  }

  frag.appendChild(wrapper);
  return frag;
}

function resetQuestionState() {
  state.userInput = '';
  state.selectedOption = null;
  state.isEvaluated = false;
  state.isCorrect = false;
}

function handleCategoryChange(cat) {
  state.selectedCategory = cat;
  resetQuestionState();
  state.currentTask = generateSingleTask(cat);
  render();
}

function handleNextTask() {
  resetQuestionState();
  state.currentTask = generateSingleTask(state.selectedCategory);
  render();
}

function handleResetStats() {
  state.stats = { solved: 0, correct: 0 };
  saveStats(state.stats);
  render();
}

function checkAnswer(e) {
  if (e) e.preventDefault();
  const task = state.currentTask;
  if (state.isEvaluated || !task) return;

  let correctFlag = false;
  if (task.type === 'multiple-choice') {
    if (state.selectedOption === null) return;
    correctFlag = state.selectedOption === task.correct;
  } else {
    if (!state.userInput.trim()) return;
    correctFlag = normalize(state.userInput) === normalize(task.answer);
  }

  state.isCorrect = correctFlag;
  state.isEvaluated = true;
  state.stats = {
    solved: state.stats.solved + 1,
    correct: state.stats.correct + (correctFlag ? 1 : 0)
  };
  saveStats(state.stats);
  render();
}

function render() {
  const root = document.getElementById('root');
  if (!root) return;

  const activeInput = document.activeElement;
  const hadInputFocus = activeInput && activeInput.classList.contains('text-input');
  const selectionStart = hadInputFocus ? activeInput.selectionStart : null;
  const selectionEnd = hadInputFocus ? activeInput.selectionEnd : null;

  const quote = state.stats.solved > 0
    ? Math.round((state.stats.correct / state.stats.solved) * 100)
    : 0;

  const container = document.createElement('div');
  container.className = 'container';

  // --- Header ---
  const header = document.createElement('header');
  header.className = 'top-bar';

  const titleWrap = document.createElement('div');
  const h1 = document.createElement('h1');
  h1.textContent = 'Mathe-Trainer 9. Klasse';
  const subtitle = document.createElement('p');
  subtitle.className = 'subtitle';
  subtitle.textContent = 'Echter Live-Zufallsgenerator';
  titleWrap.appendChild(h1);
  titleWrap.appendChild(subtitle);

  const statsBox = document.createElement('div');
  statsBox.className = 'stats-box';

  const solvedSpan = document.createElement('span');
  solvedSpan.innerHTML = `Gelöst: <strong>${state.stats.solved}</strong>`;

  const correctSpan = document.createElement('span');
  correctSpan.innerHTML = `Richtig: <strong>${state.stats.correct} (${quote}%)</strong>`;

  const resetBtn = document.createElement('button');
  resetBtn.type = 'button';
  resetBtn.className = 'btn-small';
  resetBtn.title = 'Statistik zurücksetzen';
  resetBtn.textContent = '↺';
  resetBtn.addEventListener('click', handleResetStats);

  statsBox.appendChild(solvedSpan);
  statsBox.appendChild(correctSpan);
  statsBox.appendChild(resetBtn);

  header.appendChild(titleWrap);
  header.appendChild(statsBox);
  container.appendChild(header);

  // --- Kategorie-Tabs ---
  const nav = document.createElement('nav');
  nav.className = 'category-tabs';

  for (const cat of CATEGORIES) {
    const tabBtn = document.createElement('button');
    tabBtn.type = 'button';
    tabBtn.className = `tab-btn ${state.selectedCategory === cat ? 'active' : ''}`;
    tabBtn.textContent = cat;
    tabBtn.addEventListener('click', () => handleCategoryChange(cat));
    nav.appendChild(tabBtn);
  }
  container.appendChild(nav);

  // --- Aufgaben-Karte ---
  const task = state.currentTask;
  if (task) {
    const main = document.createElement('main');
    main.className = 'card';

    const meta = document.createElement('div');
    meta.className = 'card-meta';

    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = task.category;

    const counter = document.createElement('span');
    counter.className = 'counter';
    counter.textContent = `Aufgabe #${state.stats.solved + (state.isEvaluated ? 0 : 1)}`;

    meta.appendChild(badge);
    meta.appendChild(counter);
    main.appendChild(meta);

    const questionEl = document.createElement('h2');
    questionEl.className = 'question';
    questionEl.appendChild(createMathFragment(task.question));
    main.appendChild(questionEl);

    const form = document.createElement('form');
    form.addEventListener('submit', checkAnswer);

    if (task.type === 'multiple-choice') {
      const ul = document.createElement('ul');
      ul.className = 'mc-list';

      task.options.forEach((opt, idx) => {
        let stateClass = '';
        if (state.isEvaluated) {
          if (idx === task.correct) stateClass = 'correct';
          else if (idx === state.selectedOption) stateClass = 'wrong';
        } else if (idx === state.selectedOption) {
          stateClass = 'selected';
        }

        const li = document.createElement('li');
        li.className = `mc-item ${stateClass}`;
        li.appendChild(createMathFragment(opt));

        if (!state.isEvaluated) {
          li.addEventListener('click', () => {
            state.selectedOption = idx;
            render();
          });
        }

        ul.appendChild(li);
      });

      form.appendChild(ul);
    } else {
      const inputGroup = document.createElement('div');
      inputGroup.className = 'input-group';

      const input = document.createElement('input');
      input.type = 'text';
      input.className = `text-input ${
        state.isEvaluated ? (state.isCorrect ? 'input-correct' : 'input-wrong') : ''
      }`;
      input.placeholder = 'Deine Antwort eingeben...';
      input.value = state.userInput;
      input.disabled = state.isEvaluated;
      input.addEventListener('input', (e) => {
        state.userInput = e.target.value;
        updateFractionPreview(inputGroup, state.userInput);
        updateSubmitButtonState(form);
      });

      inputGroup.appendChild(input);
      updateFractionPreview(inputGroup, state.userInput);
      form.appendChild(inputGroup);
    }

    // --- Feedback ---
    if (state.isEvaluated) {
      const fb = document.createElement('div');
      fb.className = `feedback ${state.isCorrect ? 'fb-success' : 'fb-error'}`;

      const strong = document.createElement('strong');
      strong.textContent = state.isCorrect ? '✅ Richtig!' : '❌ Leider falsch.';
      fb.appendChild(strong);

      if (!state.isCorrect && task.type === 'input') {
        const solP = document.createElement('p');
        solP.appendChild(document.createTextNode('Richtige Lösung: '));
        const solStrong = document.createElement('strong');
        solStrong.appendChild(createMathFragment(task.answer));
        solP.appendChild(solStrong);
        fb.appendChild(solP);
      }

      const expP = document.createElement('p');
      expP.className = 'explanation';
      expP.appendChild(createMathFragment(task.explanation));
      fb.appendChild(expP);

      form.appendChild(fb);
    }

    // --- Aktions-Buttons ---
    const actions = document.createElement('div');
    actions.className = 'actions';

    if (!state.isEvaluated) {
      const submitBtn = document.createElement('button');
      submitBtn.type = 'submit';
      submitBtn.className = 'btn btn-primary';
      submitBtn.textContent = 'Antwort prüfen';
      submitBtn.disabled = task.type === 'multiple-choice'
        ? state.selectedOption === null
        : !state.userInput.trim();

      const skipBtn = document.createElement('button');
      skipBtn.type = 'button';
      skipBtn.className = 'btn btn-secondary';
      skipBtn.textContent = 'Überspringen ↻';
      skipBtn.addEventListener('click', handleNextTask);

      actions.appendChild(submitBtn);
      actions.appendChild(skipBtn);
    } else {
      const nextBtn = document.createElement('button');
      nextBtn.type = 'button';
      nextBtn.className = 'btn btn-success';
      nextBtn.textContent = 'Nächste Aufgabe →';
      nextBtn.addEventListener('click', handleNextTask);

      actions.appendChild(nextBtn);
    }

    form.appendChild(actions);
    main.appendChild(form);
    container.appendChild(main);
  }

  root.replaceChildren(container);

  // Fokus bei Texteingaben sauber erhalten
  const newInput = root.querySelector('.text-input');
  if (newInput && !newInput.disabled && (hadInputFocus || !state.isEvaluated)) {
    newInput.focus();
    if (hadInputFocus && selectionStart !== null && selectionEnd !== null) {
      newInput.setSelectionRange(selectionStart, selectionEnd);
    }
  }
}

function updateFractionPreview(inputGroup, currentVal) {
  const existing = inputGroup.querySelector('.fraction-preview');
  if (existing) existing.remove();

  if (currentVal && currentVal.includes('/')) {
    const preview = document.createElement('div');
    preview.className = 'fraction-preview';
    preview.appendChild(document.createTextNode('Vorschau: '));
    preview.appendChild(createMathFragment(currentVal));
    inputGroup.appendChild(preview);
  }
}

function updateSubmitButtonState(form) {
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn && state.currentTask?.type === 'input') {
    submitBtn.disabled = !state.userInput.trim();
  }
}

render();
