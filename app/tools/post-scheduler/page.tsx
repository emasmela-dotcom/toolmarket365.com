'use client'

import { useState } from 'react'
import { Clock, Instagram, Twitter, Linkedin, Youtube, Calendar, Image, FileText, Check, X, Edit, Trash2, Copy } from 'lucide-react'

interface Post {
  id: number
  content: string
  platform: string
  date: string
  time: string
  mediaType: string
  caption: string
  hashtags: string
  status: string
  createdAt: string
}

export default function PostScheduler() {
  const [posts, setPosts] = useState<Post[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [formData, setFormData] = useState({
    content: '',
    platform: 'instagram',
    date: '',
    time: '',
    mediaType: 'image',
    caption: '',
    hashtags: ''
  })
  const [activeTab, setActiveTab] = useState('upcoming')

  const platforms: Record<string, { icon: typeof Instagram; color: string; name: string }> = {
    instagram: { icon: Instagram, color: 'bg-pink-500', name: 'Instagram' },
    twitter: { icon: Twitter, color: 'bg-blue-500', name: 'Twitter' },
    linkedin: { icon: Linkedin, color: 'bg-indigo-500', name: 'LinkedIn' },
    youtube: { icon: Youtube, color: 'bg-red-500', name: 'YouTube' },
    tiktok: { icon: Clock, color: 'bg-purple-500', name: 'TikTok' }
  }

  const openModal = (post: Post | null = null) => {
    if (post) {
      setEditingPost(post)
      setFormData(post)
    } else {
      setEditingPost(null)
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      setFormData({
        content: '',
        platform: 'instagram',
        date: tomorrow.toISOString().split('T')[0],
        time: '09:00',
        mediaType: 'image',
        caption: '',
        hashtags: ''
      })
    }
    setShowModal(true)
  }

  const savePost = () => {
    if (!formData.content.trim() || !formData.date || !formData.time) return

    const newPost: Post = {
      id: editingPost ? editingPost.id : Date.now(),
      ...formData,
      status: 'scheduled',
      createdAt: editingPost ? editingPost.createdAt : new Date().toISOString()
    }

    if (editingPost) {
      setPosts(posts.map(p => p.id === editingPost.id ? newPost : p))
    } else {
      setPosts([...posts, newPost])
    }

    setShowModal(false)
    setFormData({
      content: '',
      platform: 'instagram',
      date: '',
      time: '',
      mediaType: 'image',
      caption: '',
      hashtags: ''
    })
  }

  const deletePost = (id: number) => {
    setPosts(posts.filter(p => p.id !== id))
  }

  const duplicatePost = (post: Post) => {
    const duplicated: Post = {
      ...post,
      id: Date.now(),
      createdAt: new Date().toISOString()
    }
    setPosts([...posts, duplicated])
  }

  const updatePostStatus = (id: number, status: string) => {
    setPosts(posts.map(p => p.id === id ? { ...p, status } : p))
  }

  const getScheduledDateTime = (post: Post) => {
    const date = new Date(`${post.date}T${post.time}`)
    return date
  }

  const isUpcoming = (post: Post) => {
    const scheduledTime = getScheduledDateTime(post)
    return scheduledTime > new Date() && post.status === 'scheduled'
  }

  const isPast = (post: Post) => {
    const scheduledTime = getScheduledDateTime(post)
    return scheduledTime <= new Date() || post.status === 'published'
  }

  const upcomingPosts = posts.filter(isUpcoming).sort((a, b) => 
    getScheduledDateTime(a).getTime() - getScheduledDateTime(b).getTime()
  )

  const pastPosts = posts.filter(isPast).sort((a, b) => 
    getScheduledDateTime(b).getTime() - getScheduledDateTime(a).getTime()
  )

  const draftPosts = posts.filter(p => p.status === 'draft')

  const formatDateTime = (date: string, time: string) => {
    const dt = new Date(`${date}T${time}`)
    return dt.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const getTimeUntil = (post: Post) => {
    const now = new Date()
    const scheduled = getScheduledDateTime(post)
    const diff = scheduled.getTime() - now.getTime()
    
    if (diff < 0) return 'Past due'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `in ${days}d ${hours}h`
    if (hours > 0) return `in ${hours}h`
    return 'Soon'
  }

  const PostCard = ({ post }: { post: Post }) => {
    const PlatformIcon = platforms[post.platform].icon
    
    return (
      <div className="bg-mono-50 dark:bg-mono-900 rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border-l-4 border-accent-600">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 ${platforms[post.platform].color} rounded-lg`}>
              <PlatformIcon className="text-white" size={20} />
            </div>
            <div>
              <p className="font-semibold text-mono-950 dark:text-mono-50">{platforms[post.platform].name}</p>
              <p className="text-sm text-mono-600 dark:text-mono-400">{formatDateTime(post.date, post.time)}</p>
            </div>
          </div>
          {isUpcoming(post) && (
            <span className="px-3 py-1 bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400 rounded-full text-xs font-semibold">
              {getTimeUntil(post)}
            </span>
          )}
          {post.status === 'published' && (
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold">
              Published
            </span>
          )}
          {post.status === 'draft' && (
            <span className="px-3 py-1 bg-mono-100 dark:bg-mono-800 text-mono-700 dark:text-mono-300 rounded-full text-xs font-semibold">
              Draft
            </span>
          )}
        </div>

        <div className="mb-4">
          <p className="text-mono-700 dark:text-mono-300 line-clamp-3 mb-2">{post.content}</p>
          {post.hashtags && (
            <p className="text-sm text-accent-600">{post.hashtags}</p>
          )}
        </div>

        <div className="flex items-center gap-2 mb-4">
          {post.mediaType === 'image' && (
            <span className="flex items-center gap-1 text-xs text-mono-500 bg-mono-100 dark:bg-mono-800 px-2 py-1 rounded">
              <Image size={14} />
              Image
            </span>
          )}
          {post.mediaType === 'video' && (
            <span className="flex items-center gap-1 text-xs text-mono-500 bg-mono-100 dark:bg-mono-800 px-2 py-1 rounded">
              <FileText size={14} />
              Video
            </span>
          )}
        </div>

        <div className="flex gap-2 pt-4 border-t border-mono-200 dark:border-mono-700">
          <button
            onClick={() => openModal(post)}
            className="flex-1 px-4 py-2 bg-mono-100 dark:bg-mono-800 hover:bg-mono-200 dark:hover:bg-mono-700 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-semibold text-mono-700 dark:text-mono-300"
          >
            <Edit size={16} />
            Edit
          </button>
          <button
            onClick={() => duplicatePost(post)}
            className="flex-1 px-4 py-2 bg-mono-100 dark:bg-mono-800 hover:bg-mono-200 dark:hover:bg-mono-700 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-semibold text-mono-700 dark:text-mono-300"
          >
            <Copy size={16} />
            Duplicate
          </button>
          {isUpcoming(post) && (
            <button
              onClick={() => updatePostStatus(post.id, 'published')}
              className="px-4 py-2 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-700 dark:text-green-400 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-semibold"
            >
              <Check size={16} />
            </button>
          )}
          <button
            onClick={() => deletePost(post.id)}
            className="px-4 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-semibold"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-accent-600 rounded-2xl">
              <Clock className="text-white" size={48} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-mono-950 dark:text-mono-50 mb-3">Post Scheduler</h1>
          <p className="text-xl text-mono-600 dark:text-mono-400">Schedule and manage your social media posts</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-mono-50 dark:bg-mono-900 rounded-xl shadow p-5 border border-mono-200 dark:border-mono-700">
            <p className="text-sm text-mono-600 dark:text-mono-400 mb-1">Total Posts</p>
            <p className="text-3xl font-bold text-mono-950 dark:text-mono-50">{posts.length}</p>
          </div>
          <div className="bg-mono-50 dark:bg-mono-900 rounded-xl shadow p-5 border border-mono-200 dark:border-mono-700">
            <p className="text-sm text-mono-600 dark:text-mono-400 mb-1">Upcoming</p>
            <p className="text-3xl font-bold text-accent-600">{upcomingPosts.length}</p>
          </div>
          <div className="bg-mono-50 dark:bg-mono-900 rounded-xl shadow p-5 border border-mono-200 dark:border-mono-700">
            <p className="text-sm text-mono-600 dark:text-mono-400 mb-1">Published</p>
            <p className="text-3xl font-bold text-green-600">
              {posts.filter(p => p.status === 'published').length}
            </p>
          </div>
          <div className="bg-mono-50 dark:bg-mono-900 rounded-xl shadow p-5 border border-mono-200 dark:border-mono-700">
            <p className="text-sm text-mono-600 dark:text-mono-400 mb-1">Drafts</p>
            <p className="text-3xl font-bold text-mono-600 dark:text-mono-400">{draftPosts.length}</p>
          </div>
        </div>

        <div className="mb-6">
          <button
            onClick={() => openModal()}
            className="w-full md:w-auto px-8 py-4 bg-accent-600 text-white rounded-xl font-bold text-lg hover:bg-accent-700 transition-all shadow-lg flex items-center justify-center gap-3"
          >
            <Clock size={24} />
            Schedule New Post
          </button>
        </div>

        <div className="bg-mono-50 dark:bg-mono-900 rounded-xl shadow-lg mb-6 border border-mono-200 dark:border-mono-700">
          <div className="flex border-b border-mono-200 dark:border-mono-700">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'upcoming'
                  ? 'text-accent-600 border-b-2 border-accent-600'
                  : 'text-mono-600 dark:text-mono-400 hover:text-mono-800 dark:hover:text-mono-200'
              }`}
            >
              Upcoming ({upcomingPosts.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'past'
                  ? 'text-accent-600 border-b-2 border-accent-600'
                  : 'text-mono-600 dark:text-mono-400 hover:text-mono-800 dark:hover:text-mono-200'
              }`}
            >
              Past ({pastPosts.length})
            </button>
            <button
              onClick={() => setActiveTab('drafts')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'drafts'
                  ? 'text-accent-600 border-b-2 border-accent-600'
                  : 'text-mono-600 dark:text-mono-400 hover:text-mono-800 dark:hover:text-mono-200'
              }`}
            >
              Drafts ({draftPosts.length})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'upcoming' && upcomingPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
          {activeTab === 'past' && pastPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
          {activeTab === 'drafts' && draftPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
          
          {((activeTab === 'upcoming' && upcomingPosts.length === 0) ||
            (activeTab === 'past' && pastPosts.length === 0) ||
            (activeTab === 'drafts' && draftPosts.length === 0)) && (
            <div className="col-span-full bg-mono-50 dark:bg-mono-900 rounded-xl shadow-lg p-12 text-center border border-mono-200 dark:border-mono-700">
              <Clock className="mx-auto text-mono-300 dark:text-mono-700 mb-4" size={64} />
              <h3 className="text-xl font-bold text-mono-700 dark:text-mono-300 mb-2">No Posts Yet</h3>
              <p className="text-mono-500">
                {activeTab === 'upcoming' && "Schedule your first post to get started"}
                {activeTab === 'past' && "Your published posts will appear here"}
                {activeTab === 'drafts' && "Save posts as drafts to work on them later"}
              </p>
            </div>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
            <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto border border-mono-200 dark:border-mono-700" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-mono-950 dark:text-mono-50">
                  {editingPost ? 'Edit Post' : 'Schedule New Post'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-mono-100 dark:hover:bg-mono-800 rounded-lg transition-colors text-mono-700 dark:text-mono-300"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">Platform</label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.keys(platforms).map(platform => {
                      const PlatformIcon = platforms[platform].icon
                      return (
                        <button
                          key={platform}
                          onClick={() => setFormData({...formData, platform})}
                          className={`p-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                            formData.platform === platform
                              ? `${platforms[platform].color} text-white shadow-lg`
                              : 'bg-mono-100 dark:bg-mono-800 text-mono-700 dark:text-mono-300 hover:bg-mono-200 dark:hover:bg-mono-700'
                          }`}
                        >
                          <PlatformIcon size={18} />
                          <span className="text-sm">{platforms[platform].name}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">Post Content</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="Write your post content..."
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-mono-200 dark:border-mono-700 rounded-lg focus:border-accent-500 focus:outline-none resize-none bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">Hashtags (optional)</label>
                  <input
                    type="text"
                    value={formData.hashtags}
                    onChange={(e) => setFormData({...formData, hashtags: e.target.value})}
                    placeholder="#hashtag1 #hashtag2 #hashtag3"
                    className="w-full px-4 py-3 border-2 border-mono-200 dark:border-mono-700 rounded-lg focus:border-accent-500 focus:outline-none bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-mono-200 dark:border-mono-700 rounded-lg focus:border-accent-500 focus:outline-none bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">Time</label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-mono-200 dark:border-mono-700 rounded-lg focus:border-accent-500 focus:outline-none bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">Media Type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-mono-700 dark:text-mono-300">
                      <input
                        type="radio"
                        value="image"
                        checked={formData.mediaType === 'image'}
                        onChange={(e) => setFormData({...formData, mediaType: e.target.value})}
                        className="w-4 h-4"
                      />
                      <Image size={18} />
                      <span>Image</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-mono-700 dark:text-mono-300">
                      <input
                        type="radio"
                        value="video"
                        checked={formData.mediaType === 'video'}
                        onChange={(e) => setFormData({...formData, mediaType: e.target.value})}
                        className="w-4 h-4"
                      />
                      <FileText size={18} />
                      <span>Video</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 bg-mono-100 dark:bg-mono-800 text-mono-700 dark:text-mono-300 rounded-lg font-semibold hover:bg-mono-200 dark:hover:bg-mono-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setFormData({...formData, status: 'draft'})
                      setTimeout(savePost, 0)
                    }}
                    className="flex-1 px-6 py-3 bg-mono-200 dark:bg-mono-700 text-mono-700 dark:text-mono-300 rounded-lg font-semibold hover:bg-mono-300 dark:hover:bg-mono-600 transition-colors"
                  >
                    Save as Draft
                  </button>
                  <button
                    onClick={savePost}
                    disabled={!formData.content.trim() || !formData.date || !formData.time}
                    className="flex-1 px-6 py-3 bg-accent-600 text-white rounded-lg font-semibold hover:bg-accent-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editingPost ? 'Update' : 'Schedule'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

