import type { ReactNode } from 'react'

type BannerProps = {
  title: string
  children?: ReactNode
}

export function Banner({ title, children }: BannerProps) {
  return (
    <div className="banner" role="status">
      <div>
        <strong>{title}</strong>
        {children}
      </div>
    </div>
  )
}
