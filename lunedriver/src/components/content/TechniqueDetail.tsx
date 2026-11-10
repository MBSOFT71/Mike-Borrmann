import type { TechniqueTopic } from '../../types'
import { mediaStatus, resolveVideoUrl } from '../../media/urls'
import { DemoBanner } from '../ui/DemoBanner'
import { MediaBlock } from '../media/MediaBlock'
import { VideoPlayer } from '../media/VideoPlayer'

type TechniqueDetailProps = {
  topic: TechniqueTopic
}

export function TechniqueDetail({ topic }: TechniqueDetailProps) {
  const status = mediaStatus(topic)
  const src = resolveVideoUrl(topic.urlKey)

  return (
    <div className="stack">
      {topic.demo ? <DemoBanner>Demo-Inhalt, kein amtlicher Katalog.</DemoBanner> : null}
      <MediaBlock imageLabel={topic.imageLabel} />
      <p className="detail-body">{topic.body}</p>
      {status === 'placeholder' ? (
        <VideoPlayer title={topic.title} explanation="Optionales Video folgt, sobald eine URL hinterlegt ist." />
      ) : (
        <VideoPlayer src={src} title={topic.title} />
      )}
    </div>
  )
}
