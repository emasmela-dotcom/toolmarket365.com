'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, User } from 'lucide-react'

export function Navigation() {
  const router = useRouter()
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch('/api/me')
        const data = await res.json().catch(() => null)
        setUser(data?.user || null)
      } catch (error) {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
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
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-mono-950">CreatorFlow</span>
            <span className="text-xl font-bold text-accent-600">365</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors">
              Home
            </Link>
            <Link href="/tools" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors">
              Tools
            </Link>
            <Link href="/tools/content-library" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors">
              Content Library
            </Link>
            <Link href="/dashboard/content-performance" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors">
              Dashboard
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
            {!isLoading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-3">
                    <Link
                      href="/dashboard"
                      className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors"
                    >
                      Dashboard
                    </Link>
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
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}


