import React from 'react';
import ReactDOM from 'react-dom';
import { staticExercises, generateRandomExercises } from './data/mathe.js';

const { useState, useEffect } = React;

const CATEGORIES = [
  'Alle Themen',
  'Kopfrechnen',
  'Terme',
  'Brüche',
  'Potenzen & Wurzeln',
  'Flächen & Volumen'
];

// Komponente zur echten Darstellung von Brüchen (Zähler über Nenner)
function MathText({ text }) {
  if (!text) return null;

  const parts = String(text).split(/(-?\d+[a-zA-Z]*\/\d+[a-zA-Z]*)/g);

  return (
    <span className="math-text">
      {parts.map((part, index) => {
        const match = part.match(/^(-?)(\d+[a-zA-Z]*)\/(\d+[a-zA-Z]*)$/);
        if (match) {
          const [, sign, numerator, denominator] = match;
          return (
            <React.Fragment key={index}>
              {sign && <span className="frac-sign">{sign}</span>}
              <span className="fraction">
                <span className="frac-num">{numerator}</span>
                <span className="frac-den">{denominator}</span>
              </span>
            </React.Fragment>
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </span>
  );
}

function MatheTrainerApp() {
  const [selectedCategory, setSelectedCategory] = useState('Alle Themen');
  const [exercises, setExercises] = useState(() => [
    ...staticExercises,
    ...generateRandomExercises(10)
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const [stats, setStats] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('mathe9-stats')) || { solved: 0, correct: 0 };
    } catch (e) {
      return { solved: 0, correct: 0 };
    }
  });

  useEffect(() => {
    localStorage.setItem('mathe9-stats', JSON.stringify(stats));
  }, [stats]);

  const filteredTasks = selectedCategory === 'Alle Themen'
    ? exercises
    : exercises.filter(ex => ex.category === selectedCategory);

  const currentTask = filteredTasks[currentIndex] || filteredTasks[0];

  function handleCategoryChange(cat) {
    setSelectedCategory(cat);
    setCurrentIndex(0);
    resetQuestionState();
  }

  function resetQuestionState() {
    setUserInput('');
    setSelectedOption(null);
    setIsEvaluated(false);
    setIsCorrect(false);
  }

  function normalize(val) {
    return String(val)
      .trim()
      .toLowerCase()
      .replace('.', ',')
      .replace(/\s+/g, '');
  }

  function checkAnswer(e) {
    if (e) e.preventDefault();
    if (isEvaluated || !currentTask) return;

    let correctFlag = false;

    if (currentTask.type === 'multiple-choice') {
      if (selectedOption === null) return;
      correctFlag = selectedOption === currentTask.correct;
    } else {
      if (!userInput.trim()) return;
      correctFlag = normalize(userInput) === normalize(currentTask.answer);
    }

    setIsCorrect(correctFlag);
    setIsEvaluated(true);
    setStats(prev => ({
      solved: prev.solved + 1,
      correct: prev.correct + (correctFlag ? 1 : 0)
    }));
  }

  function nextTask() {
    resetQuestionState();
    if (currentIndex < filteredTasks.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      const moreTasks = generateRandomExercises(10);
      setExercises(prev => [...prev, ...moreTasks]);
      setCurrentIndex(prev => prev + 1);
    }
  }

  function generateNewBatch() {
    const fresh = [...staticExercises, ...generateRandomExercises(15)];
    setExercises(fresh);
    setCurrentIndex(0);
    resetQuestionState();
  }

  function resetStats() {
    setStats({ solved: 0, correct: 0 });
  }

  const quote = stats.solved > 0 ? Math.round((stats.correct / stats.solved) * 100) : 0;

  return (
    <div className="container">
      <header className="top-bar">
        <div>
          <h1>Mathe-Trainer 9. Klasse</h1>
          <p className="subtitle">Interaktives Training mit Endlos-Generator</p>
        </div>
        <div className="stats-box">
          <span>Gelöst: <strong>{stats.solved}</strong></span>
          <span>Richtig: <strong>{stats.correct} ({quote}%)</strong></span>
          <button className="btn-small" onClick={resetStats} title="Statistik zurücksetzen">↺</button>
        </div>
      </header>

      <nav className="category-tabs">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`tab-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => handleCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </nav>

      {currentTask ? (
        <main className="card">
          <div className="card-meta">
            <span className="badge">{currentTask.category}</span>
            <span className="counter">Aufgabe {currentIndex + 1} von {filteredTasks.length}</span>
          </div>

          <h2 className="question">
            <MathText text={currentTask.question} />
          </h2>

          <form onSubmit={checkAnswer}>
            {currentTask.type === 'multiple-choice' ? (
              <ul className="mc-list">
                {currentTask.options.map((opt, idx) => {
                  let stateClass = '';
                  if (isEvaluated) {
                    if (idx === currentTask.correct) stateClass = 'correct';
                    else if (idx === selectedOption) stateClass = 'wrong';
                  } else if (idx === selectedOption) {
                    stateClass = 'selected';
                  }

                  return (
                    <li
                      key={idx}
                      className={`mc-item ${stateClass}`}
                      onClick={() => !isEvaluated && setSelectedOption(idx)}
                    >
                      <MathText text={opt} />
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="input-group">
                <input
                  type="text"
                  className={`text-input ${isEvaluated ? (isCorrect ? 'input-correct' : 'input-wrong') : ''}`}
                  placeholder="Deine Antwort eingeben (z. B. 3/4 oder 12)..."
                  value={userInput}
                  disabled={isEvaluated}
                  onChange={e => setUserInput(e.target.value)}
                  autoFocus
                />
                {userInput.includes('/') && (
                  <div className="fraction-preview">
                    Vorschau: <MathText text={userInput} />
                  </div>
                )}
              </div>
            )}

            {isEvaluated && (
              <div className={`feedback ${isCorrect ? 'fb-success' : 'fb-error'}`}>
                <strong>{isCorrect ? '✅ Richtig!' : '❌ Leider falsch.'}</strong>
                {!isCorrect && currentTask.type === 'input' && (
                  <p>Richtige Lösung: <strong><MathText text={currentTask.answer} /></strong></p>
                )}
                <p className="explanation">
                  <MathText text={currentTask.explanation} />
                </p>
              </div>
            )}

            <div className="actions">
              {!isEvaluated ? (
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={currentTask.type === 'multiple-choice' ? selectedOption === null : !userInput.trim()}
                >
                  Antwort prüfen
                </button>
              ) : (
                <button type="button" className="btn btn-success" onClick={nextTask}>
                  Nächste Aufgabe →
                </button>
              )}

              <button type="button" className="btn btn-secondary" onClick={generateNewBatch}>
                🎲 Neue Zufallsaufgaben
              </button>
            </div>
          </form>
        </main>
      ) : (
        <div className="card">Keine Aufgaben in dieser Kategorie gefunden.</div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<MatheTrainerApp />);
