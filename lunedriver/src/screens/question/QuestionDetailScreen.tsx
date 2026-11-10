import { Navigate, useParams } from 'react-router-dom'
import { ScreenHeader } from '../../components/layout/ScreenHeader'
import { QuestionView } from '../../components/ui/QuestionView'
import { questionById } from '../../content/selectors'
import { isClassId, routes } from '../../navigation/routes'

export function QuestionDetailScreen() {
  const { classId, questionId } = useParams()

  if (!isClassId(classId)) {
    return <Navigate to={routes.home} replace />
  }

  const question = questionById(classId, questionId)
  if (!question) {
    return <Navigate to={routes.area(classId, 'fragen')} replace />
  }

  return (
    <section className="screen screen--dense">
      <ScreenHeader title="Übungsfrage" backTo={routes.area(classId, 'fragen')} />
      <QuestionView question={question} />
    </section>
  )
}
