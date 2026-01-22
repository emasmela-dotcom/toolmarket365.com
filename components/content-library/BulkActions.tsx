'use client'

import { useState } from 'react'
import { AlertTriangle, Heart, HeartOff, Folder, Archive, Send, Trash2, X } from 'lucide-react'

interface BulkActionsProps {
  selectedItems: string[]
  onActionComplete: () => void
  collections: Array<{
    id: string
    name: string
    item_count: number
  }>
}

export function BulkActions({ selectedItems, onActionComplete, collections }: BulkActionsProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingAction, setPendingAction] = useState<string | null>(null)
  const [targetCollection, setTargetCollection] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const actions = [
    { id: 'favorite', label: 'Add to Favorites', icon: Heart, description: 'Mark selected items as favorites' },
    { id: 'unfavorite', label: 'Remove from Favorites', icon: HeartOff, description: 'Remove selected items from favorites' },
    { id: 'move', label: 'Move to Collection', icon: Folder, description: 'Move selected items to another collection' },
    { id: 'archive', label: 'Archive', icon: Archive, description: 'Archive selected items' },
    { id: 'publish', label: 'Publish', icon: Send, description: 'Publish selected items' },
    { id: 'delete', label: 'Delete', icon: Trash2, description: 'Permanently delete selected items', dangerous: true }
  ]

  const handleBulkAction = async (actionId: string) => {
    setPendingAction(actionId)
    
    if (actionId === 'delete' || actionId === 'archive') {
      setShowConfirmDialog(true)
      return
    }

    if (actionId === 'move') {
      // Handle move action specially - show dialog with collection selector
      setShowConfirmDialog(true)
      return
    }

    await executeAction(actionId)
  }

  const executeAction = async (actionId: string, additionalData: any = {}) => {
    if (isProcessing) return

    setIsProcessing(true)
    try {
      const promises = selectedItems.map(id => {
        switch (actionId) {
          case 'favorite':
            return fetch(`/api/content-library/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ is_favorite: true })
            })
          
          case 'unfavorite':
            return fetch(`/api/content-library/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ is_favorite: false })
            })
          
          case 'archive':
            return fetch(`/api/content-library/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'archived' })
            })
          
          case 'publish':
            return fetch(`/api/content-library/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'published' })
            })
          
          case 'delete':
            return fetch(`/api/content-library/${id}`, { method: 'DELETE' })
          
          case 'move':
            return fetch(`/api/content-library/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ collection_id: additionalData.targetCollection || null })
            })
          
          default:
            return Promise.resolve()
        }
      })

      const results = await Promise.all(promises)
      const allSuccessful = results.every(response => response.ok)

      if (allSuccessful) {
        const actionLabel = actions.find(a => a.id === actionId)?.label || actionId
        alert(`Bulk ${actionLabel} completed successfully`)
        onActionComplete()
      } else {
        throw new Error('Some operations failed')
      }
    } catch (error) {
      alert(`Failed to execute bulk action: ${actionId}`)
      console.error('Bulk action error:', error)
    } finally {
      setIsProcessing(false)
      setPendingAction(null)
      setShowConfirmDialog(false)
      setTargetCollection('')
      setShowDropdown(false)
    }
  }

  const handleConfirm = () => {
    if (pendingAction === 'move') {
      // Empty string is valid (removes from collection), so we allow it
      executeAction('move', { targetCollection })
    } else {
      executeAction(pendingAction!)
    }
  }

  if (selectedItems.length === 0) return null

  const actionLabel = actions.find(a => a.id === pendingAction)?.label || pendingAction

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="px-4 py-2 bg-mono-200 dark:bg-mono-800 text-mono-950 dark:text-mono-50 rounded-lg hover:bg-mono-300 dark:hover:bg-mono-700 transition-colors flex items-center space-x-2"
        >
          <span>Bulk Actions ({selectedItems.length})</span>
        </button>
        
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-mono-900 rounded-lg shadow-lg border border-mono-200 dark:border-mono-700 z-20">
            {actions.map(action => {
              const IconComponent = action.icon
              return (
                <button
                  key={action.id}
                  onClick={() => {
                    setShowDropdown(false)
                    handleBulkAction(action.id)
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-mono-100 dark:hover:bg-mono-800 flex items-center space-x-2 transition-colors ${
                    action.dangerous ? 'text-red-600 dark:text-red-400' : ''
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{action.label}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-mono-900 rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-semibold">Confirm Bulk Action</h3>
              </div>
              <button
                onClick={() => {
                  setShowConfirmDialog(false)
                  setPendingAction(null)
                  setTargetCollection('')
                }}
                className="p-1 hover:bg-mono-100 dark:hover:bg-mono-800 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-mono-600 dark:text-mono-400 mb-4">
              {pendingAction === 'delete'
                ? `Are you sure you want to delete ${selectedItems.length} items? This action cannot be undone.`
                : pendingAction === 'move'
                  ? `Move ${selectedItems.length} items to a collection:`
                  : `Are you sure you want to ${actionLabel?.toLowerCase()} ${selectedItems.length} items?`
              }
            </p>
            
            {pendingAction === 'move' && (
              <div className="space-y-2 mb-4">
                <label className="block text-sm font-medium">Select Target Collection</label>
                <select
                  value={targetCollection}
                  onChange={(e) => setTargetCollection(e.target.value)}
                  className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
                >
                  <option value="">No Collection (Remove from collection)</option>
                  {collections.map(collection => (
                    <option key={collection.id} value={collection.id}>
                      {collection.name} ({collection.item_count} items)
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="flex justify-end space-x-2 pt-4 border-t border-mono-200 dark:border-mono-700">
              <button
                onClick={() => {
                  setShowConfirmDialog(false)
                  setPendingAction(null)
                  setTargetCollection('')
                }}
                className="px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isProcessing}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  pendingAction === 'delete'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-accent-600 text-white hover:bg-accent-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isProcessing ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </>
  )
}
