import { NavLink } from 'react-router-dom'
import { DownloadIcon, HomeIcon, SettingsIcon } from '../icons/Icons'
import { routes } from '../../navigation/routes'

const items = [
  { to: routes.home, label: 'Startseite', icon: HomeIcon, end: true },
  { to: routes.downloads, label: 'Downloads', icon: DownloadIcon, end: false },
  { to: routes.settings, label: 'Einstellungen', icon: SettingsIcon, end: false },
] as const

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Hauptnavigation">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `nav-item${isActive ? ' nav-item--active' : ''}`}
          >
            <Icon size={22} />
            <span>{item.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}
