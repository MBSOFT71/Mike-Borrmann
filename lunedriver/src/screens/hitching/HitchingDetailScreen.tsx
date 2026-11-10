import { Navigate, useParams } from 'react-router-dom'
import { StepGuide } from '../../components/content/StepGuide'
import { ScreenHeader } from '../../components/layout/ScreenHeader'
import { hitchingById } from '../../content/selectors'
import { isClassId, routes } from '../../navigation/routes'

export function HitchingDetailScreen() {
  const { classId, stepId } = useParams()

  if (!isClassId(classId) || classId !== 'be') {
    return <Navigate to={routes.home} replace />
  }

  const step = hitchingById(stepId)
  if (!step) {
    return <Navigate to={routes.area('be', 'an-abkuppeln')} replace />
  }

  return (
    <section className="screen screen--dense">
      <ScreenHeader title={step.title} backTo={routes.area('be', 'an-abkuppeln')} />
      <StepGuide step={step} />
    </section>
  )
}
