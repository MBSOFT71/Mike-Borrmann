import type { Vehicle } from '../types'

export const vehicles: Vehicle[] = [
  { id: 'car-1', title: 'Prüfungsfahrzeug 1', kind: 'car', selectableIn: ['b'], placeholder: true },
  { id: 'car-2', title: 'Prüfungsfahrzeug 2', kind: 'car', selectableIn: ['b'], placeholder: true },
  { id: 'car-3', title: 'Prüfungsfahrzeug 3', kind: 'car', selectableIn: ['b'], placeholder: true },
  { id: 'car-4', title: 'Prüfungsfahrzeug 4', kind: 'car', selectableIn: ['b'], placeholder: true },
  { id: 'moto-a1', title: 'Klasse A1', kind: 'motorcycle', selectableIn: ['a'], placeholder: true },
  { id: 'moto-a2', title: 'Klasse A2', kind: 'motorcycle', selectableIn: ['a'], placeholder: true },
  { id: 'moto-a', title: 'Klasse A', kind: 'motorcycle', selectableIn: ['a'], placeholder: true },
]
