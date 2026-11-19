function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

const ALL_TOPICS = [
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

export function generateSingleTask(selectedCategory) {
  const category = selectedCategory === 'Alle Themen'
    ? ALL_TOPICS[rand(0, ALL_TOPICS.length - 1)]
    : selectedCategory;

  const id = 'task-' + Date.now() + '-' + rand(1000, 9999);

  // =========================================================================
  // 1. KOPFRECHNEN
  // =========================================================================
  if (category === 'Kopfrechnen') {
    const type = rand(1, 4);
    if (type === 1) {
      const a = rand(15, 85);
      const b = rand(12, 45);
      return {
        id, category,
        question: `Berechne im Kopf: ${a} + ${b}`,
        type: 'input',
        answer: String(a + b),
        explanation: `Rechnung: ${a} + ${b} = ${a + b}.`
      };
    } else if (type === 2) {
      const a = rand(50, 99);
      const b = rand(11, a - 5);
      return {
        id, category,
        question: `Berechne im Kopf: ${a} - ${b}`,
        type: 'input',
        answer: String(a - b),
        explanation: `Rechnung: ${a} - ${b} = ${a - b}.`
      };
    } else if (type === 3) {
      const a = rand(3, 12);
      const b = rand(3, 12);
      return {
        id, category,
        question: `Berechne im Kopf: ${a} · ${b}`,
        type: 'input',
        answer: String(a * b),
        explanation: `Einmaleins: ${a} · ${b} = ${a * b}.`
      };
    } else {
      const factor = rand(3, 12);
      const divisor = rand(2, 9);
      const dividend = factor * divisor;
      return {
        id, category,
        question: `Berechne im Kopf: ${dividend} : ${divisor}`,
        type: 'input',
        answer: String(factor),
        explanation: `Weil ${factor} · ${divisor} = ${dividend} ist, ist das Ergebnis ${factor}.`
      };
    }
  }

  // =========================================================================
  // 2. TERME & GLEICHUNGEN
  // =========================================================================
  if (category === 'Terme') {
    const type = rand(1, 4);
    if (type === 1) {
      const x = rand(2, 12);
      const m = rand(2, 7);
      const c = rand(2, 25);
      const res = m * x + c;
      return {
        id, category,
        question: `Löse die Gleichung nach x auf: ${m}x + ${c} = ${res}`,
        type: 'input',
        answer: String(x),
        explanation: `Subtrahiere ${c} (${m}x = ${res - c}), dann teile durch ${m} → x = ${x}.`
      };
    } else if (type === 2) {
      const a = rand(2, 6);
      const b = rand(3, 20);
      const x = rand(2, 8);
      return {
        id, category,
        question: `Berechne den Wert für x = ${x}: ${a}x + ${b}`,
        type: 'input',
        answer: String(a * x + b),
        explanation: `Setze ein: ${a} · ${x} + ${b} = ${a * x} + ${b} = ${a * x + b}.`
      };
    } else if (type === 3) {
      const a = rand(3, 12);
      const b = rand(2, 9);
      const c = rand(1, a - 1);
      const d = rand(2, 8);
      const rx = a - c;
      const ry = b + d;
      return {
        id, category,
        question: `Fasse den Term so weit wie möglich zusammen: ${a}x + ${b}y - ${c}x + ${d}y`,
        type: 'multiple-choice',
        options: [
          `${rx}x + ${ry}y`,
          `${a + c}x + ${ry}y`,
          `${rx}x + ${Math.abs(b - d)}y`,
          `${rx + ry}xy`
        ],
        correct: 0,
        explanation: `Sortieren: (${a}x - ${c}x) + (${b}y + ${d}y) = ${rx}x + ${ry}y.`
      };
    } else {
      const a = rand(2, 9);
      const twoA = 2 * a;
      const sqA = a * a;
      return {
        id, category,
        question: `Löse die Klammer mit der 1. binomischen Formel auf: (x + ${a})²`,
        type: 'multiple-choice',
        options: [
          `x² + ${twoA}x + ${sqA}`,
          `x² + ${sqA}`,
          `x² + ${a}x + ${sqA}`,
          `2x + ${twoA}`
        ],
        correct: 0,
        explanation: `(a + b)² = a² + 2ab + b² → x² + 2 · ${a} · x + ${a}² = x² + ${twoA}x + ${sqA}.`
      };
    }
  }

  // =========================================================================
  // 3. BRÜCHE
  // =========================================================================
  if (category === 'Brüche') {
    const type = rand(1, 4);
    if (type === 1) {
      const den = [6, 8, 9, 10, 12, 16][rand(0, 5)];
      const num1 = rand(1, den - 3);
      const num2 = rand(1, den - num1 - 1);
      const sum = num1 + num2;
      const t = gcd(sum, den);
      const rNum = sum / t;
      const rDen = den / t;
      const ans = rDen === 1 ? String(rNum) : `${rNum}/${rDen}`;
      return {
        id, category,
        question: `Addiere und kürze vollständig: ${num1}/${den} + ${num2}/${den}`,
        type: 'input',
        answer: ans,
        explanation: `Zähler addieren: ${num1} + ${num2} = ${sum}. Bruch: ${sum}/${den}` + (t > 1 ? ` (gekürzt: ${ans})` : '.')
      };
    } else if (type === 2) {
      const bn = rand(1, 4);
      const bd = rand(bn + 1, 8);
      const t = gcd(bn, bd);
      const fn = bn / t;
      const fd = bd / t;
      const f = rand(2, 5);
      return {
        id, category,
        question: `Kürze den Bruch vollständig: ${bn * f}/${bd * f}`,
        type: 'input',
        answer: `${fn}/${fd}`,
        explanation: `Teile Zähler und Nenner durch ${f * t} → ${fn}/${fd}.`
      };
    } else if (type === 3) {
      const den = [3, 4, 5, 8, 10][rand(0, 4)];
      const num = rand(1, den - 1);
      const basis = den * rand(2, 10);
      const ans = (basis / den) * num;
      return {
        id, category,
        question: `Wie viel sind ${num}/${den} von ${basis}?`,
        type: 'input',
        answer: String(ans),
        explanation: `Teile ${basis} durch den Nenner (${den}) = ${basis / den}, mal Zähler (${num}) = ${ans}.`
      };
    } else {
      const n1 = rand(1, 5);
      const d1 = rand(2, 6);
      const n2 = rand(1, 5);
      const d2 = rand(2, 6);
      const rawNum = n1 * n2;
      const rawDen = d1 * d2;
      const t = gcd(rawNum, rawDen);
      const rNum = rawNum / t;
      const rDen = rawDen / t;
      const ans = rDen === 1 ? String(rNum) : `${rNum}/${rDen}`;
      return {
        id, category,
        question: `Multipliziere und kürze vollständig: ${n1}/${d1} · ${n2}/${d2}`,
        type: 'input',
        answer: ans,
        explanation: `Zähler · Zähler (${n1}·${n2} = ${rawNum}) und Nenner · Nenner (${d1}·${d2} = ${rawDen}) → ${ans}.`
      };
    }
  }

  // =========================================================================
  // 4. POTENZEN & WURZELN
  // =========================================================================
  if (category === 'Potenzen & Wurzeln') {
    const type = rand(1, 3);
    if (type === 1) {
      const base = rand(4, 18);
      const sq = base * base;
      return {
        id, category,
        question: `Berechne die Quadratwurzel: √${sq}`,
        type: 'input',
        answer: String(base),
        explanation: `Weil ${base} · ${base} = ${sq} ist, ist √${sq} = ${base}.`
      };
    } else if (type === 2) {
      const base = rand(3, 14);
      return {
        id, category,
        question: `Berechne die Potenz: ${base}²`,
        type: 'input',
        answer: String(base * base),
        explanation: `${base}² = ${base} · ${base} = ${base * base}.`
      };
    } else {
      const b = rand(2, 5);
      const e1 = rand(2, 4);
      const e2 = rand(2, 3);
      const sum = e1 + e2;
      return {
        id, category,
        question: `Vereinfache mit den Potenzgesetzen: ${b}^${e1} · ${b}^${e2}`,
        type: 'multiple-choice',
        options: [
          `${b}^${sum}`,
          `${b}^${e1 * e2}`,
          `${b * 2}^${sum}`,
          `${b}^${Math.abs(e1 - e2)}`
        ],
        correct: 0,
        explanation: `Potenzgesetz: Gleiche Basis, also Exponenten addieren (${e1} + ${e2} = ${sum}) → ${b}^${sum}.`
      };
    }
  }

  // =========================================================================
  // 5. FLÄCHEN & VOLUMEN
  // =========================================================================
  if (category === 'Flächen & Volumen') {
    const type = rand(1, 4);
    if (type === 1) {
      const a = rand(3, 15);
      const b = rand(2, 12);
      return {
        id, category,
        question: `Rechteck: Länge a = ${a} cm, Breite b = ${b} cm. Flächeninhalt A (in cm²):`,
        type: 'input',
        answer: String(a * b),
        explanation: `Fläche = a · b = ${a} · ${b} = ${a * b} cm².`
      };
    } else if (type === 2) {
      const g = rand(2, 8) * 2;
      const h = rand(3, 10);
      return {
        id, category,
        question: `Dreieck: Grundseite g = ${g} cm, Höhe h = ${h} cm. Flächeninhalt A (in cm²):`,
        type: 'input',
        answer: String((g * h) / 2),
        explanation: `Fläche = (g · h) : 2 = (${g} · ${h}) : 2 = ${(g * h) / 2} cm².`
      };
    } else if (type === 3) {
      const a = rand(2, 9);
      const b = rand(2, 7);
      const c = rand(2, 6);
      return {
        id, category,
        question: `Quader: a = ${a} cm, b = ${b} cm, c = ${c} cm. Volumen V (in cm³):`,
        type: 'input',
        answer: String(a * b * c),
        explanation: `Volumen = a · b · c = ${a} · ${b} · ${c} = ${a * b * c} cm³.`
      };
    } else {
      const a = rand(2, 7);
      return {
        id, category,
        question: `Würfel mit Kantenlänge a = ${a} cm. Volumen V (in cm³):`,
        type: 'input',
        answer: String(a * a * a),
        explanation: `Volumen = a³ = ${a} · ${a} · ${a} = ${a * a * a} cm³.`
      };
    }
  }

  // =========================================================================
  // 6. PROZENT & ZINSEN
  // =========================================================================
  if (category === 'Prozent & Zinsen') {
    const type = rand(1, 3);
    if (type === 1) {
      const p = [10, 20, 25, 50, 75][rand(0, 4)];
      const grundwert = rand(2, 20) * 20;
      const ans = (grundwert * p) / 100;
      return {
        id, category,
        question: `Berechne den Prozentwert: ${p} % von ${grundwert} €`,
        type: 'input',
        answer: String(ans),
        explanation: `${p} % = ${p}/100 → ${grundwert} · ${p} : 100 = ${ans} €.`
      };
    } else if (type === 2) {
      const kapital = [200, 400, 500, 800, 1000, 1500, 2000][rand(0, 6)];
      const zinssatz = [2, 3, 4, 5, 6][rand(0, 4)];
      const zinsen = (kapital * zinssatz) / 100;
      return {
        id, category,
        question: `Kapital K = ${kapital} €, Zinssatz p = ${zinssatz} %. Wie hoch sind die Jahreszinsen Z (in €)?`,
        type: 'input',
        answer: String(zinsen),
        explanation: `Z = (K · p) : 100 = (${kapital} · ${zinssatz}) : 100 = ${zinsen} €.`
      };
    } else {
      const grundwert = [50, 100, 200, 250, 400][rand(0, 4)];
      const p = [10, 20, 25, 50][rand(0, 3)];
      const anteil = (grundwert * p) / 100;
      return {
        id, category,
        question: `Welcher Prozentsatz sind ${anteil} von ${grundwert}? (Zahl ohne % eingeben)`,
        type: 'input',
        answer: String(p),
        explanation: `p % = ${anteil} : ${grundwert} = ${(anteil / grundwert).toFixed(2)} → ${p} %.`
      };
    }
  }

  // =========================================================================
  // 7. LINEARE FUNKTIONEN
  // =========================================================================
  if (category === 'Lineare Funktionen') {
    const type = rand(1, 2);
    if (type === 1) {
      const m = rand(1, 6);
      const b = rand(1, 12);
      const x = rand(1, 8);
      const y = m * x + b;
      return {
        id, category,
        question: `Gegeben ist f(x) = ${m}x + ${b}. Berechne f(${x}):`,
        type: 'input',
        answer: String(y),
        explanation: `f(${x}) = ${m} · ${x} + ${b} = ${m * x} + ${b} = ${y}.`
      };
    } else {
      const m = rand(2, 7);
      const b = rand(1, 15);
      return {
        id, category,
        question: `Welche Steigung m und welchen y-Achsenabschnitt b hat die Gerade y = ${m}x + ${b}?`,
        type: 'multiple-choice',
        options: [
          `m = ${m}, b = ${b}`,
          `m = ${b}, b = ${m}`,
          `m = ${m}, b = -${b}`,
          `m = -${m}, b = ${b}`
        ],
        correct: 0,
        explanation: `In y = mx + b steht m vor x (${m}) und b ist der konstante Wert (${b}).`
      };
    }
  }

  // =========================================================================
  // 8. PYTHAGORAS
  // =========================================================================
  if (category === 'Pythagoras') {
    const triples = [
      [3, 4, 5],
      [6, 8, 10],
      [5, 12, 13],
      [8, 15, 17],
      [9, 12, 15]
    ];
    const [a, b, c] = triples[rand(0, triples.length - 1)];
    const askHypotenuse = rand(0, 1) === 0;

    if (askHypotenuse) {
      return {
        id, category,
        question: `Rechtwinkliges Dreieck mit Katheten a = ${a} cm und b = ${b} cm. Berechne die Hypotenuse c (in cm):`,
        type: 'input',
        answer: String(c),
        explanation: `c² = a² + b² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${c * c} → c = √${c * c} = ${c} cm.`
      };
    } else {
      return {
        id, category,
        question: `Rechtwinkliges Dreieck mit Kathete a = ${a} cm und Hypotenuse c = ${c} cm. Berechne die Kathete b (in cm):`,
        type: 'input',
        answer: String(b),
        explanation: `b² = c² - a² = ${c}² - ${a}² = ${c * c} - ${a * a} = ${b * b} → b = √${b * b} = ${b} cm.`
      };
    }
  }

  // =========================================================================
  // 9. WAHRSCHEINLICHKEIT
  // =========================================================================
  const rot = rand(2, 6);
  const blau = rand(2, 6);
  const gruen = rand(1, 5);
  const gesamt = rot + blau + gruen;
  const t = gcd(rot, gesamt);
  const num = rot / t;
  const den = gesamt / t;
  const ans = den === 1 ? String(num) : `${num}/${den}`;

  return {
    id, category: 'Wahrscheinlichkeit',
    question: `In einem Beutel liegen ${rot} rote, ${blau} blaue und ${gruen} grüne Kugeln. Wie groß ist die Wahrscheinlichkeit P(rot)? (Gekürzter Bruch)`,
    type: 'input',
    answer: ans,
    explanation: `Günstige Fälle: ${rot}, mögliche Fälle insgesamt: ${gesamt} → ${rot}/${gesamt}` + (t > 1 ? ` (gekürzt: ${ans})` : '.')
  };
}
