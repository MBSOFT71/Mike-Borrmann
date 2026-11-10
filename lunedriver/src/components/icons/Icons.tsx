import type { ReactNode } from 'react'

type IconProps = { size?: number; title?: string }

function Svg({ size = 24, title, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  )
}

export function HomeIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" />
    </Svg>
  )
}

export function DownloadIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 4v10" />
      <path d="M8 11l4 4 4-4" />
      <path d="M5 20h14" />
    </Svg>
  )
}

export function SettingsIcon({ size = 24, title }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title ? <title>{title}</title> : null}
      <path d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.49.49 0 0 0 .12-.64l-1.92-3.32a.49.49 0 0 0-.6-.22l-2.39.96c-.5-.4-1.06-.73-1.69-.98l-.36-2.54A.49.49 0 0 0 13.83 2h-3.66a.49.49 0 0 0-.48.42l-.36 2.54c-.63.25-1.19.58-1.69.98l-2.39-.96a.49.49 0 0 0-.6.22L2.73 8.84a.49.49 0 0 0 .12.64l2.03 1.58c-.04.31-.06.62-.06.94s.02.63.06.94l-2.03 1.58a.49.49 0 0 0-.12.64l1.92 3.32c.13.23.4.32.6.22l2.39-.96c.5.4 1.06.73 1.69.98l.36 2.54c.05.24.25.42.48.42h3.66c.24 0 .44-.18.48-.42l.36-2.54c.63-.25 1.19-.58 1.69-.98l2.39.96c.22.1.47 0 .6-.22l1.92-3.32a.49.49 0 0 0-.12-.64l-2.03-1.58zM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2z" />
    </svg>
  )
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M9 5l7 7-7 7" />
    </Svg>
  )
}

export function BackIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M15 5l-7 7 7 7" />
    </Svg>
  )
}

export function CarIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 15h16" />
      <path d="M5.5 15 7 10.5h10L18.5 15" />
      <path d="M7 10.5 8.2 8h7.6L17 10.5" />
      <circle cx="7.5" cy="16.5" r="1.4" />
      <circle cx="16.5" cy="16.5" r="1.4" />
    </Svg>
  )
}

export function MotorcycleIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="6.5" cy="16.5" r="2.4" />
      <circle cx="17.5" cy="16.5" r="2.4" />
      <path d="M8.8 16.2 12 10.5h4.2" />
      <path d="M12 10.5 9.5 7H7.8" />
      <path d="M16.2 10.5h2.6l1.2 3.2" />
      <path d="M12 10.5l3.4 5.6" />
    </Svg>
  )
}

export function TrailerIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 15.5h8.2L13 11h4.5l1.8 4.5H21" />
      <path d="M13 11V8.5h4.2" />
      <circle cx="7" cy="17.2" r="1.4" />
      <circle cx="16.6" cy="17.2" r="1.4" />
      <path d="M3 15.5v-3.2h4" />
    </Svg>
  )
}

export function InfoIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 10.5V17" />
      <circle cx="12" cy="7.6" r="0.7" fill="currentColor" stroke="none" />
    </Svg>
  )
}

export function StorageIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="4" y="5" width="16" height="14" rx="2.2" />
      <path d="M4 9.5h16" />
      <path d="M8 13.5h5" />
    </Svg>
  )
}

export function PlayIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M10 8.8 16 12l-6 3.2z" fill="currentColor" />
    </Svg>
  )
}

export function WrenchIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 4.2v2.2M12 17.6v2.2M4.8 6.6l1.6 1.6M17.6 15.8l1.6 1.6M3.8 12h2.2M18 12h2.2M4.8 17.4l1.6-1.6M17.6 8.2l1.6-1.6" />
    </Svg>
  )
}

export function ClipboardIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="6" y="5" width="12" height="15" rx="2" />
      <path d="M9 5.2V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5v.7" />
      <path d="M9 10h6M9 13.5h6M9 17h4" />
    </Svg>
  )
}

export function WarningIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 4.2 20.5 19H3.5L12 4.2z" />
      <path d="M12 10v4.2" />
      <circle cx="12" cy="16.6" r="0.7" fill="currentColor" stroke="none" />
    </Svg>
  )
}

export function ConeIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 4 18.5 19h-13L12 4z" />
      <path d="M8.2 13h7.6M7.2 16.5h9.6" />
    </Svg>
  )
}

export function HitchIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="8" width="7" height="8" rx="1.4" />
      <path d="M10.5 12h4.2" />
      <circle cx="16.8" cy="12" r="2.4" />
      <path d="M19.2 12H21" />
    </Svg>
  )
}

export function PauseIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8 6v12M16 6v12" strokeWidth="2.4" />
    </Svg>
  )
}

export function VolumeIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4.5 10h3L12 7v10l-4.5-3h-3z" />
      <path d="M15.2 9.2a3.2 3.2 0 0 1 0 5.6" />
    </Svg>
  )
}

export function FullscreenIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 9V5h4M15 5h4v4M19 15v4h-4M9 19H5v-4" />
    </Svg>
  )
}

export function WifiIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 10.2a10 10 0 0 1 14 0" />
      <path d="M7.8 13a6.2 6.2 0 0 1 8.4 0" />
      <path d="M10.4 15.7a2.6 2.6 0 0 1 3.2 0" />
      <circle cx="12" cy="18.2" r="0.9" fill="currentColor" stroke="none" />
    </Svg>
  )
}
