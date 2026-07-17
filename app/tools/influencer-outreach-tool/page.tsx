'use client'

import React, { useState } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const copy = {
  en: {
    toolName: 'Influencer Outreach Tool',
    toolDescription:
      'Generates professional outreach emails for influencer collaborations. Creates personalized email templates based on influencer handle and follower count for brand partnership opportunities.',
    howToUse: [
      { label: 'Enter handle:', text: "Type the influencer's social media handle" },
      { label: 'Enter followers (optional):', text: 'Add their follower count for context' },
      { label: 'Customize message (optional):', text: 'Add a custom message to personalize the email' },
      { label: 'Click "Generate Email":', text: 'Create a professional outreach email template' },
      { label: 'Copy and send:', text: 'Copy the email and send it to the influencer' },
    ],
    howToUseTitle: 'How to Use This Tool',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      'Generates professional outreach email templates for contacting influencers. Creates personalized emails based on influencer handle and follower count for collaboration opportunities.',
    howToUseInner: 'How to Use',
    howToUseSteps: [
      { label: 'Enter handle:', text: 'Type the influencer\'s handle (e.g., "@creator")' },
      { label: 'Enter followers (optional):', text: 'Type their follower count' },
      { label: 'Add custom message (optional):', text: 'Add a personal note that will be included in the email' },
      { label: 'Click "Generate Email"', text: 'to create the outreach email' },
      { label: 'Copy email:', text: 'Click "Copy Email" to copy the generated email to clipboard' },
    ],
    expectedOutcome: 'Expected Outcome',
    expectedOutcomes: [
      'Professional outreach email template',
      'Personalized with influencer handle',
      'Includes follower count reference (if provided)',
      'Custom message included (if provided)',
      'Ready to copy and send',
    ],
    title: 'Influencer Outreach Tool',
    handle: 'Handle',
    followersOptional: 'Followers (optional)',
    followersPlaceholder: 'e.g., 50000',
    customMessageOptional: 'Custom Message (optional)',
    customMessagePlaceholder: 'Add a personal note or additional details...',
    generateEmail: 'Generate Email',
    reset: 'Reset',
    generatedEmail: 'Generated Email',
    copyEmail: 'Copy Email',
    howItWorks: 'How it works:',
    howItWorksBody:
      'Enter the influencer\'s handle and optionally their follower count. Click "Generate Email" to create a professional outreach email template. Customize the message and copy it to send to influencers.',
    alertEnterHandle: 'Please enter a handle',
    alertCopied: 'Email copied to clipboard!',
    template: `Hi {handle},

We love your content and would love to collaborate on our upcoming campaign.  
Let us know if you're interested and we'll send details.

Best,
Your Brand Team`,
    yourAudience: 'your audience',
    psPrefix: 'P.S.',
  },
  es: {
    toolName: 'Herramienta de contacto con influencers',
    toolDescription:
      'Genera correos profesionales de contacto para colaboraciones con influencers. Crea plantillas de correo personalizadas según el usuario y el número de seguidores para oportunidades de asociación de marca.',
    howToUse: [
      { label: 'Introduce el usuario:', text: 'Escribe el usuario de redes sociales del influencer' },
      { label: 'Introduce seguidores (opcional):', text: 'Añade su número de seguidores como contexto' },
      { label: 'Personaliza el mensaje (opcional):', text: 'Añade un mensaje personalizado para el correo' },
      { label: 'Haz clic en "Generar correo":', text: 'Crea una plantilla profesional de contacto' },
      { label: 'Copia y envía:', text: 'Copia el correo y envíalo al influencer' },
    ],
    howToUseTitle: 'Cómo usar esta herramienta',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Genera plantillas de correo profesionales para contactar influencers. Crea correos personalizados según el usuario y el número de seguidores para oportunidades de colaboración.',
    howToUseInner: 'Cómo usar',
    howToUseSteps: [
      { label: 'Introduce el usuario:', text: 'Escribe el usuario del influencer (p. ej., "@creator")' },
      { label: 'Introduce seguidores (opcional):', text: 'Escribe su número de seguidores' },
      { label: 'Añade mensaje personalizado (opcional):', text: 'Añade una nota personal que se incluirá en el correo' },
      { label: 'Haz clic en "Generar correo"', text: 'para crear el correo de contacto' },
      { label: 'Copiar correo:', text: 'Haz clic en "Copiar correo" para copiar el correo generado al portapapeles' },
    ],
    expectedOutcome: 'Resultado esperado',
    expectedOutcomes: [
      'Plantilla de correo de contacto profesional',
      'Personalizada con el usuario del influencer',
      'Incluye referencia al número de seguidores (si se proporciona)',
      'Mensaje personalizado incluido (si se proporciona)',
      'Lista para copiar y enviar',
    ],
    title: 'Herramienta de contacto con influencers',
    handle: 'Usuario',
    followersOptional: 'Seguidores (opcional)',
    followersPlaceholder: 'p. ej., 50000',
    customMessageOptional: 'Mensaje personalizado (opcional)',
    customMessagePlaceholder: 'Añade una nota personal o detalles adicionales...',
    generateEmail: 'Generar correo',
    reset: 'Restablecer',
    generatedEmail: 'Correo generado',
    copyEmail: 'Copiar correo',
    howItWorks: 'Cómo funciona:',
    howItWorksBody:
      'Introduce el usuario del influencer y opcionalmente su número de seguidores. Haz clic en "Generar correo" para crear una plantilla profesional de contacto. Personaliza el mensaje y cópialo para enviarlo a los influencers.',
    alertEnterHandle: 'Por favor introduce un usuario',
    alertCopied: '¡Correo copiado al portapapeles!',
    template: `Hola {handle},

Nos encanta tu contenido y nos encantaría colaborar en nuestra próxima campaña.
Avísanos si te interesa y te enviaremos los detalles.

Saludos,
Tu equipo de marca`,
    yourAudience: 'tu audiencia',
    psPrefix: 'P.D.',
  },
}

function InfluencerOutreachToolContent({ c }: { c: typeof copy.en }) {
  const [handle, setHandle] = useState('')
  const [followers, setFollowers] = useState('')
  const [email, setEmail] = useState('')
  const [customMessage, setCustomMessage] = useState('')

  const generate = () => {
    if (!handle.trim()) {
      alert(c.alertEnterHandle)
      return
    }

    let generatedEmail = c.template
      .replace('{handle}', handle)
      .replace('{followers}', followers || c.yourAudience)

    if (customMessage) {
      generatedEmail += `\n\n${c.psPrefix} ${customMessage}`
    }

    setEmail(generatedEmail)
  }

  const copyEmail = () => {
    if (email) {
      navigator.clipboard.writeText(email)
      alert(c.alertCopied)
    }
  }

  const reset = () => {
    setHandle('')
    setFollowers('')
    setEmail('')
    setCustomMessage('')
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
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

        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          {c.title}
        </h1>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              {c.handle}
            </label>
            <input
              id="h"
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="@creator"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              {c.followersOptional}
            </label>
            <input
              id="f"
              type="number"
              value={followers}
              onChange={(e) => setFollowers(e.target.value)}
              placeholder={c.followersPlaceholder}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              {c.customMessageOptional}
            </label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder={c.customMessagePlaceholder}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-vertical"
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={generate}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              {c.generateEmail}
            </button>
            {email && (
              <button
                onClick={reset}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
              >
                {c.reset}
              </button>
            )}
          </div>
        </div>

        {email && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {c.generatedEmail}
              </h2>
              <button
                onClick={copyEmail}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors"
              >
                {c.copyEmail}
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 p-4 rounded border border-gray-200 dark:border-gray-700 font-sans">
              {email}
            </pre>
          </div>
        )}

        {!email && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
              {c.howItWorks}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {c.howItWorksBody}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function InfluencerOutreachTool() {
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
      toolSlug="influencer-outreach-tool"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <InfluencerOutreachToolContent c={c} />
    </ToolAccessGate>
  )
}
