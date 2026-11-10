import { shouldHoldForWifi, type LinkKind } from './link'
import type { DownloadItem, DownloadRequestContext, DownloadService, DownloadStatus } from './types'

const STORAGE_KEY = 'lunedriver.downloads.stub.v1'

type Stored = Record<string, DownloadItem>

function load(): Stored {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Stored
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function save(data: Stored) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function asLink(value: DownloadRequestContext['link'] | undefined): LinkKind {
  if (value === 'wifi' || value === 'cellular' || value === 'other' || value === 'unknown') return value
  return 'unknown'
}

/** Web-Stub: merkt IDs, speichert keine Videodateien, kein Capacitor. */
export const webDownloadStub: DownloadService = {
  async list() {
    return Object.values(load())
  },
  async requestDownload(videoId: string, context?: DownloadRequestContext) {
    const hold = shouldHoldForWifi(context?.preferWifi ?? false, asLink(context?.link))
    const status: DownloadStatus = hold ? 'queued' : 'done'
    const data = load()
    data[videoId] = { videoId, status }
    save(data)
  },
  async remove(videoId: string) {
    const data = load()
    delete data[videoId]
    save(data)
  },
}
