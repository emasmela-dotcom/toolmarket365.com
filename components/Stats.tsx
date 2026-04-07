export function Stats() {
  const stats = [
    { label: 'Essential Tools', value: '150+' },
    { label: 'Active Creators', value: '50K+' },
    { label: 'Tools Integrated', value: '200+' },
    { label: 'Success Rate', value: '98%' },
  ]

  return (
    <section className="bg-mono-100 border-y border-mono-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-mono-950 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-mono-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


