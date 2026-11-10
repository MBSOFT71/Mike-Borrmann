import type { ReactNode } from 'react'
import { ChevronRightIcon } from '../icons/Icons'

type ListRowProps = {
  title: string
  meta?: string
  trailing?: ReactNode
  leading?: ReactNode
  onClick?: () => void
}

export function ListRow({ title, meta, trailing, leading, onClick }: ListRowProps) {
  const inner = (
    <>
      {leading}
      <div className="list-row__body">
        <div className="list-row__title">{title}</div>
        {meta ? <div className="list-row__meta">{meta}</div> : null}
      </div>
      {trailing}
      {onClick ? (
        <span className="class-select__chevron" aria-hidden="true">
          <ChevronRightIcon size={18} />
        </span>
      ) : null}
    </>
  )

  if (onClick) {
    return (
      <button type="button" className="list-row list-row--button" onClick={onClick}>
        {inner}
      </button>
    )
  }

  return <div className="list-row">{inner}</div>
}
