'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, User } from 'lucide-react';

export function Navigation() {
  const router = useRouter()
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false) // Start as false so page renders immediately

  useEffect(() => {
    // Set loading to false immediately so page can render
    setIsLoading(false)
    
    const loadUser = async () => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout
        
        const res = await fetch('/api/me', { 
          signal: controller.signal,
          cache: 'no-store'
        })
        clearTimeout(timeoutId)
        
        if (res.ok) {
          const data = await res.json().catch(() => null)
          setUser(data?.user || null)
        } else {
          setUser(null)
        }
      } catch (error) {
        // Silently fail - don't block page render
        setUser(null)
      }
    }
    // Load user in background, don't block render
    loadUser()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.refresh()
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-mono-200 bg-mono-50/95 backdrop-blur-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2">
          {/* Left: Logo + Compare Button */}
          <div className="flex flex-col items-start flex-shrink-0">
            <Link href="/" className="flex items-center space-x-1 mb-1">
              <span className="text-xl font-bold text-mono-950">ToolMarket</span>
              <span className="text-xl font-bold text-accent-600">365</span>
            </Link>
            <Link 
              href="/compare" 
              className="text-xs font-semibold text-accent-600 hover:text-accent-700 transition-colors bg-accent-50 dark:bg-accent-900/30 px-2 py-1 rounded border border-accent-200 dark:border-accent-800 whitespace-nowrap"
            >
              Compare ⭐
            </Link>
          </div>
          
          {/* Center: Navigation Links in 2 Rows */}
          <div className="hidden md:flex flex-col gap-y-2 flex-1 justify-center mx-4">
            {/* Row 1 */}
            <div className="flex items-center justify-center gap-x-4 gap-y-1 flex-wrap">
              <Link href="/" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors whitespace-nowrap">
                Home
              </Link>
              <Link href="/home" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors whitespace-nowrap">
                Tools
              </Link>
              <Link href="/tools/content-library" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors whitespace-nowrap">
                Content Library
              </Link>
              <Link href="/growth-suite" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors whitespace-nowrap">
                Growth Suite
              </Link>
              <Link href="/dashboard" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors whitespace-nowrap">
                Dashboard
              </Link>
            </div>
            {/* Row 2 */}
            <div className="flex items-center justify-center gap-x-4 gap-y-1 flex-wrap">
              <Link href="/dashboard/content-performance" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors whitespace-nowrap">
                Performance Dashboard
              </Link>
              <Link href="/dashboard/verification" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors whitespace-nowrap">
                Verification
              </Link>
              <Link href="/categories" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors whitespace-nowrap">
                Categories
              </Link>
              <Link href="/pricing" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors whitespace-nowrap">
                Pricing
              </Link>
              <Link href="/credits" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors whitespace-nowrap">
                Credit Costs
              </Link>
              <Link href="/integrations" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors whitespace-nowrap">
                Integrations
              </Link>
              <Link href="/assistant" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors whitespace-nowrap" title="Assistant (account required)">
                Assistant
              </Link>
              <Link href="/contact?type=feedback" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors whitespace-nowrap">
                Feedback 💬
              </Link>
            </div>
          </div>
          
          {/* Right: Search, Account, Sign Out */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <Link
              href="/home"
              className="p-2 text-mono-600 hover:text-mono-900 transition-colors"
              aria-label="Search Tools"
              title="Search Tools"
            >
              <Search className="h-5 w-5" />
            </Link>
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  href="/account"
                  className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors"
                  title={user.email}
                >
                  Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-accent-600 text-white text-sm font-medium rounded-lg hover:bg-accent-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}


