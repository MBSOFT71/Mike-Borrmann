import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { BackIcon } from '../icons/Icons'

type ScreenHeaderProps = {
  title: string
  subtitle?: string
  backTo?: string
  icon?: ReactNode
}

export function ScreenHeader({ title, subtitle, backTo, icon }: ScreenHeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="screen-header">
      {backTo ? (
        <button
          type="button"
          className="screen-header__back"
          aria-label="Zurück"
          onClick={() => navigate(backTo)}
        >
          <BackIcon size={22} />
        </button>
      ) : null}
      {icon ? <span className="screen-header__icon">{icon}</span> : null}
      <div className="screen-header__copy">
        <h1 className="screen-header__title">{title}</h1>
        {subtitle ? <p className="screen-header__sub">{subtitle}</p> : null}
      </div>
    </header>
  )
}
