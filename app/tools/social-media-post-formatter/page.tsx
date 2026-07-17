'use client'

import { useState, useEffect, useRef } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const copy = {
  en: {
    toolName: 'Social Media Post Formatter',
    toolDescription:
      'Formats social media content for different platforms with character limits, text styling (bold, italic, underline), emoji picker, and AI hashtag suggestions.',
    howToUse: [
      { label: 'Enter content:', text: 'Type or paste your social media post' },
      { label: 'Select platform:', text: 'Choose Twitter/X, Instagram, LinkedIn, Facebook, or TikTok' },
      { label: 'Format text:', text: 'Select text and use Bold, Italic, or Underline buttons' },
      { label: 'Add emojis:', text: 'Click emojis to insert them into your text' },
      { label: 'Generate hashtags:', text: 'Use "🪄 AI hashtags" to auto-generate hashtags' },
      { label: 'Copy output:', text: 'Click "Copy output" to copy the formatted text' },
    ],
    howToUseTitle: 'How to Use This Tool',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      "Formats your text content for different social media platforms. Automatically adjusts formatting, line breaks, and character limits to match each platform's requirements.",
    howToUseInner: 'How to Use',
    howToUseSteps: [
      { label: 'Paste your content:', text: 'Enter or paste your text into the input area' },
      { label: 'Style your text:', text: 'Use formatting options (bold, italic, etc.) if needed' },
      { label: 'Select platform:', text: 'Choose Instagram, Twitter, LinkedIn, Facebook, or TikTok' },
      { label: 'Review formatted output:', text: 'See how your content looks formatted for the selected platform' },
      { label: 'Copy formatted text:', text: 'Click copy to use the formatted version' },
    ],
    expectedOutcome: 'Expected Outcome',
    expectedOutcomes: [
      'Platform-optimized text formatting',
      'Character count compliance',
      'Proper line breaks and spacing',
      'Ready-to-paste formatted content',
      'One-click copy functionality',
    ],
    title: 'Social Media Post Formatter',
    subtitle: "Paste → style → pick platform → copy. That's it.",
    supportedPlatforms: 'Supported Platforms:',
    placeholder: 'Start typing your post…',
    bold: 'Bold',
    italic: 'Italic',
    underline: 'Underline',
    aiHashtags: '🪄 AI hashtags',
    copyOutput: 'Copy output',
    copied: 'Copied!',
    selectTextFirst: 'Select text first',
  },
  es: {
    toolName: 'Formateador de publicaciones para redes',
    toolDescription:
      'Formatea contenido para redes sociales según la plataforma: límites de caracteres, estilos (negrita, cursiva, subrayado), emojis y sugerencias de hashtags con IA.',
    howToUse: [
      { label: 'Ingresa el contenido:', text: 'Escribe o pega tu publicación' },
      { label: 'Elige la plataforma:', text: 'Twitter/X, Instagram, LinkedIn, Facebook o TikTok' },
      { label: 'Formatea el texto:', text: 'Selecciona texto y usa Negrita, Cursiva o Subrayado' },
      { label: 'Agrega emojis:', text: 'Haz clic en un emoji para insertarlo' },
      { label: 'Genera hashtags:', text: 'Usa "🪄 Hashtags IA" para generarlos automáticamente' },
      { label: 'Copia el resultado:', text: 'Haz clic en "Copiar resultado" para copiar el texto formateado' },
    ],
    howToUseTitle: 'Cómo usar esta herramienta',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Formatea tu texto para distintas redes sociales. Ajusta formato, saltos de línea y límites de caracteres según cada plataforma.',
    howToUseInner: 'Cómo usar',
    howToUseSteps: [
      { label: 'Pega tu contenido:', text: 'Escribe o pega el texto en el área de entrada' },
      { label: 'Estiliza el texto:', text: 'Usa las opciones de formato (negrita, cursiva, etc.) si las necesitas' },
      { label: 'Elige la plataforma:', text: 'Instagram, Twitter, LinkedIn, Facebook o TikTok' },
      { label: 'Revisa el resultado:', text: 'Mira cómo queda el contenido formateado para esa plataforma' },
      { label: 'Copia el texto:', text: 'Haz clic en copiar para usar la versión formateada' },
    ],
    expectedOutcome: 'Resultado esperado',
    expectedOutcomes: [
      'Texto formateado según la plataforma',
      'Cumplimiento del límite de caracteres',
      'Saltos de línea y espaciado adecuados',
      'Contenido listo para pegar',
      'Copia con un clic',
    ],
    title: 'Formateador de publicaciones para redes',
    subtitle: 'Pega → estiliza → elige plataforma → copia. Así de simple.',
    supportedPlatforms: 'Plataformas compatibles:',
    placeholder: 'Empieza a escribir tu publicación…',
    bold: 'Negrita',
    italic: 'Cursiva',
    underline: 'Subrayado',
    aiHashtags: '🪄 Hashtags IA',
    copyOutput: 'Copiar resultado',
    copied: '¡Copiado!',
    selectTextFirst: 'Selecciona texto primero',
  },
}

function SocialMediaPostFormatterContent() {
  const { language } = useLanguage()
  const c = copy[language]
  const [input, setInput] = useState('')
  const [platform, setPlatform] = useState('twitter')
  const [output, setOutput] = useState('')
  const [used, setUsed] = useState(0)
  const [copied, setCopied] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const limits: Record<string, number> = {
    twitter: 280,
    instagram: 2200,
    linkedin: 3000,
    facebook: 63206,
    tiktok: 2200
  }

  const unicode: Record<string, Record<string, string>> = {
    bold: {
      a: "𝗮", b: "𝗯", c: "𝗰", d: "𝗱", e: "𝗲", f: "𝗳", g: "𝗴", h: "𝗵", i: "𝗶", j: "𝗷", k: "𝗸", l: "𝗹", m: "𝗺", n: "𝗻", o: "𝗼", p: "𝗽", q: "𝗾", r: "𝗿", s: "𝘀", t: "𝘁", u: "𝘂", v: "𝘃", w: "𝘄", x: "𝘅", y: "𝘆", z: "𝘇",
      A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙", G: "𝗚", H: "𝗛", I: "𝗜", J: "𝗝", K: "𝗞", L: "𝗟", M: "𝗠", N: "𝗡", O: "𝗢", P: "𝗣", Q: "𝗤", R: "𝗥", S: "𝗦", T: "𝗧", U: "𝗨", V: "𝗩", W: "𝗪", X: "𝗫", Y: "𝗬", Z: "𝗭",
      "0": "𝟬", "1": "𝟭", "2": "𝟮", "3": "𝟯", "4": "𝟰", "5": "𝟱", "6": "𝟲", "7": "𝟳", "8": "𝟴", "9": "𝟵"
    },
    italic: {
      a: "𝘢", b: "𝘣", c: "𝘤", d: "𝘥", e: "𝘦", f: "𝘧", g: "𝘨", h: "𝘩", i: "𝘪", j: "𝘫", k: "𝘬", l: "𝘭", m: "𝘮", n: "𝘯", o: "𝘰", p: "𝘱", q: "𝘲", r: "𝘳", s: "𝘴", t: "𝘵", u: "𝘶", v: "𝘷", w: "𝘸", x: "𝘹", y: "𝘺", z: "𝘻",
      A: "𝘈", B: "𝘉", C: "𝘊", D: "𝘋", E: "𝘌", F: "𝘍", G: "𝘎", H: "𝘏", I: "𝘐", J: "𝘑", K: "𝘒", L: "𝘓", M: "𝘔", N: "𝘕", O: "𝘖", P: "𝘗", Q: "𝘘", R: "𝘙", S: "𝘚", T: "𝘛", U: "𝘜", V: "𝘝", W: "𝘞", X: "𝘟", Y: "𝘠", Z: "𝘡"
    },
    underline: {}
  }

  // Add combining underline to each char
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("").forEach(ch => {
    unicode.underline[ch] = ch + "\u0332"
  })

  const emojis = "😀😃😄😁😆😅🤣😂🙂🙃😉😊😇🥰😍🤩😘😗😚😙😋😛😜🤪😝🤑🤗🤭🤫🤔🤐🤨😐😑😏🙄😬🤥😌😔😪🤤😴😷🤒🤕🤢🤮🤧🥵🥶🥴😵🤯🤠🥳😎🤓🧐😕😟🙁☹😮😯😲😳🥺😦😧😨😰😥😢😭😱😖😣😞😓😩😫🥱😤😡😠🤬😈👿💀☠💩🤡👹👺👻👽👾🤖❤🧡💛💚💙💜🤍🖤🤎💯💢💥💫💦💨👋🤚🖐✋🖖👌🤌🤏✌🤞🤟🤘🤙👈👉👆🖕👇☝️👍👎✊👊🤛🤜👏🙌👐🤲🤝🙏✍💅🙇🙋💁🙆🙅🤷🤦🙍🙎🙄".split("")

  useEffect(() => {
    const max = limits[platform]
    const txt = input.slice(0, max)
    setOutput(txt)
    setUsed(txt.length)
  }, [input, platform])

  const getSelectionText = (): string => {
    const el = textareaRef.current
    if (!el) return ''
    const start = el.selectionStart
    const end = el.selectionEnd
    return el.value.slice(start, end)
  }

  const insertAtCursor = (text: string) => {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const newValue = el.value.slice(0, start) + text + el.value.slice(end)
    setInput(newValue)
    setTimeout(() => {
      el.focus()
      el.setSelectionRange(start + text.length, start + text.length)
    }, 0)
  }

  const handleStyle = (style: string) => {
    const sel = getSelectionText()
    if (!sel) {
      alert(c.selectTextFirst)
      return
    }
    const mapped = sel.split("").map(ch => unicode[style][ch] || ch).join("")
    insertAtCursor(mapped)
  }

  const handleEmoji = (emoji: string) => {
    insertAtCursor(emoji)
  }

  const handleAITags = () => {
    const words = input.match(/\b\w{4,}\b/g) || []
    const tags = [...new Set(words.map((w: string) => "#" + w.charAt(0).toUpperCase() + w.slice(1)))].slice(0, 10)
    if (tags.length) {
      insertAtCursor(" " + tags.join(" "))
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 text-mono-950 dark:text-mono-50 flex flex-col items-center p-8">
      <div className="w-full max-w-2xl">
        {/* Documentation Section */}
        <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-6 mb-6 border border-mono-200 dark:border-mono-700">
          <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">{c.howToUseTitle}</h2>
          <div className="space-y-4 text-sm text-mono-700 dark:text-mono-300">
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">{c.whatItDoes}</h3>
              <p>{c.whatItDoesBody}</p>
            </div>
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">{c.howToUseInner}</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                {c.howToUseSteps.map((step, i) => (
                  <li key={i}><strong>{step.label}</strong> {step.text}</li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">{c.expectedOutcome}</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                {c.expectedOutcomes.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2">{c.title}</h1>
        <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">
          {c.subtitle}
        </p>

        {/* Supported Platforms */}
        <div className="bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-lg p-4 mb-6">
          <p className="text-xs font-semibold text-mono-700 dark:text-mono-300 mb-2">{c.supportedPlatforms}</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-white dark:bg-mono-800 rounded-full text-xs font-medium text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700">📸 Instagram</span>
            <span className="px-3 py-1 bg-white dark:bg-mono-800 rounded-full text-xs font-medium text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700">🐦 Twitter/X</span>
            <span className="px-3 py-1 bg-white dark:bg-mono-800 rounded-full text-xs font-medium text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700">💼 LinkedIn</span>
            <span className="px-3 py-1 bg-white dark:bg-mono-800 rounded-full text-xs font-medium text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700">📘 Facebook</span>
            <span className="px-3 py-1 bg-white dark:bg-mono-800 rounded-full text-xs font-medium text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700">🎵 TikTok</span>
          </div>
        </div>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={c.placeholder}
          className="w-full h-36 text-base p-3 border border-mono-300 dark:border-mono-700 rounded-md bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 resize-y focus:outline-none focus:ring-2 focus:ring-accent-500"
        />

        <div className="flex gap-3 my-4 flex-wrap items-center">
          <select
            value={platform}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPlatform(e.target.value)}
            className="px-3 py-2 text-sm border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            <option value="twitter">Twitter / X</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="facebook">Facebook</option>
            <option value="tiktok">TikTok</option>
          </select>
          <button
            onClick={() => handleStyle('bold')}
            className="px-4 py-2 rounded bg-accent-600 text-white cursor-pointer text-sm hover:opacity-90 transition-opacity"
          >
            {c.bold}
          </button>
          <button
            onClick={() => handleStyle('italic')}
            className="px-4 py-2 rounded bg-accent-600 text-white cursor-pointer text-sm hover:opacity-90 transition-opacity"
          >
            {c.italic}
          </button>
          <button
            onClick={() => handleStyle('underline')}
            className="px-4 py-2 rounded bg-accent-600 text-white cursor-pointer text-sm hover:opacity-90 transition-opacity"
          >
            {c.underline}
          </button>
          <button
            onClick={handleAITags}
            className="px-4 py-2 rounded bg-accent-600 text-white cursor-pointer text-sm hover:opacity-90 transition-opacity"
          >
            {c.aiHashtags}
          </button>
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded bg-accent-600 text-white cursor-pointer text-sm hover:opacity-90 transition-opacity"
          >
            {copied ? c.copied : c.copyOutput}
          </button>
          <span className="text-sm ml-auto text-mono-600 dark:text-mono-400">
            {used} / {limits[platform]}
          </span>
        </div>

        <div className="max-w-2xl mt-2 flex gap-2 flex-wrap">
          {emojis.map((emoji, i) => (
            <span
              key={i}
              onClick={() => handleEmoji(emoji)}
              className="cursor-pointer text-xl hover:scale-125 transition-transform"
            >
              {emoji}
            </span>
          ))}
        </div>

        <div className="whitespace-pre-wrap bg-mono-50 dark:bg-mono-900 border border-mono-300 dark:border-mono-700 rounded-md p-4 mt-4 w-full text-base leading-relaxed min-h-[100px]">
          {output}
        </div>
      </div>
    </div>
  )
}

export default function SocialMediaPostFormatter() {
  const { language } = useLanguage()
  const c = copy[language]
  const howToUse = (
    <div>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        {c.howToUse.map((step, i) => (
          <li key={i}><strong>{step.label}</strong> {step.text}</li>
        ))}
      </ol>
    </div>
  )

  return (
    <ToolAccessGate
      toolSlug="social-media-post-formatter"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <SocialMediaPostFormatterContent />
    </ToolAccessGate>
  )
}
