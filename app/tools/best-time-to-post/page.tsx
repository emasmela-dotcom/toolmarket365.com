'use client'

import { useState, useEffect } from 'react'

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

export default function BestTimeToPost() {
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
      alert("No slots available for this combo")
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
      <header className="flex gap-4 flex-wrap items-center mb-4">
        <h1 className="text-2xl font-bold m-0">Best Time to Post – 2026 Heat-map</h1>
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="px-3 py-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
        >
          <option value="ig">Instagram</option>
          <option value="tt">TikTok</option>
          <option value="li">LinkedIn</option>
          <option value="tw">Twitter / X</option>
          <option value="fb">Facebook</option>
        </select>
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="px-3 py-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
        >
          <option value="travel">Travel & Tourism</option>
          <option value="fashion">Fashion & Beauty</option>
          <option value="food">Food & Restaurants</option>
          <option value="edu">Education</option>
          <option value="fitness">Fitness & Wellness</option>
          <option value="gaming">Gaming</option>
          <option value="b2b">B2B</option>
          <option value="ecom">E-commerce</option>
        </select>
        <select
          value={tz}
          onChange={(e) => setTz(e.target.value)}
          className="px-3 py-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
        >
          <option value="et">Eastern (ET/UTC-5)</option>
          <option value="ct">Central (CT/UTC-6)</option>
          <option value="pt">Pacific (PT/UTC-8)</option>
          <option value="gmt">London (GMT/UTC+0)</option>
          <option value="cet">Central EU (CET/UTC+1)</option>
        </select>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-accent-600 text-white rounded cursor-pointer hover:opacity-90"
        >
          Export .ics
        </button>
      </header>

      <div className="text-sm mt-4 flex gap-4">
        <span>■ <span className="text-mono-500">low</span></span>
        <span>■ <span className="text-green-600">top-3 window</span></span>
      </div>

      <div className="grid grid-cols-7 gap-1 mt-4">
        {days.map(d => (
          <div key={d} className="font-semibold text-xs text-center py-2">
            {d.slice(0, 3).toUpperCase()}
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

