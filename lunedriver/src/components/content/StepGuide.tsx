import type { HitchingStep } from '../../types'
import { DemoBanner } from '../ui/DemoBanner'
import { MediaBlock } from '../media/MediaBlock'
import { VideoPlayer } from '../media/VideoPlayer'
import { mediaStatus, resolveVideoUrl } from '../../media/urls'

type StepGuideProps = {
  step: HitchingStep
}

export function StepGuide({ step }: StepGuideProps) {
  const status = mediaStatus(step)
  const src = resolveVideoUrl(step.urlKey)

  return (
    <div className="stack">
      {step.demo ? <DemoBanner>Demo-Schrittfolge für das An- und Abkuppeln.</DemoBanner> : null}
      <p className="muted-hint">Schritt {step.order}</p>
      <MediaBlock imageLabel={step.imageLabel} />
      <p className="detail-body">{step.body}</p>
      {status === 'placeholder' ? (
        <VideoPlayer title={step.title} explanation="Optionales Schritt-Video folgt." />
      ) : (
        <VideoPlayer src={src} title={step.title} />
      )}
    </div>
  )
}
