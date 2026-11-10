import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { ScreenHeader } from '../../components/layout/ScreenHeader'
import { Banner } from '../../components/ui/Banner'
import { ContentList } from '../../components/ui/ContentList'
import { DemoBanner } from '../../components/ui/DemoBanner'
import { DownloadStatusBadge } from '../../components/ui/DownloadStatusBadge'
import { ListRow } from '../../components/ui/ListRow'
import { ReviewBanner } from '../../components/ui/ReviewBanner'
import {
  allHitchingSteps,
  allManeuvers,
  allSignCategories,
  questionsForClass,
  signsInCategory,
  trailerTopicsFor,
  vehiclesForClass,
  videosForClass,
} from '../../content/selectors'
import { mediaStatus } from '../../media/urls'
import { getArea } from '../../navigation/areas'
import { classButtons } from '../../navigation/classButtons'
import { isClassId, routes } from '../../navigation/routes'
import type { AreaId } from '../../navigation/areas'
import type { ClassId, MediaStatus } from '../../types'

function statusLabel(status: MediaStatus) {
  if (status === 'demo') return 'Demo'
  if (status === 'url') return 'URL'
  return 'Video folgt'
}

function OverviewThumb({ demo }: { demo?: boolean }) {
  if (demo) {
    return <img className="list-thumb" src="/media/placeholders/demo-poster.svg" alt="" />
  }
  return <span className="list-thumb list-thumb--empty" aria-hidden="true" />
}

export function AreaOverviewScreen() {
  const { classId, areaId } = useParams()

  if (!isClassId(classId)) {
    return <Navigate to={routes.home} replace />
  }

  if (classId === 'be' && areaId === 'technik') {
    return <Navigate to={routes.area('be', 'anhaengertechnik')} replace />
  }

  const area = getArea(classId, areaId)
  if (!area) {
    return <Navigate to={routes.classMenu(classId)} replace />
  }

  const klass = classButtons.find((item) => item.id === classId)

  return (
    <section className="screen screen--dense">
      <ScreenHeader
        title={area.title}
        subtitle={klass ? `${klass.title} · ${klass.subtitle}` : undefined}
        backTo={routes.classMenu(classId)}
      />
      {area.review ? <ReviewBanner kind={area.review} /> : null}
      <AreaContentList classId={classId} areaId={area.id} />
    </section>
  )
}

function AreaContentList({ classId, areaId }: { classId: ClassId; areaId: AreaId }) {
  const navigate = useNavigate()

  if (areaId === 'fahrstrecken') {
    const items = videosForClass(classId)
    const hasDemo = items.some((item) => item.demo)
    return (
      <>
        {hasDemo ? <DemoBanner>Markierte Einträge sind Demo-Dateien, keine echten Prüfungsstrecken.</DemoBanner> : null}
        <ContentList>
          {items.map((item) => {
            const status = mediaStatus(item)
            return (
              <ListRow
                key={item.id}
                leading={<OverviewThumb demo={item.demo} />}
                title={item.title}
                meta={
                  status === 'placeholder'
                    ? 'Keine Datei'
                    : [item.durationLabel, item.sizeLabel].filter(Boolean).join(' · ')
                }
                trailing={<DownloadStatusBadge label={statusLabel(status)} />}
                onClick={() => navigate(routes.video(classId, item.id))}
              />
            )
          })}
        </ContentList>
      </>
    )
  }

  if (areaId === 'technik') {
    const items = vehiclesForClass(classId)
    const kindHint = classId === 'a' ? 'Motorrad' : 'Pkw'
    return (
      <>
        <Banner title="Platzhalter">
          <p>Platzhalterflotte der Fahrschule. Modelle, Fotos und technische Besonderheiten folgen.</p>
        </Banner>
        <ContentList>
          {items.map((item) => (
            <ListRow
              key={item.id}
              title={item.title}
              meta={`${kindHint} · Platzhalter`}
              trailing={<DownloadStatusBadge label="Platzhalter" />}
              onClick={() => navigate(routes.vehicleTechnik(classId, item.id))}
            />
          ))}
        </ContentList>
      </>
    )
  }

  if (areaId === 'anhaengertechnik') {
    const items = trailerTopicsFor(classId)
    return (
      <>
        <Banner title="Platzhalter">
          <p>Ein Anhänger. Fotos, Videos und technische Angaben folgen.</p>
        </Banner>
        <ContentList>
          {items.map((item) => (
            <ListRow
              key={item.id}
              title={item.title}
              meta={item.summary}
              trailing={<DownloadStatusBadge label={statusLabel(mediaStatus(item))} />}
              onClick={() => navigate(routes.trailerTech(classId, item.id))}
            />
          ))}
        </ContentList>
      </>
    )
  }

  if (areaId === 'grundfahraufgaben') {
    return (
      <ContentList>
        {allManeuvers().map((item) => (
          <ListRow
            key={item.id}
            title={item.title}
            meta={`${item.summary ?? ''} · fachlich prüfpflichtig`}
            trailing={<DownloadStatusBadge label={statusLabel(mediaStatus(item))} />}
            onClick={() => navigate(routes.maneuver(classId, item.id))}
          />
        ))}
      </ContentList>
    )
  }

  if (areaId === 'an-abkuppeln') {
    return (
      <ContentList>
        {allHitchingSteps().map((item) => (
          <ListRow
            key={item.id}
            title={`${item.order}. ${item.title}`}
            meta={item.summary}
            trailing={<DownloadStatusBadge label={statusLabel(mediaStatus(item))} />}
            onClick={() => navigate(routes.hitch(classId, item.id))}
          />
        ))}
      </ContentList>
    )
  }

  if (areaId === 'fragen') {
    const items = questionsForClass(classId)
    if (items.length === 0) {
      return (
        <ContentList>
          <ListRow title="Fragen folgen" meta="Noch keine Übungsfragen in diesem Content-Modul" />
        </ContentList>
      )
    }
    return (
      <>
        <DemoBanner>Selbst erstellte Demo-Fragen. Kein amtlicher Katalog, keine Simulation.</DemoBanner>
        <ContentList>
          {items.map((item) => (
            <ListRow
              key={item.id}
              title={item.prompt}
              meta={item.demo ? 'Demo' : undefined}
              onClick={() => navigate(routes.question(classId, item.id))}
            />
          ))}
        </ContentList>
      </>
    )
  }

  if (areaId === 'verkehrszeichen') {
    return (
      <ContentList>
        {allSignCategories().map((item) => (
          <ListRow
            key={item.id}
            title={item.title}
            meta={`${item.hint} · ${signsInCategory(item.id).length} Platzhalter`}
            onClick={() => navigate(routes.signCategory(classId, item.id))}
          />
        ))}
      </ContentList>
    )
  }

  return null
}
