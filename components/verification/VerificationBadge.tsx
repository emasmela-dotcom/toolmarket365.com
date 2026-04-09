'use client'

import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils'

interface VerificationBadgeProps {
  verified: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function VerificationBadge({ verified, size = 'md', className }: VerificationBadgeProps) {
  if (!verified) return null

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <CheckCircle2 
      className={cn('text-accent-600 dark:text-accent-400 fill-accent-600 dark:fill-accent-400', sizeClasses[size], className)}
      aria-label="Verified Creator"
    />
  )
}
