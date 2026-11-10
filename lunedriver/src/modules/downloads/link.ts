export type LinkKind = 'wifi' | 'cellular' | 'other' | 'unknown'

type NetworkInformationLike = {
  type?: string
}

/** Best-effort link kind. Many desktops expose nothing — then `unknown`. */
export function currentLinkKind(): LinkKind {
  const nav = navigator as Navigator & {
    connection?: NetworkInformationLike
    mozConnection?: NetworkInformationLike
    webkitConnection?: NetworkInformationLike
  }
  const conn = nav.connection ?? nav.mozConnection ?? nav.webkitConnection
  if (!conn?.type) return 'unknown'
  if (conn.type === 'wifi' || conn.type === 'ethernet') return 'wifi'
  if (conn.type === 'cellular') return 'cellular'
  if (conn.type === 'none' || conn.type === 'unknown') return 'unknown'
  return 'other'
}

export function shouldHoldForWifi(preferWifi: boolean, link: LinkKind): boolean {
  if (!preferWifi) return false
  return link === 'cellular' || link === 'unknown'
}

export function linkLabel(link: LinkKind): string {
  if (link === 'wifi') return 'WLAN / Kabel'
  if (link === 'cellular') return 'Mobilfunk'
  if (link === 'other') return 'andere Verbindung'
  return 'nicht erkannt'
}
