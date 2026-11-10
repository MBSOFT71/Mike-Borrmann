import { useNavigate } from 'react-router-dom'
import type { ClassId } from '../../types'
import type { AreaConfig } from '../../navigation/areas'
import { routes } from '../../navigation/routes'
import {
  ChevronRightIcon,
  ClipboardIcon,
  ConeIcon,
  HitchIcon,
  PlayIcon,
  TrailerIcon,
  SettingsIcon,
  WarningIcon,
} from '../icons/Icons'

const icons = {
  play: PlayIcon,
  wrench: SettingsIcon,
  clipboard: ClipboardIcon,
  warning: WarningIcon,
  cone: ConeIcon,
  trailerTech: TrailerIcon,
  hitch: HitchIcon,
}

type AreaMenuCardProps = {
  classId: ClassId
  area: AreaConfig
}

export function AreaMenuCard({ classId, area }: AreaMenuCardProps) {
  const navigate = useNavigate()
  const Icon = icons[area.icon]

  return (
    <button
      type="button"
      className="class-select class-select--compact"
      onClick={() => navigate(routes.area(classId, area.id))}
    >
      <span className="class-select__icon" aria-hidden="true">
        <Icon size={24} />
      </span>
      <span className="class-select__text">
        <span className="class-select__title">{area.title}</span>
        <span className="class-select__sub">{area.description}</span>
      </span>
      <span className="class-select__chevron" aria-hidden="true">
        <ChevronRightIcon size={22} />
      </span>
    </button>
  )
}
