'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Mail, MessageSquare, Send, CheckCircle, Lightbulb } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

function ContactForm() {
  const searchParams = useSearchParams()
  const { t } = useLanguage()
  const isFeedback = searchParams?.get('type') === 'feedback'
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: isFeedback ? 'feedback' : '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    if (isFeedback && !formData.subject) {
      setFormData(prev => ({ ...prev, subject: 'feedback' }))
    }
  }, [isFeedback])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        setSubmitError(data.error || 'Could not send your message.')
        return
      }
      setIsSubmitted(true)
      setFormData({ name: '', email: '', subject: isFeedback ? 'feedback' : '', message: '' })
      setTimeout(() => setIsSubmitted(false), 5000)
    } catch {
      setSubmitError('Could not send your message. Please email apputilitybuilder@gmail.com.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            {isFeedback ? (
              <>
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <Lightbulb className="h-10 w-10 text-accent-600 dark:text-accent-400" />
                  <h1 className="text-4xl font-bold text-mono-950 dark:text-mono-50">
                    {t('contactFeedbackTitle')}
                  </h1>
                </div>
                <p className="text-lg text-mono-600 dark:text-mono-400 mb-2">
                  {t('contactFeedbackSubtitle')}
                </p>
                <div className="bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-lg p-4 max-w-2xl mx-auto">
                  <p className="text-sm text-accent-800 dark:text-accent-300">
                    <strong>💡 {t('contactToolIdeaStrong')}</strong> {t('contactToolIdea').replace(t('contactToolIdeaStrong') + ' ', '')}
                  </p>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-4xl font-bold text-mono-950 dark:text-mono-50 mb-4">
                  {t('contactTitle')}
                </h1>
                <p className="text-lg text-mono-600 dark:text-mono-400">
                  {t('contactSubtitle')}
                </p>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-mono-900 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
                <Mail className="w-6 h-6 text-accent-600 mb-3" />
                <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-2">{t('contactEmailUs')}</h3>
                <p className="text-sm text-mono-600 dark:text-mono-400">
                  <a href="mailto:apputilitybuilder@gmail.com" className="hover:text-accent-600 transition-colors">
                    apputilitybuilder@gmail.com
                  </a>
                </p>
              </div>

              <div className="bg-white dark:bg-mono-900 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
                <MessageSquare className="w-6 h-6 text-accent-600 mb-3" />
                <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-2">{t('contactResponseTime')}</h3>
                <p className="text-sm text-mono-600 dark:text-mono-400">
                  {t('contactResponseBody')}
                </p>
              </div>

              <div className="bg-white dark:bg-mono-900 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
                <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-2">{t('contactCommonQuestions')}</h3>
                <ul className="space-y-2 text-sm text-mono-600 dark:text-mono-400">
                  <li>• {t('contactQPricing')}</li>
                  <li>• {t('contactQFeatures')}</li>
                  <li>• {t('contactQSupport')}</li>
                  <li>• {t('contactQPartnership')}</li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-mono-900 rounded-lg p-8 border border-mono-200 dark:border-mono-700">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-mono-950 dark:text-mono-50 mb-2">
                      {t('contactMessageSent')}
                    </h3>
                    <p className="text-mono-600 dark:text-mono-400">
                      {isFeedback 
                        ? t('contactThanksFeedback')
                        : t('contactThanksGeneral')}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-mono-950 dark:text-mono-50 mb-2">
                        {t('contactName')}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
                        placeholder={t('contactNamePlaceholder')}
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-mono-950 dark:text-mono-50 mb-2">
                        {t('contactEmail')}
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
                        placeholder={t('signupEmailPlaceholder')}
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-mono-950 dark:text-mono-50 mb-2">
                        {t('contactSubject')}
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
                      >
                        <option value="">{t('contactSelectSubject')}</option>
                        {isFeedback ? (
                          <>
                            <option value="feedback">{t('contactOptFeedback')}</option>
                            <option value="tool-suggestion">{t('contactOptToolSuggestion')}</option>
                            <option value="feature">{t('contactOptFeatureSuggestion')}</option>
                            <option value="improvement">{t('contactOptImprovement')}</option>
                            <option value="bug">{t('contactOptBug')}</option>
                            <option value="other">{t('contactOptOtherFeedback')}</option>
                          </>
                        ) : (
                          <>
                            <option value="general">{t('contactOptGeneral')}</option>
                            <option value="support">{t('contactOptSupport')}</option>
                            <option value="billing">{t('contactOptBilling')}</option>
                            <option value="feature">{t('contactOptFeature')}</option>
                            <option value="partnership">{t('contactOptPartnership')}</option>
                            <option value="other">{t('contactOptOther')}</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-mono-950 dark:text-mono-50 mb-2">
                        {t('contactMessage')}
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500 resize-none"
                        placeholder={t('contactMessagePlaceholder')}
                      />
                    </div>

                    {submitError ? (
                      <p className="text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3">
                        {submitError}
                      </p>
                    ) : null}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-6 py-3 bg-accent-600 text-white font-medium rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>{t('contactSending')}</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>{t('contactSendMessage')}</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function ContactPage() {
  const { t } = useLanguage()
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-mono-50 dark:bg-mono-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600 mx-auto mb-4"></div>
          <p className="text-mono-600 dark:text-mono-400">{t('contactLoading')}</p>
        </div>
      </div>
    }>
      <ContactForm />
    </Suspense>
  )
}
