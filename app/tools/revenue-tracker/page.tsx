'use client'

import { useState, useEffect } from 'react'
import { DollarSign, Plus, Trash2, Calendar, Download, Filter } from 'lucide-react';
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface RevenueEntry {
  id: number
  amount: number
  date: string
  source: string
  description: string
}

const STORE_KEY = 'revenueTracker'

const copy = {
  en: {
    toolName: 'Revenue Tracker',
    toolDescription:
      'Track and manage your creator revenue across all income sources. Monitor earnings, view trends, filter by date range, and export data for tax and financial planning.',
    howToUse: [
      { label: 'Add revenue entry:', text: 'Click "Add Revenue" and enter amount, date, source, and description' },
      { label: 'View all entries:', text: 'See all revenue entries in a table with totals' },
      { label: 'Filter by date:', text: 'Use date filters to view revenue for specific periods' },
      { label: 'View trends:', text: 'See monthly and yearly revenue summaries' },
      { label: 'Export data:', text: 'Download revenue data as CSV for accounting' },
      { label: 'Delete entries:', text: 'Remove incorrect entries as needed' },
    ],
    title: 'Revenue Tracker',
    subtitle: 'Track your income and revenue streams',
    newToMonetization: 'New to monetization?',
    stripePrompt: 'to start accepting payments from brands and clients.',
    howToUseTitle: 'How to Use This Tool',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      'Track and manage your revenue streams. Add income entries with dates, sources, and descriptions. View totals, monthly breakdowns, and export data for accounting.',
    howToUseInner: 'How to Use',
    howToUseSteps: [
      { label: 'Add revenue entry:', text: 'Click "Add Revenue" button, enter amount ($), select date (defaults to today), enter source (e.g., "Sponsored Post", "Affiliate"), add description (optional), click "Add Entry"' },
      { label: 'View revenue:', text: 'See total revenue at top, view this month\'s revenue, see total number of entries, browse all entries in table' },
      { label: 'Filter entries:', text: 'All (view all revenue entries) or This Month (view only current month)' },
      { label: 'Manage entries:', text: 'Delete individual entries with trash icon, clear all entries (with confirmation)' },
      { label: 'Export data:', text: 'Click "Export CSV" to download spreadsheet (includes date, amount, source, description)' },
    ],
    expectedOutcome: 'Expected Outcome',
    expectedOutcomes: [
      'Total Revenue - Sum of all entries',
      'This Month - Current month\'s total',
      'Total Entries - Number of revenue entries',
      'Detailed table - All entries with date, amount, source, description',
      'CSV export - Downloadable spreadsheet for accounting',
      'Local storage - All data saved in browser',
    ],
    totalRevenue: 'Total Revenue',
    thisMonth: 'This Month',
    totalEntries: 'Total Entries',
    addRevenue: 'Add Revenue',
    all: 'All',
    thisMonthFilter: 'This Month',
    exportCsv: 'Export CSV',
    clearAll: 'Clear All',
    addRevenueEntry: 'Add Revenue Entry',
    amount: 'Amount ($)',
    date: 'Date',
    source: 'Source',
    sourcePlaceholder: 'e.g., Sponsored Post, Affiliate, Product Sale',
    descriptionOptional: 'Description (optional)',
    descriptionPlaceholder: 'Additional notes',
    addEntry: 'Add Entry',
    cancel: 'Cancel',
    tableDate: 'Date',
    tableAmount: 'Amount',
    tableSource: 'Source',
    tableDescription: 'Description',
    tableActions: 'Actions',
    noEntriesTitle: 'No Revenue Entries Yet',
    noEntriesHint: 'Click "Add Revenue" to start tracking your income',
    confirmClear: 'Are you sure you want to clear all revenue entries?',
    defaultSource: 'Other',
  },
  es: {
    toolName: 'Rastreador de ingresos',
    toolDescription:
      'Rastrea y gestiona tus ingresos como creador en todas las fuentes. Monitorea ganancias, ve tendencias, filtra por rango de fechas y exporta datos para impuestos y planificación financiera.',
    howToUse: [
      { label: 'Agrega entrada de ingreso:', text: 'Haz clic en "Agregar ingreso" e ingresa monto, fecha, fuente y descripción' },
      { label: 'Ve todas las entradas:', text: 'Consulta todas las entradas de ingreso en una tabla con totales' },
      { label: 'Filtra por fecha:', text: 'Usa filtros de fecha para ver ingresos de periodos específicos' },
      { label: 'Ve tendencias:', text: 'Consulta resúmenes de ingresos mensuales y anuales' },
      { label: 'Exporta datos:', text: 'Descarga datos de ingresos en CSV para contabilidad' },
      { label: 'Elimina entradas:', text: 'Quita entradas incorrectas según sea necesario' },
    ],
    title: 'Rastreador de ingresos',
    subtitle: 'Rastrea tus ingresos y fuentes de revenue',
    newToMonetization: '¿Nuevo en monetización?',
    stripePrompt: 'para empezar a aceptar pagos de marcas y clientes.',
    howToUseTitle: 'Cómo usar esta herramienta',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Rastrea y gestiona tus fuentes de ingresos. Agrega entradas con fechas, fuentes y descripciones. Ve totales, desglose mensual y exporta datos para contabilidad.',
    howToUseInner: 'Cómo usar',
    howToUseSteps: [
      { label: 'Agrega entrada de ingreso:', text: 'Haz clic en "Agregar ingreso", ingresa monto ($), selecciona fecha (por defecto hoy), ingresa fuente (ej., "Publicación patrocinada", "Afiliado"), agrega descripción (opcional), haz clic en "Agregar entrada"' },
      { label: 'Ve ingresos:', text: 'Consulta ingresos totales arriba, ingresos del mes, número total de entradas, explora todas las entradas en la tabla' },
      { label: 'Filtra entradas:', text: 'Todos (ver todas las entradas) o Este mes (ver solo el mes actual)' },
      { label: 'Gestiona entradas:', text: 'Elimina entradas individuales con el icono de papelera, borra todas las entradas (con confirmación)' },
      { label: 'Exporta datos:', text: 'Haz clic en "Exportar CSV" para descargar hoja de cálculo (incluye fecha, monto, fuente, descripción)' },
    ],
    expectedOutcome: 'Resultado esperado',
    expectedOutcomes: [
      'Ingresos totales - Suma de todas las entradas',
      'Este mes - Total del mes actual',
      'Total de entradas - Número de entradas de ingreso',
      'Tabla detallada - Todas las entradas con fecha, monto, fuente, descripción',
      'Exportación CSV - Hoja de cálculo descargable para contabilidad',
      'Almacenamiento local - Todos los datos guardados en el navegador',
    ],
    totalRevenue: 'Ingresos totales',
    thisMonth: 'Este mes',
    totalEntries: 'Total de entradas',
    addRevenue: 'Agregar ingreso',
    all: 'Todos',
    thisMonthFilter: 'Este mes',
    exportCsv: 'Exportar CSV',
    clearAll: 'Borrar todo',
    addRevenueEntry: 'Agregar entrada de ingreso',
    amount: 'Monto ($)',
    date: 'Fecha',
    source: 'Fuente',
    sourcePlaceholder: 'ej., Publicación patrocinada, Afiliado, Venta de producto',
    descriptionOptional: 'Descripción (opcional)',
    descriptionPlaceholder: 'Notas adicionales',
    addEntry: 'Agregar entrada',
    cancel: 'Cancelar',
    tableDate: 'Fecha',
    tableAmount: 'Monto',
    tableSource: 'Fuente',
    tableDescription: 'Descripción',
    tableActions: 'Acciones',
    noEntriesTitle: 'Aún no hay entradas de ingreso',
    noEntriesHint: 'Haz clic en "Agregar ingreso" para empezar a rastrear tus ingresos',
    confirmClear: '¿Estás seguro de que quieres borrar todas las entradas de ingreso?',
    defaultSource: 'Otro',
  },
}

function RevenueTrackerContent() {
  const { language } = useLanguage()
  const c = copy[language]
  const [entries, setEntries] = useState<RevenueEntry[]>([])
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    source: '',
    description: ''
  })
  const [filter, setFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORE_KEY)
    if (stored) {
      setEntries(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(entries))
  }, [entries])

  const addEntry = () => {
    const amount = parseFloat(formData.amount)
    if (!amount || amount <= 0) return

    const newEntry: RevenueEntry = {
      id: Date.now(),
      amount,
      date: formData.date,
      source: formData.source || c.defaultSource,
      description: formData.description || ''
    }

    setEntries([...entries, newEntry].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
    setFormData({
      amount: '',
      date: new Date().toISOString().split('T')[0],
      source: '',
      description: ''
    })
    setShowForm(false)
  }

  const deleteEntry = (id: number) => {
    setEntries(entries.filter(e => e.id !== id))
  }

  const clearAll = () => {
    if (confirm(c.confirmClear)) {
      setEntries([])
      localStorage.removeItem(STORE_KEY)
    }
  }

  const getTotal = () => {
    return entries.reduce((sum, e) => sum + e.amount, 0)
  }

  const getMonthlyTotal = () => {
    const now = new Date()
    const currentMonth = entries.filter(e => {
      const entryDate = new Date(e.date)
      return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear()
    })
    return currentMonth.reduce((sum, e) => sum + e.amount, 0)
  }

  const getFilteredEntries = () => {
    if (filter === 'all') return entries
    if (filter === 'month') {
      const now = new Date()
      return entries.filter(e => {
        const entryDate = new Date(e.date)
        return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear()
      })
    }
    return entries
  }

  const exportCSV = () => {
    const csv = [
      'Date,Amount,Source,Description',
      ...entries.map(e => `"${e.date}","${e.amount}","${e.source}","${e.description}"`)
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `revenue-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const dateLocale = language === 'es' ? 'es-ES' : 'en-US'

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-accent-600 rounded-2xl">
              <DollarSign className="text-white" size={48} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-mono-950 dark:text-mono-50 mb-3">{c.title}</h1>
          <p className="text-xl text-mono-600 dark:text-mono-400 mb-4">{c.subtitle}</p>
          {entries.length === 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-sm text-blue-900 dark:text-blue-200 text-center">
                <strong>{c.newToMonetization}</strong> Set up payment processing with{' '}
                <a 
                  href="https://stripe.com/payments" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-700 dark:text-blue-300 underline hover:text-blue-800 dark:hover:text-blue-200 font-semibold"
                >
                  Stripe
                </a>
                {' '}{c.stripePrompt}
              </p>
            </div>
          )}
        </div>

        <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-6 mb-8 border border-mono-200 dark:border-mono-700">
          <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">{c.howToUseTitle}</h2>
          <div className="space-y-4 text-sm text-mono-700 dark:text-mono-300">
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">{c.whatItDoes}</h3>
              <p>{c.whatItDoesBody}</p>
            </div>
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">{c.howToUseInner}</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                {c.howToUseSteps.map((step, i) => (
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-mono-50 dark:bg-mono-900 rounded-xl shadow p-6 border border-mono-200 dark:border-mono-700">
            <p className="text-sm text-mono-600 dark:text-mono-400 mb-1">{c.totalRevenue}</p>
            <p className="text-3xl font-bold text-mono-950 dark:text-mono-50">
              ${getTotal().toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-mono-50 dark:bg-mono-900 rounded-xl shadow p-6 border border-mono-200 dark:border-mono-700">
            <p className="text-sm text-mono-600 dark:text-mono-400 mb-1">{c.thisMonth}</p>
            <p className="text-3xl font-bold text-green-600">
              ${getMonthlyTotal().toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-mono-50 dark:bg-mono-900 rounded-xl shadow p-6 border border-mono-200 dark:border-mono-700">
            <p className="text-sm text-mono-600 dark:text-mono-400 mb-1">{c.totalEntries}</p>
            <p className="text-3xl font-bold text-mono-950 dark:text-mono-50">{entries.length}</p>
          </div>
        </div>

        <div className="flex gap-4 mb-6 flex-wrap">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-accent-600 text-white rounded-lg font-semibold hover:bg-accent-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            {c.addRevenue}
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                filter === 'all'
                  ? 'bg-accent-600 text-white'
                  : 'bg-mono-100 dark:bg-mono-800 text-mono-700 dark:text-mono-300 hover:bg-mono-200 dark:hover:bg-mono-700'
              }`}
            >
              <Filter size={18} />
              {c.all}
            </button>
            <button
              onClick={() => setFilter('month')}
              className={`px-4 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                filter === 'month'
                  ? 'bg-accent-600 text-white'
                  : 'bg-mono-100 dark:bg-mono-800 text-mono-700 dark:text-mono-300 hover:bg-mono-200 dark:hover:bg-mono-700'
              }`}
            >
              <Calendar size={18} />
              {c.thisMonthFilter}
            </button>
          </div>
          <button
            onClick={exportCSV}
            className="px-4 py-3 bg-mono-100 dark:bg-mono-800 hover:bg-mono-200 dark:hover:bg-mono-700 rounded-lg flex items-center gap-2 text-mono-700 dark:text-mono-300 ml-auto"
          >
            <Download size={18} />
            {c.exportCsv}
          </button>
          <button
            onClick={clearAll}
            className="px-4 py-3 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg text-red-700 dark:text-red-400"
          >
            {c.clearAll}
          </button>
        </div>

        {showForm && (
          <div className="bg-mono-50 dark:bg-mono-900 rounded-xl shadow-xl p-6 mb-6 border border-mono-200 dark:border-mono-700">
            <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">{c.addRevenueEntry}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">
                  {c.amount}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">
                  {c.date}
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">
                  {c.source}
                </label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  placeholder={c.sourcePlaceholder}
                  className="w-full px-4 py-3 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">
                  {c.descriptionOptional}
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={c.descriptionPlaceholder}
                  className="w-full px-4 py-3 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={addEntry}
                disabled={!formData.amount}
                className="px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {c.addEntry}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-3 bg-mono-100 dark:bg-mono-800 text-mono-700 dark:text-mono-300 rounded-lg hover:bg-mono-200 dark:hover:bg-mono-700"
              >
                {c.cancel}
              </button>
            </div>
          </div>
        )}

        <div className="bg-mono-50 dark:bg-mono-900 rounded-xl shadow-xl border border-mono-200 dark:border-mono-700 overflow-hidden">
          {getFilteredEntries().length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-mono-100 dark:bg-mono-800">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-mono-700 dark:text-mono-300">{c.tableDate}</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-mono-700 dark:text-mono-300">{c.tableAmount}</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-mono-700 dark:text-mono-300">{c.tableSource}</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-mono-700 dark:text-mono-300">{c.tableDescription}</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-mono-700 dark:text-mono-300">{c.tableActions}</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredEntries().map((entry) => (
                    <tr key={entry.id} className="border-t border-mono-200 dark:border-mono-700 hover:bg-mono-100 dark:hover:bg-mono-800">
                      <td className="px-6 py-4 text-mono-700 dark:text-mono-300">
                        {new Date(entry.date).toLocaleDateString(dateLocale, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 font-semibold text-green-600">
                        ${entry.amount.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-mono-700 dark:text-mono-300">{entry.source}</td>
                      <td className="px-6 py-4 text-mono-600 dark:text-mono-400">{entry.description || '-'}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <DollarSign className="mx-auto text-mono-300 dark:text-mono-700 mb-4" size={64} />
              <h3 className="text-xl font-bold text-mono-700 dark:text-mono-300 mb-2">{c.noEntriesTitle}</h3>
              <p className="text-mono-500 dark:text-mono-400">{c.noEntriesHint}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function RevenueTracker() {
  const { language } = useLanguage()
  const c = copy[language]

  const howToUse = (
    <ol className="list-decimal list-inside space-y-1 ml-2">
      {c.howToUse.map((step, i) => (
        <li key={i}><strong>{step.label}</strong> {step.text}</li>
      ))}
    </ol>
  )

  return (
    <ToolAccessGate
      toolSlug="revenue-tracker"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <RevenueTrackerContent />
    </ToolAccessGate>
  )
}
