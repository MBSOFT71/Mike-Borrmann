import { Navigate, useParams } from 'react-router-dom'
import { TechniqueDetail } from '../../components/content/TechniqueDetail'
import { ScreenHeader } from '../../components/layout/ScreenHeader'
import { techniqueById, vehicleById, vehicleSelectableIn } from '../../content/selectors'
import { isClassId, routes } from '../../navigation/routes'

export function TechniqueDetailScreen() {
  const { classId, vehicleId, topicId } = useParams()

  if (!isClassId(classId)) {
    return <Navigate to={routes.home} replace />
  }

  const topic = techniqueById(topicId)
  if (!topic) {
    return (
      <Navigate
        to={vehicleId ? routes.vehicleTechnik(classId, vehicleId) : routes.area(classId, 'anhaengertechnik')}
        replace
      />
    )
  }

  if (classId === 'be' && topic.group === 'vehicle') {
    return <Navigate to={routes.area('be', 'anhaengertechnik')} replace />
  }

  if (topic.group === 'trailer') {
    if (topic.classId !== classId) {
      return <Navigate to={routes.area(classId, 'anhaengertechnik')} replace />
    }
    return (
      <section className="screen screen--dense">
        <ScreenHeader title={topic.title} backTo={routes.area(classId, 'anhaengertechnik')} />
        <TechniqueDetail topic={topic} />
      </section>
    )
  }

  const vehicle = vehicleById(vehicleId ?? topic.vehicleId)
  if (!vehicle || !topic.vehicleId || topic.vehicleId !== vehicle.id || !vehicleSelectableIn(vehicle, classId)) {
    return <Navigate to={routes.area(classId, 'technik')} replace />
  }

  return (
    <section className="screen screen--dense">
      <ScreenHeader title={topic.title} backTo={routes.vehicleTechnik(classId, vehicle.id)} />
      <TechniqueDetail topic={topic} />
    </section>
  )
}
