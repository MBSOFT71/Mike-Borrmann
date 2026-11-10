import type { SignCategory, TrafficSign } from '../types'

export function signGraphicPath(category: SignCategory) {
  return `/media/placeholders/signs/${category}.svg`
}

export const signCategories: { id: SignCategory; title: string; hint: string }[] = [
  { id: 'gefahr', title: 'Gefahrzeichen', hint: 'Warnen vor Gefahrenstellen' },
  { id: 'vorschrift', title: 'Vorschriftzeichen', hint: 'Gebote und Verbote' },
  { id: 'richt', title: 'Richtzeichen', hint: 'Hinweise zur Vorfahrt und Führung' },
  { id: 'zusatz', title: 'Zusatzzeichen', hint: 'Ergänzen andere Zeichen' },
]

export const signs: TrafficSign[] = [
  {
    id: 'sign-gefahr-101',
    officialNumber: '101',
    title: 'Gefahrstelle',
    category: 'gefahr',
    explanation:
      'Allgemeiner Hinweis auf eine Gefahr, deren Art sich aus der Lage oder einem Zusatzzeichen ergibt. Platzhaltertext, nicht amtlich geprüft.',
    classNotes: {
      b: 'Im Pkw frühzeitig Tempo anpassen und den Fahrbahnrand beobachten.',
      a: 'Auf dem Motorrad besonders auf Fahrbahnqualität und seitliche Gefahren achten.',
      be: 'Mit Anhänger früher verzögern, der Zug braucht mehr Raum.',
    },
    needsLegalReview: true,
    placeholder: true,
  },
  {
    id: 'sign-gefahr-136',
    officialNumber: '136',
    title: 'Fußgänger',
    category: 'gefahr',
    explanation:
      'Warnung vor Fußgängerverkehr, etwa an Übergängen oder in Wohnbereichen. Platzhaltererklärung bis zur rechtlichen Prüfung.',
    classNotes: {
      b: 'Blick zu Gehwegen und Mittelinseln, rechts und links.',
      a: 'Fußgänger können hinter parkenden Fahrzeugen treten — Deckung beachten.',
      be: 'Längerer Anhalteweg der Kombination, früher bereithalten zum Bremsen.',
    },
    needsLegalReview: true,
    placeholder: true,
  },
  {
    id: 'sign-vorschrift-267',
    officialNumber: '267',
    title: 'Verbot der Einfahrt',
    category: 'vorschrift',
    explanation:
      'Einfahren in die so gekennzeichnete Straße ist verboten. Dummy-Erklärung, Grafik ist ein Platzhalter.',
    classNotes: {
      b: 'Nicht einbiegen, auch nicht „kurz“. Alternative Route wählen.',
      a: 'Gilt ebenso für Krafträder, sofern kein Zusatz etwas anderes erlaubt.',
      be: 'Mit Anhänger Umwege einplanen, Wenden an der Stelle oft unmöglich.',
    },
    needsLegalReview: true,
    placeholder: true,
  },
  {
    id: 'sign-vorschrift-276',
    officialNumber: '276',
    title: 'Überholverbot für Kraftfahrzeuge aller Art',
    category: 'vorschrift',
    explanation:
      'Überholen anderer Kraftfahrzeuge ist untersagt. Text selbst formuliert, rechtliche Prüfung ausstehend.',
    classNotes: {
      b: 'Abstand halten, nicht ansetzen, bis das Verbot endet.',
      a: 'Auch Motorräder dürfen hier nicht überholen.',
      be: 'Mit Anhänger ohnedies oft kein Überholweg — Verbot strikt beachten.',
    },
    needsLegalReview: true,
    placeholder: true,
  },
  {
    id: 'sign-richt-301',
    officialNumber: '301',
    title: 'Vorfahrt',
    category: 'richt',
    explanation:
      'An der nächsten Kreuzung oder Einmündung hast du Vorfahrt. Keine Übernahme aus Konzepttexten.',
    classNotes: {
      b: 'Trotzdem Blick nach rechts und links, Vorfahrt wird nicht erzwungen.',
      a: 'Als Motorrad gut sichtbar bleiben, nicht in den toten Winkel anderer.',
      be: 'Die Kombination braucht mehr Zeit in der Kreuzung — zügig, aber nicht hastig.',
    },
    needsLegalReview: true,
    placeholder: true,
  },
  {
    id: 'sign-richt-306',
    officialNumber: '306',
    title: 'Vorfahrtstraße',
    category: 'richt',
    explanation:
      'Du befindest dich auf einer Vorfahrtstraße. Einmündende müssen warten. Platzhalterbibliothek.',
    classNotes: {
      b: 'Vorfahrt gilt, abbiegen trotzdem ankündigen und einordnen.',
      a: 'Seitlich einmündende Pkw übersehen Motorräder leicht.',
      be: 'Beim Abbiegen von der Vorfahrtstraße den Schwenk des Anhängers einrechnen.',
    },
    needsLegalReview: true,
    placeholder: true,
  },
  {
    id: 'sign-zusatz-1000-30',
    officialNumber: '1000-30',
    title: 'Abstandsschild (Platzhalter)',
    category: 'zusatz',
    explanation:
      'Zusatzzeichen können ein Hauptzeichen räumlich oder zeitlich einschränken. Diese Grafik ist nicht amtlich.',
    classNotes: {
      b: 'Zusatz immer zusammen mit dem Hauptzeichen lesen.',
      a: 'Kleines Zusatzschild nicht übersehen — Blick kurz nach unten.',
      be: 'Einschränkungen können Länge oder Gewicht der Kombination betreffen.',
    },
    needsLegalReview: true,
    placeholder: true,
  },
  {
    id: 'sign-zusatz-1006-30',
    officialNumber: '1006-30',
    title: 'Zeitliche Beschränkung (Platzhalter)',
    category: 'zusatz',
    explanation:
      'Beispielhaftes Zusatzzeichen für eine zeitliche Geltung. Keine amtliche Grafik, rechtliche Prüfung fehlt.',
    classNotes: {
      b: 'Uhrzeit und Wochentage am Zusatz ablesen, bevor du folgst.',
      a: 'Gilt unabhängig von der Fahrzeugart, sofern nicht anders vermerkt.',
      be: 'Liefer- oder Anhängerverbote stehen oft nur im Zusatz — mitlesen.',
    },
    needsLegalReview: true,
    placeholder: true,
  },
]
