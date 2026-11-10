export type ClassId = 'b' | 'a' | 'be'

export type ContentMeta = {
  demo?: boolean
  placeholder?: boolean
  needsLegalReview?: boolean
  needsProfessionalReview?: boolean
}

export type DrivingClass = {
  id: ClassId
  title: string
  shortLabel: string
  description: string
} & ContentMeta

export type VideoMarker = {
  atSeconds: number
  endSeconds?: number
  label: string
  signId?: string
}

export type VideoEntry = {
  id: string
  classId: ClassId
  title: string
  explanation: string
  durationLabel?: string
  sizeLabel?: string
  urlKey?: string
  posterLabel?: string
  markers?: VideoMarker[]
} & ContentMeta

export type TechniqueGroup = 'vehicle' | 'trailer'

export type VehicleKind = 'car' | 'motorcycle'

export type Vehicle = {
  id: string
  title: string
  kind: VehicleKind
  selectableIn: ClassId[]
} & ContentMeta

export type TechniqueTopic = {
  id: string
  group: TechniqueGroup
  vehicleId?: string
  classId?: ClassId
  title: string
  summary?: string
  body: string
  imageLabel: string
  urlKey?: string
} & ContentMeta

export type PracticeQuestion = {
  id: string
  classId: ClassId
  prompt: string
  options: string[]
  correctIndex: number
  explanation: string
} & ContentMeta

export type SignCategory = 'gefahr' | 'vorschrift' | 'richt' | 'zusatz'

export type TrafficSign = {
  id: string
  officialNumber?: string
  title: string
  category: SignCategory
  explanation: string
  classNotes?: Partial<Record<ClassId, string>>
} & ContentMeta

export type Maneuver = {
  id: string
  title: string
  summary?: string
  body: string
  urlKey?: string
  needsProfessionalReview: true
} & ContentMeta

export type HitchingStep = {
  id: string
  order: number
  title: string
  summary?: string
  body: string
  imageLabel: string
  urlKey?: string
} & ContentMeta

export type VideoQuality = '480p' | '720p'

export type AppSettings = {
  preferWifiDownloads: boolean
  videoQuality: VideoQuality
}

export type MediaStatus = 'demo' | 'placeholder' | 'url'
