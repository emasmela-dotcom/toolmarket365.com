'use client'

import { LanguageToggle } from '@/components/LanguageToggle'

/** Always-visible language control for pages that do not render Navigation. */
export function LanguageToggleBar() {
  return (
    <div className="fixed top-3 right-3 z-[60]">
      <LanguageToggle />
    </div>
  )
}
