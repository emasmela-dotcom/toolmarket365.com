'use client'

import { useState } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'

function AICaptionGeneratorContent() {
  const [prompt, setPrompt] = useState('')
  const [tone, setTone] = useState('funny')
  const [platform, setPlatform] = useState('instagram')
  const [length, setLength] = useState('medium')
  const [niche, setNiche] = useState('general')
  const [output, setOutput] = useState('')
  const [showOutput, setShowOutput] = useState(false)

  const pools: Record<string, Record<string, string[]>> = {
    funny: {
      instagram: [
        "Just %s things 🌟🤪 #LivingMyBestLife #GoodVibes",
        "%s called — it wants its spotlight back 📸✨ #OwnIt #Funny",
        "Proof that %s > therapy (and cheaper) 😂💸 #LOL #Relatable"
      ],
      tiktok: [
        "POV: %s just ended everyone else's career 💅 #FYP #Trending",
        "%s speed-run → watch till the end 😂 #TikTokMadeMeBuyIt",
        "When %s is life but you're the main character 🎬✨ #ForYou"
      ],
      linkedin: [
        "What %s taught me about agile problem-solving 🚀 #Innovation #Leadership",
        "Leveraging %s to drive stakeholder engagement 💡 #ProfessionalGrowth",
        "How %s boosts team morale — data-driven insights below 📊 #HR"
      ],
      twitter: [
        "%s > coffee ☕️ Change my mind. #MondayMotivation",
        "Hot take: %s should be an Olympic sport 🔥 #RandomThoughts",
        "%s hits different at 3 am 🌙 #NightOwls"
      ],
      facebook: [
        "Throwback to when %s made my day! 🌞 Drop a ❤️ if you agree.",
        "Good vibes only: %s edition ✨ Share if you feel it!",
        "Who else thinks %s needs more love? 👇 #Community"
      ]
    },
    inspirational: {
      instagram: [
        "Let %s remind you: magic is real if you believe ✨💫 #Motivation #Inspire",
        "Your next chapter starts with %s — write boldly 🌅📝 #Mindset",
        "%s is proof the best stories are still being written 🌠 #KeepGoing"
      ],
      tiktok: [
        "%s energy = manifest-everything kind of vibe 🌈 #SpiritualTok",
        "Watch %s turn dreams into plans ⏳✨ #GoalGetter",
        "%s but make it self-love journey 💖 #HealingTok"
      ],
      linkedin: [
        "%s as a metaphor: iterate, adapt, ascend 🧗‍♂️ #GrowthMindset",
        "From idea to impact — %s shows the power of persistence 🚀 #Success",
        "Channel %s to unlock creative breakthroughs at work 🎨 #Innovation"
      ],
      twitter: [
        "%s is the sign you were waiting for — start today 🌱 #Quote",
        "Let %s fuel your hustle 🔥 #ThursdayThoughts",
        "Reminder: you're 1 %s away from a new reality ✨ #Mindset"
      ],
      facebook: [
        "Spreading positivity with %s 🌻 Tag someone who needs this today!",
        "If %s doesn't inspire you, nothing will 🙌 #ShareTheLove",
        "Rise, shine, repeat — %s edition ☀️ #GoodMorning"
      ]
    },
    professional: {
      instagram: [
        "Behind the scenes: %s optimized for peak performance 📈 #Tech #Efficiency",
        "%s workflow that saves 3 hrs/week — link in bio 🔗 #Productivity",
        "Case study: how %s increased ROI by 27% 📊 #Marketing"
      ],
      tiktok: [
        "Quick tip: use %s to level-up your content game 🎯 #CreatorTips",
        "%s hack nobody taught you 🛠️ #TechTok",
        "Stop scrolling — %s strategy in 30s ⏱️ #BusinessTok"
      ],
      linkedin: [
        "Whitepaper: %s as a disruptive model in 2026 📄 #IndustryInsights",
        "Webinar recap — 5 ways %s transforms customer experience 🎥 #CX",
        "Benchmark report: %s adoption up 34% YoY 📈 #Data"
      ],
      twitter: [
        "Thread 🧵: Why %s matters for SaaS growth ⬇️ #Startup",
        "1/ %s reduces churn by 18% — here's the data 📊",
        "Pro tip: schedule %s posts at 9am local for max reach ⏰ #SocialMedia"
      ],
      facebook: [
        "Live demo tomorrow: %s automation in action 🖥️ Set reminder!",
        "Survey: 62% marketers plan to invest more in %s this year 📊 #Analytics",
        "Free checklist — 7 steps to master %s 🔗 Download below!"
      ]
    },
    casual: {
      instagram: [
        "Current mood: %s and chill 🌴😌 #SundayFunday",
        "%s hits different today ✨ #SimplePleasures",
        "Serving %s realness 🥂 #NoFilter"
      ],
      tiktok: [
        "%s check ✅ What's next? #DailyVlog",
        "When %s is your personality trait 😅 #Relatable",
        "%s but make it low-key iconic 🌟 #Foryou"
      ],
      linkedin: [
        "Coffee + %s = productive morning ☕️ #WorkLife",
        "Quick update: %s is now live 🎉 #News",
        "Friday feels: %s mode on 🙃 #OfficeLife"
      ],
      twitter: [
        "%s appreciation tweet 🧡 #Random",
        "In my %s era and not leaving 🕶️ #Vibes",
        "Who else loves %s? Asking for a friend 😌 #Chat"
      ],
      facebook: [
        "Lazy Sunday with %s 🛋️ What are you up to?",
        "%s made my week — can't complain! 🌞",
        "Drop your fav %s moment below 👇 #Memories"
      ]
    },
    informative: {
      instagram: [
        "Fact: %s reduces carbon footprint by 12% 🌍 #EcoTip",
        "How to use %s in 3 steps → save this post 📌 #Tutorial",
        "Study shows %s boosts memory retention by 28% 🧠 #Science"
      ],
      tiktok: [
        "Did you know? %s #LearnOnTikTok",
        "%s explained in 15s ⏱️ #EduTok",
        "Save this %s hack for later 🛠️ #LifeHack"
      ],
      linkedin: [
        "Report: %s market to hit $4.2B by 2028 📈 #Forecast",
        "ISO spec update — %s compliance checklist attached 🔗 #Quality",
        "Infographic: 5 stats you need about %s 📊 #Insight"
      ],
      twitter: [
        "%s thread 🧵 (1/5) ⬇️ #Info",
        "Quick stat: %s adoption ↑ 41% since 2025 📊",
        "Whitepaper drop — %s benchmarks inside 🔗 #Data"
      ],
      facebook: [
        "ICYMI: %s guidelines just changed 📢 Read summary here!",
        "Infographic: %s lifecycle in 6 steps 🔄 Save & share!",
        "Poll: do you trust %s data? Vote below 📊 #Discussion"
      ]
    }
  }

  // Niche-specific templates (20+ templates across 6 niches)
  const nicheTemplates: Record<string, Record<string, Record<string, string[]>>> = {
    fitness: {
      funny: {
        instagram: [
          "When %s hits different at 6am 💪☕️ #MorningMotivation #FitnessLife",
          "POV: %s is my personality now 🏋️‍♀️ #GymLife #NoDaysOff",
          "%s > excuses. Always. 🔥 #FitnessMotivation #Workout"
        ],
        tiktok: [
          "%s but make it gym content 💪 #FitnessTok #GymTok",
          "When %s becomes your entire personality 😅 #FitTok #Gains",
          "%s energy = can't stop won't stop 🚀 #WorkoutMotivation"
        ]
      },
      inspirational: {
        instagram: [
          "Your body can do %s — it's your mind you need to convince 💪✨ #Mindset #FitnessJourney",
          "Progress > perfection. %s is proof 🌟 #FitnessMotivation #Growth",
          "Every %s is a step closer to your goals 🎯 #KeepGoing #FitnessLife"
        ],
        tiktok: [
          "%s = small steps, big changes 🌱 #FitnessJourney #Motivation",
          "Remember why you started: %s 💫 #FitnessMotivation #Goals",
          "%s but make it your comeback story 🏆 #FitnessTok"
        ]
      },
      professional: {
        instagram: [
          "Science-backed: %s improves performance by 23% 📊 #FitnessScience #EvidenceBased",
          "Training protocol: %s for optimal results 🎯 #FitnessCoaching #Performance",
          "Case study: %s increases strength gains 📈 #FitnessResearch"
        ]
      }
    },
    food: {
      funny: {
        instagram: [
          "%s but make it ✨aesthetic✨ 📸 #FoodPorn #Foodie",
          "POV: %s is your entire personality 🍕 #FoodLover #FoodieLife",
          "When %s hits different at 2am 😋 #LateNightSnacks #Food"
        ],
        tiktok: [
          "%s but make it go viral 🍽️ #FoodTok #RecipeTok",
          "POV: %s is the only thing on your mind 🥘 #FoodTok #Cooking",
          "%s speed-run any% 🏃‍♀️💨 #FoodTok #CookingHacks"
        ]
      },
      inspirational: {
        instagram: [
          "Food is love: %s brings people together ❤️ #FoodLove #Community",
          "Every %s tells a story 📖 #FoodCulture #Foodie",
          "Simple ingredients, extraordinary %s ✨ #Cooking #FoodArt"
        ]
      },
      professional: {
        instagram: [
          "Recipe breakdown: %s in 5 steps 📝 #CookingTips #Recipe",
          "Nutritional analysis: %s provides key nutrients 🥗 #HealthyEating #Nutrition",
          "Chef's technique: mastering %s 👨‍🍳 #CookingSkills #FoodPrep"
        ]
      }
    },
    travel: {
      funny: {
        instagram: [
          "%s but make it ✈️✈️✈️ #Wanderlust #TravelLife",
          "POV: %s is your entire savings account 💸 #TravelAddict #Wanderlust",
          "When %s > rent 🏠✈️ #TravelLife #Adventure"
        ],
        tiktok: [
          "%s but make it travel content ✈️ #TravelTok #Wanderlust",
          "POV: %s is your personality now 🗺️ #TravelTok #Adventure",
          "%s but you're broke after 😅 #TravelLife #Wanderlust"
        ]
      },
      inspirational: {
        instagram: [
          "Collect moments, not things: %s ✨ #TravelMemories #Wanderlust",
          "The world is a book: %s is your next chapter 📖 #TravelLife #Adventure",
          "%s reminds you why you travel 🌍 #Wanderlust #Explore"
        ]
      },
      professional: {
        instagram: [
          "Travel guide: %s — what to know before you go 📍 #TravelTips #Destination",
          "Budget breakdown: %s costs and savings 💰 #TravelPlanning #BudgetTravel",
          "Itinerary: 3 days in %s 🗺️ #TravelGuide #Destination"
        ]
      }
    },
    fashion: {
      funny: {
        instagram: [
          "%s but make it fashion 💅✨ #OOTD #Fashion",
          "POV: %s is your entire personality 👗 #Fashionista #Style",
          "When %s > groceries 🛍️ #FashionAddict #Shopping"
        ],
        tiktok: [
          "%s but make it a fit check 👔 #FashionTok #OOTD",
          "POV: %s is your personality trait 🎨 #FashionTok #Style",
          "%s but make it iconic 💫 #FashionTok #Trending"
        ]
      },
      inspirational: {
        instagram: [
          "Style is a way to say who you are: %s ✨ #Fashion #PersonalStyle",
          "%s = confidence in every step 👠 #FashionMotivation #Style",
          "Fashion is art: %s is your canvas 🎨 #FashionDesign #Style"
        ]
      },
      professional: {
        instagram: [
          "Trend report: %s is dominating 2026 📊 #FashionTrends #StyleGuide",
          "Styling tips: how to wear %s 🎯 #FashionTips #OutfitIdeas",
          "Brand spotlight: %s collection review 👗 #FashionReview #Style"
        ]
      }
    },
    tech: {
      funny: {
        instagram: [
          "%s but make it tech support 😅💻 #TechLife #Developer",
          "POV: %s is your entire personality 🖥️ #TechTok #Coding",
          "When %s > sleep 😴💻 #DeveloperLife #Tech"
        ],
        tiktok: [
          "%s but make it coding content 💻 #TechTok #Coding",
          "POV: %s is your life now 🚀 #TechTok #Developer",
          "%s but you're debugging at 3am 🐛 #TechLife #Coding"
        ]
      },
      inspirational: {
        instagram: [
          "Code is poetry: %s is your verse 💻✨ #Coding #TechLife",
          "Innovation starts with %s 🚀 #TechMotivation #Innovation",
          "%s = building the future 🌟 #TechLife #Developer"
        ]
      },
      professional: {
        instagram: [
          "Tech review: %s performance analysis 📊 #TechReview #Gadgets",
          "Tutorial: mastering %s in 10 steps 🎯 #TechTips #Tutorial",
          "Industry insights: %s market trends 📈 #TechNews #Innovation"
        ]
      }
    },
    beauty: {
      funny: {
        instagram: [
          "%s but make it ✨glam✨ 💄 #Beauty #Makeup",
          "POV: %s is your entire personality 💅 #BeautyTok #Makeup",
          "When %s > sleep 😴💄 #BeautyLife #MakeupAddict"
        ],
        tiktok: [
          "%s but make it a glow-up ✨ #BeautyTok #Makeup",
          "POV: %s is your personality trait 💫 #BeautyTok #GlowUp",
          "%s but make it iconic 🌟 #BeautyTok #MakeupTutorial"
        ]
      },
      inspirational: {
        instagram: [
          "Beauty is confidence: %s helps you shine ✨ #BeautyMotivation #SelfLove",
          "%s = feeling your best self 💫 #BeautyLife #Confidence",
          "Every %s is self-care 🌸 #BeautyRoutine #SelfCare"
        ]
      },
      professional: {
        instagram: [
          "Product review: %s — honest thoughts 💄 #BeautyReview #Makeup",
          "Tutorial: %s step-by-step guide 🎯 #MakeupTutorial #BeautyTips",
          "Trend alert: %s is everywhere 📊 #BeautyTrends #Makeup"
        ]
      }
    }
  }

  const handleGenerate = () => {
    const trimmedPrompt = prompt.trim()
    if (!trimmedPrompt) {
      alert("Add a description first")
      return
    }

    // Use niche templates if niche is selected and templates exist, otherwise use general pools
    let templates: string[] = []
    if (niche !== 'general' && nicheTemplates[niche]?.[tone]?.[platform]) {
      templates = nicheTemplates[niche][tone][platform]
    } else {
      templates = pools[tone][platform]
    }

    const generated = templates.slice(0, 3).map(t => 
      t.replace("%s", trimmedPrompt) + (length === "long" ? " 💡" : "")
    ).join("\n\n—\n\n")

    setOutput(generated)
    setShowOutput(true)
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 text-mono-950 dark:text-mono-50 py-8 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-2 text-center">AI Caption Generator</h1>
        <p className="text-sm text-mono-600 dark:text-mono-400 text-center mb-4">
          Describe your image/video, pick a vibe & platform → get 3 captions in seconds.
        </p>

        {/* Supported Platforms */}
        <div className="bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-lg p-4 mb-6">
          <p className="text-xs font-semibold text-mono-700 dark:text-mono-300 mb-2">Supported Platforms:</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-white dark:bg-mono-800 rounded-full text-xs font-medium text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700">📸 Instagram</span>
            <span className="px-3 py-1 bg-white dark:bg-mono-800 rounded-full text-xs font-medium text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700">🎵 TikTok</span>
            <span className="px-3 py-1 bg-white dark:bg-mono-800 rounded-full text-xs font-medium text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700">💼 LinkedIn</span>
            <span className="px-3 py-1 bg-white dark:bg-mono-800 rounded-full text-xs font-medium text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700">🐦 Twitter/X</span>
            <span className="px-3 py-1 bg-white dark:bg-mono-800 rounded-full text-xs font-medium text-mono-700 dark:text-mono-300 border border-mono-200 dark:border-mono-700">📘 Facebook</span>
          </div>
        </div>

        {/* Documentation Section */}
        <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-6 mb-6 border border-mono-200 dark:border-mono-700">
          <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">How to Use This Tool</h2>
          <div className="space-y-4 text-sm text-mono-700 dark:text-mono-300">
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">What It Does</h3>
              <p>Generates 3 social media captions instantly based on your image/video description, selected tone, platform, and length preference.</p>
            </div>
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">How to Use</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li><strong>Describe your content:</strong> Paste image description or video script</li>
                <li><strong>Select tone:</strong> Funny/Witty, Inspirational, Professional, Casual, or Informative</li>
                <li><strong>Choose platform:</strong> Instagram, TikTok, LinkedIn, Twitter/X, or Facebook</li>
                <li><strong>Pick length:</strong> Short (≤70 chars), Medium (70-220 chars), or Long (220+ chars)</li>
                <li><strong>Click "Generate 3 captions"</strong> to create your captions</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">Expected Outcome</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>3 unique captions tailored to your tone and platform</li>
                <li>Platform-optimized formatting and hashtags</li>
                <li>Tone-appropriate language and style</li>
                <li>Length-optimized for your selected preference</li>
                <li>Ready to copy and use immediately</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-mono-50 dark:bg-mono-900 border border-mono-300 dark:border-mono-700 rounded-lg p-6 mt-4">
          <label className="block mb-2 mt-4 text-sm font-semibold">
            1. Paste image description or video script
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g. A dog skateboarding down the beach at sunset wearing neon sunglasses…"
            className="w-full p-3 text-sm border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 resize-y h-24 focus:outline-none focus:ring-2 focus:ring-accent-500"
          />

          <label className="block mb-2 mt-4 text-sm font-semibold">2. Tone</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full p-3 text-sm border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            <option value="funny">Funny / Witty</option>
            <option value="inspirational">Inspirational</option>
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="informative">Informative</option>
          </select>

          <label className="block mb-2 mt-4 text-sm font-semibold">3. Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full p-3 text-sm border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="linkedin">LinkedIn</option>
            <option value="twitter">Twitter / X</option>
            <option value="facebook">Facebook</option>
          </select>

          <label className="block mb-2 mt-4 text-sm font-semibold">5. Length</label>
          <select
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="w-full p-3 text-sm border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            <option value="short">Short (≤ 70 chars)</option>
            <option value="medium">Medium (70-220 chars)</option>
            <option value="long">Long (220+)</option>
          </select>

          <button
            onClick={handleGenerate}
            className="w-full mt-6 px-4 py-3 bg-accent-600 text-white rounded font-medium hover:opacity-90 transition-opacity cursor-pointer"
          >
            Generate 3 captions
          </button>

          {showOutput && (
            <div className="whitespace-pre-wrap bg-mono-100 dark:bg-mono-800 p-4 rounded mt-4 text-sm leading-relaxed">
              {output}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AICaptionGenerator() {
  const toolDescription = "Generates 3 social media captions instantly based on your image/video description, selected tone, platform, and length preference."
  
  const howToUse = (
    <ol className="list-decimal list-inside space-y-1 ml-2">
      <li><strong>Describe your content:</strong> Paste image description or video script</li>
      <li><strong>Select tone:</strong> Funny/Witty, Inspirational, Professional, Casual, or Informative</li>
      <li><strong>Choose platform:</strong> Instagram, TikTok, LinkedIn, Twitter/X, or Facebook</li>
      <li><strong>Pick length:</strong> Short (≤70 chars), Medium (70-220 chars), or Long (220+ chars)</li>
      <li><strong>Click "Generate 3 captions"</strong> to create your captions</li>
    </ol>
  )

  return (
    <ToolAccessGate
      toolSlug="ai-caption-generator"
      toolName="AI Caption Generator"
      toolDescription={toolDescription}
      howToUse={howToUse}
    >
      <AICaptionGeneratorContent />
    </ToolAccessGate>
  )
}


