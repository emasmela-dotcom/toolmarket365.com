'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, User } from 'lucide-react'

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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-1">
            <span className="text-xl font-bold text-mono-950">CreatorFlow</span>
            <span className="text-xl font-bold text-accent-600">365</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8 ml-8">
            <Link href="/" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors">
              Home
            </Link>
            <Link href="/tools" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors">
              Tools
            </Link>
            <Link href="/bots" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors">
              Bots
            </Link>
            <Link href="/tools/content-library" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors">
              Content Library
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors">
              Dashboard
            </Link>
            <Link href="/dashboard/content-performance" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors">
              Performance Dashboard
            </Link>
            <Link href="/dashboard/verification" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors">
              Verification
            </Link>
            <Link href="/tools/instagram-scheduler" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors">
              Instagram Scheduler
            </Link>
            <Link href="/tools/social-graphics" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors">
              Graphics Tool
            </Link>
            <Link href="/categories" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors">
              Categories
            </Link>
            <Link href="/compare" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors">
              Compare
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors">
              Pricing
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-mono-600 hover:text-mono-900 transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <>
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
            </>
          </div>
        </div>
      </div>
    </nav>
  )
}


