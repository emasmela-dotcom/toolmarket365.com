'use client'

import Link from 'next/link'
import { getLifepack365Url, LIFEPACK365_NAME } from '@/lib/siteConfig'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const copy = {
  en: {
    platformBlurb: 'ToolMarket365 platform',
    sisterProduct: 'Sister product',
    platform: 'Platform',
    allTools: 'All Tools',
    categories: 'Categories',
    compare: 'Compare',
    pricing: 'Pricing',
    account: 'Account',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    forgotPassword: 'Forgot Password',
    company: 'Company',
    about: 'About',
    contact: 'Contact',
    feedback: 'Feedback & Suggestions 💬',
    marketingKit: 'Marketing kit',
    legal: 'Legal',
    privacy: 'Privacy',
    terms: 'Terms',
    rights: '© 2025 ToolMarket365. All rights reserved.',
  },
  es: {
    platformBlurb: 'Plataforma ToolMarket365',
    sisterProduct: 'Producto hermano',
    platform: 'Plataforma',
    allTools: 'Todas las herramientas',
    categories: 'Categorías',
    compare: 'Comparar',
    pricing: 'Precios',
    account: 'Cuenta',
    signIn: 'Iniciar sesión',
    signUp: 'Registrarse',
    forgotPassword: 'Olvidé mi contraseña',
    company: 'Empresa',
    about: 'Acerca de',
    contact: 'Contacto',
    feedback: 'Comentarios y sugerencias 💬',
    marketingKit: 'Kit de marketing',
    legal: 'Legal',
    privacy: 'Privacidad',
    terms: 'Términos',
    rights: '© 2025 ToolMarket365. Todos los derechos reservados.',
  },
}

export function Footer() {
  const { language } = useLanguage()
  const c = copy[language]
  const lifepackUrl = getLifepack365Url()
  return (
    <footer className="border-t border-mono-200 bg-mono-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-mono-950 mb-4">ToolMarket365</h3>
            <p className="text-sm text-mono-600">
              {c.platformBlurb}
            </p>
            {lifepackUrl ? (
              <p className="text-sm text-mono-600 mt-3">
                {c.sisterProduct}:{' '}
                <a
                  href={lifepackUrl}
                  className="text-accent-600 hover:text-accent-700 font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {LIFEPACK365_NAME}
                </a>
              </p>
            ) : null}
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-mono-950 mb-4">{c.platform}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/home" className="text-mono-600 hover:text-accent-600 transition-colors">
                  {c.allTools}
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-mono-600 hover:text-accent-600 transition-colors">
                  {c.categories}
                </Link>
              </li>
              <li>
                <Link href="/compare" className="text-mono-600 hover:text-accent-600 transition-colors">
                  {c.compare}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-mono-600 hover:text-accent-600 transition-colors">
                  {c.pricing}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-mono-950 mb-4">{c.account}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/login" className="text-mono-600 hover:text-accent-600 transition-colors">
                  {c.signIn}
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-mono-600 hover:text-accent-600 transition-colors">
                  {c.signUp}
                </Link>
              </li>
              <li>
                <Link href="/forgot-password" className="text-mono-600 hover:text-accent-600 transition-colors">
                  {c.forgotPassword}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-mono-950 mb-4">{c.company}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-mono-600 hover:text-accent-600 transition-colors">
                  {c.about}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-mono-600 hover:text-accent-600 transition-colors">
                  {c.contact}
                </Link>
              </li>
              <li>
                <Link href="/contact?type=feedback" className="text-mono-600 hover:text-accent-600 transition-colors">
                  {c.feedback}
                </Link>
              </li>
              <li>
                <Link href="/marketing-kit" className="text-mono-600 hover:text-accent-600 transition-colors">
                  {c.marketingKit}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-mono-950 mb-4">{c.legal}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-mono-600 hover:text-accent-600 transition-colors">
                  {c.privacy}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-mono-600 hover:text-accent-600 transition-colors">
                  {c.terms}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-mono-200">
          <p className="text-sm text-mono-500 text-center">
            {c.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}
