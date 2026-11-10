import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
}

/** Primär-Schaltfläche für Navigation und gleichartige Aktionen. */
export function Button({ children, className, type = 'button', ...rest }: ButtonProps) {
  return (
    <button type={type} className={className ? `class-select ${className}` : 'class-select'} {...rest}>
      {children}
    </button>
  )
}
