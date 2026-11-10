import type { ClassId } from '../types'

export type AreaId =
  | 'fahrstrecken'
  | 'technik'
  | 'fragen'
  | 'verkehrszeichen'
  | 'grundfahraufgaben'
  | 'anhaengertechnik'
  | 'an-abkuppeln'

export type AreaIcon =
  | 'play'
  | 'wrench'
  | 'clipboard'
  | 'warning'
  | 'cone'
  | 'trailerTech'
  | 'hitch'

export type AreaConfig = {
  id: AreaId
  title: string
  description: string
  icon: AreaIcon
  review?: 'legal' | 'professional'
}

const fahrstrecken: AreaConfig = {
  id: 'fahrstrecken',
  title: 'Fahrstrecken',
  description: 'Videos und Erklärungen zur Prüfungsfahrt',
  icon: 'play',
}

const fragen: AreaConfig = {
  id: 'fragen',
  title: 'Praktische Prüfungsfragen',
  description: 'Übungsfragen zur praktischen Prüfung',
  icon: 'clipboard',
}

const verkehrszeichen: AreaConfig = {
  id: 'verkehrszeichen',
  title: 'Verkehrszeichen',
  description: 'Gemeinsame Bibliothek mit klassenspezifischem Hinweis',
  icon: 'warning',
  review: 'legal',
}

const technikB: AreaConfig = {
  id: 'technik',
  title: 'Fahrzeugtechnik',
  description: 'Prüfungsfahrzeug wählen',
  icon: 'wrench',
}

const technikA: AreaConfig = {
  id: 'technik',
  title: 'Fahrzeugtechnik',
  description: 'Motorrad wählen',
  icon: 'wrench',
}

const grundfahraufgaben: AreaConfig = {
  id: 'grundfahraufgaben',
  title: 'Grundfahraufgaben',
  description: 'Vorgeschriebene Aufgaben',
  icon: 'cone',
  review: 'professional',
}

const anhaengertechnik: AreaConfig = {
  id: 'anhaengertechnik',
  title: 'Anhängertechnik',
  description: 'Ein Anhänger · Platzhalter',
  icon: 'trailerTech',
}

const hitching: AreaConfig = {
  id: 'an-abkuppeln',
  title: 'An- und Abkuppeln',
  description: 'Schrittfolge für Klasse BE',
  icon: 'hitch',
}

export const areasByClass: Record<ClassId, AreaConfig[]> = {
  b: [fahrstrecken, technikB, fragen, verkehrszeichen],
  a: [fahrstrecken, grundfahraufgaben, technikA, fragen, verkehrszeichen],
  be: [fahrstrecken, anhaengertechnik, hitching, fragen, verkehrszeichen],
}

export function isAreaId(value: string | undefined): value is AreaId {
  return (
    value === 'fahrstrecken' ||
    value === 'technik' ||
    value === 'fragen' ||
    value === 'verkehrszeichen' ||
    value === 'grundfahraufgaben' ||
    value === 'anhaengertechnik' ||
    value === 'an-abkuppeln'
  )
}

export function getAreas(classId: ClassId): AreaConfig[] {
  return areasByClass[classId]
}

export function getArea(classId: ClassId, areaId: string | undefined): AreaConfig | undefined {
  if (!isAreaId(areaId)) return undefined
  return areasByClass[classId].find((area) => area.id === areaId)
}
