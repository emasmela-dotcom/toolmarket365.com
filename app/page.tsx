export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-mono-950 dark:text-mono-50 mb-4">
        CreatorFlow<span className="text-accent-600">365</span>
      </h1>
      <p className="text-mono-600 dark:text-mono-400 mb-6 text-center">
        The Micro-SaaS Marketplace for Content Creators
      </p>
      <a
        href="/tools"
        className="px-6 py-3 bg-accent-600 text-white font-medium rounded-lg hover:bg-accent-700 transition-colors"
      >
        Browse Tools
      </a>
    </div>
  )
}
