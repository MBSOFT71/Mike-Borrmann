type DownloadStatusBadgeProps = {
  label?: string
}

export function DownloadStatusBadge({ label = 'In Vorbereitung' }: DownloadStatusBadgeProps) {
  return <span className="badge">{label}</span>
}
