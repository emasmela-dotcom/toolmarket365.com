import type { ReactNode } from 'react'

/** Panel + grid styles ship from /home-panels.css (static) so Tailwind cannot drop them. */
export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link rel="stylesheet" href="/home-panels.css" />
      {children}
    </>
  )
}
