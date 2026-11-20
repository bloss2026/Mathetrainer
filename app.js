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

const TOPICS_ONLY = CATEGORIES.filter((c) => c !== 'Alle Themen');
const EXAM_COUNTS = [5, 10, 15, 20];
const STATS_KEY = 'mathe9-stats-v2';

function createEmptyStats() {
  const byTopic = {};
  for (const topic of TOPICS_ONLY) {
    byTopic[topic] = { solved: 0, correct: 0, wrong: 0 };
  }
  return {
    solved: 0,
    correct: 0,
    wrong: 0,
    byTopic,
    mistakes: [] // { id, category, question, type, options, correctOption, answer, userAnswer, explanation, timestamp }
  };
}

function loadStats() {
  const base = createEmptyStats();
  try {
    const raw = JSON.parse(localStorage.getItem(STATS_KEY));
    if (!raw) return base;

    const byTopic = { ...base.byTopic };
    if (raw.byTopic && typeof raw.byTopic === 'object') {
      for (const topic of TOPICS_ONLY) {
        if (raw.byTopic[topic]) {
          byTopic[topic] = {
            solved: Number(raw.byTopic[topic].solved) || 0,
            correct: Number(raw.byTopic[topic].correct) || 0,
            wrong: Number(raw.byTopic[topic].wrong) || 0
          };
        }
      }
    }

    const solved = Number(raw.solved) || 0;
    const correct = Number(raw.correct) || 0;
    const wrong = typeof raw.wrong === 'number' ? raw.wrong : Math.max(0, solved - correct);

    return {
      solved,
      correct,
      wrong,
      byTopic,
      mistakes: Array.isArray(raw.mistakes) ? raw.mistakes.slice(0, 50) : []
    };
  } catch (e) {
    return base;
  }
}

function saveStats(stats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    // Storage-Fehler ignorieren
  }
}

let state = {
  mode: 'practice', // 'practice' | 'exam' | 'progress'
  selectedCategory: 'Alle Themen',
  // Übungsmodus
  currentTask: generateSingleTask('Alle Themen'),
  userInput: '',
  selectedOption: null,
  isEvaluated: false,
  isCorrect: false,
  isRetryTask: false,
  stats: loadStats(),
  // Lernkontrolle
  examCount: 10,
  examStatus: 'setup', // 'setup' | 'running' | 'finished'
  examTasks: [],
  examAnswers: [],
  examIndex: 0
};

function normalize(val) {
  return String(val ?? '').trim().toLowerCase().replace(',', '.').replace(/\s+/g, '');
}

function isTaskAnswerCorrect(task, answer) {
  if (!task || answer === null || answer === undefined) return false;
  if (task.type === 'multiple-choice') {
    return answer === task.correct;
  }
  if (!String(answer).trim()) return false;
  return normalize(answer) === normalize(task.answer);
}

function formatUserAnswer(task, answer) {
  if (answer === null || answer === undefined || String(answer).trim() === '') {
    return 'Keine Antwort';
  }
  if (task.type === 'multiple-choice') {
    return task.options[answer] ?? 'Keine Antwort';
  }
  return String(answer).trim();
}

function formatCorrectAnswer(task) {
  if (task.type === 'multiple-choice') {
    return task.options[task.correct];
  }
  return task.answer;
}

function recordTaskResult(task, userAnswer, isCorrect) {
  const topic = TOPICS_ONLY.includes(task.category) ? task.category : 'Kopfrechnen';
  const prevTopic = state.stats.byTopic[topic] || { solved: 0, correct: 0, wrong: 0 };

  const updatedTopic = {
    solved: prevTopic.solved + 1,
    correct: prevTopic.correct + (isCorrect ? 1 : 0),
    wrong: prevTopic.wrong + (isCorrect ? 0 : 1)
  };

  let updatedMistakes = [...state.stats.mistakes];

  if (!isCorrect) {
    const mistakeEntry = {
      id: task.id || ('m-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6)),
      category: topic,
      question: task.question,
      type: task.type,
      options: task.options ? [...task.options] : undefined,
      correct: task.correct,
      answer: task.answer,
      userAnswer: formatUserAnswer(task, userAnswer),
      explanation: task.explanation,
      timestamp: Date.now()
    };
    // Gleiche Frage ggf. aktualisieren, sonst oben einfügen (max. 40)
    updatedMistakes = [
      mistakeEntry,
      ...updatedMistakes.filter((m) => m.question !== task.question)
    ].slice(0, 40);
  } else {
    // Wenn eine zuvor falsche Aufgabe nun richtig gelöst wurde, aus Fehlerliste entfernen
    updatedMistakes = updatedMistakes.filter((m) => m.question !== task.question);
  }

  state.stats = {
    solved: state.stats.solved + 1,
    correct: state.stats.correct + (isCorrect ? 1 : 0),
    wrong: state.stats.wrong + (isCorrect ? 0 : 1),
    byTopic: {
      ...state.stats.byTopic,
      [topic]: updatedTopic
    },
    mistakes: updatedMistakes
  };

  saveStats(state.stats);
}

function calculateGrade(percent) {
  if (percent >= 92) return { grade: '1', label: 'Sehr gut' };
  if (percent >= 81) return { grade: '2', label: 'Gut' };
  if (percent >= 67) return { grade: '3', label: 'Befriedigend' };
  if (percent >= 50) return { grade: '4', label: 'Ausreichend' };
  if (percent >= 30) return { grade: '5', label: 'Mangelhaft' };
  return { grade: '6', label: 'Ungenügend' };
}

/**
 * Erzeugt ein DocumentFragment mit formatierten Brüchen, Hochzahlen (Potenzen) und Text.
 */
function createMathFragment(text) {
  const frag = document.createDocumentFragment();
  if (!text) return frag;

  const wrapper = document.createElement('span');
  wrapper.className = 'math-text';

  const fracParts = String(text).split(/(-?\d+[a-zA-Z]*\/\d+[a-zA-Z]*)/g);

  for (const part of fracParts) {
    if (!part) continue;

    const fracMatch = part.match(/^(-?)(\d+[a-zA-Z]*)\/(\d+[a-zA-Z]*)$/);
    if (fracMatch) {
      const [, sign, numerator, denominator] = fracMatch;
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
      continue;
    }

    const powerParts = part.split(/(\([^()]+\)\^(?:\([^\)]+\)|[a-zA-Z0-9+-]+)|[a-zA-Z0-9]+\^(?:\([^\)]+\)|[a-zA-Z0-9+-]+)|[a-zA-Z0-9]+[²³])/g);

    for (const pPart of powerParts) {
      if (!pPart) continue;

      const caretMatch = pPart.match(/^(.+?)\^\(?([a-zA-Z0-9+-]+)\)?$/);
      if (caretMatch) {
        const [, base, exp] = caretMatch;
        const baseEl = document.createElement('span');
        baseEl.textContent = base;

        const supEl = document.createElement('sup');
        supEl.className = 'math-sup';
        supEl.textContent = exp;

        wrapper.appendChild(baseEl);
        wrapper.appendChild(supEl);
        continue;
      }

      const unicodeSupMatch = pPart.match(/^(.+?)([²³])$/);
      if (unicodeSupMatch) {
        const [, base, supChar] = unicodeSupMatch;
        const baseEl = document.createElement('span');
        baseEl.textContent = base;

        const supEl = document.createElement('sup');
        supEl.className = 'math-sup';
        supEl.textContent = supChar === '²' ? '2' : '3';

        wrapper.appendChild(baseEl);
        wrapper.appendChild(supEl);
        continue;
      }

      wrapper.appendChild(document.createTextNode(pPart));
    }
  }

  frag.appendChild(wrapper);
  return frag;
}

// =========================================================================
// ÜBUNGSMODUS-LOGIK
// =========================================================================

function resetQuestionState() {
  state.userInput = '';
  state.selectedOption = null;
  state.isEvaluated = false;
  state.isCorrect = false;
  state.isRetryTask = false;
}

function handleModeSwitch(newMode) {
  if (state.mode === newMode) return;
  state.mode = newMode;
  if (newMode === 'exam' && state.examStatus !== 'running') {
    state.examStatus = 'setup';
  }
  render();
}

function handleCategoryChange(cat) {
  state.selectedCategory = cat;
  if (state.mode === 'practice') {
    resetQuestionState();
    state.currentTask = generateSingleTask(cat);
  }
  render();
}

function handleNextTask() {
  resetQuestionState();
  state.currentTask = generateSingleTask(state.selectedCategory);
  render();
}

function practiceMistakeTask(mistake) {
  state.mode = 'practice';
  state.selectedCategory = mistake.category || 'Alle Themen';
  resetQuestionState();
  state.isRetryTask = true;
  state.currentTask = {
    id: mistake.id,
    category: mistake.category,
    question: mistake.question,
    type: mistake.type,
    options: mistake.options ? [...mistake.options] : undefined,
    correct: mistake.correct,
    answer: mistake.answer,
    explanation: mistake.explanation
  };
  render();
}

function removeMistake(mistakeId) {
  state.stats = {
    ...state.stats,
    mistakes: state.stats.mistakes.filter((m) => m.id !== mistakeId)
  };
  saveStats(state.stats);
  render();
}

function handleResetStats() {
  state.stats = createEmptyStats();
  saveStats(state.stats);
  render();
}

function checkAnswer(e) {
  if (e) e.preventDefault();
  const task = state.currentTask;
  if (state.isEvaluated || !task) return;

  let correctFlag = false;
  let givenAnswer = null;

  if (task.type === 'multiple-choice') {
    if (state.selectedOption === null) return;
    givenAnswer = state.selectedOption;
    correctFlag = state.selectedOption === task.correct;
  } else {
    if (!state.userInput.trim()) return;
    givenAnswer = state.userInput;
    correctFlag = normalize(state.userInput) === normalize(task.answer);
  }

  state.isCorrect = correctFlag;
  state.isEvaluated = true;
  recordTaskResult(task, givenAnswer, correctFlag);
  render();
}

// =========================================================================
// LERNKONTROLLE-LOGIK
// =========================================================================

function startExam() {
  const tasks = [];
  for (let i = 0; i < state.examCount; i++) {
    tasks.push(generateSingleTask(state.selectedCategory));
  }
  state.examTasks = tasks;
  state.examAnswers = new Array(state.examCount).fill(null);
  state.examIndex = 0;
  state.examStatus = 'running';
  render();
}

function finishExam() {
  state.examStatus = 'finished';
  state.examTasks.forEach((task, idx) => {
    const ans = state.examAnswers[idx];
    const correct = isTaskAnswerCorrect(task, ans);
    recordTaskResult(task, ans, correct);
  });
  render();
}

function resetExamToSetup() {
  state.examStatus = 'setup';
  state.examTasks = [];
  state.examAnswers = [];
  state.examIndex = 0;
  render();
}

// =========================================================================
// RENDERING
// =========================================================================

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
  if (state.mode === 'exam') {
    subtitle.textContent = 'Lernkontrolle – Teste dein Wissen unter Prüfungsbedingungen';
  } else if (state.mode === 'progress') {
    subtitle.textContent = 'Lernstand – Stärken, Schwächen und Fehler gezielt nachüben';
  } else {
    subtitle.textContent = 'Echter Live-Zufallsgenerator';
  }
  titleWrap.appendChild(h1);
  titleWrap.appendChild(subtitle);

  const rightControls = document.createElement('div');
  rightControls.className = 'header-controls';

  const modeSwitch = document.createElement('div');
  modeSwitch.className = 'mode-switch';

  const practiceModeBtn = document.createElement('button');
  practiceModeBtn.type = 'button';
  practiceModeBtn.className = `mode-btn ${state.mode === 'practice' ? 'active' : ''}`;
  practiceModeBtn.textContent = 'Üben';
  practiceModeBtn.addEventListener('click', () => handleModeSwitch('practice'));

  const examModeBtn = document.createElement('button');
  examModeBtn.type = 'button';
  examModeBtn.className = `mode-btn ${state.mode === 'exam' ? 'active' : ''}`;
  examModeBtn.textContent = 'Lernkontrolle';
  examModeBtn.addEventListener('click', () => handleModeSwitch('exam'));

  const progressModeBtn = document.createElement('button');
  progressModeBtn.type = 'button';
  progressModeBtn.className = `mode-btn ${state.mode === 'progress' ? 'active' : ''}`;
  progressModeBtn.textContent = state.stats.mistakes.length > 0
    ? `Lernstand (${state.stats.mistakes.length})`
    : 'Lernstand';
  progressModeBtn.addEventListener('click', () => handleModeSwitch('progress'));

  modeSwitch.appendChild(practiceModeBtn);
  modeSwitch.appendChild(examModeBtn);
  modeSwitch.appendChild(progressModeBtn);

  const statsBox = document.createElement('div');
  statsBox.className = 'stats-box';

  const solvedSpan = document.createElement('span');
  solvedSpan.innerHTML = `Gelöst: <strong>${state.stats.solved}</strong>`;

  const correctSpan = document.createElement('span');
  correctSpan.innerHTML = `Richtig: <strong>${state.stats.correct} (${quote}%)</strong>`;

  const resetBtn = document.createElement('button');
  resetBtn.type = 'button';
  resetBtn.className = 'btn-small';
  resetBtn.title = 'Lernstand & Statistik zurücksetzen';
  resetBtn.textContent = '↺';
  resetBtn.addEventListener('click', handleResetStats);

  statsBox.appendChild(solvedSpan);
  statsBox.appendChild(correctSpan);
  statsBox.appendChild(resetBtn);

  rightControls.appendChild(modeSwitch);
  rightControls.appendChild(statsBox);

  header.appendChild(titleWrap);
  header.appendChild(rightControls);
  container.appendChild(header);

  // --- Kategorie-Tabs ---
  if (state.mode === 'practice' || (state.mode === 'exam' && state.examStatus === 'setup')) {
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
  }

  // --- Hauptbereich ---
  if (state.mode === 'practice') {
    container.appendChild(renderPracticeCard());
  } else if (state.mode === 'progress') {
    container.appendChild(renderProgressCard());
  } else {
    if (state.examStatus === 'setup') {
      container.appendChild(renderExamSetupCard());
    } else if (state.examStatus === 'running') {
      container.appendChild(renderExamRunningCard());
    } else {
      container.appendChild(renderExamResultCard());
    }
  }

  root.replaceChildren(container);

  const newInput = root.querySelector('.text-input');
  if (
    newInput &&
    !newInput.disabled &&
    (hadInputFocus ||
      (state.mode === 'practice' && !state.isEvaluated) ||
      (state.mode === 'exam' && state.examStatus === 'running'))
  ) {
    newInput.focus();
    if (hadInputFocus && selectionStart !== null && selectionEnd !== null) {
      newInput.setSelectionRange(selectionStart, selectionEnd);
    }
  }
}

function renderPracticeCard() {
  const task = state.currentTask;
  const main = document.createElement('main');
  main.className = 'card';
  if (!task) return main;

  const meta = document.createElement('div');
  meta.className = 'card-meta';

  const badgeWrap = document.createElement('div');
  badgeWrap.className = 'badge-group';

  const badge = document.createElement('span');
  badge.className = 'badge';
  badge.textContent = task.category;
  badgeWrap.appendChild(badge);

  if (state.isRetryTask) {
    const retryBadge = document.createElement('span');
    retryBadge.className = 'badge badge-retry';
    retryBadge.textContent = 'Fehler-Training';
    badgeWrap.appendChild(retryBadge);
  }

  const counter = document.createElement('span');
  counter.className = 'counter';
  counter.textContent = `Aufgabe #${state.stats.solved + (state.isEvaluated ? 0 : 1)}`;

  meta.appendChild(badgeWrap);
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
  return main;
}

// =========================================================================
// LERNSTAND-ANSICHT (RICHTIG / FALSCH / FEHLER NACHÜBEN)
// =========================================================================

function renderProgressCard() {
  const main = document.createElement('main');
  main.className = 'card';

  const { solved, correct, wrong, byTopic, mistakes } = state.stats;
  const quote = solved > 0 ? Math.round((correct / solved) * 100) : 0;

  const heading = document.createElement('h2');
  heading.className = 'question';
  heading.textContent = 'Dein aktueller Lernstand';
  main.appendChild(heading);

  // Kennzahlen-Kacheln
  const kpiGrid = document.createElement('div');
  kpiGrid.className = 'kpi-grid';
  kpiGrid.innerHTML = `
    <div class="kpi-box kpi-neutral">
      <span class="kpi-value">${solved}</span>
      <span class="kpi-label">Gesamt bearbeitet</span>
    </div>
    <div class="kpi-box kpi-correct">
      <span class="kpi-value">${correct}</span>
      <span class="kpi-label">Richtig</span>
    </div>
    <div class="kpi-box kpi-wrong">
      <span class="kpi-value">${wrong}</span>
      <span class="kpi-label">Nicht richtig</span>
    </div>
    <div class="kpi-box kpi-quote">
      <span class="kpi-value">${quote} %</span>
      <span class="kpi-label">Trefferquote</span>
    </div>
  `;
  main.appendChild(kpiGrid);

  // Themen-Übersicht
  const topicSectionTitle = document.createElement('h3');
  topicSectionTitle.className = 'section-subtitle';
  topicSectionTitle.textContent = 'Lernstand nach Themen';
  main.appendChild(topicSectionTitle);

  const topicList = document.createElement('div');
  topicList.className = 'topic-progress-list';

  for (const topic of TOPICS_ONLY) {
    const tStats = byTopic[topic] || { solved: 0, correct: 0, wrong: 0 };
    const tQuote = tStats.solved > 0 ? Math.round((tStats.correct / tStats.solved) * 100) : 0;

    const row = document.createElement('div');
    row.className = 'topic-progress-row';

    const topLine = document.createElement('div');
    topLine.className = 'topic-progress-top';
    topLine.innerHTML = `
      <strong>${topic}</strong>
      <span class="topic-counts">
        <span class="txt-ok">✓ ${tStats.correct} richtig</span> ·
        <span class="txt-err">✕ ${tStats.wrong} falsch</span>
        (${tStats.solved > 0 ? `${tQuote}%` : '–'})
      </span>
    `;

    const barBg = document.createElement('div');
    barBg.className = 'progress-bar-bg';
    const barFill = document.createElement('div');
    barFill.className = 'progress-bar-fill';
    barFill.style.width = `${tQuote}%`;
    if (tStats.solved === 0) {
      barFill.style.width = '0%';
    } else if (tQuote < 50) {
      barFill.classList.add('bar-low');
    } else if (tQuote < 80) {
      barFill.classList.add('bar-mid');
    }
    barBg.appendChild(barFill);

    row.appendChild(topLine);
    row.appendChild(barBg);
    topicList.appendChild(row);
  }
  main.appendChild(topicList);

  // Liste der nicht richtigen Aufgaben
  const mistakesTitle = document.createElement('h3');
  mistakesTitle.className = 'section-subtitle';
  mistakesTitle.textContent = `Nicht richtig gelöste Aufgaben (${mistakes.length})`;
  main.appendChild(mistakesTitle);

  if (mistakes.length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.className = 'exam-info';
    emptyMsg.textContent =
      solved === 0
        ? 'Noch keine Aufgaben bearbeitet. Starte im Bereich „Üben“ oder „Lernkontrolle“, um deinen Lernstand aufzubauen.'
        : 'Aktuell sind keine offenen Fehleraufgaben vorhanden – super gemacht!';
    main.appendChild(emptyMsg);
  } else {
    const mistakeCards = document.createElement('div');
    mistakeCards.className = 'exam-review-list';

    for (const item of mistakes) {
      const card = document.createElement('div');
      card.className = 'review-item review-wrong';

      const head = document.createElement('div');
      head.className = 'review-header';
      head.innerHTML = `<span><strong>${item.category}</strong></span><span>❌ Nicht richtig</span>`;
      card.appendChild(head);

      const qEl = document.createElement('p');
      qEl.className = 'review-question';
      qEl.appendChild(createMathFragment(item.question));
      card.appendChild(qEl);

      const userP = document.createElement('p');
      userP.className = 'review-answer';
      userP.appendChild(document.createTextNode('Deine Antwort: '));
      const uStrong = document.createElement('strong');
      uStrong.appendChild(createMathFragment(item.userAnswer));
      userP.appendChild(uStrong);
      card.appendChild(userP);

      const solP = document.createElement('p');
      solP.className = 'review-answer';
      solP.appendChild(document.createTextNode('Richtige Lösung: '));
      const sStrong = document.createElement('strong');
      sStrong.appendChild(createMathFragment(formatCorrectAnswer(item)));
      solP.appendChild(sStrong);
      card.appendChild(solP);

      const expP = document.createElement('p');
      expP.className = 'explanation';
      expP.appendChild(createMathFragment(item.explanation));
      card.appendChild(expP);

      const itemActions = document.createElement('div');
      itemActions.className = 'mistake-actions';

      const retryBtn = document.createElement('button');
      retryBtn.type = 'button';
      retryBtn.className = 'btn-mini btn-mini-primary';
      retryBtn.textContent = 'Aufgabe erneut lösen';
      retryBtn.addEventListener('click', () => practiceMistakeTask(item));

      const dismissBtn = document.createElement('button');
      dismissBtn.type = 'button';
      dismissBtn.className = 'btn-mini btn-mini-secondary';
      dismissBtn.textContent = 'Aus Liste entfernen';
      dismissBtn.addEventListener('click', () => removeMistake(item.id));

      itemActions.appendChild(retryBtn);
      itemActions.appendChild(dismissBtn);
      card.appendChild(itemActions);

      mistakeCards.appendChild(card);
    }

    main.appendChild(mistakeCards);
  }

  return main;
}

// =========================================================================
// LERNKONTROLLE: 1. SETUP
// =========================================================================

function renderExamSetupCard() {
  const main = document.createElement('main');
  main.className = 'card';

  const title = document.createElement('h2');
  title.className = 'question';
  title.textContent = 'Lernkontrolle konfigurieren';
  main.appendChild(title);

  const info = document.createElement('p');
  info.className = 'exam-info';
  info.textContent =
    'Beantworte alle Aufgaben ohne Zwischenauswertung. Am Ende erhältst du deine Punktzahl, eine Schulnote, alle Lösungswege und deine Fehler fließen direkt in deinen Lernstand ein.';
  main.appendChild(info);

  const summaryBox = document.createElement('div');
  summaryBox.className = 'exam-setup-box';
  summaryBox.innerHTML = `<p><strong>Gewähltes Thema:</strong> ${state.selectedCategory} (oben auswählbar)</p>`;
  main.appendChild(summaryBox);

  const countLabel = document.createElement('p');
  countLabel.className = 'exam-label';
  countLabel.textContent = 'Anzahl der Aufgaben wählen:';
  main.appendChild(countLabel);

  const countRow = document.createElement('div');
  countRow.className = 'exam-count-row';

  for (const cnt of EXAM_COUNTS) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `count-btn ${state.examCount === cnt ? 'active' : ''}`;
    btn.textContent = `${cnt} Aufgaben`;
    btn.addEventListener('click', () => {
      state.examCount = cnt;
      render();
    });
    countRow.appendChild(btn);
  }
  main.appendChild(countRow);

  const actions = document.createElement('div');
  actions.className = 'actions';

  const startBtn = document.createElement('button');
  startBtn.type = 'button';
  startBtn.className = 'btn btn-primary';
  startBtn.textContent = `Lernkontrolle starten (${state.examCount} Aufgaben)`;
  startBtn.addEventListener('click', startExam);

  actions.appendChild(startBtn);
  main.appendChild(actions);
  return main;
}

// =========================================================================
// LERNKONTROLLE: 2. DURCHFÜHRUNG
// =========================================================================

function renderExamRunningCard() {
  const idx = state.examIndex;
  const total = state.examTasks.length;
  const task = state.examTasks[idx];
  const currentAnswer = state.examAnswers[idx];

  const main = document.createElement('main');
  main.className = 'card';

  const meta = document.createElement('div');
  meta.className = 'card-meta';

  const badge = document.createElement('span');
  badge.className = 'badge';
  badge.textContent = task.category;

  const answeredCount = state.examAnswers.filter((a) =>
    a !== null && a !== undefined && String(a).trim() !== ''
  ).length;

  const counter = document.createElement('span');
  counter.className = 'counter';
  counter.textContent = `Frage ${idx + 1} von ${total} (${answeredCount}/${total} beantwortet)`;

  meta.appendChild(badge);
  meta.appendChild(counter);
  main.appendChild(meta);

  const navDots = document.createElement('div');
  navDots.className = 'exam-dots';
  state.examTasks.forEach((_, dotIdx) => {
    const ans = state.examAnswers[dotIdx];
    const isAnswered = ans !== null && ans !== undefined && String(ans).trim() !== '';
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = `exam-dot ${dotIdx === idx ? 'current' : ''} ${isAnswered ? 'answered' : ''}`;
    dot.textContent = String(dotIdx + 1);
    dot.addEventListener('click', () => {
      state.examIndex = dotIdx;
      render();
    });
    navDots.appendChild(dot);
  });
  main.appendChild(navDots);

  const questionEl = document.createElement('h2');
  questionEl.className = 'question';
  questionEl.appendChild(createMathFragment(task.question));
  main.appendChild(questionEl);

  const form = document.createElement('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (idx < total - 1) {
      state.examIndex++;
      render();
    } else {
      finishExam();
    }
  });

  if (task.type === 'multiple-choice') {
    const ul = document.createElement('ul');
    ul.className = 'mc-list';

    task.options.forEach((opt, optIdx) => {
      const li = document.createElement('li');
      li.className = `mc-item ${currentAnswer === optIdx ? 'selected' : ''}`;
      li.appendChild(createMathFragment(opt));
      li.addEventListener('click', () => {
        state.examAnswers[idx] = optIdx;
        render();
      });
      ul.appendChild(li);
    });

    form.appendChild(ul);
  } else {
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'text-input';
    input.placeholder = 'Deine Antwort eingeben...';
    input.value = currentAnswer ?? '';
    input.addEventListener('input', (e) => {
      state.examAnswers[idx] = e.target.value;
      updateFractionPreview(inputGroup, e.target.value);
      const dot = navDots.children[idx];
      if (dot) {
        dot.classList.toggle('answered', e.target.value.trim() !== '');
      }
    });

    inputGroup.appendChild(input);
    updateFractionPreview(inputGroup, currentAnswer ?? '');
    form.appendChild(inputGroup);
  }

  const actions = document.createElement('div');
  actions.className = 'actions';

  if (idx > 0) {
    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'btn btn-secondary';
    prevBtn.textContent = '← Zurück';
    prevBtn.addEventListener('click', () => {
      state.examIndex--;
      render();
    });
    actions.appendChild(prevBtn);
  }

  if (idx < total - 1) {
    const nextBtn = document.createElement('button');
    nextBtn.type = 'submit';
    nextBtn.className = 'btn btn-primary';
    nextBtn.textContent = 'Weiter →';
    actions.appendChild(nextBtn);
  } else {
    const finishBtn = document.createElement('button');
    finishBtn.type = 'submit';
    finishBtn.className = 'btn btn-success';
    finishBtn.textContent = 'Lernkontrolle abgeben ✓';
    actions.appendChild(finishBtn);
  }

  const abortBtn = document.createElement('button');
  abortBtn.type = 'button';
  abortBtn.className = 'btn btn-secondary';
  abortBtn.textContent = 'Abbrechen';
  abortBtn.addEventListener('click', resetExamToSetup);
  actions.appendChild(abortBtn);

  form.appendChild(actions);
  main.appendChild(form);
  return main;
}

// =========================================================================
// LERNKONTROLLE: 3. AUSWERTUNG & LÖSUNGSWEGE
// =========================================================================

function renderExamResultCard() {
  const total = state.examTasks.length;
  let correctCount = 0;

  const results = state.examTasks.map((task, idx) => {
    const userAns = state.examAnswers[idx];
    const correct = isTaskAnswerCorrect(task, userAns);
    if (correct) correctCount++;
    return { task, userAns, correct, idx };
  });

  const wrongCount = total - correctCount;
  const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const gradeInfo = calculateGrade(percent);

  const main = document.createElement('main');
  main.className = 'card';

  const summary = document.createElement('div');
  summary.className = 'exam-result-header';

  const gradeBadge = document.createElement('div');
  gradeBadge.className = `grade-badge grade-${gradeInfo.grade}`;
  gradeBadge.innerHTML = `<span class="grade-num">Note ${gradeInfo.grade}</span><span class="grade-text">${gradeInfo.label}</span>`;

  const scoreDetails = document.createElement('div');
  scoreDetails.className = 'score-details';
  scoreDetails.innerHTML = `
    <h2>Auswertung der Lernkontrolle</h2>
    <p>Thema: <strong>${state.selectedCategory}</strong></p>
    <p>Richtig: <strong>${correctCount}</strong> · Nicht richtig: <strong>${wrongCount}</strong> (${percent} %)</p>
  `;

  summary.appendChild(gradeBadge);
  summary.appendChild(scoreDetails);
  main.appendChild(summary);

  const topActions = document.createElement('div');
  topActions.className = 'actions';
  topActions.style.marginBottom = '20px';

  const retrySameBtn = document.createElement('button');
  retrySameBtn.type = 'button';
  retrySameBtn.className = 'btn btn-primary';
  retrySameBtn.textContent = 'Neue Lernkontrolle starten ↻';
  retrySameBtn.addEventListener('click', startExam);

  const openProgressBtn = document.createElement('button');
  openProgressBtn.type = 'button';
  openProgressBtn.className = 'btn btn-secondary';
  openProgressBtn.textContent = 'Lernstand & Fehler ansehen';
  openProgressBtn.addEventListener('click', () => handleModeSwitch('progress'));

  topActions.appendChild(retrySameBtn);
  topActions.appendChild(openProgressBtn);
  main.appendChild(topActions);

  const reviewList = document.createElement('div');
  reviewList.className = 'exam-review-list';

  for (const item of results) {
    const { task, userAns, correct, idx } = item;
    const reviewItem = document.createElement('div');
    reviewItem.className = `review-item ${correct ? 'review-correct' : 'review-wrong'}`;

    const itemHeader = document.createElement('div');
    itemHeader.className = 'review-header';
    itemHeader.innerHTML = `
      <span><strong>Aufgabe ${idx + 1}</strong> · ${task.category}</span>
      <span>${correct ? '✅ Richtig' : '❌ Falsch'}</span>
    `;
    reviewItem.appendChild(itemHeader);

    const qP = document.createElement('p');
    qP.className = 'review-question';
    qP.appendChild(createMathFragment(task.question));
    reviewItem.appendChild(qP);

    const userDisplay = formatUserAnswer(task, userAns);
    const correctDisplay = formatCorrectAnswer(task);

    const userP = document.createElement('p');
    userP.className = 'review-answer';
    userP.appendChild(document.createTextNode('Deine Antwort: '));
    const userStrong = document.createElement('strong');
    userStrong.appendChild(createMathFragment(userDisplay));
    userP.appendChild(userStrong);
    reviewItem.appendChild(userP);

    if (!correct) {
      const solP = document.createElement('p');
      solP.className = 'review-answer';
      solP.appendChild(document.createTextNode('Richtige Lösung: '));
      const solStrong = document.createElement('strong');
      solStrong.appendChild(createMathFragment(correctDisplay));
      solP.appendChild(solStrong);
      reviewItem.appendChild(solP);
    }

    const expP = document.createElement('p');
    expP.className = 'explanation';
    expP.appendChild(createMathFragment(task.explanation));
    reviewItem.appendChild(expP);

    reviewList.appendChild(reviewItem);
  }

  main.appendChild(reviewList);
  return main;
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
