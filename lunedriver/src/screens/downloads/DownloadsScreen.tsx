import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../components/layout/ScreenHeader'
import { Banner } from '../../components/ui/Banner'
import { ContentList } from '../../components/ui/ContentList'
import { DownloadStatusBadge } from '../../components/ui/DownloadStatusBadge'
import { videos } from '../../content/videos'
import { mediaStatus } from '../../media/urls'
import {
  currentLinkKind,
  linkLabel,
  webDownloadStub,
  type DownloadItem,
  type LinkKind,
} from '../../modules/downloads'
import { readSettings } from '../../modules/settings/store'
import { classButtons } from '../../navigation/classButtons'
import { routes } from '../../navigation/routes'
import type { MediaStatus } from '../../types'

function mediaLabel(status: MediaStatus) {
  if (status === 'demo') return 'Demo'
  if (status === 'url') return 'URL'
  return 'Keine Datei'
}

function stubLabel(item: DownloadItem | undefined, downloadable: boolean) {
  if (!downloadable) return 'Nicht verfügbar'
  if (item?.status === 'done') return 'Gemerkt (Stub)'
  if (item?.status === 'queued') return 'Wartet auf WLAN'
  return 'Nicht gemerkt'
}

export function DownloadsScreen() {
  const navigate = useNavigate()
  const [stubItems, setStubItems] = useState<DownloadItem[]>([])
  const [preferWifi, setPreferWifi] = useState(() => readSettings().preferWifiDownloads)
  const [link, setLink] = useState<LinkKind>(() => currentLinkKind())

  const reload = useCallback(async () => {
    setStubItems(await webDownloadStub.list())
    setPreferWifi(readSettings().preferWifiDownloads)
    setLink(currentLinkKind())
  }, [])

  useEffect(() => {
    void reload()
  }, [reload])

  const byId = new Map(stubItems.map((item) => [item.videoId, item]))

  async function vormerken(videoId: string) {
    const settings = readSettings()
    await webDownloadStub.requestDownload(videoId, {
      preferWifi: settings.preferWifiDownloads,
      link: currentLinkKind(),
    })
    await reload()
  }

  async function entfernen(videoId: string) {
    await webDownloadStub.remove(videoId)
    await reload()
  }

  return (
    <section className="screen screen--dense">
      <ScreenHeader title="Downloads" subtitle="Fahrvideos aus dem Content-Modul" />
      <Banner title="Web-Stub, kein Offline">
        <p>
          Vormerken und Entfernen laufen nur im Browser-Speicher. Es werden keine Videodateien
          abgelegt. Capacitor-Offline folgt später als eigenes Modul.
        </p>
      </Banner>
      <p className="muted-hint">
        WLAN-Vorrang {preferWifi ? 'an' : 'aus'} · Verbindung {linkLabel(link)}. Qualität aus den
        Einstellungen greift hier nicht.
      </p>

      {classButtons.map((klass) => {
        const items = videos.filter((video) => video.classId === klass.id)
        return (
          <div key={klass.id} className="download-group">
            <h2 className="section-kicker">{klass.title} · {klass.subtitle}</h2>
            <ContentList>
              {items.map((video) => {
                const status = mediaStatus(video)
                const downloadable = status !== 'placeholder'
                const stub = byId.get(video.id)
                const meta =
                  status === 'placeholder'
                    ? 'Keine Datei'
                    : [video.sizeLabel, video.durationLabel, mediaLabel(status)].filter(Boolean).join(' · ')
                return (
                  <div key={video.id} className="download-row">
                    <button
                      type="button"
                      className="download-row__open"
                      onClick={() => navigate(routes.video(klass.id, video.id))}
                    >
                      <span className="list-row__title">{video.title}</span>
                      <span className="list-row__meta">{meta}</span>
                    </button>
                    <div className="download-row__side">
                      <DownloadStatusBadge label={stubLabel(stub, downloadable)} />
                      {downloadable && !stub ? (
                        <button type="button" className="row-action" onClick={() => void vormerken(video.id)}>
                          Vormerken
                        </button>
                      ) : null}
                      {downloadable && stub?.status === 'queued' ? (
                        <button type="button" className="row-action" onClick={() => void vormerken(video.id)}>
                          Erneut
                        </button>
                      ) : null}
                      {stub ? (
                        <button
                          type="button"
                          className="row-action row-action--danger"
                          onClick={() => void entfernen(video.id)}
                        >
                          Entfernen
                        </button>
                      ) : null}
                    </div>
                  </div>
                )
              })}
            </ContentList>
          </div>
        )
      })}
    </section>
  )
}
