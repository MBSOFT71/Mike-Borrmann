import type { ReactNode } from 'react'

type ContentListProps = {
  children: ReactNode
}

export function ContentList({ children }: ContentListProps) {
  return <div className="card content-list">{children}</div>
}
