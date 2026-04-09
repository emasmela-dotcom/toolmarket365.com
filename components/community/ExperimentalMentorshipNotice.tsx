'use client'

import { AlertTriangle } from 'lucide-react';
import Link from 'next/link'

export function ExperimentalMentorshipNotice({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-400 dark:border-red-700 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-800 dark:text-red-300">
              <strong>⚠️ Experimental Pilot:</strong> This mentorship feature is experimental. Will be removed if bad reviews are received or if no one uses it. 
              <Link href="/community/mentorship-etiquette" className="underline font-semibold hover:text-red-900 dark:hover:text-red-100 ml-1">
                Read etiquette guidelines →
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
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
          <ul className="text-sm text-red-800 dark:text-red-300 space-y-1 ml-4 mb-3">
            <li>• <strong>Bad reviews or negative feedback</strong> are received about the mentorship system</li>
            <li>• <strong>No engagement</strong> - If creators don't use it (no mentors sign up, no questions asked, no activity), there's no point in keeping it</li>
          </ul>
          <p className="text-sm text-red-800 dark:text-red-300 mb-3">
            <strong>For Mentors:</strong> There's really nothing to gain from being a creator mentor except the satisfaction of showing other creators how you got where you are. This is about giving back to the community, not personal gain.
          </p>
          <p className="text-sm text-red-800 dark:text-red-300 font-semibold mb-3">
            <strong>Please respect mentors and follow etiquette guidelines.</strong> Negative experiences or lack of usage could result in this feature being removed for everyone.
          </p>
          <Link
            href="/community/mentorship-etiquette"
            className="text-sm text-red-700 dark:text-red-300 underline font-semibold hover:text-red-900 dark:hover:text-red-100"
          >
            Read full mentorship etiquette guidelines →
          </Link>
        </div>
      </div>
    </div>
  )
}
