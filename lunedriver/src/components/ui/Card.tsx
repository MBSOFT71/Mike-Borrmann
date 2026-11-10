import type { ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return <section className={className ? `card ${className}` : 'card'}>{children}</section>
}
