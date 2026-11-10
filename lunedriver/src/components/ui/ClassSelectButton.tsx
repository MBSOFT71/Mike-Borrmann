import { useNavigate } from 'react-router-dom'
import type { ClassButtonConfig } from '../../navigation/classButtons'
import { routes } from '../../navigation/routes'
import { CarIcon, ChevronRightIcon, MotorcycleIcon, TrailerIcon } from '../icons/Icons'

const icons = {
  car: CarIcon,
  motorcycle: MotorcycleIcon,
  trailer: TrailerIcon,
}

type ClassSelectButtonProps = {
  config: ClassButtonConfig
}

export function ClassSelectButton({ config }: ClassSelectButtonProps) {
  const navigate = useNavigate()
  const Icon = icons[config.icon]

  return (
    <button
      type="button"
      className="class-select"
      onClick={() => navigate(routes.classMenu(config.id))}
    >
      <span className="class-select__icon" aria-hidden="true">
        <Icon size={26} />
      </span>
      <span className="class-select__text">
        <span className="class-select__title">{config.title}</span>
        <span className="class-select__sub">{config.subtitle}</span>
      </span>
      <span className="class-select__chevron" aria-hidden="true">
        <ChevronRightIcon size={22} />
      </span>
    </button>
  )
}
