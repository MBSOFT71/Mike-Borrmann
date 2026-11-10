import { Navigate, useParams } from 'react-router-dom'
import { ScreenHeader } from '../../components/layout/ScreenHeader'
import { SignDetail } from '../../components/ui/SignDetail'
import { isSignCategory, signById } from '../../content/selectors'
import { isClassId, routes } from '../../navigation/routes'

export function SignDetailScreen() {
  const { classId, category, signId } = useParams()

  if (!isClassId(classId)) {
    return <Navigate to={routes.home} replace />
  }

  if (!isSignCategory(category)) {
    return <Navigate to={routes.area(classId, 'verkehrszeichen')} replace />
  }

  const sign = signById(signId)
  if (!sign || sign.category !== category) {
    return <Navigate to={routes.signCategory(classId, category)} replace />
  }

  return (
    <section className="screen screen--dense">
      <ScreenHeader title={sign.title} backTo={routes.signCategory(classId, category)} />
      <SignDetail sign={sign} classId={classId} />
    </section>
  )
}
