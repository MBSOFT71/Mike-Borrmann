import { Navigate, useParams } from 'react-router-dom'
import { ScreenHeader } from '../../components/layout/ScreenHeader'
import { AreaMenuCard } from '../../components/ui/AreaMenuCard'
import { CarIcon, MotorcycleIcon, TrailerIcon } from '../../components/icons/Icons'
import { classButtons } from '../../navigation/classButtons'
import { getAreas } from '../../navigation/areas'
import { isClassId, routes } from '../../navigation/routes'

const classIcons = {
  car: CarIcon,
  motorcycle: MotorcycleIcon,
  trailer: TrailerIcon,
}

export function ClassMenuScreen() {
  const { classId } = useParams()

  if (!isClassId(classId)) {
    return <Navigate to={routes.home} replace />
  }

  const config = classButtons.find((item) => item.id === classId)
  const areas = getAreas(classId)
  const Icon = config ? classIcons[config.icon] : CarIcon

  return (
    <section className="screen screen--dense">
      <ScreenHeader
        title={config?.title ?? 'Klasse'}
        subtitle={config?.subtitle}
        backTo={routes.home}
        icon={<Icon size={22} />}
      />
      <div className="class-list class-list--flush">
        {areas.map((area) => (
          <AreaMenuCard key={area.id} classId={classId} area={area} />
        ))}
      </div>
    </section>
  )
}
