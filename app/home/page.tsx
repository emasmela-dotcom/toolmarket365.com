export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <main className="relative min-h-[70vh] overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.22),transparent_55%)]" />
      <section className="mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-5 rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-1 text-xs font-semibold tracking-[0.18em] text-blue-300">
          BUILT TO SHIP
        </p>
        <h1 className="mb-4 bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-5xl font-extrabold leading-tight text-transparent sm:text-7xl">
          ToolMarket365
        </h1>
        <p className="max-w-2xl text-base text-gray-300 sm:text-lg">
          Your focused build canvas for turning ideas into working tools fast.
        </p>
      </section>
    </main>
  )
}
