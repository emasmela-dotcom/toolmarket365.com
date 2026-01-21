'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-mono-50 dark:bg-mono-950 px-4">
          <div className="max-w-2xl w-full text-center">
            <h1 className="text-3xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              Application Error
            </h1>
            <p className="text-lg text-mono-600 dark:text-mono-400 mb-8">
              A critical error occurred. Please refresh the page or contact support.
            </p>
            <button
              onClick={reset}
              className="inline-flex items-center justify-center px-6 py-3 bg-accent-600 text-white font-medium rounded-lg hover:bg-accent-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
