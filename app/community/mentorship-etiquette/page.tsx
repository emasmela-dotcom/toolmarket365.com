'use client'

import Link from 'next/link'
import { AlertTriangle, CheckCircle, XCircle, Clock, Heart, Users, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext'

const copy = {
  en: {
    pageTitle: 'Mentorship Etiquette Guide',
    pageSubtitle:
      'Learn how to approach mentors respectfully and build meaningful mentorship relationships',
    pilotTitle: '⚠️ Experimental Pilot Program',
    pilotIntroBold: 'This mentorship feature is experimental.',
    pilotIntroRest: 'This pilot program will be removed if:',
    pilotList: [
      {
        label: 'Bad reviews or negative feedback',
        text: ' are received about the mentorship system',
      },
      {
        label: 'No engagement',
        text: " - If creators don't use it (no mentors sign up, no questions asked, no activity), there's no point in keeping it",
      },
    ],
    pilotForMentorsLabel: 'For Mentors:',
    pilotForMentorsText:
      "There's really nothing to gain from being a creator mentor except the satisfaction of showing other creators how you got where you are. This is about giving back to the community, not personal gain.",
    pilotRespect:
      'Please respect mentors and follow etiquette guidelines. Negative experiences or lack of usage could result in this feature being removed for everyone.',
    warningTitle: "⚠️ Important: Don't Be Overly Aggressive",
    warningText:
      'Mentors are volunteering their time to help you grow. Being too aggressive (multiple messages, demanding responses, not respecting boundaries) will turn them away. Follow these guidelines to build positive mentorship relationships.',
    dosTitle: "✅ DO's - Best Practices",
    dosSections: [
      {
        title: '1. Be Respectful of Their Time',
        items: [
          { label: 'One question at a time', text: " - Don't flood mentors with multiple questions" },
          { label: 'Wait for responses', text: ' - Give mentors time to reply (24-48 hours minimum)' },
          { label: 'Be concise', text: ' - Get to the point quickly' },
          { label: 'Say thank you', text: ' - Always acknowledge their help' },
        ],
      },
      {
        title: '2. Do Your Homework First',
        items: [
          { label: 'Search existing Q&A', text: ' - Your question might already be answered' },
          {
            label: 'Be specific',
            text: ' - "How do I grow on TikTok?" is too vague. "How do I improve engagement on TikTok fitness content?" is better',
          },
          { label: "Show you've tried", text: " - Mention what you've already attempted" },
        ],
      },
      {
        title: '3. Be Professional',
        items: [
          { label: 'Introduce yourself', text: ' - Briefly share who you are and your goals' },
          { label: 'Be clear about what you need', text: ' - Specific questions get better answers' },
          {
            label: 'Follow up appropriately',
            text: ' - One follow-up after a week is fine, multiple messages in one day is not',
          },
        ],
      },
      {
        title: '4. Respect Boundaries',
        items: [
          { label: 'Check mentor availability', text: ' - Some mentors have limited hours' },
          { label: 'Respect their expertise', text: " - Don't ask about topics outside their niche" },
          { label: 'Accept "no" gracefully', text: ' - If a mentor declines, thank them and move on' },
        ],
      },
    ],
    dontsTitle: "❌ DON'Ts - What Turns Mentors Away",
    dontsSections: [
      {
        title: "1. Don't Be Overly Aggressive",
        items: [
          { prefix: '❌ ', label: 'Multiple messages in one day', text: ' - This feels like spam' },
          { prefix: '❌ ', label: 'Demanding immediate responses', text: ' - Mentors have lives too' },
          { prefix: '❌ ', label: 'Following up too frequently', text: ' - Wait at least 3-5 days before following up' },
          {
            prefix: '❌ ',
            label: 'Sending the same question to multiple mentors',
            text: ' - Pick one mentor per question',
          },
        ],
      },
      {
        title: "2. Don't Expect Free Work",
        items: [
          { prefix: '❌ ', label: 'Asking mentors to do work for you', text: ' - They guide, you execute' },
          {
            prefix: '❌ ',
            label: 'Requesting detailed content reviews',
            text: ' - Use the Q&A board for quick feedback',
          },
          {
            prefix: '❌ ',
            label: 'Expecting ongoing daily support',
            text: ' - Mentorship is occasional guidance, not daily coaching',
          },
        ],
      },
      {
        title: "3. Don't Be Entitled",
        items: [
          { prefix: '❌ ', label: 'Demanding responses', text: ' - Mentors volunteer their time' },
          { prefix: '❌ ', label: "Getting upset if they don't respond", text: " - They're busy creators too" },
          { prefix: '❌ ', label: 'Not saying thank you', text: ' - Always acknowledge their help' },
        ],
      },
      {
        title: "4. Don't Waste Their Time",
        items: [
          { prefix: '❌ ', label: 'Questions easily answered by Google', text: ' - Do basic research first' },
          { prefix: '❌ ', label: 'Vague, unclear questions', text: ' - Be specific about what you need' },
          { prefix: '❌ ', label: 'Not reading their profile', text: ' - Check their expertise before asking' },
        ],
      },
    ],
    templateTitle: '📋 Mentorship Request Template',
    templateIntro: 'When reaching out to a mentor, use this structure:',
    requestTemplate: `Subject: [Specific Topic] Question - [Your Name]

Hi [Mentor Name],

I'm [your name], a [niche] creator on [platform] with [follower count]. I've been creating content for [time period] and I'm working on [specific goal].

I saw your expertise in [their specialty] and I have a specific question about [your question].

I've already tried [what you've attempted] but I'm stuck on [specific issue].

Would you be able to share your thoughts on [specific question]? I understand you're busy, so no pressure if you can't respond.

Thank you for your time!

[Your Name]`,
    rateLimitsTitle: '🎯 Rate Limits & Guidelines',
    rateLimitsIntro: 'To prevent overwhelming mentors:',
    rateLimitsItems: [
      { label: 'Maximum 1 mentorship request per week', text: ' per creator' },
      { label: 'Maximum 2 follow-up messages', text: ' per conversation' },
      { label: 'Wait 3-5 days', text: ' before following up' },
      {
        label: 'One mentor per question',
        text: " - Don't spam multiple mentors with the same question",
      },
    ],
    rememberTitle: '💡 Remember',
    rememberItems: [
      {
        label: 'Mentors are volunteers',
        text: " - They're helping because they want to, not because they have to",
      },
      {
        label: 'Respect builds relationships',
        text: ' - Being respectful can lead to long-term mentorship',
      },
      { label: 'Patience pays off', text: ' - Good mentors are worth waiting for' },
      {
        label: 'Community matters',
        text: ' - Treat mentors well so they continue helping others',
      },
    ],
    turnedAwayTitle: "🚨 If You're Turned Away",
    turnedAwayIntro: "If a mentor declines or doesn't respond:",
    turnedAwayItems: [
      { label: "Don't take it personally", text: ' - They might be busy or not the right fit' },
      { label: 'Try the Q&A board', text: ' - Other creators can help too' },
      { label: 'Find another mentor', text: ' - There are many mentors available' },
      { label: 'Reflect on your approach', text: ' - Was your message respectful and clear?' },
    ],
    bottomLineTitle: 'Bottom Line',
    bottomLineText:
      'Treat mentors like respected colleagues, not free help. Respect their time, be specific, and always say thank you. This builds a healthy mentorship community where everyone benefits!',
    finalReminderTitle: '⚠️ Remember: This is Experimental',
    finalReminderIntroBold: 'This mentorship pilot program can be removed at any time.',
    finalReminderIntroRest: 'This feature will be removed if:',
    finalReminderList: [
      {
        label: 'Bad reviews or negative feedback',
        text: ' are received about how creators are treating mentors',
      },
      {
        label: 'No one uses it',
        text: " - If there's no engagement (no mentors, no questions, no activity), there's no point in keeping it around",
      },
    ],
    finalReminderMentors:
      "Mentors gain nothing except the satisfaction of helping others. They're showing you how they got where they are—that's it. No payment, no personal gain, just giving back.",
    finalReminderBehavior:
      'Your respectful behavior and active participation keeps this feature alive. Be respectful, follow the guidelines, and help us build a positive mentorship community—or this feature disappears for everyone.',
    browseMentors: 'Browse Mentors',
    askForHelp: 'Ask for Help',
  },
  es: {
    pageTitle: 'Guía de Etiqueta para Mentoría',
    pageSubtitle:
      'Aprende a acercarte a los mentores con respeto y construir relaciones de mentoría significativas',
    pilotTitle: '⚠️ Programa Piloto Experimental',
    pilotIntroBold: 'Esta función de mentoría es experimental.',
    pilotIntroRest: 'Este programa piloto se eliminará si:',
    pilotList: [
      {
        label: 'Se reciben malas reseñas o comentarios negativos',
        text: ' sobre el sistema de mentoría',
      },
      {
        label: 'No hay participación',
        text: ' - Si los creadores no lo usan (ningún mentor se registra, no se hacen preguntas, no hay actividad), no tiene sentido mantenerlo',
      },
    ],
    pilotForMentorsLabel: 'Para Mentores:',
    pilotForMentorsText:
      'Realmente no hay nada que ganar al ser mentor de creadores, excepto la satisfacción de mostrar a otros creadores cómo llegaste a donde estás. Se trata de devolver a la comunidad, no de beneficio personal.',
    pilotRespect:
      'Por favor respeta a los mentores y sigue las pautas de etiqueta. Experiencias negativas o falta de uso podrían resultar en que esta función se elimine para todos.',
    warningTitle: '⚠️ Importante: No Seas Demasiado Agresivo',
    warningText:
      'Los mentores están donando su tiempo para ayudarte a crecer. Ser demasiado agresivo (múltiples mensajes, exigir respuestas, no respetar límites) los alejará. Sigue estas pautas para construir relaciones de mentoría positivas.',
    dosTitle: '✅ Qué SÍ Hacer - Mejores Prácticas',
    dosSections: [
      {
        title: '1. Respeta Su Tiempo',
        items: [
          { label: 'Una pregunta a la vez', text: ' - No satures a los mentores con múltiples preguntas' },
          { label: 'Espera las respuestas', text: ' - Dale tiempo a los mentores para responder (mínimo 24-48 horas)' },
          { label: 'Sé conciso', text: ' - Ve al grano rápidamente' },
          { label: 'Da las gracias', text: ' - Siempre reconoce su ayuda' },
        ],
      },
      {
        title: '2. Haz Tu Tarea Primero',
        items: [
          { label: 'Busca en las preguntas y respuestas existentes', text: ' - Tu pregunta quizás ya fue respondida' },
          {
            label: 'Sé específico',
            text: ' - "¿Cómo crezco en TikTok?" es demasiado vago. "¿Cómo mejoro el engagement en contenido fitness de TikTok?" es mejor',
          },
          { label: 'Muestra que lo has intentado', text: ' - Menciona lo que ya has probado' },
        ],
      },
      {
        title: '3. Sé Profesional',
        items: [
          { label: 'Preséntate', text: ' - Comparte brevemente quién eres y tus objetivos' },
          { label: 'Sé claro sobre lo que necesitas', text: ' - Las preguntas específicas obtienen mejores respuestas' },
          {
            label: 'Haz seguimiento apropiadamente',
            text: ' - Un seguimiento después de una semana está bien, varios mensajes en un día no',
          },
        ],
      },
      {
        title: '4. Respeta los Límites',
        items: [
          { label: 'Verifica la disponibilidad del mentor', text: ' - Algunos mentores tienen horarios limitados' },
          { label: 'Respeta su experiencia', text: ' - No preguntes sobre temas fuera de su nicho' },
          { label: 'Acepta un "no" con gracia', text: ' - Si un mentor declina, agradécele y sigue adelante' },
        ],
      },
    ],
    dontsTitle: '❌ Qué NO Hacer - Lo Que Aleja a los Mentores',
    dontsSections: [
      {
        title: '1. No Seas Demasiado Agresivo',
        items: [
          { prefix: '❌ ', label: 'Múltiples mensajes en un día', text: ' - Esto se siente como spam' },
          { prefix: '❌ ', label: 'Exigir respuestas inmediatas', text: ' - Los mentores también tienen vida' },
          { prefix: '❌ ', label: 'Hacer seguimiento con demasiada frecuencia', text: ' - Espera al menos 3-5 días antes de hacer seguimiento' },
          {
            prefix: '❌ ',
            label: 'Enviar la misma pregunta a múltiples mentores',
            text: ' - Elige un mentor por pregunta',
          },
        ],
      },
      {
        title: '2. No Esperes Trabajo Gratis',
        items: [
          { prefix: '❌ ', label: 'Pedir a los mentores que hagan el trabajo por ti', text: ' - Ellos guían, tú ejecutas' },
          {
            prefix: '❌ ',
            label: 'Solicitar revisiones detalladas de contenido',
            text: ' - Usa el tablero de preguntas y respuestas para feedback rápido',
          },
          {
            prefix: '❌ ',
            label: 'Esperar apoyo diario continuo',
            text: ' - La mentoría es orientación ocasional, no coaching diario',
          },
        ],
      },
      {
        title: '3. No Seas Exigente',
        items: [
          { prefix: '❌ ', label: 'Exigir respuestas', text: ' - Los mentores donan su tiempo' },
          { prefix: '❌ ', label: 'Enojarte si no responden', text: ' - También son creadores ocupados' },
          { prefix: '❌ ', label: 'No dar las gracias', text: ' - Siempre reconoce su ayuda' },
        ],
      },
      {
        title: '4. No Desperdicies Su Tiempo',
        items: [
          { prefix: '❌ ', label: 'Preguntas fácilmente respondidas por Google', text: ' - Investiga primero lo básico' },
          { prefix: '❌ ', label: 'Preguntas vagas e imprecisas', text: ' - Sé específico sobre lo que necesitas' },
          { prefix: '❌ ', label: 'No leer su perfil', text: ' - Revisa su experiencia antes de preguntar' },
        ],
      },
    ],
    templateTitle: '📋 Plantilla de Solicitud de Mentoría',
    templateIntro: 'Al contactar a un mentor, usa esta estructura:',
    requestTemplate: `Asunto: Pregunta sobre [Tema Específico] - [Tu Nombre]

Hola [Nombre del Mentor],

Soy [tu nombre], un creador de [nicho] en [plataforma] con [número de seguidores]. He estado creando contenido durante [período de tiempo] y estoy trabajando en [objetivo específico].

Vi tu experiencia en [su especialidad] y tengo una pregunta específica sobre [tu pregunta].

Ya he intentado [lo que has probado] pero estoy atascado en [problema específico].

¿Podrías compartir tus ideas sobre [pregunta específica]? Entiendo que estás ocupado, así que no hay presión si no puedes responder.

¡Gracias por tu tiempo!

[Tu Nombre]`,
    rateLimitsTitle: '🎯 Límites de Frecuencia y Pautas',
    rateLimitsIntro: 'Para evitar saturar a los mentores:',
    rateLimitsItems: [
      { label: 'Máximo 1 solicitud de mentoría por semana', text: ' por creador' },
      { label: 'Máximo 2 mensajes de seguimiento', text: ' por conversación' },
      { label: 'Espera 3-5 días', text: ' antes de hacer seguimiento' },
      {
        label: 'Un mentor por pregunta',
        text: ' - No envíes spam a múltiples mentores con la misma pregunta',
      },
    ],
    rememberTitle: '💡 Recuerda',
    rememberItems: [
      {
        label: 'Los mentores son voluntarios',
        text: ' - Ayudan porque quieren, no porque tienen que hacerlo',
      },
      {
        label: 'El respeto construye relaciones',
        text: ' - Ser respetuoso puede llevar a una mentoría a largo plazo',
      },
      { label: 'La paciencia vale la pena', text: ' - Los buenos mentores valen la espera' },
      {
        label: 'La comunidad importa',
        text: ' - Trata bien a los mentores para que sigan ayudando a otros',
      },
    ],
    turnedAwayTitle: '🚨 Si Te Rechazan',
    turnedAwayIntro: 'Si un mentor declina o no responde:',
    turnedAwayItems: [
      { label: 'No lo tomes personal', text: ' - Puede estar ocupado o no ser la persona indicada' },
      { label: 'Prueba el tablero de preguntas y respuestas', text: ' - Otros creadores también pueden ayudar' },
      { label: 'Busca otro mentor', text: ' - Hay muchos mentores disponibles' },
      { label: 'Reflexiona sobre tu enfoque', text: ' - ¿Tu mensaje fue respetuoso y claro?' },
    ],
    bottomLineTitle: 'En Resumen',
    bottomLineText:
      'Trata a los mentores como colegas respetados, no como ayuda gratuita. Respeta su tiempo, sé específico y siempre da las gracias. ¡Esto construye una comunidad de mentoría saludable donde todos se benefician!',
    finalReminderTitle: '⚠️ Recuerda: Esto es Experimental',
    finalReminderIntroBold: 'Este programa piloto de mentoría puede eliminarse en cualquier momento.',
    finalReminderIntroRest: 'Esta función se eliminará si:',
    finalReminderList: [
      {
        label: 'Se reciben malas reseñas o comentarios negativos',
        text: ' sobre cómo los creadores tratan a los mentores',
      },
      {
        label: 'Nadie lo usa',
        text: ' - Si no hay participación (sin mentores, sin preguntas, sin actividad), no tiene sentido mantenerlo',
      },
    ],
    finalReminderMentors:
      'Los mentores no ganan nada excepto la satisfacción de ayudar a otros. Te están mostrando cómo llegaron a donde están—eso es todo. Sin pago, sin beneficio personal, solo devolver a la comunidad.',
    finalReminderBehavior:
      'Tu comportamiento respetuoso y participación activa mantienen viva esta función. Sé respetuoso, sigue las pautas y ayúdanos a construir una comunidad de mentoría positiva—o esta función desaparece para todos.',
    browseMentors: 'Explorar Mentores',
    askForHelp: 'Pedir Ayuda',
  },
}

export default function MentorshipEtiquettePage() {
  const { language } = useLanguage()
  const c = copy[language]

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Heart className="h-10 w-10 text-accent-600 dark:text-accent-400" />
            <h1 className="text-4xl font-bold text-mono-950 dark:text-mono-50">
              {c.pageTitle}
            </h1>
          </div>
          <p className="text-lg text-mono-600 dark:text-mono-400 max-w-2xl mx-auto">
            {c.pageSubtitle}
          </p>
        </div>

        {/* Experimental Pilot Notice */}
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-400 dark:border-red-700 rounded-lg p-6 mb-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
          <h3 className="font-bold text-red-900 dark:text-red-200 mb-2">
            {c.pilotTitle}
          </h3>
          <p className="text-sm text-red-800 dark:text-red-300 mb-3">
            <strong>{c.pilotIntroBold}</strong> {c.pilotIntroRest}
          </p>
          <ul className="text-sm text-red-800 dark:text-red-300 space-y-2 ml-4 mb-3">
            {c.pilotList.map((item, i) => (
              <li key={i}>
                • <strong>{item.label}</strong>{item.text}
              </li>
            ))}
          </ul>
          <p className="text-sm text-red-800 dark:text-red-300 mb-3">
            <strong>{c.pilotForMentorsLabel}</strong> {c.pilotForMentorsText}
          </p>
          <p className="text-sm text-red-800 dark:text-red-300 font-semibold">
            <strong>{c.pilotRespect}</strong>
          </p>
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-700 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-yellow-900 dark:text-yellow-200 mb-2">
                {c.warningTitle}
              </h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                {c.warningText}
              </p>
            </div>
          </div>
        </div>

        {/* DO's Section */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            <h2 className="text-2xl font-bold text-green-900 dark:text-green-200">
              {c.dosTitle}
            </h2>
          </div>

          <div className="space-y-6">
            {c.dosSections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <h3 className="font-semibold text-green-900 dark:text-green-200 mb-2">
                  {section.title}
                </h3>
                <ul className="text-sm text-green-800 dark:text-green-300 space-y-1 ml-4">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      • <strong>{item.label}</strong>{item.text}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* DON'Ts Section */}
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            <h2 className="text-2xl font-bold text-red-900 dark:text-red-200">
              {c.dontsTitle}
            </h2>
          </div>

          <div className="space-y-6">
            {c.dontsSections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <h3 className="font-semibold text-red-900 dark:text-red-200 mb-2">
                  {section.title}
                </h3>
                <ul className="text-sm text-red-800 dark:text-red-300 space-y-1 ml-4">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      • {item.prefix}<strong>{item.label}</strong>{item.text}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Template Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-200">
              {c.templateTitle}
            </h2>
          </div>
          <p className="text-sm text-blue-800 dark:text-blue-300 mb-4">
            {c.templateIntro}
          </p>
          <div className="bg-white dark:bg-mono-900 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
            <pre className="text-sm text-mono-800 dark:text-mono-200 whitespace-pre-wrap font-mono">
              {c.requestTemplate}
            </pre>
          </div>
        </div>

        {/* Rate Limits */}
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-200">
              {c.rateLimitsTitle}
            </h2>
          </div>
          <p className="text-sm text-purple-800 dark:text-purple-300 mb-4">
            {c.rateLimitsIntro}
          </p>
          <ul className="text-sm text-purple-800 dark:text-purple-300 space-y-2 ml-4">
            {c.rateLimitsItems.map((item, i) => (
              <li key={i}>
                • <strong>{item.label}</strong>{item.text}
              </li>
            ))}
          </ul>
        </div>

        {/* Key Reminders */}
        <div className="bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-accent-900 dark:text-accent-200 mb-4">
            {c.rememberTitle}
          </h2>
          <ul className="text-sm text-accent-800 dark:text-accent-300 space-y-3">
            {c.rememberItems.map((item, i) => (
              <li key={i} className="flex items-start">
                <span className="font-bold mr-2">•</span>
                <span><strong>{item.label}</strong>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* If Turned Away */}
        <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-6 mb-8 border border-mono-200 dark:border-mono-700">
          <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
            {c.turnedAwayTitle}
          </h2>
          <p className="text-sm text-mono-700 dark:text-mono-300 mb-4">
            {c.turnedAwayIntro}
          </p>
          <ol className="text-sm text-mono-700 dark:text-mono-300 space-y-2 ml-4 list-decimal">
            {c.turnedAwayItems.map((item, i) => (
              <li key={i}>
                <strong>{item.label}</strong>{item.text}
              </li>
            ))}
          </ol>
        </div>

        {/* Bottom Line */}
        <div className="bg-gradient-to-r from-accent-50 to-blue-50 dark:from-accent-900/20 dark:to-blue-900/20 border-2 border-accent-300 dark:border-accent-700 rounded-lg p-6 text-center mb-8">
          <p className="text-lg font-bold text-mono-950 dark:text-mono-50 mb-2">
            {c.bottomLineTitle}
          </p>
          <p className="text-sm text-mono-700 dark:text-mono-300">
            {c.bottomLineText}
          </p>
        </div>

        {/* Final Reminder - Experimental */}
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-400 dark:border-red-700 rounded-lg p-6 text-center">
          <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-red-900 dark:text-red-200 mb-3">
            {c.finalReminderTitle}
          </h3>
          <p className="text-sm text-red-800 dark:text-red-300 mb-2">
            <strong>{c.finalReminderIntroBold}</strong> {c.finalReminderIntroRest}
          </p>
          <ul className="text-sm text-red-800 dark:text-red-300 space-y-2 ml-4 mb-3">
            {c.finalReminderList.map((item, i) => (
              <li key={i}>
                • <strong>{item.label}</strong>{item.text}
              </li>
            ))}
          </ul>
          <p className="text-sm text-red-800 dark:text-red-300 mb-3">
            <strong>{c.finalReminderMentors}</strong>
          </p>
          <p className="text-sm text-red-800 dark:text-red-300 font-semibold">
            <strong>{c.finalReminderBehavior}</strong>
          </p>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link
            href="/community/mentors"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-accent-600 text-white font-semibold rounded-lg hover:bg-accent-700 transition-colors"
          >
            <span>{c.browseMentors}</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/community/ask-for-help"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-mono-200 dark:bg-mono-800 text-mono-950 dark:text-mono-50 font-semibold rounded-lg hover:bg-mono-300 dark:hover:bg-mono-700 transition-colors"
          >
            <span>{c.askForHelp}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
