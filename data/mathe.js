export const staticExercises = [
  // --- KOPFRECHNEN ---
  {
    id: 'k1',
    category: 'Kopfrechnen',
    question: 'Berechne im Kopf: 14 · 15',
    type: 'input',
    answer: '210',
    explanation: '14 · 10 = 140 und 14 · 5 = 70. Zusammen: 140 + 70 = 210.'
  },
  {
    id: 'k2',
    category: 'Kopfrechnen',
    question: 'Wie viel sind 3/4 von 60 €?',
    type: 'multiple-choice',
    options: ['35 €', '40 €', '45 €', '50 €'],
    correct: 2,
    explanation: '60 € : 4 = 15 €. Mal 3 ergibt 45 €.'
  },
  {
    id: 'k3',
    category: 'Kopfrechnen',
    question: 'Berechne: (-8) · (-9)',
    type: 'input',
    answer: '72',
    explanation: 'Minus mal Minus ergibt Plus: 8 · 9 = 72.'
  },

  // --- TERME ---
  {
    id: 't1',
    category: 'Terme',
    question: 'Fasse zusammen: 5x + 3y - 2x + 7y',
    type: 'multiple-choice',
    options: ['3x + 10y', '7x + 10y', '3x + 4y', '13xy'],
    correct: 0,
    explanation: 'Gleiche Variablen zusammenfassen: (5x - 2x) + (3y + 7y) = 3x + 10y.'
  },
  {
    id: 't2',
    category: 'Terme',
    question: 'Löse die Klammer auf: 3 · (4a - 2)',
    type: 'multiple-choice',
    options: ['12a - 2', '7a - 6', '12a - 6', '12a + 6'],
    correct: 2,
    explanation: 'Jeden Teil in der Klammer mit 3 multiplizieren: 3 · 4a = 12a und 3 · (-2) = -6.'
  },
  {
    id: 't3',
    category: 'Terme',
    question: 'Berechne den Wert des Terms 2x² + 5 für x = 3.',
    type: 'input',
    answer: '23',
    explanation: '2 · 3² + 5 = 2 · 9 + 5 = 18 + 5 = 23.'
  },
  {
    id: 't4',
    category: 'Terme',
    question: 'Löse die Gleichung nach x auf: 3x + 6 = 21',
    type: 'input',
    answer: '5',
    explanation: '3x + 6 = 21 | -6  =>  3x = 15 | :3  =>  x = 5.'
  },

  // --- BRÜCHE ---
  {
    id: 'b1',
    category: 'Brüche',
    question: 'Addiere und kürze falls möglich: 3/4 + 2/3',
    type: 'multiple-choice',
    options: ['5/7', '17/12', '6/12', '1 1/4'],
    correct: 1,
    explanation: 'Hauptnenner ist 12: 9/12 + 8/12 = 17/12.'
  },
  {
    id: 'b2',
    category: 'Brüche',
    question: 'Multipliziere und kürze vollständig: 5/6 · 3/10',
    type: 'multiple-choice',
    options: ['15/60', '1/4', '8/16', '1/2'],
    correct: 1,
    explanation: 'Über Kreuz kürzen: 5 mit 10 (bleibt 1 und 2) und 3 mit 6 (bleibt 1 und 2). 1/2 · 1/2 = 1/4.'
  },
  {
    id: 'b3',
    category: 'Brüche',
    question: 'Kürze den Bruch so weit wie möglich: 18/24',
    type: 'input',
    answer: '3/4',
    explanation: 'Zähler und Nenner durch 6 teilen: 18 : 6 = 3 und 24 : 6 = 4 → 3/4.'
  },

  // --- POTENZEN & WURZELN ---
  {
    id: 'pw1',
    category: 'Potenzen & Wurzeln',
    question: 'Berechne: √144',
    type: 'input',
    answer: '12',
    explanation: '12 · 12 = 144, also ist √144 = 12.'
  },
  {
    id: 'pw2',
    category: 'Potenzen & Wurzeln',
    question: 'Vereinfache nach den Potenzgesetzen: 2³ · 2²',
    type: 'multiple-choice',
    options: ['2⁵ (32)', '2⁶ (64)', '4⁵ (1024)', '4⁶ (4096)'],
    correct: 0,
    explanation: 'Bei gleicher Basis werden die Exponenten addiert: 2^(3+2) = 2⁵ = 32.'
  },
  {
    id: 'pw3',
    category: 'Potenzen & Wurzeln',
    question: 'Berechne: 5² - √49',
    type: 'input',
    answer: '18',
    explanation: '5² = 25 und √49 = 7. Rechnung: 25 - 7 = 18.'
  },

  // --- FLÄCHEN & VOLUMEN ---
  {
    id: 'fv1',
    category: 'Flächen & Volumen',
    question: 'Ein Rechteck ist a = 8 cm lang und b = 4,5 cm breit. Wie groß ist der Flächeninhalt A (in cm²)?',
    type: 'input',
    answer: '36',
    explanation: 'A = a · b = 8 cm · 4,5 cm = 36 cm².'
  },
  {
    id: 'fv2',
    category: 'Flächen & Volumen',
    question: 'Berechne den Flächeninhalt eines Kreises mit r = 5 cm (nutze π ≈ 3,14). Ergebnis in cm²:',
    type: 'input',
    answer: '78,5',
    explanation: 'A = π · r² = 3,14 · 5² = 3,14 · 25 = 78,5 cm².'
  },
  {
    id: 'fv3',
    category: 'Flächen & Volumen',
    question: 'Ein Quader ist 5 cm lang, 3 cm breit und 4 cm hoch. Wie groß ist das Volumen V (in cm³)?',
    type: 'input',
    answer: '60',
    explanation: 'V = a · b · c = 5 · 3 · 4 = 60 cm³.'
  },
  {
    id: 'fv4',
    category: 'Flächen & Volumen',
    question: 'Berechne das Volumen eines Zylinders mit r = 3 cm und h = 10 cm (nutze π ≈ 3,14). Ergebnis in cm³:',
    type: 'input',
    answer: '282,6',
    explanation: 'V = π · r² · h = 3,14 · 3² · 10 = 3,14 · 9 · 10 = 282,6 cm³.'
  }
];

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

export function generateRandomExercises(count = 10) {
  const generated = [];

  for (let i = 0; i < count; i++) {
    const typePick = rand(1, 6);
    const id = 'gen-' + Date.now() + '-' + i + '-' + rand(100, 999);

    if (typePick === 1) {
      const a = rand(12, 24);
      const b = rand(6, 15);
      generated.push({
        id,
        category: 'Kopfrechnen',
        question: `Kopfrechnen: ${a} · ${b} = ?`,
        type: 'input',
        answer: String(a * b),
        explanation: `${a} · 10 = ${a * 10}, plus ${a} · ${b - 10} = ${a * (b - 10)} → Ergebnis: ${a * b}.`
      });
    } else if (typePick === 2) {
      const x = rand(2, 12);
      const m = rand(2, 7);
      const c = rand(1, 20);
      const res = m * x + c;
      generated.push({
        id,
        category: 'Terme',
        question: `Löse die Gleichung nach x auf: ${m}x + ${c} = ${res}`,
        type: 'input',
        answer: String(x),
        explanation: `${m}x + ${c} = ${res} | -${c}  =>  ${m}x = ${res - c} | :${m}  =>  x = ${x}.`
      });
    } else if (typePick === 3) {
      const base = rand(11, 20);
      const sq = base * base;
      generated.push({
        id,
        category: 'Potenzen & Wurzeln',
        question: `Berechne die Quadratwurzel: √${sq}`,
        type: 'input',
        answer: String(base),
        explanation: `${base} · ${base} = ${sq}, daher ist √${sq} = ${base}.`
      });
    } else if (typePick === 4) {
      const a = rand(2, 9);
      const b = rand(2, 8);
      const c = rand(2, 6);
      generated.push({
        id,
        category: 'Flächen & Volumen',
        question: `Quader-Volumen: a = ${a} cm, b = ${b} cm, c = ${c} cm. Gib V in cm³ an:`,
        type: 'input',
        answer: String(a * b * c),
        explanation: `V = a · b · c = ${a} · ${b} · ${c} = ${a * b * c} cm³.`
      });
    } else if (typePick === 5) {
      const den = [6, 8, 9, 10, 12][rand(0, 4)];
      const num1 = rand(1, den - 2);
      const num2 = rand(1, den - 1);
      const sumNum = num1 + num2;
      const teiler = gcd(sumNum, den);
      const resNum = sumNum / teiler;
      const resDen = den / teiler;
      const ans = resDen === 1 ? String(resNum) : `${resNum}/${resDen}`;

      generated.push({
        id,
        category: 'Brüche',
        question: `Addiere und kürze vollständig: ${num1}/${den} + ${num2}/${den}`,
        type: 'input',
        answer: ans,
        explanation: `${num1}/${den} + ${num2}/${den} = ${sumNum}/${den}` + (teiler > 1 ? ` (gekürzt mit ${teiler}: ${ans})` : '')
      });
    } else {
      const baseNum = rand(1, 5);
      const baseDen = rand(baseNum + 1, 9);
      const factor = rand(2, 6);
      const teiler = gcd(baseNum, baseDen);
      const finalNum = baseNum / teiler;
      const finalDen = baseDen / teiler;

      generated.push({
        id,
        category: 'Brüche',
        question: `Kürze den Bruch so weit wie möglich: ${baseNum * factor}/${baseDen * factor}`,
        type: 'input',
        answer: `${finalNum}/${finalDen}`,
        explanation: `Zähler und Nenner durch ${factor * teiler} teilen ergibt ${finalNum}/${finalDen}.`
      });
    }
  }

  return generated;
}
