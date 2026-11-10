import type { ClassId } from '../types'
import type { AreaId } from './areas'

export const CLASS_IDS: readonly ClassId[] = ['b', 'a', 'be']

export function isClassId(value: string | undefined): value is ClassId {
  return value === 'b' || value === 'a' || value === 'be'
}

export const routes = {
  home: '/',
  downloads: '/downloads',
  settings: '/einstellungen',
  classMenu: (classId: ClassId) => `/klasse/${classId}`,
  area: (classId: ClassId, areaId: AreaId) => `/klasse/${classId}/${areaId}`,
  video: (classId: ClassId, videoId: string) => `/klasse/${classId}/fahrstrecken/${videoId}`,
  vehicleTechnik: (classId: ClassId, vehicleId: string) => `/klasse/${classId}/technik/${vehicleId}`,
  techniqueDetail: (classId: ClassId, vehicleId: string, topicId: string) =>
    `/klasse/${classId}/technik/${vehicleId}/${topicId}`,
  trailerTech: (classId: ClassId, topicId: string) => `/klasse/${classId}/anhaengertechnik/${topicId}`,
  maneuver: (classId: ClassId, maneuverId: string) => `/klasse/${classId}/grundfahraufgaben/${maneuverId}`,
  hitch: (classId: ClassId, stepId: string) => `/klasse/${classId}/an-abkuppeln/${stepId}`,
  question: (classId: ClassId, questionId: string) => `/klasse/${classId}/fragen/${questionId}`,
  signCategory: (classId: ClassId, category: string) => `/klasse/${classId}/verkehrszeichen/${category}`,
  signDetail: (classId: ClassId, category: string, signId: string) =>
    `/klasse/${classId}/verkehrszeichen/${category}/${signId}`,
} as const

export function isDetailPath(pathname: string) {
  const parts = pathname.split('/').filter(Boolean)
  if (parts[0] !== 'klasse' || parts.length < 4) return false
  if (parts[2] === 'verkehrszeichen' || parts[2] === 'technik') return parts.length >= 5
  return true
}
