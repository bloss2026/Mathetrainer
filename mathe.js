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
      const bTens = Math.floor(b / 10) * 10;
      const bOnes = b % 10;
      const sum = a + b;
      return {
        id, category,
        question: `Berechne im Kopf: ${a} + ${b}`,
        type: 'input',
        answer: String(sum),
        explanation:
          `Schritt 1 – Zerlegen: Zerlege ${b} in Zehner und Einer: ${b} = ${bTens} + ${bOnes}. ` +
          `Schritt 2 – Zehner addieren: ${a} + ${bTens} = ${a + bTens}. ` +
          `Schritt 3 – Einer addieren: ${a + bTens} + ${bOnes} = ${sum}.`
      };
    } else if (type === 2) {
      const a = rand(50, 99);
      const b = rand(11, a - 5);
      const bTens = Math.floor(b / 10) * 10;
      const bOnes = b % 10;
      const diff = a - b;
      return {
        id, category,
        question: `Berechne im Kopf: ${a} - ${b}`,
        type: 'input',
        answer: String(diff),
        explanation:
          `Schritt 1 – Zerlegen: Zerlege ${b} in ${bTens} und ${bOnes}. ` +
          `Schritt 2 – Zehner subtrahieren: ${a} - ${bTens} = ${a - bTens}. ` +
          `Schritt 3 – Einer subtrahieren: ${a - bTens} - ${bOnes} = ${diff}.`
      };
    } else if (type === 3) {
      const a = rand(3, 12);
      const b = rand(3, 12);
      const prod = a * b;
      return {
        id, category,
        question: `Berechne im Kopf: ${a} · ${b}`,
        type: 'input',
        answer: String(prod),
        explanation:
          `Schritt 1 – Einmaleins anwenden: ${a} · ${b} bedeutet ${a} mal die Zahl ${b} (bzw. ${b} mal ${a}). ` +
          `Schritt 2 – Ergebnis: ${a} · ${b} = ${prod}.`
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
        explanation:
          `Schritt 1 – Umkehraufgabe nutzen: Welche Zahl mal ${divisor} ergibt ${dividend}? ` +
          `Schritt 2 – Prüfen: ${divisor} · ${factor} = ${dividend}. ` +
          `Schritt 3 – Ergebnis: ${dividend} : ${divisor} = ${factor}.`
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
      const afterSub = res - c;
      return {
        id, category,
        question: `Löse die Gleichung nach x auf: ${m}x + ${c} = ${res}`,
        type: 'input',
        answer: String(x),
        explanation:
          `Ausgangsgleichung: ${m}x + ${c} = ${res}. ` +
          `Schritt 1 – Zahl auf beiden Seiten subtrahieren (- ${c}): ${m}x = ${res} - ${c} = ${afterSub}. ` +
          `Schritt 2 – Durch Faktor vor x teilen (: ${m}): x = ${afterSub} : ${m} = ${x}.`
      };
    } else if (type === 2) {
      const a = rand(2, 6);
      const b = rand(3, 20);
      const x = rand(2, 8);
      const ax = a * x;
      const total = ax + b;
      return {
        id, category,
        question: `Berechne den Wert für x = ${x}: ${a}x + ${b}`,
        type: 'input',
        answer: String(total),
        explanation:
          `Gegebener Term: ${a}x + ${b} mit x = ${x}. ` +
          `Schritt 1 – Einsetzen: ${a} · ${x} + ${b}. ` +
          `Schritt 2 – Punkt- vor Strichrechnung: ${a} · ${x} = ${ax}, danach ${ax} + ${b} = ${total}.`
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
        explanation:
          `Schritt 1 – Gleiche Variablen sortieren: (${a}x - ${c}x) + (${b}y + ${d}y). ` +
          `Schritt 2 – x-Terme zusammenfassen: ${a}x - ${c}x = ${rx}x. ` +
          `Schritt 3 – y-Terme zusammenfassen: ${b}y + ${d}y = ${ry}y. ` +
          `Ergebnis: ${rx}x + ${ry}y (x und y dürfen nicht zu xy verrechnet werden).`
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
        explanation:
          `Formel: (A + B)² = A² + 2 · A · B + B² mit A = x und B = ${a}. ` +
          `Schritt 1 – A² berechnen: x². ` +
          `Schritt 2 – 2 · A · B berechnen: 2 · x · ${a} = ${twoA}x. ` +
          `Schritt 3 – B² berechnen: ${a}² = ${sqA}. ` +
          `Zusammen gesetzt: x² + ${twoA}x + ${sqA}.`
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
      const shortenStep = t > 1
        ? ` Schritt 3 – Kürzen durch ggT(${sum}, ${den}) = ${t}: ${sum} : ${t} = ${rNum} und ${den} : ${t} = ${rDen} → ${ans}.`
        : ` Schritt 3 – Der Bruch ${sum}/${den} lässt sich nicht weiter kürzen.`;
      return {
        id, category,
        question: `Addiere und kürze vollständig: ${num1}/${den} + ${num2}/${den}`,
        type: 'input',
        answer: ans,
        explanation:
          `Schritt 1 – Nenner prüfen: Beide Brüche haben denselben Nenner (${den}). ` +
          `Schritt 2 – Zähler addieren: (${num1} + ${num2})/${den} = ${sum}/${den}.` +
          shortenStep
      };
    } else if (type === 2) {
      const bn = rand(1, 4);
      const bd = rand(bn + 1, 8);
      const t = gcd(bn, bd);
      const fn = bn / t;
      const fd = bd / t;
      const f = rand(2, 5);
      const divisor = f * t;
      return {
        id, category,
        question: `Kürze den Bruch vollständig: ${bn * f}/${bd * f}`,
        type: 'input',
        answer: `${fn}/${fd}`,
        explanation:
          `Ausgangsbruch: ${bn * f}/${bd * f}. ` +
          `Schritt 1 – Gemeinsamen Teiler finden: Sowohl ${bn * f} als auch ${bd * f} sind durch ${divisor} teilbar. ` +
          `Schritt 2 – Zähler und Nenner durch ${divisor} teilen: ${bn * f} : ${divisor} = ${fn} und ${bd * f} : ${divisor} = ${fd}. ` +
          `Ergebnis: ${fn}/${fd}.`
      };
    } else if (type === 3) {
      const den = [3, 4, 5, 8, 10][rand(0, 4)];
      const num = rand(1, den - 1);
      const basis = den * rand(2, 10);
      const unitPart = basis / den;
      const ans = unitPart * num;
      return {
        id, category,
        question: `Wie viel sind ${num}/${den} von ${basis}?`,
        type: 'input',
        answer: String(ans),
        explanation:
          `Schritt 1 – Ein Teil (${1}/${den}) berechnen: Teile ${basis} durch den Nenner ${den} → ${basis} : ${den} = ${unitPart}. ` +
          `Schritt 2 – ${num} Teile berechnen: Multipliziere ${unitPart} mit dem Zähler ${num} → ${unitPart} · ${num} = ${ans}.`
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
      const shortenStep = t > 1
        ? ` Schritt 3 – Kürzen durch ${t}: ${rawNum} : ${t} = ${rNum} und ${rawDen} : ${t} = ${rDen} → ${ans}.`
        : ` Schritt 3 – Der Bruch ${rawNum}/${rawDen} ist bereits vollständig gekürzt.`;
      return {
        id, category,
        question: `Multipliziere und kürze vollständig: ${n1}/${d1} · ${n2}/${d2}`,
        type: 'input',
        answer: ans,
        explanation:
          `Schritt 1 – Zähler multiplizieren: ${n1} · ${n2} = ${rawNum}. ` +
          `Schritt 2 – Nenner multiplizieren: ${d1} · ${d2} = ${rawDen}, das ergibt ${rawNum}/${rawDen}.` +
          shortenStep
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
        explanation:
          `Schritt 1 – Bedeutung der Quadratwurzel: Gesucht ist eine nicht-negative Zahl, die mit sich selbst multipliziert ${sq} ergibt. ` +
          `Schritt 2 – Probe: ${base} · ${base} = ${base}² = ${sq}. ` +
          `Ergebnis: √${sq} = ${base}.`
      };
    } else if (type === 2) {
      const base = rand(3, 14);
      const sq = base * base;
      return {
        id, category,
        question: `Berechne die Potenz: ${base}²`,
        type: 'input',
        answer: String(sq),
        explanation:
          `Schritt 1 – Potenz ausschreiben: ${base}² bedeutet Basis ${base} zweimal als Faktor: ${base} · ${base}. ` +
          `Schritt 2 – Ausrechnen: ${base} · ${base} = ${sq}.`
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
        explanation:
          `Schritt 1 – Basis prüfen: Beide Potenzen haben dieselbe Basis (${b}). ` +
          `Schritt 2 – 1. Potenzgesetz anwenden: Bei gleicher Basis werden die Exponenten addiert: ${e1} + ${e2} = ${sum}. ` +
          `Schritt 3 – Ergebnis notieren: ${b}^${sum} (Basis ${b} bleibt gleich).`
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
      const area = a * b;
      return {
        id, category,
        question: `Rechteck: Länge a = ${a} cm, Breite b = ${b} cm. Flächeninhalt A (in cm²):`,
        type: 'input',
        answer: String(area),
        explanation:
          `Schritt 1 – Formel für den Rechteck-Flächeninhalt: A = a · b. ` +
          `Schritt 2 – Werte einsetzen: A = ${a} cm · ${b} cm = ${area} cm². ` +
          `Antwortzahl (in cm²): ${area}.`
      };
    } else if (type === 2) {
      const g = rand(2, 8) * 2;
      const h = rand(3, 10);
      const prod = g * h;
      const area = prod / 2;
      return {
        id, category,
        question: `Dreieck: Grundseite g = ${g} cm, Höhe h = ${h} cm. Flächeninhalt A (in cm²):`,
        type: 'input',
        answer: String(area),
        explanation:
          `Schritt 1 – Formel für den Dreiecks-Flächeninhalt: A = (g · h) : 2. ` +
          `Schritt 2 – Grundseite mal Höhe rechnen: ${g} · ${h} = ${prod}. ` +
          `Schritt 3 – Durch 2 teilen: ${prod} : 2 = ${area} cm². Antwortzahl: ${area}.`
      };
    } else if (type === 3) {
      const a = rand(2, 9);
      const b = rand(2, 7);
      const c = rand(2, 6);
      const ab = a * b;
      const vol = ab * c;
      return {
        id, category,
        question: `Quader: a = ${a} cm, b = ${b} cm, c = ${c} cm. Volumen V (in cm³):`,
        type: 'input',
        answer: String(vol),
        explanation:
          `Schritt 1 – Formel für das Quadervolumen: V = a · b · c. ` +
          `Schritt 2 – Teilprodukt berechnen: ${a} · ${b} = ${ab}. ` +
          `Schritt 3 – Mit dritter Kante multiplizieren: ${ab} · ${c} = ${vol} cm³. Antwortzahl: ${vol}.`
      };
    } else {
      const a = rand(2, 7);
      const sq = a * a;
      const vol = sq * a;
      return {
        id, category,
        question: `Würfel mit Kantenlänge a = ${a} cm. Volumen V (in cm³):`,
        type: 'input',
        answer: String(vol),
        explanation:
          `Schritt 1 – Formel für das Würfelvolumen: V = a³ = a · a · a. ` +
          `Schritt 2 – Einsetzen: ${a} · ${a} · ${a}. ` +
          `Schritt 3 – Ausrechnen: ${a} · ${a} = ${sq}, dann ${sq} · ${a} = ${vol} cm³. Antwortzahl: ${vol}.`
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
      const step1 = grundwert * p;
      const ans = step1 / 100;
      return {
        id, category,
        question: `Berechne den Prozentwert: ${p} % von ${grundwert} €`,
        type: 'input',
        answer: String(ans),
        explanation:
          `Gegeben: Grundwert G = ${grundwert} €, Prozentsatz p = ${p} %. ` +
          `Schritt 1 – Formel: W = (G · p) : 100. ` +
          `Schritt 2 – Multiplizieren: ${grundwert} · ${p} = ${step1}. ` +
          `Schritt 3 – Durch 100 teilen: ${step1} : 100 = ${ans} €.`
      };
    } else if (type === 2) {
      const kapital = [200, 400, 500, 800, 1000, 1500, 2000][rand(0, 6)];
      const zinssatz = [2, 3, 4, 5, 6][rand(0, 4)];
      const step1 = kapital * zinssatz;
      const zinsen = step1 / 100;
      return {
        id, category,
        question: `Kapital K = ${kapital} €, Zinssatz p = ${zinssatz} %. Wie hoch sind die Jahreszinsen Z (in €)?`,
        type: 'input',
        answer: String(zinsen),
        explanation:
          `Gegeben: Kapital K = ${kapital} €, Zinssatz p = ${zinssatz} %. ` +
          `Schritt 1 – Zinsformel für 1 Jahr: Z = (K · p) : 100. ` +
          `Schritt 2 – K · p berechnen: ${kapital} · ${zinssatz} = ${step1}. ` +
          `Schritt 3 – Durch 100 teilen: ${step1} : 100 = ${zinsen} €.`
      };
    } else {
      const grundwert = [50, 100, 200, 250, 400][rand(0, 4)];
      const p = [10, 20, 25, 50][rand(0, 3)];
      const anteil = (grundwert * p) / 100;
      const decimal = anteil / grundwert;
      return {
        id, category,
        question: `Welcher Prozentsatz sind ${anteil} von ${grundwert}? (Zahl ohne % eingeben)`,
        type: 'input',
        answer: String(p),
        explanation:
          `Gegeben: Prozentwert W = ${anteil}, Grundwert G = ${grundwert}. ` +
          `Schritt 1 – Anteil als Bruch/Dezimalzahl: p% = W : G = ${anteil} : ${grundwert} = ${decimal}. ` +
          `Schritt 2 – In Prozent umwandeln (mit 100 malnehmen): ${decimal} · 100 = ${p} %.`
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
      const mx = m * x;
      const y = mx + b;
      return {
        id, category,
        question: `Gegeben ist f(x) = ${m}x + ${b}. Berechne f(${x}):`,
        type: 'input',
        answer: String(y),
        explanation:
          `Schritt 1 – x = ${x} in die Funktionsgleichung einsetzen: f(${x}) = ${m} · ${x} + ${b}. ` +
          `Schritt 2 – Multiplikation zuerst: ${m} · ${x} = ${mx}. ` +
          `Schritt 3 – Addition durchführen: ${mx} + ${b} = ${y}.`
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
        explanation:
          `Schritt 1 – Normalform vergleichen: Die allgemeine Geradengleichung lautet y = m · x + b. ` +
          `Schritt 2 – Steigung m ablesen: Der Faktor vor x ist m = ${m}. ` +
          `Schritt 3 – y-Achsenabschnitt b ablesen: Der konstante Summand ist b = ${b} (Schnittpunkt mit der y-Achse bei (0 | ${b})).`
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
    const sqA = a * a;
    const sqB = b * b;
    const sqC = c * c;

    if (askHypotenuse) {
      return {
        id, category,
        question: `Rechtwinkliges Dreieck mit Katheten a = ${a} cm und b = ${b} cm. Berechne die Hypotenuse c (in cm):`,
        type: 'input',
        answer: String(c),
        explanation:
          `Schritt 1 – Satz des Pythagoras aufstellen: a² + b² = c² (c liegt gegenüber dem rechten Winkel). ` +
          `Schritt 2 – Quadrate berechnen und addieren: ${a}² + ${b}² = ${sqA} + ${sqB} = ${sqC} → c² = ${sqC}. ` +
          `Schritt 3 – Wurzel ziehen: c = √${sqC} = ${c} cm.`
      };
    } else {
      return {
        id, category,
        question: `Rechtwinkliges Dreieck mit Kathete a = ${a} cm und Hypotenuse c = ${c} cm. Berechne die Kathete b (in cm):`,
        type: 'input',
        answer: String(b),
        explanation:
          `Schritt 1 – Nach Kathete b umstellen: a² + b² = c²  ⇒  b² = c² - a². ` +
          `Schritt 2 – Quadrate einsetzen und subtrahieren: b² = ${c}² - ${a}² = ${sqC} - ${sqA} = ${sqB}. ` +
          `Schritt 3 – Wurzel ziehen: b = √${sqB} = ${b} cm.`
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
  const shortenStep = t > 1
    ? ` Schritt 3 – Bruch kürzen (durch ${t}): ${rot} : ${t} = ${num} und ${gesamt} : ${t} = ${den} → ${ans}.`
    : ` Schritt 3 – Der Bruch ${rot}/${gesamt} lässt sich nicht weiter kürzen.`;

  return {
    id, category: 'Wahrscheinlichkeit',
    question: `In einem Beutel liegen ${rot} rote, ${blau} blaue und ${gruen} grüne Kugeln. Wie groß ist die Wahrscheinlichkeit P(rot)? (Gekürzter Bruch)`,
    type: 'input',
    answer: ans,
    explanation:
      `Schritt 1 – Gesamtanzahl aller Kugeln bestimmen: ${rot} (rot) + ${blau} (blau) + ${gruen} (grün) = ${gesamt} Kugeln insgesamt. ` +
      `Schritt 2 – Laplace-Formel anwenden: P(rot) = Anzahl roter Kugeln : Gesamtzahl = ${rot}/${gesamt}.` +
      shortenStep
  };
}
