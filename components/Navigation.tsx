'use client'

import Link from 'next/link'
import { Search, User } from 'lucide-react'

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 border-b border-mono-200 bg-mono-50/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-mono-950">Micro-SaaS</span>
            <span className="text-xl font-normal text-mono-600">Marketplace</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/tools" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors">
              Tools
            </Link>
            <Link href="/categories" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors">
              Categories
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-mono-700 hover:text-accent-600 transition-colors">
              Pricing
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-mono-600 hover:text-mono-900 transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <button className="p-2 text-mono-600 hover:text-mono-900 transition-colors">
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}


