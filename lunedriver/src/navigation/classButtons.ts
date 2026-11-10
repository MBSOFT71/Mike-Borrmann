import type { ClassId } from '../types'

export type ClassButtonConfig = {
  id: ClassId
  title: string
  subtitle: string
  icon: 'car' | 'motorcycle' | 'trailer'
}

/** Startseiten-Schaltflächen (UI, kein Content-Modul). */
export const classButtons: ClassButtonConfig[] = [
  { id: 'b', title: 'Klasse B', subtitle: 'Pkw', icon: 'car' },
  { id: 'a', title: 'Klasse A', subtitle: 'Motorrad', icon: 'motorcycle' },
  { id: 'be', title: 'Klasse BE', subtitle: 'Pkw mit Anhänger', icon: 'trailer' },
]
