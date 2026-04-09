'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react';
import { isLocalStorageFavorite, addLocalStorageFavorite, removeLocalStorageFavorite } from '@/lib/templates/favorites'

interface FavoriteButtonProps {
  templateId: string
  initialIsFavorited?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onToggle?: (isFavorited: boolean) => void
}

export function FavoriteButton({ 
  templateId, 
  initialIsFavorited = false,
  size = 'md',
  className = '',
  onToggle 
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited)
  const [isLoading, setIsLoading] = useState(false)

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  useEffect(() => {
    // Check localStorage on mount for non-authenticated users
    if (!initialIsFavorited) {
      const favorited = isLocalStorageFavorite(templateId)
      setIsFavorited(favorited)
    }
  }, [templateId, initialIsFavorited])

  const handleToggle = async () => {
    setIsLoading(true)
    
    try {
      const action = isFavorited ? 'remove' : 'add'
      const response = await fetch('/api/templates/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId,
          action
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const newFavoritedState = !isFavorited
        setIsFavorited(newFavoritedState)
        
        // Update localStorage as backup
        if (newFavoritedState) {
          addLocalStorageFavorite(templateId)
        } else {
          removeLocalStorageFavorite(templateId)
        }

        // Call parent callback
        if (onToggle) {
          onToggle(newFavoritedState)
        }

      } else {
        // Fallback to localStorage if API fails
        const newFavoritedState = !isFavorited
        if (newFavoritedState) {
          addLocalStorageFavorite(templateId)
        } else {
          removeLocalStorageFavorite(templateId)
        }
        setIsFavorited(newFavoritedState)
        if (onToggle) {
          onToggle(newFavoritedState)
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      // Fallback to localStorage
      const newFavoritedState = !isFavorited
      if (newFavoritedState) {
        addLocalStorageFavorite(templateId)
      } else {
        removeLocalStorageFavorite(templateId)
      }
      setIsFavorited(newFavoritedState)
      if (onToggle) {
        onToggle(newFavoritedState)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`relative transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg p-2 ${
        isFavorited ? 'text-red-500 hover:text-red-600 dark:text-red-400' : 'text-mono-400 hover:text-red-500 dark:hover:text-red-400'
      } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      aria-pressed={isFavorited}
    >
      <Heart 
        className={`${sizeClasses[size]} transition-all duration-200 ${
          isFavorited ? 'fill-current' : ''
        }`}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`${sizeClasses[size]} border-2 border-current border-t-transparent rounded-full animate-spin`} />
        </div>
      )}
    </button>
  )
}
