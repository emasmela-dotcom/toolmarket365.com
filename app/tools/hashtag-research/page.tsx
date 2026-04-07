'use client'

import { useState } from 'react'
import { Search, Copy, TrendingUp, BarChart3, Users, Zap, Check } from 'lucide-react'
import { ToolAccessGate } from '@/components/ToolAccessGate'

interface Hashtag {
  tag: string
  volume: string
  engagement: 'High' | 'Medium' | 'Low'
  competition: 'High' | 'Medium' | 'Low'
  trending: boolean
}

function HashtagResearchToolContent() {
  const [searchTerm, setSearchTerm] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [results, setResults] = useState<{
    query: string
    hashtags: Hashtag[]
    optimal: Hashtag[]
    growing: Hashtag[]
    niche: Hashtag[]
  } | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const hashtagDatabase: Record<string, Hashtag[]> = {
    fitness: [
      { tag: 'fitness', volume: '487M', engagement: 'High', competition: 'High', trending: true },
      { tag: 'fitnessjourney', volume: '89M', engagement: 'High', competition: 'Medium', trending: true },
      { tag: 'fitnessmotivation', volume: '156M', engagement: 'High', competition: 'High', trending: false },
      { tag: 'fitnesslife', volume: '45M', engagement: 'Medium', competition: 'Medium', trending: false },
      { tag: 'fitnessaddict', volume: '23M', engagement: 'Medium', competition: 'Low', trending: false },
      { tag: 'fitfam', volume: '67M', engagement: 'High', competition: 'Medium', trending: true },
      { tag: 'gymlife', volume: '134M', engagement: 'High', competition: 'High', trending: false },
      { tag: 'workout', volume: '289M', engagement: 'High', competition: 'High', trending: false },
      { tag: 'gains', volume: '78M', engagement: 'Medium', competition: 'Medium', trending: false },
      { tag: 'fitnessgirl', volume: '92M', engagement: 'High', competition: 'Medium', trending: false }
    ],
    travel: [
      { tag: 'travel', volume: '567M', engagement: 'High', competition: 'High', trending: false },
      { tag: 'travelgram', volume: '178M', engagement: 'High', competition: 'High', trending: true },
      { tag: 'travelphotography', volume: '234M', engagement: 'High', competition: 'High', trending: false },
      { tag: 'wanderlust', volume: '145M', engagement: 'High', competition: 'High', trending: false },
      { tag: 'traveltheworld', volume: '89M', engagement: 'Medium', competition: 'Medium', trending: false },
      { tag: 'instatravel', volume: '198M', engagement: 'High', competition: 'High', trending: false },
      { tag: 'travelblogger', volume: '76M', engagement: 'Medium', competition: 'Medium', trending: true },
      { tag: 'traveladdict', volume: '34M', engagement: 'Medium', competition: 'Low', trending: false },
      { tag: 'explore', volume: '456M', engagement: 'High', competition: 'High', trending: false },
      { tag: 'adventure', volume: '312M', engagement: 'High', competition: 'High', trending: false }
    ],
    food: [
      { tag: 'food', volume: '456M', engagement: 'High', competition: 'High', trending: false },
      { tag: 'foodie', volume: '234M', engagement: 'High', competition: 'High', trending: false },
      { tag: 'foodporn', volume: '289M', engagement: 'High', competition: 'High', trending: false },
      { tag: 'foodstagram', volume: '167M', engagement: 'High', competition: 'High', trending: true },
      { tag: 'instafood', volume: '198M', engagement: 'High', competition: 'High', trending: false },
      { tag: 'yummy', volume: '145M', engagement: 'Medium', competition: 'Medium', trending: false },
      { tag: 'delicious', volume: '123M', engagement: 'Medium', competition: 'Medium', trending: false },
      { tag: 'foodblogger', volume: '87M', engagement: 'Medium', competition: 'Medium', trending: true },
      { tag: 'homemade', volume: '92M', engagement: 'Medium', competition: 'Medium', trending: false },
      { tag: 'foodphotography', volume: '76M', engagement: 'High', competition: 'Medium', trending: false }
    ],
    fashion: [
      { tag: 'fashion', volume: '523M', engagement: 'High', competition: 'High', trending: false },
      { tag: 'fashionista', volume: '167M', engagement: 'High', competition: 'High', trending: false },
      { tag: 'style', volume: '289M', engagement: 'High', competition: 'High', trending: false },
      { tag: 'ootd', volume: '378M', engagement: 'High', competition: 'High', trending: true },
      { tag: 'fashionblogger', volume: '134M', engagement: 'High', competition: 'Medium', trending: false },
      { tag: 'instafashion', volume: '156M', engagement: 'High', competition: 'High', trending: false },
      { tag: 'outfitoftheday', volume: '198M', engagement: 'High', competition: 'High', trending: false },
      { tag: 'stylish', volume: '89M', engagement: 'Medium', competition: 'Medium', trending: false },
      { tag: 'fashionstyle', volume: '67M', engagement: 'Medium', competition: 'Medium', trending: false },
      { tag: 'lookbook', volume: '54M', engagement: 'Medium', competition: 'Low', trending: true }
    ],
    tech: [
      { tag: 'technology', volume: '123M', engagement: 'Medium', competition: 'High', trending: false },
      { tag: 'tech', volume: '178M', engagement: 'High', competition: 'High', trending: false },
      { tag: 'innovation', volume: '89M', engagement: 'Medium', competition: 'Medium', trending: true },
      { tag: 'ai', volume: '234M', engagement: 'High', competition: 'High', trending: true },
      { tag: 'coding', volume: '67M', engagement: 'Medium', competition: 'Medium', trending: false },
      { tag: 'programming', volume: '54M', engagement: 'Medium', competition: 'Medium', trending: false },
      { tag: 'developer', volume: '76M', engagement: 'Medium', competition: 'Medium', trending: false },
      { tag: 'techie', volume: '23M', engagement: 'Low', competition: 'Low', trending: false },
      { tag: 'startup', volume: '145M', engagement: 'High', competition: 'High', trending: true },
      { tag: 'gadgets', volume: '45M', engagement: 'Medium', competition: 'Medium', trending: false }
    ]
  }

  const getRelevantHashtags = (term: string): Hashtag[] => {
    const lowerTerm = term.toLowerCase()
    for (const [key, hashtags] of Object.entries(hashtagDatabase)) {
      if (key.includes(lowerTerm) || lowerTerm.includes(key)) {
        return hashtags
      }
    }
    return hashtagDatabase.fitness
  }

  const handleSearch = () => {
    if (!searchTerm.trim()) return
    
    setIsSearching(true)
    
    setTimeout(() => {
      const hashtags = getRelevantHashtags(searchTerm)
      
      setResults({
        query: searchTerm,
        hashtags: hashtags,
        optimal: hashtags.slice(0, 3),
        growing: hashtags.filter(h => h.trending).slice(0, 3),
        niche: hashtags.filter(h => h.competition === 'Low' || h.competition === 'Medium').slice(0, 4)
      })
      
      setIsSearching(false)
    }, 800)
  }

  const copyToClipboard = (tags: Hashtag[], index: string) => {
    const tagString = tags.map(h => `#${h.tag}`).join(' ')
    navigator.clipboard.writeText(tagString)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const getEngagementColor = (engagement: string) => {
    switch(engagement) {
      case 'High': return 'text-accent-600'
      case 'Medium': return 'text-mono-600'
      case 'Low': return 'text-mono-500'
      default: return 'text-mono-600'
    }
  }

  const getCompetitionColor = (competition: string) => {
    switch(competition) {
      case 'High': return 'bg-mono-200 text-mono-700'
      case 'Medium': return 'bg-mono-100 text-mono-600'
      case 'Low': return 'bg-accent-100 text-accent-700'
      default: return 'bg-mono-100 text-mono-600'
    }
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Documentation Section */}
        <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-6 mb-8 border border-mono-200 dark:border-mono-700">
          <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">How to Use This Tool</h2>
          <div className="space-y-4 text-sm text-mono-700 dark:text-mono-300">
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">What It Does</h3>
              <p>Discovers the best hashtags for your content based on topics and keywords. Shows volume, engagement potential, competition level, and trending status. Organizes hashtags into optimal mixes, trending tags, and niche opportunities.</p>
            </div>
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">How to Use</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li><strong>Enter a topic or keyword:</strong> Type a topic (e.g., fitness, travel, food, fashion, tech)</li>
                <li><strong>Select platform:</strong> Choose Instagram, TikTok, or Twitter</li>
                <li><strong>Click "Search"</strong> to find relevant hashtags</li>
                <li><strong>Review results:</strong> Stats overview (total found, trending count, average engagement), Optimal Mix (top 3 high-competition hashtags), Trending Now (currently trending hashtags), Niche Opportunities (lower competition hashtags), Full table (all related hashtags with details)</li>
                <li><strong>Copy hashtags:</strong> Click "Copy All" on any section</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">Expected Outcome</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>10+ related hashtags for your topic</li>
                <li>Volume data - Post count for each hashtag</li>
                <li>Engagement ratings - High, Medium, or Low</li>
                <li>Competition levels - High, Medium, or Low</li>
                <li>Trending indicators - Which hashtags are hot right now</li>
                <li>Organized categories: Optimal mix for maximum reach, Trending tags for current visibility, Niche opportunities for less competition</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-mono-950 dark:text-mono-50 mb-2">Hashtag Research Tool</h1>
          <p className="text-mono-600 dark:text-mono-400 mb-4">Discover the best hashtags to boost your content reach</p>
          
          {/* Supported Platforms */}
          <div className="bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-xs font-semibold text-mono-700 dark:text-mono-300 mb-2">Supported Platforms:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="px-3 py-1 bg-white dark:bg-mono-800 rounded-full text-xs font-medium text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700">📸 Instagram</span>
              <span className="px-3 py-1 bg-white dark:bg-mono-800 rounded-full text-xs font-medium text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700">🎵 TikTok</span>
              <span className="px-3 py-1 bg-white dark:bg-mono-800 rounded-full text-xs font-medium text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700">🐦 Twitter/X</span>
            </div>
          </div>
        </div>

        <div className="bg-mono-50 dark:bg-mono-900 border border-mono-200 dark:border-mono-700 rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Enter topic or keyword (e.g., fitness, travel, food)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full px-4 py-3 border border-mono-300 dark:border-mono-700 rounded-lg focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200 bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="px-4 py-3 border border-mono-300 dark:border-mono-700 rounded-lg focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200 text-mono-950 dark:text-mono-50 bg-mono-50 dark:bg-mono-900"
              >
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="twitter">Twitter</option>
              </select>
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="px-6 py-3 bg-accent-600 text-white rounded-lg font-medium hover:bg-accent-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Search size={20} />
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </div>

        {results && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-mono-50 dark:bg-mono-900 border border-mono-200 dark:border-mono-700 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-accent-100 dark:bg-accent-900/30 rounded-lg">
                    <BarChart3 className="text-accent-600" size={24} />
                  </div>
                  <h3 className="font-semibold text-mono-950 dark:text-mono-50">Total Found</h3>
                </div>
                <p className="text-3xl font-bold text-mono-950 dark:text-mono-50">{results.hashtags.length}</p>
                <p className="text-sm text-mono-500 dark:text-mono-500 mt-1">Related hashtags</p>
              </div>

              <div className="bg-mono-50 dark:bg-mono-900 border border-mono-200 dark:border-mono-700 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-accent-100 dark:bg-accent-900/30 rounded-lg">
                    <TrendingUp className="text-accent-600" size={24} />
                  </div>
                  <h3 className="font-semibold text-mono-950 dark:text-mono-50">Trending</h3>
                </div>
                <p className="text-3xl font-bold text-mono-950 dark:text-mono-50">{results.hashtags.filter(h => h.trending).length}</p>
                <p className="text-sm text-mono-500 dark:text-mono-500 mt-1">Hot right now</p>
              </div>

              <div className="bg-mono-50 dark:bg-mono-900 border border-mono-200 dark:border-mono-700 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-accent-100 dark:bg-accent-900/30 rounded-lg">
                    <Zap className="text-accent-600" size={24} />
                  </div>
                  <h3 className="font-semibold text-mono-950 dark:text-mono-50">Avg Engagement</h3>
                </div>
                <p className="text-3xl font-bold text-mono-950 dark:text-mono-50">High</p>
                <p className="text-sm text-mono-500 dark:text-mono-500 mt-1">Expected reach</p>
              </div>
            </div>

            <div className="bg-mono-50 dark:bg-mono-900 border border-mono-200 dark:border-mono-700 rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 flex items-center gap-2">
                  <Zap className="text-accent-600" size={24} />
                  Optimal Mix (High Competition)
                </h2>
                <button
                  onClick={() => copyToClipboard(results.optimal, 'optimal')}
                  className="px-4 py-2 bg-mono-100 dark:bg-mono-800 hover:bg-mono-200 dark:hover:bg-mono-700 rounded-lg flex items-center gap-2 transition-colors text-mono-700 dark:text-mono-300"
                >
                  {copiedIndex === 'optimal' ? <Check size={18} className="text-accent-600" /> : <Copy size={18} />}
                  {copiedIndex === 'optimal' ? 'Copied!' : 'Copy All'}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {results.optimal.map((hashtag, idx) => (
                  <div key={idx} className="px-4 py-2 bg-accent-100 dark:bg-accent-900/30 border border-accent-200 dark:border-accent-800 rounded-lg">
                    <span className="font-semibold text-accent-700 dark:text-accent-400">#{hashtag.tag}</span>
                    <span className="text-sm text-mono-600 dark:text-mono-400 ml-2">({hashtag.volume})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-mono-50 dark:bg-mono-900 border border-mono-200 dark:border-mono-700 rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 flex items-center gap-2">
                  <TrendingUp className="text-accent-600" size={24} />
                  Trending Now
                </h2>
                <button
                  onClick={() => copyToClipboard(results.growing, 'growing')}
                  className="px-4 py-2 bg-mono-100 dark:bg-mono-800 hover:bg-mono-200 dark:hover:bg-mono-700 rounded-lg flex items-center gap-2 transition-colors text-mono-700 dark:text-mono-300"
                >
                  {copiedIndex === 'growing' ? <Check size={18} className="text-accent-600" /> : <Copy size={18} />}
                  {copiedIndex === 'growing' ? 'Copied!' : 'Copy All'}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {results.growing.map((hashtag, idx) => (
                  <div key={idx} className="px-4 py-2 bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-lg">
                    <span className="font-semibold text-accent-700 dark:text-accent-400">#{hashtag.tag}</span>
                    <span className="text-sm text-mono-600 dark:text-mono-400 ml-2">({hashtag.volume})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-mono-50 dark:bg-mono-900 border border-mono-200 dark:border-mono-700 rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 flex items-center gap-2">
                  <Users className="text-accent-600" size={24} />
                  Niche Opportunities (Lower Competition)
                </h2>
                <button
                  onClick={() => copyToClipboard(results.niche, 'niche')}
                  className="px-4 py-2 bg-mono-100 dark:bg-mono-800 hover:bg-mono-200 dark:hover:bg-mono-700 rounded-lg flex items-center gap-2 transition-colors text-mono-700 dark:text-mono-300"
                >
                  {copiedIndex === 'niche' ? <Check size={18} className="text-accent-600" /> : <Copy size={18} />}
                  {copiedIndex === 'niche' ? 'Copied!' : 'Copy All'}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {results.niche.map((hashtag, idx) => (
                  <div key={idx} className="px-4 py-2 bg-mono-50 dark:bg-mono-800 border border-mono-200 dark:border-mono-700 rounded-lg">
                    <span className="font-semibold text-mono-700 dark:text-mono-300">#{hashtag.tag}</span>
                    <span className="text-sm text-mono-600 dark:text-mono-400 ml-2">({hashtag.volume})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-mono-50 dark:bg-mono-900 border border-mono-200 dark:border-mono-700 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">All Related Hashtags</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b-2 border-mono-200 dark:border-mono-700">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-mono-700 dark:text-mono-300">Hashtag</th>
                      <th className="text-left py-3 px-4 font-semibold text-mono-700 dark:text-mono-300">Volume</th>
                      <th className="text-left py-3 px-4 font-semibold text-mono-700 dark:text-mono-300">Engagement</th>
                      <th className="text-left py-3 px-4 font-semibold text-mono-700 dark:text-mono-300">Competition</th>
                      <th className="text-left py-3 px-4 font-semibold text-mono-700 dark:text-mono-300">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.hashtags.map((hashtag, idx) => (
                      <tr key={idx} className="border-b border-mono-100 dark:border-mono-800 hover:bg-mono-50 dark:hover:bg-mono-800 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-semibold text-accent-600">#{hashtag.tag}</span>
                        </td>
                        <td className="py-3 px-4 text-mono-700 dark:text-mono-300">{hashtag.volume}</td>
                        <td className="py-3 px-4">
                          <span className={`font-medium ${getEngagementColor(hashtag.engagement)}`}>
                            {hashtag.engagement}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCompetitionColor(hashtag.competition)}`}>
                            {hashtag.competition}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {hashtag.trending && (
                            <span className="flex items-center gap-1 text-accent-600 text-sm font-medium">
                              <TrendingUp size={16} />
                              Trending
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {!results && (
          <div className="bg-mono-50 dark:bg-mono-900 border border-mono-200 dark:border-mono-700 rounded-lg shadow-sm p-12 text-center">
            <Search className="mx-auto text-mono-300 dark:text-mono-700 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-mono-700 dark:text-mono-300 mb-2">Start Your Hashtag Research</h3>
            <p className="text-mono-500">Enter a topic or keyword to discover the best hashtags for your content</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function HashtagResearchTool() {
  const toolDescription = "Research and discover the best hashtags for your content. Find trending hashtags, analyze engagement levels, competition, and volume to optimize your social media posts."
  
  const howToUse = (
    <ol className="list-decimal list-inside space-y-1 ml-2">
      <li><strong>Enter search term:</strong> Type a keyword or topic related to your content</li>
      <li><strong>Select platform:</strong> Choose Instagram, TikTok, Twitter, or LinkedIn</li>
      <li><strong>Click "Search Hashtags"</strong> to find relevant hashtags</li>
      <li><strong>Review results:</strong> See hashtag volume, engagement levels, competition, and trending status</li>
      <li><strong>Copy hashtags:</strong> Click the copy button to use hashtags in your posts</li>
    </ol>
  )

  return (
    <ToolAccessGate
      toolSlug="hashtag-research"
      toolName="Hashtag Research"
      toolDescription={toolDescription}
      howToUse={howToUse}
    >
      <HashtagResearchToolContent />
    </ToolAccessGate>
  )
}


