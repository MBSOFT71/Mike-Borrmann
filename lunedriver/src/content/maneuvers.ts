import type { Maneuver } from '../types'

const review =
  ' Die genaue Ausführung und die Bewertungskriterien stehen unter fachlicher Prüfung und werden nicht aus Konzeptbildern übernommen.'

export const maneuvers: Maneuver[] = [
  {
    id: 'a-slow',
    title: 'Schrittgeschwindigkeit',
    summary: 'Langsam fahren, Balance halten',
    body:
      'Die Maschine bei sehr niedriger Geschwindigkeit geradeaus führen, ohne den Fuß abzusetzen. Kupplung, Gas und Blick führen das Tempo.' +
      review,
    needsProfessionalReview: true,
    placeholder: true,
  },
  {
    id: 'a-slalom',
    title: 'Slalom',
    summary: 'Versetzte Markierungen',
    body:
      'Einen vorgegebenen Slalomkurs gleichmäßig durchfahren. Lenkimpulse früh setzen, Blick zur nächsten Markierung.' +
      review,
    needsProfessionalReview: true,
    urlKey: 'demo-local',
    demo: true,
  },
  {
    id: 'a-swerve',
    title: 'Ausweichen',
    summary: 'Hindernis umfahren',
    body:
      'Nach einem Signal ein markiertes Hindernis umfahren und die Spur wieder aufnehmen. Bremsen und Ausweichen nicht vermischen.' +
      review,
    needsProfessionalReview: true,
    placeholder: true,
  },
  {
    id: 'a-brake',
    title: 'Bremsen',
    summary: 'Gefahrenbremsung üben',
    body:
      'Aus der vorgegebenen Geschwindigkeit dosiert bis zum Stillstand bremsen. Vorderrad- und Hinterradbremse abgestimmt einsetzen.' +
      review,
    needsProfessionalReview: true,
    placeholder: true,
  },
  {
    id: 'a-more-maneuvers',
    title: 'Weitere vorgeschriebene Grundfahraufgaben',
    summary: 'Weitere Pflichtaufgaben',
    body:
      'Weitere vorgeschriebene Aufgaben der Klasse A folgen nach fachlicher Klärung. Dieser Eintrag ist ein Platzhalter für die vollständige Liste.' +
      review,
    needsProfessionalReview: true,
    placeholder: true,
  },
]
