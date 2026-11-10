/**
 * Konfigurierbare Video-URLs. Nicht in Komponenten hart kodieren.
 * Lokale Demo-Datei oder später eine echte Quelle — keine YouTube-Einbettung.
 */
export const videoUrls: Record<string, string> = {
  'demo-local': '/media/demo/demo-fahrt.mp4',
}

export function resolveVideoUrl(urlKey?: string): string | undefined {
  if (!urlKey) return undefined
  return videoUrls[urlKey]
}

export function mediaStatus(entry: { demo?: boolean; placeholder?: boolean; urlKey?: string }): 'demo' | 'placeholder' | 'url' {
  if (entry.placeholder || !entry.urlKey || !videoUrls[entry.urlKey]) return 'placeholder'
  if (entry.demo) return 'demo'
  return 'url'
}
