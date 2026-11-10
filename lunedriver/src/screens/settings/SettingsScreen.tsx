import { useEffect, useState } from 'react'
import { APP_NAME, APP_PHASE, APP_VERSION } from '../../appInfo'
import { ScreenHeader } from '../../components/layout/ScreenHeader'
import { Banner } from '../../components/ui/Banner'
import { Card } from '../../components/ui/Card'
import { InVorbereitungBadge } from '../../components/ui/InVorbereitungBadge'
import { InfoIcon, StorageIcon, WifiIcon } from '../../components/icons/Icons'
import { currentLinkKind, linkLabel } from '../../modules/downloads'
import { readSettings, writeSettings } from '../../modules/settings/store'
import type { AppSettings, VideoQuality } from '../../types'

export function SettingsScreen() {
  const [settings, setSettings] = useState<AppSettings>(readSettings)
  const link = currentLinkKind()

  useEffect(() => {
    writeSettings(settings)
  }, [settings])

  function setQuality(videoQuality: VideoQuality) {
    setSettings((current) => ({ ...current, videoQuality }))
  }

  return (
    <section className="screen screen--dense">
      <ScreenHeader title="Einstellungen" />
      <Banner title="Teilweise vorbereitet">
        <p>
          Der WLAN-Vorrang gilt für den Download-Stub. Videoqualität und Speicherverwaltung haben
          noch keine native Wirkung.
        </p>
      </Banner>

      <Card>
        <div className="row-between">
          <div className="setting-copy">
            <div className="setting-heading">
              <WifiIcon size={20} />
              <h2>WLAN-Downloads bevorzugen</h2>
            </div>
            <p>
              An: ohne erkanntes WLAN bleibt die Vormerkung in der Warteschlange. Verbindung:{' '}
              {linkLabel(link)}.
            </p>
          </div>
          <button
            type="button"
            className="switch"
            role="switch"
            aria-checked={settings.preferWifiDownloads}
            aria-label="WLAN-Downloads bevorzugen"
            onClick={() =>
              setSettings((current) => ({
                ...current,
                preferWifiDownloads: !current.preferWifiDownloads,
              }))
            }
          >
            <span className="switch__knob" />
          </button>
        </div>
      </Card>

      <Card>
        <div className="setting-copy">
          <h2>Videoqualität</h2>
          <p>480p Standard, 720p optional — Präferenz, greift erst mit einer echten Medienquelle.</p>
        </div>
        <div className="quality-row">
          <button
            type="button"
            className={`quality-chip${settings.videoQuality === '480p' ? ' quality-chip--active' : ''}`}
            onClick={() => setQuality('480p')}
          >
            480p
            <small>Standard</small>
          </button>
          <button
            type="button"
            className={`quality-chip${settings.videoQuality === '720p' ? ' quality-chip--active' : ''}`}
            onClick={() => setQuality('720p')}
          >
            720p
            <small>Optional</small>
          </button>
        </div>
        <p className="muted-hint">
          <InVorbereitungBadge />
        </p>
      </Card>

      <Card>
        <div className="setting-heading">
          <InfoIcon size={20} />
          <h2>App-Informationen</h2>
        </div>
        <dl className="app-info">
          <dt>Name</dt>
          <dd>{APP_NAME}</dd>
          <dt>Version</dt>
          <dd>{APP_VERSION}</dd>
          <dt>Phase</dt>
          <dd>Phase {APP_PHASE}</dd>
        </dl>
      </Card>

      <Card>
        <div className="row-between">
          <div className="setting-copy">
            <div className="setting-heading">
              <StorageIcon size={20} />
              <h2>Speicherverwaltung für Offline-Videos</h2>
            </div>
            <p>Spätere Erweiterung — in dieser Version nicht umgesetzt.</p>
          </div>
          <InVorbereitungBadge />
        </div>
      </Card>
    </section>
  )
}
