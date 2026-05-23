import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

/** Tool pages are browsable without a subscription; gates live on individual tools / APIs. */
export default function ToolsLayout({ children }: Props) {
  return <>{children}</>
}
