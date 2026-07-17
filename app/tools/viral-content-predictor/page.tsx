'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Eye, Heart, MessageCircle, Share2, Clock, Hash, Zap, AlertCircle, CheckCircle2, Save, Check, X } from 'lucide-react';
import { isSaveToLibraryEnabled } from '@/lib/preferences'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { useLanguage } from '@/lib/i18n/LanguageContext'

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

const copy = {
  en: {
    toolName: 'Viral Content Predictor',
    toolDescription:
      "AI-powered analysis to predict your content's viral potential before you post. Analyzes emotional triggers, visual elements, timing factors, competitor landscape, and hashtag effectiveness to give you a comprehensive viral score.",
    howToUse: [
      { label: 'Enter your content:', text: 'Paste your caption, post text, or content description' },
      { label: 'Select platform:', text: "Choose the platform you're posting to (TikTok, Instagram, YouTube, etc.)" },
      { label: 'Select media type:', text: 'Choose the type of content (video, image, carousel, reel)' },
      { label: 'Click "Predict Viral Potential"', text: 'to analyze' },
      { label: 'Review results:', text: 'See viral score, engagement predictions, optimal posting time, and recommendations' },
    ],
    howToUseTitle: 'How to Use This Tool',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      "AI-powered analysis to predict your content's viral potential before you post. Analyzes emotional triggers, visual elements, timing factors, competitor landscape, and hashtag effectiveness to give you a comprehensive viral score.",
    howToUseInner: 'How to Use',
    howToUseSteps: [
      { label: 'Enter your content:', text: 'Paste your caption, post text, or content description' },
      { label: 'Select platform:', text: "Choose the platform you're posting to (TikTok, Instagram, YouTube, etc.)" },
      { label: 'Select media type:', text: 'Choose the type of content (video, image, carousel, reel)' },
      { label: 'Click "Predict Viral Potential"', text: 'to analyze' },
      { label: 'Review results:', text: 'See viral score, engagement predictions, optimal posting time, and recommendations' },
    ],
    expectedOutcome: 'Expected Outcome',
    expectedOutcomes: [
      'Viral potential score (0-100) with confidence level',
      'Predicted engagement metrics (likes, comments, shares, views)',
      'Emotional analysis breakdown',
      'Optimal posting time recommendations',
      'Recommended hashtags',
      'Risk factors and opportunities for improvement',
    ],
    title: '🚀 Viral Content Predictor',
    subtitle: "AI-powered analysis to predict your content's viral potential",
    supportedPlatforms: 'Supported Platforms:',
    contentAnalysis: 'Content Analysis',
    contentText: 'Content Text',
    contentPlaceholder: 'Paste your content caption here...',
    platform: 'Platform',
    mediaType: 'Media Type',
    mediaVideo: 'Video',
    mediaImage: 'Image',
    mediaCarousel: 'Carousel',
    mediaReel: 'Reel',
    analyzing: 'Analyzing...',
    predict: 'Predict Viral Potential',
    viralScoreTitle: 'Viral Potential Score',
    saveToLibrary: 'Save to Library',
    saving: 'Saving...',
    saved: 'Saved!',
    savedNotification: 'Saved to Library ✓',
    undo: 'Undo',
    outOf100: 'out of 100',
    confidence: 'Confidence',
    viralProbability: 'Viral Probability',
    predictedLikes: 'Predicted Likes',
    predictedComments: 'Predicted Comments',
    predictedShares: 'Predicted Shares',
    predictedViews: 'Predicted Views',
    optimalPostingTime: 'Optimal Posting Time',
    calculating: 'Calculating...',
    optimalTimeHint: 'Based on your audience activity and trending patterns',
    recommendedHashtags: 'Recommended Hashtags',
    emotionalAnalysis: 'Emotional Analysis',
    emotionalIntensity: 'Emotional Intensity',
    empathyScore: 'Empathy Score',
    surpriseFactor: 'Surprise Factor',
    shareability: 'Shareability',
    primaryEmotions: 'Primary Emotions Detected:',
    riskFactors: 'Risk Factors',
    opportunities: 'Opportunities',
    emptyState:
      'Enter your content above to predict its viral potential. The AI will analyze emotional triggers, visual elements, timing factors, and more to give you a comprehensive score.',
    errorEnterContent: 'Please enter content to analyze',
    errorAnalyzeFailed: 'Failed to analyze content',
    errorViralPotential: 'Failed to analyze viral potential',
    errorSaveLibrary: 'Failed to save to library',
    libraryTitle: (platform: string, mediaType: string) => `Viral Prediction - ${platform} ${mediaType}`,
    libraryDescription: (score: number, platform: string, mediaType: string) =>
      `Viral Score: ${Math.round(score)}/100 | Platform: ${platform} | Type: ${mediaType}`,
  },
  es: {
    toolName: 'Predictor de contenido viral',
    toolDescription:
      'Análisis con IA para predecir el potencial viral de tu contenido antes de publicar. Analiza disparadores emocionales, elementos visuales, factores de tiempo, panorama competitivo y efectividad de hashtags para darte una puntuación viral completa.',
    howToUse: [
      { label: 'Introduce tu contenido:', text: 'Pega tu pie de foto, texto de publicación o descripción del contenido' },
      { label: 'Selecciona la plataforma:', text: 'Elige dónde publicarás (TikTok, Instagram, YouTube, etc.)' },
      { label: 'Selecciona el tipo de medio:', text: 'Elige el tipo de contenido (video, imagen, carrusel, reel)' },
      { label: 'Haz clic en "Predecir potencial viral"', text: 'para analizar' },
      { label: 'Revisa los resultados:', text: 'Consulta la puntuación viral, predicciones de engagement, hora óptima de publicación y recomendaciones' },
    ],
    howToUseTitle: 'Cómo usar esta herramienta',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Análisis con IA para predecir el potencial viral de tu contenido antes de publicar. Analiza disparadores emocionales, elementos visuales, factores de tiempo, panorama competitivo y efectividad de hashtags para darte una puntuación viral completa.',
    howToUseInner: 'Cómo usar',
    howToUseSteps: [
      { label: 'Introduce tu contenido:', text: 'Pega tu pie de foto, texto de publicación o descripción del contenido' },
      { label: 'Selecciona la plataforma:', text: 'Elige dónde publicarás (TikTok, Instagram, YouTube, etc.)' },
      { label: 'Selecciona el tipo de medio:', text: 'Elige el tipo de contenido (video, imagen, carrusel, reel)' },
      { label: 'Haz clic en "Predecir potencial viral"', text: 'para analizar' },
      { label: 'Revisa los resultados:', text: 'Consulta la puntuación viral, predicciones de engagement, hora óptima de publicación y recomendaciones' },
    ],
    expectedOutcome: 'Resultado esperado',
    expectedOutcomes: [
      'Puntuación de potencial viral (0-100) con nivel de confianza',
      'Métricas de engagement previstas (likes, comentarios, compartidos, vistas)',
      'Desglose del análisis emocional',
      'Recomendaciones de hora óptima de publicación',
      'Hashtags recomendados',
      'Factores de riesgo y oportunidades de mejora',
    ],
    title: '🚀 Predictor de contenido viral',
    subtitle: 'Análisis con IA para predecir el potencial viral de tu contenido',
    supportedPlatforms: 'Plataformas compatibles:',
    contentAnalysis: 'Análisis de contenido',
    contentText: 'Texto del contenido',
    contentPlaceholder: 'Pega aquí el pie de foto de tu contenido...',
    platform: 'Plataforma',
    mediaType: 'Tipo de medio',
    mediaVideo: 'Video',
    mediaImage: 'Imagen',
    mediaCarousel: 'Carrusel',
    mediaReel: 'Reel',
    analyzing: 'Analizando...',
    predict: 'Predecir potencial viral',
    viralScoreTitle: 'Puntuación de potencial viral',
    saveToLibrary: 'Guardar en biblioteca',
    saving: 'Guardando...',
    saved: '¡Guardado!',
    savedNotification: 'Guardado en biblioteca ✓',
    undo: 'Deshacer',
    outOf100: 'de 100',
    confidence: 'Confianza',
    viralProbability: 'Probabilidad viral',
    predictedLikes: 'Likes previstos',
    predictedComments: 'Comentarios previstos',
    predictedShares: 'Compartidos previstos',
    predictedViews: 'Vistas previstas',
    optimalPostingTime: 'Hora óptima de publicación',
    calculating: 'Calculando...',
    optimalTimeHint: 'Según la actividad de tu audiencia y patrones de tendencia',
    recommendedHashtags: 'Hashtags recomendados',
    emotionalAnalysis: 'Análisis emocional',
    emotionalIntensity: 'Intensidad emocional',
    empathyScore: 'Puntuación de empatía',
    surpriseFactor: 'Factor sorpresa',
    shareability: 'Compartibilidad',
    primaryEmotions: 'Emociones principales detectadas:',
    riskFactors: 'Factores de riesgo',
    opportunities: 'Oportunidades',
    emptyState:
      'Introduce tu contenido arriba para predecir su potencial viral. La IA analizará disparadores emocionales, elementos visuales, factores de tiempo y más para darte una puntuación completa.',
    errorEnterContent: 'Por favor introduce contenido para analizar',
    errorAnalyzeFailed: 'Error al analizar el contenido',
    errorViralPotential: 'Error al analizar el potencial viral',
    errorSaveLibrary: 'Error al guardar en la biblioteca',
    libraryTitle: (platform: string, mediaType: string) => `Predicción viral - ${platform} ${mediaType}`,
    libraryDescription: (score: number, platform: string, mediaType: string) =>
      `Puntuación viral: ${Math.round(score)}/100 | Plataforma: ${platform} | Tipo: ${mediaType}`,
  },
}

function ViralContentPredictorContent({ c }: { c: typeof copy.en }) {
  const [content, setContent] = useState('')
  const [platform, setPlatform] = useState('tiktok')
  const [mediaType, setMediaType] = useState('video')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saveToLibraryEnabled, setSaveToLibraryEnabled] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [savedItemId, setSavedItemId] = useState<string | null>(null)
  const [showUndo, setShowUndo] = useState(false)

  useEffect(() => {
    setSaveToLibraryEnabled(isSaveToLibraryEnabled())
  }, [])

  const handlePredict = async () => {
    if (!content.trim()) {
      setError(c.errorEnterContent)
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
          userId: 'user'
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || c.errorAnalyzeFailed)
      }

      const data = await response.json()
      setPrediction(data.prediction)
    } catch (err) {
      console.error('Prediction error:', err)
      setError(err instanceof Error ? err.message : c.errorViralPotential)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 dark:text-green-400'
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const handleUndoSave = async () => {
    if (!savedItemId) return

    try {
      const response = await fetch(`/api/content-library/${savedItemId}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success || savedItemId.startsWith('local_')) {
        if (savedItemId.startsWith('local_')) {
          const localData = localStorage.getItem('content_library_fallback') || '[]'
          const localItems = JSON.parse(localData)
          const filtered = localItems.filter((item: any) => item.id !== savedItemId)
          localStorage.setItem('content_library_fallback', JSON.stringify(filtered))
        }
        setShowUndo(false)
        setSaveSuccess(false)
        setSavedItemId(null)
      }
    } catch (error) {
      console.error('Error undoing save:', error)
      setShowUndo(false)
      setSaveSuccess(false)
    }
  }

  const handleSaveToLibrary = async () => {
    if (!prediction) return

    setIsSaving(true)
    setSaveSuccess(false)
    setShowUndo(false)

    try {
      const contentData = {
        title: c.libraryTitle(platform, mediaType),
        description: c.libraryDescription(prediction.viralScore, platform, mediaType),
        content_type: 'text' as const,
        content_data: {
          originalContent: content,
          platform,
          mediaType,
          prediction: {
            viralScore: prediction.viralScore,
            confidence: prediction.confidence,
            viralProbability: prediction.prediction?.viralProbability,
            expectedEngagement: prediction.prediction?.expectedEngagement,
            optimalPostingTime: prediction.prediction?.optimalPostingTime,
            recommendedHashtags: prediction.prediction?.recommendedHashtags,
            emotionalAnalysis: prediction.emotionalAnalysis,
            visualAnalysis: prediction.visualAnalysis,
            timingAnalysis: prediction.timingAnalysis,
            riskFactors: prediction.analysis?.riskFactors,
            opportunities: prediction.analysis?.opportunities
          }
        },
        tags: ['viral-predictor', platform, mediaType, `score-${Math.round(prediction.viralScore)}`],
        status: 'draft' as const,
        metadata: {
          tool: 'viral-content-predictor',
          toolVersion: '1.0',
          createdAt: new Date().toISOString()
        }
      }

      const response = await fetch('/api/content-library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contentData)
      })

      const result = await response.json()

      if (result.success) {
        setSaveSuccess(true)
        setSavedItemId(result.data?.id || null)
        setShowUndo(true)
        setTimeout(() => {
          setShowUndo(false)
          setSaveSuccess(false)
        }, 5000)
      } else {
        throw new Error(result.error || c.errorSaveLibrary)
      }
    } catch (error) {
      console.error('Error saving to library:', error)
      setError(c.errorSaveLibrary)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      {showUndo && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-4 z-50 animate-in slide-in-from-bottom-5">
          <div className="flex items-center space-x-2">
            <Check className="w-5 h-5" />
            <span className="font-medium">{c.savedNotification}</span>
          </div>
          <button
            onClick={handleUndoSave}
            className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm font-medium transition-colors"
          >
            {c.undo}
          </button>
          <button
            onClick={() => {
              setShowUndo(false)
              setSaveSuccess(false)
            }}
            className="text-white/80 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{c.howToUseTitle}</h2>
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{c.whatItDoes}</h3>
              <p>{c.whatItDoesBody}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{c.howToUseInner}</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                {c.howToUseSteps.map((step, i) => (
                  <li key={i}><strong>{step.label}</strong> {step.text}</li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{c.expectedOutcome}</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                {c.expectedOutcomes.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            {c.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">{c.subtitle}</p>

          <div className="bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">{c.supportedPlatforms}</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">🎵 TikTok</span>
              <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">📸 Instagram</span>
              <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">📺 YouTube</span>
              <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">🐦 Twitter/X</span>
              <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">💼 LinkedIn</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{c.contentAnalysis}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  {c.contentText}
                </label>
                <textarea
                  placeholder={c.contentPlaceholder}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-[120px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    {c.platform}
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
                    {c.mediaType}
                  </label>
                  <select
                    value={mediaType}
                    onChange={(e) => setMediaType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  >
                    <option value="video">{c.mediaVideo}</option>
                    <option value="image">{c.mediaImage}</option>
                    <option value="carousel">{c.mediaCarousel}</option>
                    <option value="reel">{c.mediaReel}</option>
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
                    {c.analyzing}
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    {c.predict}
                  </>
                )}
              </button>
            </div>
          </div>

          {prediction && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{c.viralScoreTitle}</h2>
                {saveToLibraryEnabled && (
                  <button
                    onClick={handleSaveToLibrary}
                    disabled={isSaving || saveSuccess}
                    className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      saveSuccess
                        ? 'bg-green-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {c.saving}
                      </>
                    ) : saveSuccess ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        {c.saved}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {c.saveToLibrary}
                      </>
                    )}
                  </button>
                )}
              </div>
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className={`text-6xl font-bold ${getScoreColor(prediction.viralScore)}`}>
                    {Math.round(prediction.viralScore)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{c.outOf100}</div>
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
                    <div className="text-gray-600 dark:text-gray-400">{c.confidence}</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {Math.round(prediction.confidence)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">{c.viralProbability}</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {Math.round(prediction.prediction?.viralProbability || 0)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {prediction && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center">
                <Heart className="w-8 h-8 mx-auto mb-2 text-red-500" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {prediction.prediction?.expectedEngagement?.likes?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{c.predictedLikes}</div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {prediction.prediction?.expectedEngagement?.comments?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{c.predictedComments}</div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center">
                <Share2 className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {prediction.prediction?.expectedEngagement?.shares?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{c.predictedShares}</div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center">
                <Eye className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {prediction.prediction?.expectedEngagement?.views?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{c.predictedViews}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  {c.optimalPostingTime}
                </h3>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {prediction.prediction?.optimalPostingTime ?
                    new Date(prediction.prediction.optimalPostingTime).toLocaleString() :
                    c.calculating}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {c.optimalTimeHint}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                  <Hash className="w-5 h-5 mr-2" />
                  {c.recommendedHashtags}
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

            {prediction.emotionalAnalysis && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">{c.emotionalAnalysis}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(prediction.emotionalAnalysis.emotionalIntensity)}`}>
                      {Math.round(prediction.emotionalAnalysis.emotionalIntensity)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{c.emotionalIntensity}</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(prediction.emotionalAnalysis.empathyScore)}`}>
                      {Math.round(prediction.emotionalAnalysis.empathyScore)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{c.empathyScore}</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(prediction.emotionalAnalysis.surpriseFactor)}`}>
                      {Math.round(prediction.emotionalAnalysis.surpriseFactor)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{c.surpriseFactor}</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(prediction.emotionalAnalysis.shareabilityScore)}`}>
                      {Math.round(prediction.emotionalAnalysis.shareabilityScore)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{c.shareability}</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{c.primaryEmotions}</div>
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

            {((prediction.analysis?.riskFactors?.length ?? 0) > 0 || (prediction.analysis?.opportunities?.length ?? 0) > 0) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {(prediction.analysis?.riskFactors?.length ?? 0) > 0 && (
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800">
                    <h3 className="text-lg font-bold mb-4 text-red-900 dark:text-red-200 flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      {c.riskFactors}
                    </h3>
                    <ul className="space-y-2">
                      {(prediction.analysis?.riskFactors ?? []).map((risk: string, index: number) => (
                        <li key={index} className="text-sm text-red-800 dark:text-red-200 flex items-start">
                          <span className="mr-2">•</span>
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {(prediction.analysis?.opportunities?.length ?? 0) > 0 && (
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
                    <h3 className="text-lg font-bold mb-4 text-green-900 dark:text-green-200 flex items-center">
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      {c.opportunities}
                    </h3>
                    <ul className="space-y-2">
                      {(prediction.analysis?.opportunities ?? []).map((opp: string, index: number) => (
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
            <p className="text-gray-600 dark:text-gray-400 text-center">{c.emptyState}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ViralContentPredictor() {
  const { language } = useLanguage()
  const c = copy[language]

  const howToUse = (
    <ol className="list-decimal list-inside space-y-1 ml-2">
      {c.howToUse.map((step, i) => (
        <li key={i}><strong>{step.label}</strong> {step.text}</li>
      ))}
    </ol>
  )

  return (
    <ToolAccessGate
      toolSlug="viral-content-predictor"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <ViralContentPredictorContent c={c} />
    </ToolAccessGate>
  )
}
