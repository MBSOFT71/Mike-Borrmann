import { resolveVideoUrl } from '../../media/urls'
import { PlaceholderImage } from './PlaceholderImage'
import { VideoPlayer } from './VideoPlayer'

type MediaBlockProps = {
  imageLabel: string
  urlKey?: string
  videoTitle?: string
}

export function MediaBlock({ imageLabel, urlKey, videoTitle }: MediaBlockProps) {
  const src = resolveVideoUrl(urlKey)

  return (
    <div className="stack">
      <PlaceholderImage label={imageLabel} />
      {src ? <VideoPlayer src={src} title={videoTitle} /> : null}
    </div>
  )
}
