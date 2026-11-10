import { Banner } from './Banner'

type DemoBannerProps = {
  children?: string
}

export function DemoBanner({ children = 'Demo-Inhalt, kein Produktionsstand.' }: DemoBannerProps) {
  return <Banner title="Demo">{<p>{children}</p>}</Banner>
}
