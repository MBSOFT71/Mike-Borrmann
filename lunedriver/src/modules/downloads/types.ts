export type DownloadStatus = 'queued' | 'done'

export type DownloadItem = {
  videoId: string
  status: DownloadStatus
  bytes?: number
}

export type DownloadRequestContext = {
  preferWifi: boolean
  link: 'wifi' | 'cellular' | 'other' | 'unknown'
}

/**
 * Download-Interface. Capacitor-Offline folgt später als eigenes Modul.
 * Der Web-Stub speichert nur Vormerkungen, keine Dateien.
 */
export type DownloadService = {
  list(): Promise<DownloadItem[]>
  requestDownload(videoId: string, context?: DownloadRequestContext): Promise<void>
  remove(videoId: string): Promise<void>
}
