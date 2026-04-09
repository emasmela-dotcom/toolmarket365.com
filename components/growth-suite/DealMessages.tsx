'use client'

import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Send, User, Building2 } from 'lucide-react';

interface Message {
  id: string
  sender_id: string
  sender_type: 'brand' | 'creator' | 'system'
  sender_name?: string
  sender_avatar?: string
  message: string
  created_at: string
  attachments?: string[]
  isOwn?: boolean
}

interface DealMessagesProps {
  dealId: string
  userRole: 'brand' | 'creator' | 'unknown'
}

export function DealMessages({ dealId, userRole }: DealMessagesProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetchMessages()
    // Poll for new messages every 30 seconds
    const interval = setInterval(fetchMessages, 30000)
    return () => clearInterval(interval)
  }, [dealId])

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/growth-suite/deals/${dealId}/messages`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || userRole === 'unknown') return

    try {
      setSending(true)
      const response = await fetch(`/api/growth-suite/deals/${dealId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: newMessage.trim()
        })
      })

      if (response.ok) {
        setNewMessage('')
        fetchMessages()
      } else {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const getAvatarIcon = (senderType: string) => {
    switch (senderType) {
      case 'brand':
        return <Building2 className="w-4 h-4" />
      case 'creator':
        return <User className="w-4 h-4" />
      default:
        return <User className="w-4 h-4" />
    }
  }

  const getAvatarColor = (senderType: string) => {
    switch (senderType) {
      case 'brand':
        return 'bg-accent-600'
      case 'creator':
        return 'bg-purple-600'
      default:
        return 'bg-mono-600'
    }
  }

  if (userRole === 'unknown') {
    return (
      <div className="border border-mono-200 dark:border-mono-700 rounded-lg p-8 text-center bg-mono-50 dark:bg-mono-900">
        <p className="text-mono-600 dark:text-mono-400">You must be a participant in this deal to view messages.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Messages List */}
      <div className="border border-mono-200 dark:border-mono-700 rounded-lg p-6 bg-mono-50 dark:bg-mono-900">
        <h3 className="text-lg font-semibold text-mono-950 dark:text-mono-50 mb-4">Conversation</h3>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-mono-500">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwn = message.isOwn !== undefined ? message.isOwn : false
              return (
                <div
                  key={message.id}
                  className={`flex space-x-3 ${
                    isOwn ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${getAvatarColor(message.sender_type)}`}>
                    {message.sender_avatar ? (
                      <img src={message.sender_avatar} alt={message.sender_name || ''} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      getAvatarIcon(message.sender_type)
                    )}
                  </div>
                  <div className={`flex-1 space-y-1 ${
                    isOwn ? 'text-right' : ''
                  }`}>
                    {!isOwn && message.sender_name && (
                      <p className="text-xs font-medium text-mono-600 dark:text-mono-400 mb-1">
                        {message.sender_name}
                      </p>
                    )}
                    <div className={`inline-block p-3 rounded-lg ${
                      isOwn
                        ? 'bg-accent-600 text-white'
                        : 'bg-mono-100 dark:bg-mono-800 text-mono-900 dark:text-mono-50'
                    }`}>
                      <p className="text-sm">{message.message}</p>
                    </div>
                    <p className="text-xs text-mono-500">
                      {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Message Input */}
      <div className="border border-mono-200 dark:border-mono-700 rounded-lg p-4 bg-mono-50 dark:bg-mono-900">
        <div className="flex space-x-3">
          <textarea
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 resize-none min-h-[80px]"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
            className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-end"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
