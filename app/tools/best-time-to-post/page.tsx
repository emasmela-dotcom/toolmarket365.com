'use client'

import { useState, useEffect } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const copy = {
  en: {
    toolName: 'Best Time to Post',
    toolDescription:
      'Shows the best times to post on social media platforms using a heat-map visualization. Displays optimal posting times by day of week and hour of day to maximize engagement.',
    howToUse: [
      { label: 'Select platform:', text: 'Choose Instagram, TikTok, Twitter, LinkedIn, or Facebook' },
      { label: 'View heat-map:', text: 'See color-coded grid showing best posting times (darker colors = better times)' },
      { label: 'Hover over cells:', text: 'See specific day and time combinations' },
      { label: 'Plan your posts:', text: 'Schedule content during the optimal times shown in darker colors' },
    ],
    howToUseTitle: 'How to Use This Tool',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      'Shows the best times to post on social media platforms using a heat-map visualization. Displays optimal posting times by day of week and hour of day to maximize engagement.',
    howToUseInner: 'How to Use',
    expectedOutcome: 'Expected Outcome',
    expectedOutcomes: [
      'Visual heat-map showing optimal posting times',
      'Platform-specific recommendations',
      'Day and hour combinations for best engagement',
      'Color-coded visualization (darker = better times)',
      'Easy-to-read grid format',
    ],
    title: 'Best Time to Post – 2026 Heat-map',
    supportedPlatforms: 'Supported Platforms:',
    platformInstagram: 'Instagram',
    platformTiktok: 'TikTok',
    platformLinkedin: 'LinkedIn',
    platformTwitter: 'Twitter / X',
    platformFacebook: 'Facebook',
    industryTravel: 'Travel & Tourism',
    industryFashion: 'Fashion & Beauty',
    industryFood: 'Food & Restaurants',
    industryEdu: 'Education',
    industryFitness: 'Fitness & Wellness',
    industryGaming: 'Gaming',
    industryB2b: 'B2B',
    industryEcom: 'E-commerce',
    tzEastern: 'Eastern (ET/UTC-5)',
    tzCentral: 'Central (CT/UTC-6)',
    tzPacific: 'Pacific (PT/UTC-8)',
    tzLondon: 'London (GMT/UTC+0)',
    tzCentralEu: 'Central EU (CET/UTC+1)',
    exportIcs: 'Export .ics',
    legendLow: 'low',
    legendTop3: 'top-3 window',
    alertNoSlots: 'No slots available for this combo',
    dayLabels: { mon: 'MON', tue: 'TUE', wed: 'WED', thu: 'THU', fri: 'FRI', sat: 'SAT', sun: 'SUN' },
  },
  es: {
    toolName: 'Mejor hora para publicar',
    toolDescription:
      'Muestra las mejores horas para publicar en redes sociales con un mapa de calor. Indica los momentos óptimos por día de la semana y hora del día para maximizar el engagement.',
    howToUse: [
      { label: 'Selecciona la plataforma:', text: 'Elige Instagram, TikTok, Twitter, LinkedIn o Facebook' },
      { label: 'Consulta el mapa de calor:', text: 'Ve la cuadrícula con colores que indica las mejores horas (colores más oscuros = mejores horas)' },
      { label: 'Pasa el cursor sobre las celdas:', text: 'Consulta combinaciones específicas de día y hora' },
      { label: 'Planifica tus publicaciones:', text: 'Programa contenido en las horas óptimas mostradas con colores más oscuros' },
    ],
    howToUseTitle: 'Cómo usar esta herramienta',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Muestra las mejores horas para publicar en redes sociales con un mapa de calor. Indica los momentos óptimos por día de la semana y hora del día para maximizar el engagement.',
    howToUseInner: 'Cómo usar',
    expectedOutcome: 'Resultado esperado',
    expectedOutcomes: [
      'Mapa de calor visual con las horas óptimas de publicación',
      'Recomendaciones específicas por plataforma',
      'Combinaciones de día y hora para mejor engagement',
      'Visualización con código de colores (más oscuro = mejores horas)',
      'Formato de cuadrícula fácil de leer',
    ],
    title: 'Mejor hora para publicar – Mapa de calor 2026',
    supportedPlatforms: 'Plataformas compatibles:',
    platformInstagram: 'Instagram',
    platformTiktok: 'TikTok',
    platformLinkedin: 'LinkedIn',
    platformTwitter: 'Twitter / X',
    platformFacebook: 'Facebook',
    industryTravel: 'Viajes y turismo',
    industryFashion: 'Moda y belleza',
    industryFood: 'Comida y restaurantes',
    industryEdu: 'Educación',
    industryFitness: 'Fitness y bienestar',
    industryGaming: 'Videojuegos',
    industryB2b: 'B2B',
    industryEcom: 'Comercio electrónico',
    tzEastern: 'Este (ET/UTC-5)',
    tzCentral: 'Centro (CT/UTC-6)',
    tzPacific: 'Pacífico (PT/UTC-8)',
    tzLondon: 'Londres (GMT/UTC+0)',
    tzCentralEu: 'Europa central (CET/UTC+1)',
    exportIcs: 'Exportar .ics',
    legendLow: 'bajo',
    legendTop3: 'ventana top-3',
    alertNoSlots: 'No hay franjas disponibles para esta combinación',
    dayLabels: { mon: 'LUN', tue: 'MAR', wed: 'MIÉ', thu: 'JUE', fri: 'VIE', sat: 'SÁB', sun: 'DOM' },
  },
}

const data: Record<string, Record<string, string[]>> = {
  ig: {
    travel: ["sun:10-12", "mon:13-14", "mon:16-18", "tue:11-18", "wed:11-18", "wed:19-21", "thu:11-18", "fri:10-17", "sat:10-18"],
    fashion: ["mon:11-13", "mon:19-21", "tue:11-13", "tue:19-21", "wed:11-13", "wed:19-21", "thu:11-13", "thu:19-21", "fri:11-13", "fri:19-21", "sat:09-11", "sat:17-19", "sun:09-11", "sun:17-19"],
    food: ["mon:12-13", "mon:18-20", "tue:12-13", "tue:18-20", "wed:12-13", "wed:18-20", "thu:12-13", "thu:18-20", "fri:12-13", "fri:18-20", "sat:12-13", "sat:18-20", "sun:12-13", "sun:18-20"],
    edu: ["mon:14-16", "mon:18-21", "tue:14-16", "tue:18-21", "wed:14-16", "wed:18-21", "thu:14-16", "thu:18-21", "fri:14-16", "fri:18-21"],
    fitness: ["mon:06-08", "mon:17-19", "tue:06-08", "tue:17-19", "wed:06-08", "wed:17-19", "thu:06-08", "thu:17-19", "fri:06-08", "fri:17-19", "sat:08-10", "sat:16-18", "sun:08-10", "sun:16-18"],
    gaming: ["mon:20-23", "tue:20-23", "wed:20-23", "thu:20-23", "fri:15-23", "sat:15-23", "sun:15-23"],
    b2b: ["mon:09-11", "mon:13-15", "tue:09-11", "tue:13-15", "wed:09-11", "wed:13-15", "thu:09-11", "thu:13-15", "fri:09-11", "fri:13-15"],
    ecom: ["mon:12-14", "mon:19-21", "tue:12-14", "tue:19-21", "wed:12-14", "wed:19-21", "thu:12-14", "thu:19-21", "fri:12-14", "fri:19-21", "sat:12-14", "sat:19-21", "sun:12-14", "sun:19-21"]
  },
  tt: {},
  li: {
    b2b: ["mon:09-11", "mon:13-15", "tue:09-11", "tue:13-15", "wed:09-11", "wed:13-15", "thu:09-11", "thu:13-15", "fri:09-11", "fri:13-15"]
  },
  tw: {
    b2b: ["mon:09-11", "mon:13-15", "tue:09-11", "tue:13-15", "wed:09-11", "wed:13-15", "thu:09-11", "thu:13-15", "fri:09-11", "fri:13-15"]
  },
  fb: {
    ecom: ["mon:12-14", "mon:19-21", "tue:12-14", "tue:19-21", "wed:12-14", "wed:19-21", "thu:12-14", "thu:19-21", "fri:12-14", "fri:19-21", "sat:12-14", "sat:19-21", "sun:12-14", "sun:19-21"]
  }
}

const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
const hours = Array.from({ length: 24 }, (_, i) => i)

function BestTimeToPostContent({ c }: { c: typeof copy.en }) {
  const [platform, setPlatform] = useState('ig')
  const [industry, setIndustry] = useState('travel')
  const [tz, setTz] = useState('et')

  const getGoodSlots = (): Set<string> => {
    const key = data[platform]?.[industry] || []
    const slotSet = new Set<string>()
    
    key.forEach(slot => {
      const [day, timeRange] = slot.split(':')
      const [start, end] = timeRange.split('-').map(Number)
      for (let h = start; h < end; h++) {
        slotSet.add(`${day}:${h}-${h + 1}`)
      }
    })
    
    return slotSet
  }

  const goodSlots = getGoodSlots()

  const isGoodSlot = (day: string, hour: number): boolean => {
    return goodSlots.has(`${day}:${hour}-${hour + 1}`)
  }

  const nextWeekday = (day: string): Date => {
    const dayMap: Record<string, number> = { mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6, sun: 0 }
    const today = new Date().getDay()
    let add = (dayMap[day] - today + 7) % 7
    if (add === 0) add = 7
    const date = new Date()
    date.setDate(date.getDate() + add)
    date.setHours(0, 0, 0, 0)
    return date
  }

  const toICS = (d: Date): string => {
    return d.toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z'
  }

  const handleExport = () => {
    const key = data[platform]?.[industry] || []
    if (!key.length) {
      alert(c.alertNoSlots)
      return
    }

    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//BestTime//EN"]
    
    key.forEach(slot => {
      const [day, timeRange] = slot.split(':')
      const [start, end] = timeRange.split('-').map(Number)
      const base = nextWeekday(day)
      const dtStart = new Date(base)
      dtStart.setHours(start, 0, 0)
      const dtEnd = new Date(base)
      dtEnd.setHours(end, 0, 0)

      ics.push("BEGIN:VEVENT")
      ics.push(`UID:${Date.now()}${Math.random()}@besttime.local`)
      ics.push(`DTSTART:${toICS(dtStart)}`)
      ics.push(`DTEND:${toICS(dtEnd)}`)
      ics.push(`SUMMARY:Post on ${platform.toUpperCase()} ("${industry}" niche)`)
      ics.push("END:VEVENT")
    })

    ics.push("END:VCALENDAR")

    const blob = new Blob([ics.join('\r\n')], { type: 'text/calendar' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'best-time.ics'
    a.click()
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 text-mono-950 dark:text-mono-50 p-4 max-w-4xl mx-auto">
      {/* Documentation Section */}
      <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-6 mb-6 border border-mono-200 dark:border-mono-700">
        <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">{c.howToUseTitle}</h2>
        <div className="space-y-4 text-sm text-mono-700 dark:text-mono-300">
          <div>
            <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">{c.whatItDoes}</h3>
            <p>{c.whatItDoesBody}</p>
          </div>
          <div>
            <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">{c.howToUseInner}</h3>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              {c.howToUse.map((step, i) => (
                <li key={i}><strong>{step.label}</strong> {step.text}</li>
              ))}
            </ol>
          </div>
          <div>
            <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">{c.expectedOutcome}</h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              {c.expectedOutcomes.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <header className="flex gap-4 flex-wrap items-center mb-4">
        <h1 className="text-2xl font-bold m-0">{c.title}</h1>
      </header>

      {/* Supported Platforms */}
      <div className="bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-lg p-4 mb-6">
        <p className="text-xs font-semibold text-mono-700 dark:text-mono-300 mb-2">{c.supportedPlatforms}</p>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-white dark:bg-mono-800 rounded-full text-xs font-medium text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700">📸 Instagram</span>
          <span className="px-3 py-1 bg-white dark:bg-mono-800 rounded-full text-xs font-medium text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700">🎵 TikTok</span>
          <span className="px-3 py-1 bg-white dark:bg-mono-800 rounded-full text-xs font-medium text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700">🐦 Twitter/X</span>
          <span className="px-3 py-1 bg-white dark:bg-mono-800 rounded-full text-xs font-medium text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700">💼 LinkedIn</span>
          <span className="px-3 py-1 bg-white dark:bg-mono-800 rounded-full text-xs font-medium text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700">📘 Facebook</span>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap items-center mb-4">
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="px-3 py-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
        >
          <option value="ig">{c.platformInstagram}</option>
          <option value="tt">{c.platformTiktok}</option>
          <option value="li">{c.platformLinkedin}</option>
          <option value="tw">{c.platformTwitter}</option>
          <option value="fb">{c.platformFacebook}</option>
        </select>
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="px-3 py-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
        >
          <option value="travel">{c.industryTravel}</option>
          <option value="fashion">{c.industryFashion}</option>
          <option value="food">{c.industryFood}</option>
          <option value="edu">{c.industryEdu}</option>
          <option value="fitness">{c.industryFitness}</option>
          <option value="gaming">{c.industryGaming}</option>
          <option value="b2b">{c.industryB2b}</option>
          <option value="ecom">{c.industryEcom}</option>
        </select>
        <select
          value={tz}
          onChange={(e) => setTz(e.target.value)}
          className="px-3 py-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
        >
          <option value="et">{c.tzEastern}</option>
          <option value="ct">{c.tzCentral}</option>
          <option value="pt">{c.tzPacific}</option>
          <option value="gmt">{c.tzLondon}</option>
          <option value="cet">{c.tzCentralEu}</option>
        </select>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-accent-600 text-white rounded cursor-pointer hover:opacity-90"
        >
          {c.exportIcs}
        </button>
      </div>

      <div className="text-sm mt-4 flex gap-4">
        <span>■ <span className="text-mono-500">{c.legendLow}</span></span>
        <span>■ <span className="text-green-600">{c.legendTop3}</span></span>
      </div>

      <div className="grid grid-cols-7 gap-1 mt-4">
        {days.map(d => (
          <div key={d} className="font-semibold text-xs text-center py-2">
            {c.dayLabels[d as keyof typeof c.dayLabels]}
          </div>
        ))}
        {hours.map(h => (
          days.map(d => {
            const isGood = isGoodSlot(d, h)
            return (
              <div
                key={`${d}-${h}`}
                className={`text-center text-xs py-1 rounded cursor-pointer relative ${
                  isGood
                    ? 'bg-green-600 text-white'
                    : 'bg-mono-200 dark:bg-mono-800 text-mono-700 dark:text-mono-300'
                } hover:brightness-110`}
              >
                {h}:00
              </div>
            )
          })
        ))}
      </div>
    </div>
  )
}

export default function BestTimeToPost() {
  const { language } = useLanguage()
  const c = copy[language]

  const howToUse = (
    <div>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        {c.howToUse.map((step, i) => (
          <li key={i}><strong>{step.label}</strong> {step.text}</li>
        ))}
      </ol>
    </div>
  )

  return (
    <ToolAccessGate
      toolSlug="best-time-to-post"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <BestTimeToPostContent c={c} />
    </ToolAccessGate>
  )
}

