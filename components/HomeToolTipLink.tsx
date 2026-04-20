import type { ReactNode } from 'react'
import Link from 'next/link'
import {
  HOME_TOOL_DESCRIPTIONS,
  homeToolTipId,
} from '@/lib/homeToolDescriptions'

type Props = {
  href: string
  className?: string
  children: ReactNode
}

export function HomeToolTipLink({ href, className, children }: Props) {
  const description = HOME_TOOL_DESCRIPTIONS[href]
  if (!description) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    )
  }
  const id = homeToolTipId(href)
  return (
    <span className="tm-home-tooltip-wrap">
      <Link href={href} className={className} aria-describedby={id}>
        {children}
      </Link>
      <span id={id} role="tooltip" className="tm-home-tooltip">
        {description}
      </span>
    </span>
  )
}
