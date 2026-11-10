import type { TechniqueTopic } from '../types'
import { vehicles } from './vehicles'

const placeholderBody =
  'Fahrzeugspezifische Anleitung folgt. Modell, Fotos und technische Besonderheiten sind noch nicht hinterlegt.'

function vehicleTopic(
  vehicleId: string,
  slot: string,
  title: string,
  summary: string,
): TechniqueTopic {
  return {
    id: `${vehicleId}-${slot}`,
    vehicleId,
    group: 'vehicle',
    title,
    summary,
    body: placeholderBody,
    imageLabel: `${title} · Platzhalter`,
    placeholder: true,
  }
}

function topicsForVehicle(vehicleId: string, kind: 'car' | 'motorcycle'): TechniqueTopic[] {
  if (kind === 'car') {
    return [
      vehicleTopic(vehicleId, 'lights', 'Beleuchtung und Bedienelemente', 'Inhalt folgt'),
      vehicleTopic(vehicleId, 'hood', 'Motorhaube und Flüssigkeitsstände', 'Inhalt folgt'),
      vehicleTopic(vehicleId, 'tires', 'Reifen und Bremsen', 'Inhalt folgt'),
      vehicleTopic(vehicleId, 'safety', 'Sicherheitskontrollen', 'Inhalt folgt'),
    ]
  }
  return [
    vehicleTopic(vehicleId, 'lights', 'Beleuchtung und Bedienelemente', 'Inhalt folgt'),
    vehicleTopic(vehicleId, 'fluids', 'Flüssigkeitsstände', 'Inhalt folgt'),
    vehicleTopic(vehicleId, 'tires', 'Reifen und Bremsen', 'Inhalt folgt'),
    vehicleTopic(vehicleId, 'safety', 'Sicherheitskontrollen', 'Inhalt folgt'),
  ]
}

const trailerPlaceholderBody =
  'Anhängerspezifische Anleitung folgt. Fotos, Videos und technische Angaben sind noch nicht hinterlegt.'

function trailerTopic(id: string, title: string): TechniqueTopic {
  return {
    id,
    classId: 'be',
    group: 'trailer',
    title,
    summary: 'Inhalt folgt',
    body: trailerPlaceholderBody,
    imageLabel: `${title} · Platzhalter`,
    placeholder: true,
  }
}

const trailerTopics: TechniqueTopic[] = [
  trailerTopic('be-hitch', 'Anhängerkupplung und Verbindung'),
  trailerTopic('be-elec', 'Beleuchtung und Elektrik'),
  trailerTopic('be-tires', 'Reifen und Bremsen'),
  trailerTopic('be-load', 'Ladungssicherung'),
  trailerTopic('be-check', 'Sicherheitskontrollen'),
]

export const techniqueTopics: TechniqueTopic[] = [
  ...vehicles.flatMap((vehicle) => topicsForVehicle(vehicle.id, vehicle.kind)),
  ...trailerTopics,
]
