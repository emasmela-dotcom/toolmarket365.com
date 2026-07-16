'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import {
  HOME_TOOL_DESCRIPTIONS,
  homeToolTipId,
  legalHomeTooltipDescription,
} from '@/lib/homeToolDescriptions'
import { useLanguage } from '@/lib/i18n/LanguageContext'

type Props = {
  href: string
  className?: string
  children: ReactNode
}

export function HomeToolTipLink({ href, className, children }: Props) {
  const { t } = useLanguage()
  const legalDescription = legalHomeTooltipDescription(href, t)
  const description = legalDescription ?? HOME_TOOL_DESCRIPTIONS[href]
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
