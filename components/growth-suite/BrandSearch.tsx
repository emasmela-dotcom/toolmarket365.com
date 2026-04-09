'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, DollarSign, Globe, Users, Calendar } from 'lucide-react';
import { formatCurrency } from '@/lib/utils'

interface Brand {
  id: string
  company_name: string
  website: string
  budget_range: string
  preferred_creator_types: string[]
  campaign_types: string[]
  status: 'active' | 'inactive' | 'suspended'
  description?: string
  location?: string
}

export function BrandSearch() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [budgetFilter, setBudgetFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBrands()
  }, [])

  useEffect(() => {
    filterBrands()
  }, [brands, searchTerm, budgetFilter])

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/growth-suite/brands?list=true')
      if (response.ok) {
        const data = await response.json()
        setBrands(data.brands || [])
      }
    } catch (error) {
      console.error('Error fetching brands:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterBrands = () => {
    let filtered = brands

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(brand => 
        brand.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand.preferred_creator_types.some(type => 
          type.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Filter by budget range
    if (budgetFilter) {
      filtered = filtered.filter(brand => 
        brand.budget_range === budgetFilter
      )
    }

    setFilteredBrands(filtered)
  }

  const getBudgetRangeOptions = () => {
    const uniqueRanges = [...new Set(brands.map(brand => brand.budget_range))]
    return uniqueRanges.filter(Boolean)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mono-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search brands by name, description, or creator type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mono-400 w-4 h-4" />
          <select
            value={budgetFilter}
            onChange={(e) => setBudgetFilter(e.target.value)}
            className="pl-10 pr-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            <option value="">All Budgets</option>
            {getBudgetRangeOptions().map(range => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-mono-600 dark:text-mono-400">
        Found {filteredBrands.length} brands
      </div>

      {/* Brand Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBrands.map((brand) => (
          <div key={brand.id} className="border border-mono-200 dark:border-mono-700 rounded-lg hover:shadow-lg transition-shadow bg-mono-50 dark:bg-mono-900">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-mono-950 dark:text-mono-50">{brand.company_name}</h3>
                <span className={`px-2 py-0.5 rounded text-xs ${
                  brand.status === 'active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-mono-100 text-mono-800 dark:bg-mono-800 dark:text-mono-200'
                }`}>
                  {brand.status}
                </span>
              </div>
              
              <div className="space-y-4">
                {/* Website */}
                <div className="flex items-center space-x-2 text-sm text-mono-600 dark:text-mono-400">
                  <Globe className="w-4 h-4" />
                  <a href={brand.website} target="_blank" rel="noopener noreferrer" className="text-accent-600 hover:underline">
                    {brand.website?.replace('https://', '').replace('http://', '')}
                  </a>
                </div>

                {/* Budget Range */}
                <div className="flex items-center space-x-2 text-sm text-mono-600 dark:text-mono-400">
                  <DollarSign className="w-4 h-4" />
                  <span>{brand.budget_range}</span>
                </div>

                {/* Location */}
                {brand.location && (
                  <div className="flex items-center space-x-2 text-sm text-mono-600 dark:text-mono-400">
                    <Users className="w-4 h-4" />
                    <span>{brand.location}</span>
                  </div>
                )}

                {/* Preferred Creator Types */}
                <div>
                  <p className="text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">Preferred Creator Types:</p>
                  <div className="flex flex-wrap gap-2">
                    {brand.preferred_creator_types?.map((type, index) => (
                      <span key={index} className="px-2 py-0.5 border border-mono-300 dark:border-mono-700 rounded text-xs text-mono-700 dark:text-mono-300">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Campaign Types */}
                <div>
                  <p className="text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">Campaign Types:</p>
                  <div className="flex flex-wrap gap-2">
                    {brand.campaign_types?.map((type, index) => (
                      <span key={index} className="px-2 py-0.5 border border-mono-300 dark:border-mono-700 rounded text-xs text-mono-700 dark:text-mono-300">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                {brand.description && (
                  <p className="text-sm text-mono-600 dark:text-mono-400 line-clamp-3">
                    {brand.description}
                  </p>
                )}

                {/* Action Button */}
                <button className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredBrands.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-mono-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-mono-900 dark:text-mono-100 mb-2">No brands found</h3>
          <p className="text-mono-600 dark:text-mono-400">
            {searchTerm || budgetFilter 
              ? "Try adjusting your search criteria"
              : "No brands available at the moment"
            }
          </p>
        </div>
      )}
    </div>
  )
}
