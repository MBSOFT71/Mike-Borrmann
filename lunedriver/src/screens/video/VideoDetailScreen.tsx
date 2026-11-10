import { Navigate, useParams } from 'react-router-dom'
import { ScreenHeader } from '../../components/layout/ScreenHeader'
import { DemoBanner } from '../../components/ui/DemoBanner'
import { VideoPlayer } from '../../components/media/VideoPlayer'
import { signById, videoById } from '../../content/selectors'
import { mediaStatus, resolveVideoUrl } from '../../media/urls'
import { isClassId, routes } from '../../navigation/routes'

export function VideoDetailScreen() {
  const { classId, videoId } = useParams()

  if (!isClassId(classId)) {
    return <Navigate to={routes.home} replace />
  }

  const video = videoById(classId, videoId)
  if (!video) {
    return <Navigate to={routes.area(classId, 'fahrstrecken')} replace />
  }

  const src = resolveVideoUrl(video.urlKey)
  const status = mediaStatus(video)
  const markers = video.markers?.map((marker) => {
    const sign = signById(marker.signId)
    if (!sign) return marker
    const number = sign.officialNumber ? `${sign.officialNumber} · ` : ''
    return { ...marker, label: `${number}${sign.title}` }
  })

  return (
    <section className="screen screen--dense">
      <ScreenHeader title={video.title} backTo={routes.area(classId, 'fahrstrecken')} />
      {video.demo ? <DemoBanner>Lokale Demo-Datei — kein realer Streckenabschnitt.</DemoBanner> : null}
      <VideoPlayer
        src={status === 'placeholder' ? undefined : src}
        title={video.title}
        poster={video.demo ? '/media/placeholders/demo-poster.svg' : undefined}
        explanation={video.explanation}
        markers={markers}
      />
    </section>
  )
}
