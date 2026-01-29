'use client'

import Link from 'next/link'
import { AlertTriangle, CheckCircle, XCircle, Clock, Heart, Users, ArrowRight } from 'lucide-react'

export default function MentorshipEtiquettePage() {
  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Heart className="h-10 w-10 text-accent-600 dark:text-accent-400" />
            <h1 className="text-4xl font-bold text-mono-950 dark:text-mono-50">
              Mentorship Etiquette Guide
            </h1>
          </div>
          <p className="text-lg text-mono-600 dark:text-mono-400 max-w-2xl mx-auto">
            Learn how to approach mentors respectfully and build meaningful mentorship relationships
          </p>
        </div>

        {/* Experimental Pilot Notice */}
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-400 dark:border-red-700 rounded-lg p-6 mb-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
          <h3 className="font-bold text-red-900 dark:text-red-200 mb-2">
            ⚠️ Experimental Pilot Program
          </h3>
          <p className="text-sm text-red-800 dark:text-red-300 mb-3">
            <strong>This mentorship feature is experimental.</strong> This pilot program will be removed if:
          </p>
          <ul className="text-sm text-red-800 dark:text-red-300 space-y-2 ml-4 mb-3">
            <li>• <strong>Bad reviews or negative feedback</strong> are received about the mentorship system</li>
            <li>• <strong>No engagement</strong> - If creators don't use it (no mentors sign up, no questions asked, no activity), there's no point in keeping it</li>
          </ul>
          <p className="text-sm text-red-800 dark:text-red-300 mb-3">
            <strong>For Mentors:</strong> There's really nothing to gain from being a creator mentor except the satisfaction of showing other creators how you got where you are. This is about giving back to the community, not personal gain.
          </p>
          <p className="text-sm text-red-800 dark:text-red-300 font-semibold">
            <strong>Please respect mentors and follow etiquette guidelines.</strong> Negative experiences or lack of usage could result in this feature being removed for everyone.
          </p>
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-700 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-yellow-900 dark:text-yellow-200 mb-2">
                ⚠️ Important: Don't Be Overly Aggressive
              </h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                Mentors are volunteering their time to help you grow. Being too aggressive (multiple messages, demanding responses, not respecting boundaries) will turn them away. Follow these guidelines to build positive mentorship relationships.
              </p>
            </div>
          </div>
        </div>

        {/* DO's Section */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            <h2 className="text-2xl font-bold text-green-900 dark:text-green-200">
              ✅ DO's - Best Practices
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-200 mb-2">
                1. Be Respectful of Their Time
              </h3>
              <ul className="text-sm text-green-800 dark:text-green-300 space-y-1 ml-4">
                <li>• <strong>One question at a time</strong> - Don't flood mentors with multiple questions</li>
                <li>• <strong>Wait for responses</strong> - Give mentors time to reply (24-48 hours minimum)</li>
                <li>• <strong>Be concise</strong> - Get to the point quickly</li>
                <li>• <strong>Say thank you</strong> - Always acknowledge their help</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-200 mb-2">
                2. Do Your Homework First
              </h3>
              <ul className="text-sm text-green-800 dark:text-green-300 space-y-1 ml-4">
                <li>• <strong>Search existing Q&A</strong> - Your question might already be answered</li>
                <li>• <strong>Be specific</strong> - "How do I grow on TikTok?" is too vague. "How do I improve engagement on TikTok fitness content?" is better</li>
                <li>• <strong>Show you've tried</strong> - Mention what you've already attempted</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-200 mb-2">
                3. Be Professional
              </h3>
              <ul className="text-sm text-green-800 dark:text-green-300 space-y-1 ml-4">
                <li>• <strong>Introduce yourself</strong> - Briefly share who you are and your goals</li>
                <li>• <strong>Be clear about what you need</strong> - Specific questions get better answers</li>
                <li>• <strong>Follow up appropriately</strong> - One follow-up after a week is fine, multiple messages in one day is not</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-200 mb-2">
                4. Respect Boundaries
              </h3>
              <ul className="text-sm text-green-800 dark:text-green-300 space-y-1 ml-4">
                <li>• <strong>Check mentor availability</strong> - Some mentors have limited hours</li>
                <li>• <strong>Respect their expertise</strong> - Don't ask about topics outside their niche</li>
                <li>• <strong>Accept "no" gracefully</strong> - If a mentor declines, thank them and move on</li>
              </ul>
            </div>
          </div>
        </div>

        {/* DON'Ts Section */}
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            <h2 className="text-2xl font-bold text-red-900 dark:text-red-200">
              ❌ DON'Ts - What Turns Mentors Away
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-200 mb-2">
                1. Don't Be Overly Aggressive
              </h3>
              <ul className="text-sm text-red-800 dark:text-red-300 space-y-1 ml-4">
                <li>• ❌ <strong>Multiple messages in one day</strong> - This feels like spam</li>
                <li>• ❌ <strong>Demanding immediate responses</strong> - Mentors have lives too</li>
                <li>• ❌ <strong>Following up too frequently</strong> - Wait at least 3-5 days before following up</li>
                <li>• ❌ <strong>Sending the same question to multiple mentors</strong> - Pick one mentor per question</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-200 mb-2">
                2. Don't Expect Free Work
              </h3>
              <ul className="text-sm text-red-800 dark:text-red-300 space-y-1 ml-4">
                <li>• ❌ <strong>Asking mentors to do work for you</strong> - They guide, you execute</li>
                <li>• ❌ <strong>Requesting detailed content reviews</strong> - Use the Q&A board for quick feedback</li>
                <li>• ❌ <strong>Expecting ongoing daily support</strong> - Mentorship is occasional guidance, not daily coaching</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-200 mb-2">
                3. Don't Be Entitled
              </h3>
              <ul className="text-sm text-red-800 dark:text-red-300 space-y-1 ml-4">
                <li>• ❌ <strong>Demanding responses</strong> - Mentors volunteer their time</li>
                <li>• ❌ <strong>Getting upset if they don't respond</strong> - They're busy creators too</li>
                <li>• ❌ <strong>Not saying thank you</strong> - Always acknowledge their help</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-200 mb-2">
                4. Don't Waste Their Time
              </h3>
              <ul className="text-sm text-red-800 dark:text-red-300 space-y-1 ml-4">
                <li>• ❌ <strong>Questions easily answered by Google</strong> - Do basic research first</li>
                <li>• ❌ <strong>Vague, unclear questions</strong> - Be specific about what you need</li>
                <li>• ❌ <strong>Not reading their profile</strong> - Check their expertise before asking</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Template Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-200">
              📋 Mentorship Request Template
            </h2>
          </div>
          <p className="text-sm text-blue-800 dark:text-blue-300 mb-4">
            When reaching out to a mentor, use this structure:
          </p>
          <div className="bg-white dark:bg-mono-900 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
            <pre className="text-sm text-mono-800 dark:text-mono-200 whitespace-pre-wrap font-mono">
{`Subject: [Specific Topic] Question - [Your Name]

Hi [Mentor Name],

I'm [your name], a [niche] creator on [platform] with [follower count]. I've been creating content for [time period] and I'm working on [specific goal].

I saw your expertise in [their specialty] and I have a specific question about [your question].

I've already tried [what you've attempted] but I'm stuck on [specific issue].

Would you be able to share your thoughts on [specific question]? I understand you're busy, so no pressure if you can't respond.

Thank you for your time!

[Your Name]`}
            </pre>
          </div>
        </div>

        {/* Rate Limits */}
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-200">
              🎯 Rate Limits & Guidelines
            </h2>
          </div>
          <p className="text-sm text-purple-800 dark:text-purple-300 mb-4">
            To prevent overwhelming mentors:
          </p>
          <ul className="text-sm text-purple-800 dark:text-purple-300 space-y-2 ml-4">
            <li>• <strong>Maximum 1 mentorship request per week</strong> per creator</li>
            <li>• <strong>Maximum 2 follow-up messages</strong> per conversation</li>
            <li>• <strong>Wait 3-5 days</strong> before following up</li>
            <li>• <strong>One mentor per question</strong> - Don't spam multiple mentors with the same question</li>
          </ul>
        </div>

        {/* Key Reminders */}
        <div className="bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-accent-900 dark:text-accent-200 mb-4">
            💡 Remember
          </h2>
          <ul className="text-sm text-accent-800 dark:text-accent-300 space-y-3">
            <li className="flex items-start">
              <span className="font-bold mr-2">•</span>
              <span><strong>Mentors are volunteers</strong> - They're helping because they want to, not because they have to</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">•</span>
              <span><strong>Respect builds relationships</strong> - Being respectful can lead to long-term mentorship</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">•</span>
              <span><strong>Patience pays off</strong> - Good mentors are worth waiting for</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">•</span>
              <span><strong>Community matters</strong> - Treat mentors well so they continue helping others</span>
            </li>
          </ul>
        </div>

        {/* If Turned Away */}
        <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-6 mb-8 border border-mono-200 dark:border-mono-700">
          <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
            🚨 If You're Turned Away
          </h2>
          <p className="text-sm text-mono-700 dark:text-mono-300 mb-4">
            If a mentor declines or doesn't respond:
          </p>
          <ol className="text-sm text-mono-700 dark:text-mono-300 space-y-2 ml-4 list-decimal">
            <li><strong>Don't take it personally</strong> - They might be busy or not the right fit</li>
            <li><strong>Try the Q&A board</strong> - Other creators can help too</li>
            <li><strong>Find another mentor</strong> - There are many mentors available</li>
            <li><strong>Reflect on your approach</strong> - Was your message respectful and clear?</li>
          </ol>
        </div>

        {/* Bottom Line */}
        <div className="bg-gradient-to-r from-accent-50 to-blue-50 dark:from-accent-900/20 dark:to-blue-900/20 border-2 border-accent-300 dark:border-accent-700 rounded-lg p-6 text-center mb-8">
          <p className="text-lg font-bold text-mono-950 dark:text-mono-50 mb-2">
            Bottom Line
          </p>
          <p className="text-sm text-mono-700 dark:text-mono-300">
            Treat mentors like respected colleagues, not free help. Respect their time, be specific, and always say thank you. This builds a healthy mentorship community where everyone benefits!
          </p>
        </div>

        {/* Final Reminder - Experimental */}
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-400 dark:border-red-700 rounded-lg p-6 text-center">
          <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-red-900 dark:text-red-200 mb-3">
            ⚠️ Remember: This is Experimental
          </h3>
          <p className="text-sm text-red-800 dark:text-red-300 mb-2">
            <strong>This mentorship pilot program can be removed at any time.</strong> This feature will be removed if:
          </p>
          <ul className="text-sm text-red-800 dark:text-red-300 space-y-2 ml-4 mb-3">
            <li>• <strong>Bad reviews or negative feedback</strong> are received about how creators are treating mentors</li>
            <li>• <strong>No one uses it</strong> - If there's no engagement (no mentors, no questions, no activity), there's no point in keeping it around</li>
          </ul>
          <p className="text-sm text-red-800 dark:text-red-300 mb-3">
            <strong>Mentors gain nothing except the satisfaction of helping others.</strong> They're showing you how they got where they are—that's it. No payment, no personal gain, just giving back.
          </p>
          <p className="text-sm text-red-800 dark:text-red-300 font-semibold">
            <strong>Your respectful behavior and active participation keeps this feature alive.</strong> Be respectful, follow the guidelines, and help us build a positive mentorship community—or this feature disappears for everyone.
          </p>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link
            href="/community/mentors"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-accent-600 text-white font-semibold rounded-lg hover:bg-accent-700 transition-colors"
          >
            <span>Browse Mentors</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/community/ask-for-help"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-mono-200 dark:bg-mono-800 text-mono-950 dark:text-mono-50 font-semibold rounded-lg hover:bg-mono-300 dark:hover:bg-mono-700 transition-colors"
          >
            <span>Ask for Help</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
