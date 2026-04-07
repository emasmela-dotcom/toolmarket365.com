// AI Personalization - Template-based, uses local data only (no external API calls)

interface UserPreferences {
  preferredTone: string
  preferredPlatform: string
  preferredNiche: string
  bestPostingTimes: string[]
  topPerformingContent: string[]
}

interface UsageData {
  tool: string
  timestamp: number
  config: Record<string, any>
  result?: any
}

// Get user preferences from local storage (template-based learning)
export function getUserPreferences(userId: string): UserPreferences {
  const stored = localStorage.getItem(`user_prefs_${userId}`)
  if (stored) {
    return JSON.parse(stored)
  }

  // Default preferences
  return {
    preferredTone: 'casual',
    preferredPlatform: 'instagram',
    preferredNiche: 'general',
    bestPostingTimes: ['09:00', '13:00', '19:00'],
    topPerformingContent: []
  }
}

// Learn from usage patterns (template-based, no API)
export function learnFromUsage(userId: string, usageData: UsageData[]) {
  const prefs = getUserPreferences(userId)
  
  // Analyze usage patterns
  const toneCounts: Record<string, number> = {}
  const platformCounts: Record<string, number> = {}
  const nicheCounts: Record<string, number> = {}
  const timeCounts: Record<string, number> = {}

  usageData.forEach(usage => {
    if (usage.config.tone) toneCounts[usage.config.tone] = (toneCounts[usage.config.tone] || 0) + 1
    if (usage.config.platform) platformCounts[usage.config.platform] = (platformCounts[usage.config.platform] || 0) + 1
    if (usage.config.niche) nicheCounts[usage.config.niche] = (nicheCounts[usage.config.niche] || 0) + 1
    if (usage.timestamp) {
      const hour = new Date(usage.timestamp).getHours()
      timeCounts[hour.toString()] = (timeCounts[hour.toString()] || 0) + 1
    }
  })

  // Update preferences based on most common usage
  if (Object.keys(toneCounts).length > 0) {
    prefs.preferredTone = Object.entries(toneCounts).sort((a, b) => b[1] - a[1])[0][0]
  }
  if (Object.keys(platformCounts).length > 0) {
    prefs.preferredPlatform = Object.entries(platformCounts).sort((a, b) => b[1] - a[1])[0][0]
  }
  if (Object.keys(nicheCounts).length > 0) {
    prefs.preferredNiche = Object.entries(nicheCounts).sort((a, b) => b[1] - a[1])[0][0]
  }
  if (Object.keys(timeCounts).length > 0) {
    const topTimes = Object.entries(timeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([hour]) => `${hour.padStart(2, '0')}:00`)
    prefs.bestPostingTimes = topTimes
  }

  // Save updated preferences
  localStorage.setItem(`user_prefs_${userId}`, JSON.stringify(prefs))
  return prefs
}

// Get personalized suggestions (template-based)
export function getPersonalizedSuggestions(userId: string): {
  tone: string
  platform: string
  niche: string
  bestTime: string
  message: string
} {
  const prefs = getUserPreferences(userId)
  
  return {
    tone: prefs.preferredTone,
    platform: prefs.preferredPlatform,
    niche: prefs.preferredNiche,
    bestTime: prefs.bestPostingTimes[0] || '09:00',
    message: `Based on your usage, we recommend ${prefs.preferredTone} tone on ${prefs.preferredPlatform} for ${prefs.preferredNiche} content. Best posting time: ${prefs.bestPostingTimes[0] || '09:00'}`
  }
}

// Track usage (template-based, no API)
export function trackUsage(userId: string, tool: string, config: Record<string, any>) {
  const usage: UsageData = {
    tool,
    timestamp: Date.now(),
    config
  }

  const stored = localStorage.getItem(`usage_${userId}`)
  const usageHistory: UsageData[] = stored ? JSON.parse(stored) : []
  usageHistory.push(usage)

  // Keep only last 100 entries
  const recentUsage = usageHistory.slice(-100)
  localStorage.setItem(`usage_${userId}`, JSON.stringify(recentUsage))

  // Learn from usage
  learnFromUsage(userId, recentUsage)
}
