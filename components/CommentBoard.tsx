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
    loadComments()
  }, [])

  const loadComments = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/comments')
      const data = await response.json()
      if (response.ok) {
        setComments(data.comments || [])
      } else {
        console.error('Failed to load comments:', data.error)
      }
    } catch (error) {
      console.error('Error loading comments:', error)
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
    <section className="py-12 bg-mono-50 dark:bg-mono-900 border-t border-mono-200 dark:border-mono-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="h-6 w-6 text-accent-600 dark:text-accent-400" />
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50">
              Community Board
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="mb-8 bg-white dark:bg-mono-800 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-md bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  maxLength={50}
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your thoughts, feedback, or announcements..."
                  rows={4}
                  className="w-full px-3 py-2 border border-mono-300 dark:border-mono-700 rounded-md bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500 resize-y"
                  maxLength={500}
                />
                <p className="text-right text-xs text-mono-500 dark:text-mono-400 mt-1">
                  {message.length}/500
                </p>
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !name.trim() || !message.trim()}
                className="w-full sm:w-auto px-6 py-2 bg-accent-600 text-white font-medium rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? 'Posting...' : 'Post Message'}
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12 bg-white dark:bg-mono-800 rounded-lg border border-mono-200 dark:border-mono-700">
                <p className="text-mono-600 dark:text-mono-400">Loading comments...</p>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-mono-800 rounded-lg border border-mono-200 dark:border-mono-700">
                <MessageSquare className="h-12 w-12 text-mono-400 dark:text-mono-600 mx-auto mb-3" />
                <p className="text-mono-600 dark:text-mono-400">No messages yet. Be the first to post!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-white dark:bg-mono-800 rounded-lg p-5 border border-mono-200 dark:border-mono-700 hover:border-accent-300 dark:hover:border-accent-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-mono-950 dark:text-mono-50">
                        {comment.name}
                      </span>
                      <span className="text-xs text-mono-500 dark:text-mono-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="p-1 text-mono-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      title="Delete comment"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-mono-700 dark:text-mono-300 whitespace-pre-wrap">
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

