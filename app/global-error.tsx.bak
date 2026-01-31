'use client'

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string }
  reset?: () => void
}) {
  return (
    <html>
      <head><meta charSet="utf-8" /></head>
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
        <div style={{ maxWidth: '32rem', width: '100%', textAlign: 'center', padding: '1rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '1rem', color: '#111' }}>
            Application Error
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#444', marginBottom: '2rem' }}>
            A critical error occurred. Please refresh the page.
          </p>
          <a
            href="/"
            style={{ display: 'inline-block', padding: '0.75rem 1.5rem', fontSize: '1rem', fontWeight: 500, color: '#fff', background: '#2563eb', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', textDecoration: 'none' }}
          >
            Try Again
          </a>
        </div>
      </body>
    </html>
  )
}
