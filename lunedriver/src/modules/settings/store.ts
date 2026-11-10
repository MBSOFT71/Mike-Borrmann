import type { AppSettings } from '../../types'

export const SETTINGS_KEY = 'lunedriver.settings.v1'

export const defaultSettings: AppSettings = {
  preferWifiDownloads: true,
  videoQuality: '480p',
}

export function readSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return defaultSettings
    const parsed = JSON.parse(raw) as Partial<AppSettings>
    return {
      preferWifiDownloads: parsed.preferWifiDownloads ?? true,
      videoQuality: parsed.videoQuality === '720p' ? '720p' : '480p',
    }
  } catch {
    return defaultSettings
  }
}

export function writeSettings(settings: AppSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}
