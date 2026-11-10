import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { ScreenHeader } from '../../components/layout/ScreenHeader'
import { ContentList } from '../../components/ui/ContentList'
import { ListRow } from '../../components/ui/ListRow'
import { ReviewBanner } from '../../components/ui/ReviewBanner'
import { isSignCategory, signsInCategory } from '../../content/selectors'
import { signCategories } from '../../content/signs'
import { classButtons } from '../../navigation/classButtons'
import { isClassId, routes } from '../../navigation/routes'

export function SignCategoryScreen() {
  const navigate = useNavigate()
  const { classId, category } = useParams()

  if (!isClassId(classId)) {
    return <Navigate to={routes.home} replace />
  }

  if (!isSignCategory(category)) {
    return <Navigate to={routes.area(classId, 'verkehrszeichen')} replace />
  }

  const meta = signCategories.find((item) => item.id === category)
  const items = signsInCategory(category)
  const klass = classButtons.find((item) => item.id === classId)

  return (
    <section className="screen screen--dense">
      <ScreenHeader
        title={meta?.title ?? 'Verkehrszeichen'}
        subtitle={klass ? `${klass.title} · Platzhalterbibliothek` : undefined}
        backTo={routes.area(classId, 'verkehrszeichen')}
      />
      <ReviewBanner kind="legal" />
      <ContentList>
        {items.map((sign) => (
          <ListRow
            key={sign.id}
            title={sign.title}
            meta={`Nr. ${sign.officialNumber ?? '—'} · nicht amtlich`}
            onClick={() => navigate(routes.signDetail(classId, category, sign.id))}
          />
        ))}
      </ContentList>
    </section>
  )
}
