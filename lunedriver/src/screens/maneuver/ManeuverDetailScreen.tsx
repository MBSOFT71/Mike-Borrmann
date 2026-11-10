import { Navigate, useParams } from 'react-router-dom'
import { ScreenHeader } from '../../components/layout/ScreenHeader'
import { DemoBanner } from '../../components/ui/DemoBanner'
import { ReviewBanner } from '../../components/ui/ReviewBanner'
import { PlaceholderImage } from '../../components/media/PlaceholderImage'
import { VideoPlayer } from '../../components/media/VideoPlayer'
import { maneuverById } from '../../content/selectors'
import { mediaStatus, resolveVideoUrl } from '../../media/urls'
import { isClassId, routes } from '../../navigation/routes'

export function ManeuverDetailScreen() {
  const { classId, maneuverId } = useParams()

  if (!isClassId(classId) || classId !== 'a') {
    return <Navigate to={routes.home} replace />
  }

  const maneuver = maneuverById(maneuverId)
  if (!maneuver) {
    return <Navigate to={routes.area('a', 'grundfahraufgaben')} replace />
  }

  const status = mediaStatus(maneuver)
  const src = resolveVideoUrl(maneuver.urlKey)

  return (
    <section className="screen screen--dense">
      <ScreenHeader title={maneuver.title} backTo={routes.area('a', 'grundfahraufgaben')} />
      <ReviewBanner kind="professional" />
      {maneuver.demo ? <DemoBanner>Demo-Clip zur Aufgabe, keine verbindliche Prüfungsnorm.</DemoBanner> : null}
      <PlaceholderImage label={maneuver.title} />
      <p className="detail-body">{maneuver.body}</p>
      <VideoPlayer
        src={status === 'placeholder' ? undefined : src}
        title={maneuver.title}
        explanation="Optionales Erklärvideo. Anforderungen unterliegen der fachlichen Prüfung."
      />
    </section>
  )
}
