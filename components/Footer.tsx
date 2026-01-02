import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-mono-200 bg-mono-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-mono-950 mb-4">Micro-SaaS Marketplace</h3>
            <p className="text-sm text-mono-600">
              Essential tools for professional content creators.
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
                <Link href="/pricing" className="text-mono-600 hover:text-accent-600 transition-colors">
                  Pricing
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
            © 2025 Micro-SaaS Marketplace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}


