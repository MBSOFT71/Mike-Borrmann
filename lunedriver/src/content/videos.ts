import type { VideoEntry } from '../types'

const demoMarkers = [
  { atSeconds: 2, endSeconds: 4.5, label: 'Gefahrstelle', signId: 'sign-gefahr-101' },
  { atSeconds: 5, endSeconds: 7.5, label: 'Vorfahrt', signId: 'sign-richt-301' },
]

const demoExplanation =
  'Demo-Erklärung: Beobachte Fahrbahn, andere Verkehrsteilnehmende und den Straßenrand. Dies ist ein Übungsclip, kein realer Streckenabschnitt und kein Konzeptbeispiel.'

export const videos: VideoEntry[] = [
  {
    id: 'b-demo-1',
    classId: 'b',
    title: 'Demo-Fahrt 1',
    explanation: demoExplanation,
    durationLabel: '0:08',
    sizeLabel: '58 KB',
    urlKey: 'demo-local',
    posterLabel: 'Demo-Poster Klasse B',
    markers: demoMarkers,
    demo: true,
  },
  {
    id: 'b-demo-2',
    classId: 'b',
    title: 'Weitere Strecke',
    explanation: 'Für diese Strecke ist noch keine Medienquelle hinterlegt.',
    durationLabel: '—',
    posterLabel: 'Video folgt',
    placeholder: true,
  },
  {
    id: 'a-demo-1',
    classId: 'a',
    title: 'Demo-Fahrt 1',
    explanation: demoExplanation,
    durationLabel: '0:08',
    sizeLabel: '58 KB',
    urlKey: 'demo-local',
    posterLabel: 'Demo-Poster Klasse A',
    markers: demoMarkers,
    demo: true,
  },
  {
    id: 'a-demo-2',
    classId: 'a',
    title: 'Weitere Strecke',
    explanation: 'Für diese Strecke ist noch keine Medienquelle hinterlegt.',
    durationLabel: '—',
    posterLabel: 'Video folgt',
    placeholder: true,
  },
  {
    id: 'be-demo-1',
    classId: 'be',
    title: 'Demo-Fahrt 1',
    explanation: demoExplanation,
    durationLabel: '0:08',
    sizeLabel: '58 KB',
    urlKey: 'demo-local',
    posterLabel: 'Demo-Poster Klasse BE',
    markers: demoMarkers,
    demo: true,
  },
  {
    id: 'be-demo-2',
    classId: 'be',
    title: 'Weitere Strecke',
    explanation: 'Für diese Strecke ist noch keine Medienquelle hinterlegt.',
    durationLabel: '—',
    posterLabel: 'Video folgt',
    placeholder: true,
  },
]
