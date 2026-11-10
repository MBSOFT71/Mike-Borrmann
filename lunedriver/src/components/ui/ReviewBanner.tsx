import { Banner } from './Banner'

type ReviewBannerProps = {
  kind: 'legal' | 'professional'
}

export function ReviewBanner({ kind }: ReviewBannerProps) {
  const title = kind === 'legal' ? 'Rechtliche Prüfung ausstehend' : 'Fachliche Prüfung ausstehend'
  return (
    <Banner title={title}>
      <p>
        {kind === 'legal'
          ? 'Verkehrszeichen-Grafiken und Texte sind bis zur rechtlichen Prüfung nur Platzhalter.'
          : 'Grundfahraufgaben sind fachlich prüfpflichtig. Anforderungen werden nicht aus den Konzeptbildern übernommen.'}
      </p>
    </Banner>
  )
}
