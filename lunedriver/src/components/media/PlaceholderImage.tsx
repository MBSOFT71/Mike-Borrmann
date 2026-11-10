type PlaceholderImageProps = {
  label: string
  src?: string
}

export function PlaceholderImage({ label, src }: PlaceholderImageProps) {
  return (
    <div className="media-placeholder" aria-label={label}>
      {src ? <img className="sign-graphic" src={src} alt="" /> : null}
      <span className="badge">Platzhalter</span>
      <p>{label}</p>
    </div>
  )
}
