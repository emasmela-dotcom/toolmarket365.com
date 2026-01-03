'use client'

import { useState, useEffect } from 'react'
import { DollarSign, Plus, Trash2, Calendar, TrendingUp, Download, Filter } from 'lucide-react'

interface RevenueEntry {
  id: number
  amount: number
  date: string
  source: string
  description: string
}

const STORE_KEY = 'revenueTracker'

export default function RevenueTracker() {
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
      source: formData.source || 'Other',
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
    if (confirm('Are you sure you want to clear all revenue entries?')) {
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

  const sources = Array.from(new Set(entries.map(e => e.source))).filter(Boolean)

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-accent-600 rounded-2xl">
              <DollarSign className="text-white" size={48} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-mono-950 dark:text-mono-50 mb-3">Revenue Tracker</h1>
          <p className="text-xl text-mono-600 dark:text-mono-400">Track your income and revenue streams</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-mono-50 dark:bg-mono-900 rounded-xl shadow p-6 border border-mono-200 dark:border-mono-700">
            <p className="text-sm text-mono-600 dark:text-mono-400 mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-mono-950 dark:text-mono-50">
              ${getTotal().toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-mono-50 dark:bg-mono-900 rounded-xl shadow p-6 border border-mono-200 dark:border-mono-700">
            <p className="text-sm text-mono-600 dark:text-mono-400 mb-1">This Month</p>
            <p className="text-3xl font-bold text-green-600">
              ${getMonthlyTotal().toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-mono-50 dark:bg-mono-900 rounded-xl shadow p-6 border border-mono-200 dark:border-mono-700">
            <p className="text-sm text-mono-600 dark:text-mono-400 mb-1">Total Entries</p>
            <p className="text-3xl font-bold text-mono-950 dark:text-mono-50">{entries.length}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-accent-600 text-white rounded-lg font-semibold hover:bg-accent-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Add Revenue
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
              All
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
              This Month
            </button>
          </div>
          <button
            onClick={exportCSV}
            className="px-4 py-3 bg-mono-100 dark:bg-mono-800 hover:bg-mono-200 dark:hover:bg-mono-700 rounded-lg flex items-center gap-2 text-mono-700 dark:text-mono-300 ml-auto"
          >
            <Download size={18} />
            Export CSV
          </button>
          <button
            onClick={clearAll}
            className="px-4 py-3 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg text-red-700 dark:text-red-400"
          >
            Clear All
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="bg-mono-50 dark:bg-mono-900 rounded-xl shadow-xl p-6 mb-6 border border-mono-200 dark:border-mono-700">
            <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">Add Revenue Entry</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">
                  Amount ($)
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
                  Date
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
                  Source
                </label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  placeholder="e.g., Sponsored Post, Affiliate, Product Sale"
                  className="w-full px-4 py-3 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">
                  Description (optional)
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Additional notes"
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
                Add Entry
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-3 bg-mono-100 dark:bg-mono-800 text-mono-700 dark:text-mono-300 rounded-lg hover:bg-mono-200 dark:hover:bg-mono-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Entries List */}
        <div className="bg-mono-50 dark:bg-mono-900 rounded-xl shadow-xl border border-mono-200 dark:border-mono-700 overflow-hidden">
          {getFilteredEntries().length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-mono-100 dark:bg-mono-800">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-mono-700 dark:text-mono-300">Date</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-mono-700 dark:text-mono-300">Amount</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-mono-700 dark:text-mono-300">Source</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-mono-700 dark:text-mono-300">Description</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-mono-700 dark:text-mono-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredEntries().map((entry) => (
                    <tr key={entry.id} className="border-t border-mono-200 dark:border-mono-700 hover:bg-mono-100 dark:hover:bg-mono-800">
                      <td className="px-6 py-4 text-mono-700 dark:text-mono-300">
                        {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
              <h3 className="text-xl font-bold text-mono-700 dark:text-mono-300 mb-2">No Revenue Entries Yet</h3>
              <p className="text-mono-500">Click "Add Revenue" to start tracking your income</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

