import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { ScreenHeader } from '../../components/layout/ScreenHeader'
import { ContentList } from '../../components/ui/ContentList'
import { DownloadStatusBadge } from '../../components/ui/DownloadStatusBadge'
import { ListRow } from '../../components/ui/ListRow'
import { PlaceholderState } from '../../components/ui/PlaceholderState'
import { techniqueForVehicle, vehicleById, vehicleSelectableIn } from '../../content/selectors'
import { mediaStatus } from '../../media/urls'
import { isClassId, routes } from '../../navigation/routes'

function statusLabel(status: ReturnType<typeof mediaStatus>) {
  if (status === 'demo') return 'Demo'
  if (status === 'url') return 'URL'
  return 'Inhalt folgt'
}

export function VehicleTopicsScreen() {
  const navigate = useNavigate()
  const { classId, vehicleId } = useParams()

  if (!isClassId(classId)) {
    return <Navigate to={routes.home} replace />
  }

  if (classId === 'be') {
    return <Navigate to={routes.area('be', 'anhaengertechnik')} replace />
  }

  const vehicle = vehicleById(vehicleId)
  if (!vehicle || !vehicleSelectableIn(vehicle, classId)) {
    return <Navigate to={routes.area(classId, 'technik')} replace />
  }

  const items = techniqueForVehicle(vehicle.id)
  const kindLabel = vehicle.kind === 'car' ? 'Pkw' : 'Motorrad'

  return (
    <section className="screen screen--dense">
      <ScreenHeader
        title={vehicle.title}
        subtitle={`${kindLabel} · Platzhalter`}
        backTo={routes.area(classId, 'technik')}
      />
      {items.length === 0 ? (
        <PlaceholderState title="Anleitungen folgen">
          <p>Für dieses Fahrzeug sind noch keine technischen Inhalte hinterlegt.</p>
        </PlaceholderState>
      ) : (
        <ContentList>
          {items.map((item) => (
            <ListRow
              key={item.id}
              title={item.title}
              meta={item.summary}
              trailing={<DownloadStatusBadge label={statusLabel(mediaStatus(item))} />}
              onClick={() => navigate(routes.techniqueDetail(classId, vehicle.id, item.id))}
            />
          ))}
        </ContentList>
      )}
    </section>
  )
}
