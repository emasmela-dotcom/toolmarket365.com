'use client'

import { VerificationStatus } from '@/components/verification/VerificationStatus'
import { Shield, CheckCircle, Clock } from 'lucide-react';
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const copy = {
  en: {
    title: 'Creator Verification',
    subtitle:
      'Get verified to display a verified badge, build trust with your audience, and access priority support',
    benefitsTitle: 'Verification Benefits',
    benefitsSubtitle: 'Unlock exclusive features and build credibility with verification',
    benefitTrustTitle: 'Trust & Credibility',
    benefitTrustDesc:
      'Build trust with your audience and potential collaborators. Display a verified badge on your creator profile.',
    benefitBadgeTitle: 'Verified Badge',
    benefitBadgeDesc:
      'Show a blue checkmark badge on your profile in Growth Suite, making you stand out to brands and collaborators',
    benefitSupportTitle: 'Priority Support',
    benefitSupportDesc:
      'Get faster response times from our support team (24-48 hour response vs. standard 3-5 business days)',
    requirementsTitle: 'Verification Requirements',
    requirementsSubtitle: "To get verified, you'll need to meet these criteria",
    reqProfile: 'Complete profile with profile picture and bio',
    reqAccountAge: 'Active account for at least 30 days',
    reqContent: 'Consistent content creation or platform usage',
    reqPolicy: 'No policy violations or suspicious activity',
    toolName: 'Creator Verification',
    toolDescription:
      'Get verified as a creator to display a verified badge, build trust with your audience, and access priority support. Verification is automatic for Professional+ plans. Note: Tool access is determined by your subscription plan, not verification status.',
    howToUse:
      "1. Click 'Request Verification' if you're on a Starter or Essential plan. 2. Professional+ plans are automatically verified. 3. Once verified, you'll see a blue checkmark badge on your profile. 4. Verification helps build credibility and provides priority support—your subscription plan determines which tools you can access.",
  },
  es: {
    title: 'Verificación de creador',
    subtitle:
      'Obtén la verificación para mostrar una insignia verificada, generar confianza con tu audiencia y acceder a soporte prioritario',
    benefitsTitle: 'Beneficios de la verificación',
    benefitsSubtitle: 'Desbloquea funciones exclusivas y genera credibilidad con la verificación',
    benefitTrustTitle: 'Confianza y credibilidad',
    benefitTrustDesc:
      'Genera confianza con tu audiencia y posibles colaboradores. Muestra una insignia verificada en tu perfil de creador.',
    benefitBadgeTitle: 'Insignia verificada',
    benefitBadgeDesc:
      'Muestra una insignia de verificación azul en tu perfil en Growth Suite, destacándote ante marcas y colaboradores',
    benefitSupportTitle: 'Soporte prioritario',
    benefitSupportDesc:
      'Obtén respuestas más rápidas de nuestro equipo de soporte (24-48 horas frente a 3-5 días hábiles estándar)',
    requirementsTitle: 'Requisitos de verificación',
    requirementsSubtitle: 'Para obtener la verificación, debes cumplir estos criterios',
    reqProfile: 'Perfil completo con foto y biografía',
    reqAccountAge: 'Cuenta activa durante al menos 30 días',
    reqContent: 'Creación de contenido o uso constante de la plataforma',
    reqPolicy: 'Sin violaciones de políticas ni actividad sospechosa',
    toolName: 'Verificación de creador',
    toolDescription:
      'Obtén la verificación como creador para mostrar una insignia verificada, generar confianza con tu audiencia y acceder a soporte prioritario. La verificación es automática en planes Professional+. Nota: el acceso a herramientas lo determina tu plan de suscripción, no el estado de verificación.',
    howToUse:
      "1. Haz clic en 'Solicitar verificación' si tienes un plan Starter o Essential. 2. Los planes Professional+ se verifican automáticamente. 3. Una vez verificado, verás una insignia azul en tu perfil. 4. La verificación ayuda a generar credibilidad y proporciona soporte prioritario: tu plan de suscripción determina a qué herramientas puedes acceder.",
  },
}

function VerificationPageContent() {
  const { language } = useLanguage()
  const c = copy[language]

  const benefits = [
    {
      icon: Shield,
      title: c.benefitTrustTitle,
      description: c.benefitTrustDesc,
    },
    {
      icon: CheckCircle,
      title: c.benefitBadgeTitle,
      description: c.benefitBadgeDesc,
    },
    {
      icon: Clock,
      title: c.benefitSupportTitle,
      description: c.benefitSupportDesc,
    },
  ]

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-mono-950 dark:text-mono-50">{c.title}</h1>
        <p className="text-mono-600 dark:text-mono-400 mt-2">
          {c.subtitle}
        </p>
      </div>

      <div className="grid gap-8">
        <VerificationStatus />

        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6">
          <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-2">{c.benefitsTitle}</h2>
          <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">
            {c.benefitsSubtitle}
          </p>
          <div className="grid gap-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div key={index} className="flex items-start gap-4 p-4 bg-mono-50 dark:bg-mono-800 rounded-lg">
                  <div className="w-10 h-10 bg-accent-100 dark:bg-accent-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-accent-600 dark:text-accent-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">{benefit.title}</h3>
                    <p className="text-sm text-mono-600 dark:text-mono-400">{benefit.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6">
          <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-2">{c.requirementsTitle}</h2>
          <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">
            {c.requirementsSubtitle}
          </p>
          <ul className="space-y-2 text-sm text-mono-600 dark:text-mono-400">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-accent-600 rounded-full"></span>
              {c.reqProfile}
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-accent-600 rounded-full"></span>
              {c.reqAccountAge}
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-accent-600 rounded-full"></span>
              {c.reqContent}
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-accent-600 rounded-full"></span>
              {c.reqPolicy}
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function VerificationPage() {
  const { language } = useLanguage()
  const c = copy[language]

  return (
    <ToolAccessGate
      toolSlug="creator-verification"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={c.howToUse}
    >
      <VerificationPageContent />
    </ToolAccessGate>
  )
}
