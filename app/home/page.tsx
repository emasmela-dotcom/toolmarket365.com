export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <main className="relative min-h-[70vh] overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-8 top-10 text-4xl animate-bounce">🎬</div>
        <div className="absolute right-10 top-16 text-4xl animate-pulse">🎙️</div>
        <div className="absolute left-16 bottom-20 text-4xl animate-bounce [animation-delay:300ms]">
          📈
        </div>
        <div className="absolute right-16 bottom-24 text-4xl animate-pulse [animation-delay:500ms]">
          ✨
        </div>
      </div>

      <section className="relative z-10 mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-sm font-semibold tracking-[0.18em] text-blue-300">
          CONTENT CREATOR WORKSPACE
        </p>
        <h1 className="mb-4 text-5xl font-extrabold leading-tight sm:text-7xl">
          ToolMarket365
        </h1>
        <p className="max-w-2xl text-base text-gray-300 sm:text-lg">
          Build, create, and scale with one focused creator canvas.
        </p>
      </section>
    </main>
  )
}
