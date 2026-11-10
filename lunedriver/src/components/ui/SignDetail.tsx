import type { ClassId, TrafficSign } from '../../types'
import { signCategories, signGraphicPath } from '../../content/signs'
import { classButtons } from '../../navigation/classButtons'
import { PlaceholderImage } from '../media/PlaceholderImage'
import { ReviewBanner } from './ReviewBanner'

type SignDetailProps = {
  sign: TrafficSign
  classId: ClassId
}

export function SignDetail({ sign, classId }: SignDetailProps) {
  const klass = classButtons.find((item) => item.id === classId)
  const note = sign.classNotes?.[classId]
  const categoryTitle = signCategories.find((item) => item.id === sign.category)?.title

  return (
    <div className="stack">
      <ReviewBanner kind="legal" />
      <PlaceholderImage label={sign.title} src={signGraphicPath(sign.category)} />
      <dl className="app-info">
        <dt>Nummer</dt>
        <dd>{sign.officialNumber ?? '—'}</dd>
        <dt>Kategorie</dt>
        <dd>{categoryTitle ?? sign.category}</dd>
      </dl>
      <p className="detail-body">{sign.explanation}</p>
      {note ? (
        <div className="card">
          <strong>Hinweis {klass ? `${klass.title}` : classId.toUpperCase()}</strong>
          <p className="detail-body detail-body--tight">{note}</p>
        </div>
      ) : null}
    </div>
  )
}
