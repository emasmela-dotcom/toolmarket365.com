'use client'

import { useState, useEffect } from 'react'
import { Instagram, Youtube, Twitter, Globe, Mail, MapPin, DollarSign, Star, Users, Calendar } from 'lucide-react'
import { formatNumber, formatCurrency } from '@/lib/utils'

interface CreatorProfile {
  id: string
  user_id: string
  display_name: string
  bio?: string
  niche: string // Single string, not array
  location?: string
  email?: string
  website?: string
  platforms: { // JSONB object, not array
    instagram?: {
      handle: string
      followers: number
      engagement_rate: number
    }
    youtube?: {
      handle: string
      subscribers: number
      engagement_rate: number
    }
    twitter?: {
      handle: string
      followers: number
      engagement_rate: number
    }
    tiktok?: {
      handle: string
      followers: number
      engagement_rate: number
    }
  }
  total_followers: number // Not follower_count
  average_engagement_rate: number // Not engagement_rate
  rates: { // JSONB object, not rate_range
    sponsored_post?: number
    product_review?: number
    brand_ambassador?: number
    event_appearance?: number
  }
  portfolio_urls: string[] // Array, not single portfolio_url
  profile_image_url?: string // Not avatar_url
  created_at?: string
  is_verified: boolean
}

interface CreatorProfileProps {
  creatorId?: string
  profile?: CreatorProfile
  compact?: boolean
  preview?: boolean
  onEdit?: () => void
}

export function CreatorProfile({ creatorId, profile: propProfile, compact = false, preview = false, onEdit }: CreatorProfileProps) {
  const [profile, setProfile] = useState<CreatorProfile | null>(propProfile || null)
  const [loading, setLoading] = useState(!propProfile)

  useEffect(() => {
    if (creatorId && !propProfile) {
      fetchCreatorProfile()
    }
  }, [creatorId])

  const fetchCreatorProfile = async () => {
    try {
      const response = await fetch(`/api/growth-suite/creator-profile`)
      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
      }
    } catch (error) {
      console.error('Error fetching creator profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPlatformIcon = (platform: string) => {
    const icons: { [key: string]: JSX.Element } = {
      instagram: <Instagram className="w-5 h-5" />,
      youtube: <Youtube className="w-5 h-5" />,
      twitter: <Twitter className="w-5 h-5" />,
      tiktok: <Globe className="w-5 h-5" />
    }
    return icons[platform.toLowerCase()] || <Globe className="w-5 h-5" />
  }

  const formatEngagementRate = (rate: number) => {
    // rate is already a percentage (DECIMAL 5,2), so just format it
    return `${rate.toFixed(1)}%`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-600"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-mono-500">Creator profile not found</p>
      </div>
    )
  }

  return (
    <div className={compact ? "" : "max-w-4xl mx-auto"}>
      <div className={`border border-mono-200 dark:border-mono-700 rounded-lg ${compact ? "p-4" : "p-6"} bg-mono-50 dark:bg-mono-900`}>
        {/* Header Section */}
        <div className="flex items-start space-x-4 mb-6">
          <div className={`${compact ? "w-16 h-16" : "w-20 h-20"} rounded-full bg-accent-100 dark:bg-accent-900 flex items-center justify-center text-accent-600 font-bold ${compact ? "text-xl" : "text-2xl"}`}>
            {profile.profile_image_url ? (
              <img src={profile.profile_image_url} alt={profile.display_name} className="w-full h-full rounded-full object-cover" />
            ) : (
              profile.display_name.charAt(0).toUpperCase()
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h2 className={`font-bold text-mono-950 dark:text-mono-50 ${compact ? "text-lg" : "text-2xl"}`}>
                {profile.display_name}
              </h2>
              {profile.is_verified && (
                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded">
                  <Star className="w-3 h-3 inline mr-1" />
                  Verified
                </span>
              )}
            </div>
            
            <p className="text-mono-600 dark:text-mono-400 mb-2">{profile.bio}</p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-mono-500">
              {profile.niche && (
                <span className="px-2 py-0.5 border border-mono-300 dark:border-mono-700 rounded text-xs">
                  {profile.niche}
                </span>
              )}
              {profile.location && (
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.email && (
                <div className="flex items-center space-x-1">
                  <Mail className="w-4 h-4" />
                  <span>{profile.email}</span>
                </div>
              )}
              {profile.website && (
                <div className="flex items-center space-x-1">
                  <Globe className="w-4 h-4" />
                  <a href={profile.website} className="text-accent-600 hover:underline">
                    {profile.website.replace('https://', '').replace('http://', '')}
                  </a>
                </div>
              )}
            </div>
          </div>

          {!preview && onEdit && (
            <button onClick={onEdit} className="px-3 py-1 border border-mono-300 dark:border-mono-700 rounded-lg hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors text-sm">
              Edit Profile
            </button>
          )}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-mono-100 dark:bg-mono-800 rounded-lg">
            <div className="text-2xl font-bold text-accent-600">
              {formatNumber(profile.total_followers)}
            </div>
            <div className="text-sm text-mono-600 dark:text-mono-400">Total Followers</div>
          </div>
          <div className="text-center p-4 bg-mono-100 dark:bg-mono-800 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {formatEngagementRate(profile.average_engagement_rate)}
            </div>
            <div className="text-sm text-mono-600 dark:text-mono-400">Avg Engagement</div>
          </div>
          <div className="text-center p-4 bg-mono-100 dark:bg-mono-800 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {Object.keys(profile.platforms || {}).length}
            </div>
            <div className="text-sm text-mono-600 dark:text-mono-400">Platforms</div>
          </div>
          <div className="text-center p-4 bg-mono-100 dark:bg-mono-800 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(profile.rates?.sponsored_post || 0, 'USD')}
            </div>
            <div className="text-sm text-mono-600 dark:text-mono-400">Starting Rate</div>
          </div>
        </div>

        {/* Platform Details */}
        {!compact && profile.platforms && Object.keys(profile.platforms).length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-mono-900 dark:text-mono-100 mb-4">Platform Presence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(profile.platforms).map(([platform, data]) => {
                const Icon = getPlatformIcon(platform)
                return (
                  <div key={platform} className="border border-mono-200 dark:border-mono-700 rounded-lg p-4 bg-mono-50 dark:bg-mono-900">
                    <div className="flex items-center space-x-3 mb-3">
                      {Icon}
                      <span className="font-medium capitalize">{platform}</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-mono-600 dark:text-mono-400">Handle:</span>
                        <span className="font-medium text-mono-950 dark:text-mono-50">@{data.handle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-mono-600 dark:text-mono-400">Followers:</span>
                        <span className="font-medium text-mono-950 dark:text-mono-50">{formatNumber(data.followers || data.subscribers || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-mono-600 dark:text-mono-400">Engagement:</span>
                        <span className="font-medium text-mono-950 dark:text-mono-50">{formatEngagementRate(data.engagement_rate)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Rates Section */}
        {!compact && profile.rates && Object.keys(profile.rates).length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-mono-900 dark:text-mono-100 mb-4">Collaboration Rates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(profile.rates).map(([type, rate]) => (
                <div key={type} className="border border-mono-200 dark:border-mono-700 rounded-lg p-4 bg-mono-50 dark:bg-mono-900">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium capitalize text-mono-950 dark:text-mono-50">
                        {type.replace('_', ' ')}
                      </p>
                      <p className="text-sm text-mono-600 dark:text-mono-400">
                        Starting from
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-accent-600">
                        {formatCurrency(rate, 'USD')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Portfolio Section */}
        {profile.portfolio_urls && profile.portfolio_urls.length > 0 && (
          <div className={compact ? "mb-4" : "mb-6"}>
            <h3 className={`font-semibold text-mono-900 dark:text-mono-100 mb-3 ${compact ? "text-sm" : "text-lg"}`}>
              Portfolio
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {profile.portfolio_urls.slice(0, compact ? 4 : 8).map((url, index) => (
                <div key={index} className="aspect-square bg-mono-100 dark:bg-mono-800 rounded-lg overflow-hidden">
                  <img 
                    src={url} 
                    alt={`Portfolio ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!preview && !compact && (
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex-1 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors">
              <Mail className="w-4 h-4 inline mr-2" />
              Contact Creator
            </button>
            <button className="flex-1 px-4 py-2 border border-mono-300 dark:border-mono-700 rounded-lg hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors">
              View Full Portfolio
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
