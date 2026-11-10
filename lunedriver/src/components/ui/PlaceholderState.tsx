import type { ReactNode } from 'react'

type PlaceholderStateProps = {
  title: string
  children?: ReactNode
}

export function PlaceholderState({ title, children }: PlaceholderStateProps) {
  return (
    <div className="placeholder-state card">
      <span className="badge">In Vorbereitung</span>
      <h2>{title}</h2>
      {children}
    </div>
  )
}
