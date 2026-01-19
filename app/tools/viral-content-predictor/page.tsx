'use client'

import { useState } from 'react'
import { 
  TrendingUp, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2,
  Clock,
  Hash,
  Zap,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'

interface PredictionResult {
  viralScore: number
  confidence: number
  emotionalAnalysis: any
  visualAnalysis: any
  timingAnalysis: any
  prediction: any
  analysis?: {
    riskFactors?: string[]
    opportunities?: string[]
  }
}

export default function ViralContentPredictor() {
  const [content, setContent] = useState('')
  const [platform, setPlatform] = useState('tiktok')
  const [mediaType, setMediaType] = useState('video')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handlePredict = async () => {
    if (!content.trim()) {
      setError('Please enter content to analyze')
      return
    }

    setIsAnalyzing(true)
    setError(null)
    
    try {
      const response = await fetch('/api/viral-predictor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: {
            text: content,
            mediaType,
            platform,
            mediaUrls: []
          },
          niche: 'general',
          userId: 'user' // Replace with actual user ID from auth
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze content')
      }

      const data = await response.json()
      setPrediction(data.prediction)
    } catch (err) {
      console.error('Prediction error:', err)
      setError(err instanceof Error ? err.message : 'Failed to analyze viral potential')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 dark:text-green-400'
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 70) return 'bg-green-100 dark:bg-green-900/30'
    if (score >= 50) return 'bg-yellow-100 dark:bg-yellow-900/30'
    return 'bg-red-100 dark:bg-red-900/30'
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Documentation Section */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How to Use This Tool</h2>
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">What It Does</h3>
              <p>AI-powered analysis to predict your content's viral potential before you post. Analyzes emotional triggers, visual elements, timing factors, competitor landscape, and hashtag effectiveness to give you a comprehensive viral score.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">How to Use</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li><strong>Enter your content:</strong> Paste your caption, post text, or content description</li>
                <li><strong>Select platform:</strong> Choose the platform you're posting to (TikTok, Instagram, YouTube, etc.)</li>
                <li><strong>Select media type:</strong> Choose the type of content (video, image, carousel, reel)</li>
                <li><strong>Click "Predict Viral Potential"</strong> to analyze</li>
                <li><strong>Review results:</strong> See viral score, engagement predictions, optimal posting time, and recommendations</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Expected Outcome</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Viral potential score (0-100) with confidence level</li>
                <li>Predicted engagement metrics (likes, comments, shares, views)</li>
                <li>Emotional analysis breakdown</li>
                <li>Optimal posting time recommendations</li>
                <li>Recommended hashtags</li>
                <li>Risk factors and opportunities for improvement</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            🚀 Viral Content Predictor
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            AI-powered analysis to predict your content's viral potential
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Content Input */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Content Analysis</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Content Text
                </label>
                <textarea
                  placeholder="Paste your content caption here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-[120px]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Platform
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  >
                    <option value="tiktok">TikTok</option>
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                    <option value="twitter">Twitter/X</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Media Type
                  </label>
                  <select
                    value={mediaType}
                    onChange={(e) => setMediaType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  >
                    <option value="video">Video</option>
                    <option value="image">Image</option>
                    <option value="carousel">Carousel</option>
                    <option value="reel">Reel</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-800 dark:text-red-200 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handlePredict}
                disabled={isAnalyzing || !content.trim()}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Predict Viral Potential
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Viral Score Display */}
          {prediction && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Viral Potential Score</h2>
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className={`text-6xl font-bold ${getScoreColor(prediction.viralScore)}`}>
                    {Math.round(prediction.viralScore)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">out of 100</div>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      prediction.viralScore >= 70
                        ? 'bg-green-500'
                        : prediction.viralScore >= 50
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${prediction.viralScore}%` }}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Confidence</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {Math.round(prediction.confidence)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Viral Probability</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {Math.round(prediction.prediction?.viralProbability || 0)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Analysis Results */}
        {prediction && (
          <div className="space-y-6">
            {/* Engagement Predictions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center">
                <Heart className="w-8 h-8 mx-auto mb-2 text-red-500" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {prediction.prediction?.expectedEngagement?.likes?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Predicted Likes</div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {prediction.prediction?.expectedEngagement?.comments?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Predicted Comments</div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center">
                <Share2 className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {prediction.prediction?.expectedEngagement?.shares?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Predicted Shares</div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center">
                <Eye className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {prediction.prediction?.expectedEngagement?.views?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Predicted Views</div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Optimal Posting Time */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Optimal Posting Time
                </h3>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {prediction.prediction?.optimalPostingTime ? 
                    new Date(prediction.prediction.optimalPostingTime).toLocaleString() : 
                    'Calculating...'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Based on your audience activity and trending patterns
                </div>
              </div>

              {/* Recommended Hashtags */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                  <Hash className="w-5 h-5 mr-2" />
                  Recommended Hashtags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {prediction.prediction?.recommendedHashtags?.slice(0, 8).map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Emotional Analysis */}
            {prediction.emotionalAnalysis && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Emotional Analysis</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(prediction.emotionalAnalysis.emotionalIntensity)}`}>
                      {Math.round(prediction.emotionalAnalysis.emotionalIntensity)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Emotional Intensity</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(prediction.emotionalAnalysis.empathyScore)}`}>
                      {Math.round(prediction.emotionalAnalysis.empathyScore)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Empathy Score</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(prediction.emotionalAnalysis.surpriseFactor)}`}>
                      {Math.round(prediction.emotionalAnalysis.surpriseFactor)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Surprise Factor</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(prediction.emotionalAnalysis.shareabilityScore)}`}>
                      {Math.round(prediction.emotionalAnalysis.shareabilityScore)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Shareability</div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Primary Emotions Detected:</div>
                  <div className="flex flex-wrap gap-2">
                    {prediction.emotionalAnalysis.primaryEmotions?.map((emotion: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm"
                      >
                        {emotion}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Risk Factors & Opportunities */}
            {(prediction.analysis?.riskFactors?.length || prediction.analysis?.opportunities?.length) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {prediction.analysis?.riskFactors?.length > 0 && (
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800">
                    <h3 className="text-lg font-bold mb-4 text-red-900 dark:text-red-200 flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      Risk Factors
                    </h3>
                    <ul className="space-y-2">
                      {prediction.analysis.riskFactors.map((risk: string, index: number) => (
                        <li key={index} className="text-sm text-red-800 dark:text-red-200 flex items-start">
                          <span className="mr-2">•</span>
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {prediction.analysis?.opportunities?.length > 0 && (
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
                    <h3 className="text-lg font-bold mb-4 text-green-900 dark:text-green-200 flex items-center">
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Opportunities
                    </h3>
                    <ul className="space-y-2">
                      {prediction.analysis.opportunities.map((opp: string, index: number) => (
                        <li key={index} className="text-sm text-green-800 dark:text-green-200 flex items-start">
                          <span className="mr-2">•</span>
                          <span>{opp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {!prediction && !isAnalyzing && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-center">
              Enter your content above to predict its viral potential. The AI will analyze emotional triggers, visual elements, timing factors, and more to give you a comprehensive score.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
