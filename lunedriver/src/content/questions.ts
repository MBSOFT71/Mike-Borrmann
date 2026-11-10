import type { PracticeQuestion } from '../types'

const demo = ' Demo-Frage, selbst formuliert, kein Theoriekatalog.'

export const questions: PracticeQuestion[] = [
  {
    id: 'b-q1',
    classId: 'b',
    prompt: 'Du willst an einer Einmündung nach rechts abbiegen. Worauf achtest du zuerst?',
    options: [
      'Nur auf den Gegenverkehr auf der Kreuzenstraße',
      'Auf Fußgänger und Radfahrende, die den Weg kreuzen, und auf den fließenden Verkehr',
      'Nur in den linken Außenspiegel',
    ],
    correctIndex: 1,
    explanation:
      'Vor dem Abbiegen den Bereich rechts neben und vor dem Fahrzeug prüfen, besonders zu Fuß Gehende und Radfahrende, dann den übrigen Verkehr.' +
      demo,
    demo: true,
  },
  {
    id: 'b-q2',
    classId: 'b',
    prompt: 'Die Prüferin oder der Prüfer bittet um eine Fahrzeugkontrolle. Wie gehst du vor?',
    options: [
      'Ohne Erklärung sofort den Motorraum aufklappen',
      'Ruhig die Punkte des Rundgangs nennen und am Fahrzeug zeigen',
      'Nur den Kilometerstand vorlesen',
    ],
    correctIndex: 1,
    explanation:
      'In der praktischen Prüfung zählt nachvollziehbares Vorgehen: Punkte benennen, zeigen, Ergebnis sagen. Das ist eine Übungsfrage, kein amtlicher Katalogsatz.' +
      demo,
    demo: true,
  },
  {
    id: 'a-q1',
    classId: 'a',
    prompt: 'Unmittelbar vor dem Anfahren mit dem Motorrad: was gehört dazu?',
    options: [
      'Helm zu, Blick, Spiegel, Ständer ein, kuppeln und losrollen',
      'Nur den Motor hochdrehen',
      'Zuerst den Stand des Tanks fotografieren',
    ],
    correctIndex: 0,
    explanation:
      'Schutzkleidung sitzt, Umgebung und Spiegel sind geprüft, der Ständer ist eingeholt, dann erst rollt die Maschine.' +
      demo,
    demo: true,
  },
  {
    id: 'a-q2',
    classId: 'a',
    prompt: 'In einer übersichtlichen Rechtskurve: wohin führst du den Blick?',
    options: [
      'Fest auf das Vorderrad',
      'In den Kurvenausgang, die Linie mit dem Blick vorbereiten',
      'Nur auf den linken Spiegel',
    ],
    correctIndex: 1,
    explanation:
      'Der Blick führt die Linie. In die Kurve hineinsehen, nicht an den Boden oder das Vorderrad heften.' +
      demo,
    demo: true,
  },
  {
    id: 'be-q1',
    classId: 'be',
    prompt: 'Bevor du mit Anhänger rückwärts in eine Lücke einlenkst: was prüfst du?',
    options: [
      'Nur den Tankinhalt des Zugfahrzeugs',
      'Freiraum hinter und seitlich der Kombination, Spiegel, Hilfsperson falls nötig',
      'Ob das Radio leise genug ist',
    ],
    correctIndex: 1,
    explanation:
      'Rückwärtsfahren mit Anhänger braucht Übersicht: toter Winkel, Hindernisse, ggf. einweisen lassen. Übungsfrage zur Praxis, kein Katalog.' +
      demo,
    demo: true,
  },
  {
    id: 'be-q2',
    classId: 'be',
    prompt: 'Die Stützlast am Kupplungskopf ist deutlich zu gering. Was kann folgen?',
    options: [
      'Nichts, die Fahrt wird ruhiger',
      'Der Anhänger kann schlingern, die Kombination wird hecklastig und instabil',
      'Nur der Verbrauch steigt',
    ],
    correctIndex: 1,
    explanation:
      'Zu wenig Stützlast macht den Zug instabil. Ladung so verteilen, dass die zulässige Stützlast eingehalten wird.' +
      demo,
    demo: true,
  },
]
