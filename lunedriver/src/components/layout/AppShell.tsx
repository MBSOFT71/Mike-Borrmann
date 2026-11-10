import { Outlet, useLocation } from 'react-router-dom'
import { isDetailPath } from '../../navigation/routes'
import { BottomNav } from './BottomNav'

export function AppShell() {
  const location = useLocation()
  const detail = isDetailPath(location.pathname)

  return (
    <div className={detail ? 'app-shell app-shell--detail' : 'app-shell'}>
      <main className="app-shell__main">
        <Outlet />
      </main>
      {detail ? null : <BottomNav />}
    </div>
  )
}
