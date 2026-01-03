'use client'

import { useState, useEffect, useRef } from 'react'

export default function SocialMediaPostFormatter() {
  const [input, setInput] = useState('')
  const [platform, setPlatform] = useState('twitter')
  const [output, setOutput] = useState('')
  const [used, setUsed] = useState(0)
  const [copyText, setCopyText] = useState('Copy output')
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
      alert("Select text first")
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
      setCopyText("Copied!")
      setTimeout(() => setCopyText("Copy output"), 1200)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 text-mono-950 dark:text-mono-50 flex flex-col items-center p-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-2">Social Media Post Formatter</h1>
        <p className="text-sm text-mono-600 dark:text-mono-400 mb-6">
          Paste → style → pick platform → copy. That&apos;s it.
        </p>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Start typing your post…"
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
            Bold
          </button>
          <button
            onClick={() => handleStyle('italic')}
            className="px-4 py-2 rounded bg-accent-600 text-white cursor-pointer text-sm hover:opacity-90 transition-opacity"
          >
            Italic
          </button>
          <button
            onClick={() => handleStyle('underline')}
            className="px-4 py-2 rounded bg-accent-600 text-white cursor-pointer text-sm hover:opacity-90 transition-opacity"
          >
            Underline
          </button>
          <button
            onClick={handleAITags}
            className="px-4 py-2 rounded bg-accent-600 text-white cursor-pointer text-sm hover:opacity-90 transition-opacity"
          >
            🪄 AI hashtags
          </button>
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded bg-accent-600 text-white cursor-pointer text-sm hover:opacity-90 transition-opacity"
          >
            {copyText}
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

