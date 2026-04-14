'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Mail, MessageSquare, Send, CheckCircle, Lightbulb } from 'lucide-react';

function ContactForm() {
  const searchParams = useSearchParams()
  const isFeedback = searchParams?.get('type') === 'feedback'
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: isFeedback ? 'feedback' : '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    if (isFeedback && !formData.subject) {
      setFormData(prev => ({ ...prev, subject: 'feedback' }))
    }
  }, [isFeedback])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission (you can integrate with an API later)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000)
    }, 1000)
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
          {/* Header */}
          <div className="text-center mb-12">
            {isFeedback ? (
              <>
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <Lightbulb className="h-10 w-10 text-accent-600 dark:text-accent-400" />
                  <h1 className="text-4xl font-bold text-mono-950 dark:text-mono-50">
                    Feedback & Suggestions
                  </h1>
                </div>
                <p className="text-lg text-mono-600 dark:text-mono-400 mb-2">
                  Your feedback helps us improve ToolMarket365! Share your ideas, suggestions, or report issues. We read every message.
                </p>
                <div className="bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-lg p-4 max-w-2xl mx-auto">
                  <p className="text-sm text-accent-800 dark:text-accent-300">
                    <strong>💡 Have a tool idea?</strong> We're always looking to add tools creators actually want! Select "New Tool Suggestion" as your subject and tell us what tool would help you most.
                  </p>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-4xl font-bold text-mono-950 dark:text-mono-50 mb-4">
                  Contact Us
                </h1>
                <p className="text-lg text-mono-600 dark:text-mono-400">
                  Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-mono-900 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
                <Mail className="w-6 h-6 text-accent-600 mb-3" />
                <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-2">Email Us</h3>
                <p className="text-sm text-mono-600 dark:text-mono-400">
                  <a href="mailto:support@creatorflow365.com" className="hover:text-accent-600 transition-colors">
                    support@creatorflow365.com
                  </a>
                </p>
              </div>

              <div className="bg-white dark:bg-mono-900 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
                <MessageSquare className="w-6 h-6 text-accent-600 mb-3" />
                <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-2">Response Time</h3>
                <p className="text-sm text-mono-600 dark:text-mono-400">
                  We typically respond within 24-48 hours during business days.
                </p>
              </div>

              <div className="bg-white dark:bg-mono-900 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
                <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-2">Common Questions</h3>
                <ul className="space-y-2 text-sm text-mono-600 dark:text-mono-400">
                  <li>• Pricing and plans</li>
                  <li>• Feature requests</li>
                  <li>• Technical support</li>
                  <li>• Partnership inquiries</li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-mono-900 rounded-lg p-8 border border-mono-200 dark:border-mono-700">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-mono-950 dark:text-mono-50 mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-mono-600 dark:text-mono-400">
                      {isFeedback 
                        ? "Thank you for your feedback! We appreciate your input and will review it carefully."
                        : "Thank you for contacting us. We'll get back to you soon."}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-mono-950 dark:text-mono-50 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-mono-950 dark:text-mono-50 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-mono-950 dark:text-mono-50 mb-2">
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
                      >
                        <option value="">Select a subject</option>
                        {isFeedback ? (
                          <>
                            <option value="feedback">General Feedback</option>
                            <option value="tool-suggestion">New Tool Suggestion</option>
                            <option value="feature">Feature Suggestion</option>
                            <option value="improvement">Tool Improvement</option>
                            <option value="bug">Bug Report</option>
                            <option value="other">Other Feedback</option>
                          </>
                        ) : (
                          <>
                            <option value="general">General Inquiry</option>
                            <option value="support">Technical Support</option>
                            <option value="billing">Billing Question</option>
                            <option value="feature">Feature Request</option>
                            <option value="partnership">Partnership Inquiry</option>
                            <option value="other">Other</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-mono-950 dark:text-mono-50 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500 resize-none"
                        placeholder="Tell us how we can help..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-6 py-3 bg-accent-600 text-white font-medium rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Message</span>
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
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-mono-50 dark:bg-mono-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600 mx-auto mb-4"></div>
          <p className="text-mono-600 dark:text-mono-400">Loading...</p>
        </div>
      </div>
    }>
      <ContactForm />
    </Suspense>
  )
}
