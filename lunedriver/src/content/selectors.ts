import type {
  ClassId,
  HitchingStep,
  Maneuver,
  PracticeQuestion,
  SignCategory,
  TechniqueTopic,
  TrafficSign,
  Vehicle,
  VideoEntry,
} from '../types'
import { hitchingSteps } from './hitching'
import { maneuvers } from './maneuvers'
import { questions } from './questions'
import { signCategories, signs } from './signs'
import { techniqueTopics } from './technique'
import { vehicles } from './vehicles'
import { videos } from './videos'

export function videosForClass(classId: ClassId): VideoEntry[] {
  return videos.filter((item) => item.classId === classId)
}

export function videoById(classId: ClassId, id: string | undefined): VideoEntry | undefined {
  return videos.find((item) => item.classId === classId && item.id === id)
}

export function vehiclesForClass(classId: ClassId): Vehicle[] {
  return vehicles.filter((item) => item.selectableIn.includes(classId))
}

export function vehicleById(id: string | undefined): Vehicle | undefined {
  return vehicles.find((item) => item.id === id)
}

export function vehicleSelectableIn(vehicle: Vehicle, classId: ClassId): boolean {
  return vehicle.selectableIn.includes(classId)
}

export function techniqueForVehicle(vehicleId: string): TechniqueTopic[] {
  return techniqueTopics.filter((item) => item.group === 'vehicle' && item.vehicleId === vehicleId)
}

export function trailerTopicsFor(classId: ClassId): TechniqueTopic[] {
  return techniqueTopics.filter((item) => item.group === 'trailer' && item.classId === classId)
}

export function techniqueById(id: string | undefined): TechniqueTopic | undefined {
  return techniqueTopics.find((item) => item.id === id)
}

export function allManeuvers(): Maneuver[] {
  return maneuvers
}

export function maneuverById(id: string | undefined): Maneuver | undefined {
  return maneuvers.find((item) => item.id === id)
}

export function allHitchingSteps(): HitchingStep[] {
  return [...hitchingSteps].sort((a, b) => a.order - b.order)
}

export function hitchingById(id: string | undefined): HitchingStep | undefined {
  return hitchingSteps.find((item) => item.id === id)
}

export function questionsForClass(classId: ClassId): PracticeQuestion[] {
  return questions.filter((item) => item.classId === classId)
}

export function questionById(classId: ClassId, id: string | undefined): PracticeQuestion | undefined {
  return questions.find((item) => item.classId === classId && item.id === id)
}

export function allSignCategories() {
  return signCategories
}

export function signsInCategory(category: SignCategory): TrafficSign[] {
  return signs.filter((item) => item.category === category)
}

export function signById(id: string | undefined): TrafficSign | undefined {
  return signs.find((item) => item.id === id)
}

export function isSignCategory(value: string | undefined): value is SignCategory {
  return value === 'gefahr' || value === 'vorschrift' || value === 'richt' || value === 'zusatz'
}
