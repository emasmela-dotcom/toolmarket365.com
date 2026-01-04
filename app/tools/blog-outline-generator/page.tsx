'use client'

import { useState } from 'react'

export default function BlogOutlineGenerator() {
  const [title, setTitle] = useState('')
  const [tone, setTone] = useState('professional')
  const [level, setLevel] = useState('intermediate')
  const [keyword, setKeyword] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [output, setOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')

  const generateOutline = async () => {
    if (!title.trim()) {
      setError('Please enter a blog title')
      return
    }

    setIsGenerating(true)
    setError('')
    setOutput('')

    // If no API key, generate a template outline
    if (!apiKey.trim()) {
      setTimeout(() => {
        const template = generateTemplateOutline(title, tone, level, keyword)
        setOutput(template)
        setIsGenerating(false)
      }, 1000)
      return
    }

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{
            role: 'user',
            content: `Write a detailed blog outline (H2+H3+bullets) for "${title}". Tone=${tone}. Level=${level}. Keyword="${keyword || 'N/A'}"`
          }]
        })
      })

      if (!res.ok) {
        throw new Error('API request failed. Check your API key.')
      }

      const data = await res.json()
      const outline = data.choices[0]?.message?.content || 'No outline generated'
      setOutput(outline)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate outline')
      // Fallback to template
      const template = generateTemplateOutline(title, tone, level, keyword)
      setOutput(template)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateTemplateOutline = (title: string, tone: string, level: string, kw: string): string => {
    const intro = `# ${title}\n\n## Introduction\n- Hook: Capture reader attention\n- Context: Set the stage for the topic\n- Thesis: Main argument or purpose${kw ? `\n- Keyword focus: ${kw}` : ''}\n\n`
    
    const sections = [
      '## Understanding the Basics',
      '## Key Concepts and Strategies',
      '## Advanced Techniques',
      '## Real-World Applications',
      '## Common Pitfalls to Avoid',
      '## Best Practices',
      '## Conclusion'
    ]

    const outline = sections.map((section, idx) => {
      let content = `\n${section}\n`
      
      if (idx === 0) {
        content += `- Definition and core principles\n- Why it matters\n- Key terminology\n`
      } else if (idx === 1) {
        content += `- Main strategies\n- Step-by-step approach\n- Tools and resources\n`
      } else if (idx === 2) {
        content += `- Advanced tips\n- Optimization techniques\n- Expert insights\n`
      } else if (idx === 3) {
        content += `- Case studies\n- Examples\n- Success stories\n`
      } else if (idx === 4) {
        content += `- Mistakes to avoid\n- Warning signs\n- Prevention tips\n`
      } else if (idx === 5) {
        content += `- Recommended approach\n- Action items\n- Next steps\n`
      } else {
        content += `- Summary of key points\n- Final thoughts\n- Call to action\n`
      }
      
      return content
    }).join('\n')

    return intro + outline + '\n\n## Conclusion\n- Recap main points\n- Final recommendations\n- Encouragement to take action\n'
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 text-mono-950 dark:text-mono-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Documentation Section */}
        <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-6 mb-6 border border-mono-200 dark:border-mono-700">
          <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">How to Use This Tool</h2>
          <div className="space-y-4 text-sm text-mono-700 dark:text-mono-300">
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">What It Does</h3>
              <p>Generates detailed blog outlines with H2, H3 headings and bullet points. Works with OpenAI API for AI-powered outlines, or generates template outlines without an API key.</p>
            </div>
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">How to Use</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li><strong>Enter blog title (required):</strong> Type your blog post title</li>
                <li><strong>Select tone:</strong> Professional, Casual, Friendly, Academic, or Conversational</li>
                <li><strong>Choose level:</strong> Beginner, Intermediate, or Advanced</li>
                <li><strong>Add primary keyword (optional):</strong> For SEO focus</li>
                <li><strong>Add OpenAI API key (optional):</strong> For AI-powered outlines</li>
                <li><strong>Click "Generate Outline"</strong> to create your outline</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">Expected Outcome</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>With API Key: AI-generated outline tailored to your title, tone, and level with structured format (H2/H3 headings, bullet points), SEO-optimized if keyword provided, tone-appropriate content structure</li>
                <li>Without API Key: Template outline with standard blog structure (Introduction, Understanding the Basics, Key Concepts, Advanced Techniques, Real-World Applications, Common Pitfalls, Best Practices, Conclusion), ready to customize</li>
              </ul>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2">Blog Outline Generator</h1>
        <p className="text-mono-600 dark:text-mono-400 mb-6">
          Generate detailed blog outlines with H2, H3, and bullet points. Works with or without OpenAI API.
        </p>

        <div className="bg-mono-50 dark:bg-mono-900 border border-mono-300 dark:border-mono-700 rounded-lg p-6 mb-6">
          <label className="block mb-2 text-sm font-semibold">
            Blog Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., How to Build a Successful SaaS Product"
            className="w-full p-3 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
          />

          <label className="block mb-2 mt-4 text-sm font-semibold">
            Tone
          </label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full p-3 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="friendly">Friendly</option>
            <option value="academic">Academic</option>
            <option value="conversational">Conversational</option>
          </select>

          <label className="block mb-2 mt-4 text-sm font-semibold">
            Level
          </label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full p-3 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <label className="block mb-2 mt-4 text-sm font-semibold">
            Primary Keyword (optional)
          </label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g., SaaS development"
            className="w-full p-3 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
          />

          <label className="block mb-2 mt-4 text-sm font-semibold">
            OpenAI API Key (optional - leave blank for template)
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="w-full p-3 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
          />
          <p className="text-xs text-mono-500 mt-1">
            Without an API key, a template outline will be generated. Add your key for AI-powered outlines.
          </p>

          <button
            onClick={generateOutline}
            disabled={isGenerating}
            className="w-full mt-6 px-4 py-3 bg-accent-600 text-white rounded font-medium hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating...' : 'Generate Outline'}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>

        {output && (
          <div className="bg-mono-50 dark:bg-mono-900 border border-mono-300 dark:border-mono-700 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Generated Outline</h2>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(output)
                }}
                className="px-4 py-2 bg-mono-200 dark:bg-mono-700 rounded hover:bg-mono-300 dark:hover:bg-mono-600 text-sm"
              >
                Copy
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono bg-mono-100 dark:bg-mono-800 p-4 rounded overflow-x-auto">
              {output}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}


