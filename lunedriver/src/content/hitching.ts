import type { HitchingStep } from '../types'

const demo = ' Demo-Schritt, keine verbindliche Prüfanweisung.'

export const hitchingSteps: HitchingStep[] = [
  {
    id: 'be-step-1',
    order: 1,
    title: 'Vorbereitung',
    summary: 'Sichern und ausrichten',
    body:
      'Zugfahrzeug und Anhänger auf ebenem Untergrund abstellen, Feststellbremse ziehen, Stützrad nutzen und die Deichsel auf Kupplungshöhe bringen.' +
      demo,
    imageLabel: 'Vorbereitung An- und Abkuppeln',
    placeholder: true,
  },
  {
    id: 'be-step-2',
    order: 2,
    title: 'Kupplung verbinden',
    summary: 'Aufsetzen und sichern',
    body:
      'Kupplung auf den Kugelkopf setzen, Rastung prüfen, Sicherungssplint bzw. Schloss schließen und das Abreißseil am Zugfahrzeug einhängen.' +
      demo,
    imageLabel: 'Kupplung verbinden',
    urlKey: 'demo-local',
    demo: true,
  },
  {
    id: 'be-step-3',
    order: 3,
    title: 'Elektrik und Kontrolle',
    summary: 'Stecker und Leuchten',
    body:
      'Stecker einrasten, Stützrad hochkurbeln und feststellen, Leuchten am Anhänger prüfen, Rundgang um die Kombination.' +
      demo,
    imageLabel: 'Elektrik und Kontrolle',
    placeholder: true,
  },
  {
    id: 'be-step-4',
    order: 4,
    title: 'Abkuppeln',
    summary: 'In umgekehrter Reihenfolge',
    body:
      'Sichern, Stützrad herunter, Stecker lösen, Abreißseil aushängen, Kupplung öffnen und den Anhänger vom Kugelkopf heben.' +
      demo,
    imageLabel: 'Abkuppeln',
    placeholder: true,
  },
]
