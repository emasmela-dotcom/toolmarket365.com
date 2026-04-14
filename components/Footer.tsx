import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-mono-200 bg-mono-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-mono-950 mb-4">ToolMarket365</h3>
            <p className="text-sm text-mono-600">
              ToolMarket365 platform
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-mono-950 mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tools" className="text-mono-600 hover:text-accent-600 transition-colors">
                  All Tools
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-mono-600 hover:text-accent-600 transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/compare" className="text-mono-600 hover:text-accent-600 transition-colors">
                  Compare
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-mono-600 hover:text-accent-600 transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-mono-950 mb-4">Account</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/login" className="text-mono-600 hover:text-accent-600 transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-mono-600 hover:text-accent-600 transition-colors">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="/forgot-password" className="text-mono-600 hover:text-accent-600 transition-colors">
                  Forgot Password
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-mono-950 mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-mono-600 hover:text-accent-600 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-mono-600 hover:text-accent-600 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/contact?type=feedback" className="text-mono-600 hover:text-accent-600 transition-colors">
                  Feedback & Suggestions 💬
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-mono-950 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-mono-600 hover:text-accent-600 transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-mono-600 hover:text-accent-600 transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-mono-200">
          <p className="text-sm text-mono-500 text-center">
            © 2025 ToolMarket365. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}


