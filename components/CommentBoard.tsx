'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Send, Trash2, Clock } from 'lucide-react'

interface Comment {
  id: string
  name: string
  message: string
  created_at: string
  updated_at?: string
}

export function CommentBoard() {
  const [comments, setComments] = useState<Comment[]>([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load comments with timeout to prevent page hanging
    const timer = setTimeout(() => {
      loadComments()
    }, 100) // Small delay to let page render first
    return () => clearTimeout(timer)
  }, [])

  const loadComments = async () => {
    try {
      setIsLoading(true)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2000) // 2 second timeout
      
      try {
        const response = await fetch('/api/comments', {
          signal: controller.signal
        })
        clearTimeout(timeoutId)
        
        if (!response.ok) {
          throw new Error('API error')
        }
        
        const data = await response.json()
        setComments(data.comments || [])
      } catch (fetchError) {
        clearTimeout(timeoutId)
        // Silently fail - don't block the page
        setComments([])
      }
    } catch (error) {
      // Silently fail - don't block the page
      setComments([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) {
      alert('Please enter both name and message')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          message: message.trim(),
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setName('')
        setMessage('')
        loadComments() // Reload comments from server
      } else {
        alert(data.error || 'Failed to post comment')
      }
    } catch (error) {
      console.error('Error posting comment:', error)
      alert('Failed to post comment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this comment?')) return

    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        loadComments() // Reload comments from server
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete comment')
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
      alert('Failed to delete comment. Please try again.')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <section className="py-6 bg-mono-50 dark:bg-mono-900 border-t border-mono-200 dark:border-mono-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-accent-600 dark:text-accent-400" />
            <h2 className="text-lg font-bold text-mono-950 dark:text-mono-50">
              Community Board
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="mb-4 bg-white dark:bg-mono-800 rounded-lg p-4 border border-mono-200 dark:border-mono-700">
            <div className="space-y-3">
              <div className="flex gap-3">
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="flex-1 px-3 py-2 text-sm border border-mono-300 dark:border-mono-700 rounded-md bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  maxLength={50}
                />
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={2}
                  className="flex-1 px-3 py-2 text-sm border border-mono-300 dark:border-mono-700 rounded-md bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500 resize-none"
                  maxLength={500}
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim() || !message.trim()}
                  className="px-4 py-2 bg-accent-600 text-white text-sm font-medium rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  {isSubmitting ? '...' : 'Post'}
                </button>
              </div>
            </div>
          </form>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-6 bg-white dark:bg-mono-800 rounded-lg border border-mono-200 dark:border-mono-700">
                <p className="text-sm text-mono-600 dark:text-mono-400">Loading...</p>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-6 bg-white dark:bg-mono-800 rounded-lg border border-mono-200 dark:border-mono-700">
                <p className="text-sm text-mono-600 dark:text-mono-400">No messages yet.</p>
              </div>
            ) : (
              comments.slice(0, 5).map((comment) => (
                <div
                  key={comment.id}
                  className="bg-white dark:bg-mono-800 rounded-lg p-3 border border-mono-200 dark:border-mono-700 text-sm"
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-mono-950 dark:text-mono-50 text-xs">
                        {comment.name}
                      </span>
                      <span className="text-xs text-mono-500 dark:text-mono-400">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="p-1 text-mono-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="text-xs text-mono-700 dark:text-mono-300 whitespace-pre-wrap line-clamp-2">
                    {comment.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

