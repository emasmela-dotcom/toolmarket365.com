'use client'

import { useState, useEffect } from 'react'
import { Mail, Calendar, Plus, Trash2, Copy, Check, Clock, User, Building2, Sparkles, Zap, Settings, CheckCircle2, ArrowRight } from 'lucide-react';
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const copy = {
  en: {
    toolName: 'AI Lead Follow-Up Agent',
    toolDescription:
      'Manage leads and generate personalized follow-up emails automatically. Track lead status, schedule follow-ups, and create professional email templates without any external API usage.',
    howToUse: [
      { label: 'Add a lead:', text: 'Click "Add Lead" and enter name, email, company, source, and notes' },
      { label: 'Select a lead:', text: 'Choose a lead from the list to generate a follow-up email' },
      { label: 'Generate email:', text: 'Click "Generate Follow-Up Email" to create a personalized message' },
      { label: 'Review and customize:', text: 'Edit the generated email as needed' },
      { label: 'Copy or send:', text: 'Copy the email to your email client or send directly' },
      { label: 'Track status:', text: 'Update lead status as you progress through your sales funnel' },
    ],
    title: 'AI Lead Follow-Up Agent',
    subtitle: 'Manage leads and generate personalized follow-up messages. Works immediately with zero setup.',
    whatYouGetTitle: 'What You Get Straight From ToolMarket365',
    whatYouGetIntro: "This tool works immediately with zero setup. Here's what you can do right now:",
    featureLeadManagement: 'Lead Management:',
    featureLeadManagementText: 'Add and organize all your leads (brands, clients, collaborators) in one place',
    featureFollowUpGenerator: 'Smart Follow-Up Generator:',
    featureFollowUpGeneratorText: 'Instantly generate personalized follow-up emails based on lead info, source, and conversation stage',
    featureTones: 'Multiple Tones:',
    featureTonesText: 'Choose professional, friendly, or casual messaging styles',
    featureTracking: 'Follow-Up Tracking:',
    featureTrackingText: 'Track which leads need follow-up, when you last contacted them, and conversation status',
    featureCopySend: 'Copy & Send:',
    featureCopySendText: 'Copy generated messages and paste into Gmail, Instagram DMs, Twitter DMs, or any platform you use',
    featureZeroCost: 'Zero Cost:',
    featureZeroCostText: 'No API usage, no setup fees, no external services required',
    howItWorksTitle: 'How This Tool Works',
    howItWorksBody1:
      'All ToolMarket365 tools are fully template-based and work immediately with zero cost to you or us. No external API calls, no setup fees, no usage charges.',
    howItWorksBody2Prefix: 'Optional Enhancement:',
    howItWorksBody2:
      'You can connect your own external services (Twilio, OpenAI, Gmail, etc.) to add advanced automation and capabilities, but you pay those providers directly - ToolMarket365 never charges for API usage.',
    optionalIntegrationsTitle: 'Optional: Power Up With Your Own Integrations',
    optionalIntegrationsIntro:
      "If you want full automation, you can connect your own services. You pay for their usage, not us. Here's what becomes possible:",
    emailAutomationTitle: 'Email Automation',
    emailAutomationText:
      "Connect your Gmail or Outlook account to automatically send follow-up emails on schedule. You pay your email provider's costs.",
    smsFollowUpsTitle: 'SMS Follow-Ups',
    smsFollowUpsText: "Connect your Twilio account to send SMS follow-ups automatically. You pay Twilio's SMS rates directly.",
    aiResponsesTitle: 'AI-Powered Responses',
    aiResponsesText:
      'Connect your own OpenAI or Anthropic API key to generate dynamic, context-aware responses. You pay the AI provider directly.',
    scheduledSequencesTitle: 'Scheduled Sequences',
    scheduledSequencesText:
      'Set up multi-step follow-up sequences that run automatically (e.g., Day 1, Day 3, Day 7) using your connected services.',
    integrationNotePrefix: 'Note:',
    integrationNote:
      'Integration setup is optional and coming soon. For now, use the tool as-is to manage leads and generate messages you can copy and send manually.',
    yourNameLabel: 'Your Name (for email signatures)',
    yourNamePlaceholder: 'Enter your name',
    leadsNeedFollowUp: (n: number) => `${n} lead(s) need follow-up today!`,
    yourLeads: (n: number) => `Your Leads (${n})`,
    addLead: 'Add Lead',
    namePlaceholder: 'Name *',
    emailPlaceholder: 'Email *',
    companyPlaceholder: 'Company (optional)',
    sourcePlaceholder: 'Source (e.g., Brand collaboration)',
    notesPlaceholder: 'Notes (optional)',
    cancel: 'Cancel',
    noLeadsYet: 'No leads yet. Add your first lead to get started!',
    followUpDue: 'Follow-up due',
    followUpCount: (n: number) => `${n} follow-up${n > 1 ? 's' : ''}`,
    generateFollowUpTitle: 'Generate Follow-Up Email',
    followUpTypeLabel: 'Follow-Up Type',
    firstFollowUp: 'First Follow-Up',
    secondFollowUp: 'Second Follow-Up',
    finalFollowUp: 'Final Follow-Up',
    toneLabel: 'Tone',
    toneProfessional: 'Professional',
    toneFriendly: 'Friendly',
    toneCasual: 'Casual',
    customMessageLabel: 'Custom Message (optional)',
    customMessagePlaceholder: 'Add a personal note that will be included as P.S.',
    generateFollowUpButton: 'Generate Follow-Up Email',
    generatedEmail: 'Generated Email',
    copy: 'Copy',
    markAsContacted: 'Mark as Contacted',
    toLabel: 'To:',
    subjectLabel: 'Subject:',
    subjectFollowUp: 'Follow-up:',
    leadDetails: 'Lead Details',
    sourceLabel: 'Source:',
    statusLabel: 'Status:',
    lastContactedLabel: 'Last Contacted:',
    nextFollowUpLabel: 'Next Follow-Up:',
    notesLabel: 'Notes:',
    selectLeadTitle: 'Select a Lead',
    selectLeadBody: 'Choose a lead from the list to generate a personalized follow-up email',
    alertNameEmail: 'Please enter at least name and email',
    confirmDelete: 'Are you sure you want to delete this lead?',
    alertSelectLead: 'Please select a lead first',
    defaultYourName: 'Your Name',
    generalInquiry: 'General inquiry',
    alertEmailCopied: 'Email copied to clipboard!',
    statusNew: 'new',
    statusContacted: 'contacted',
    statusFollowedUp: 'followed-up',
    statusResponded: 'responded',
    statusClosed: 'closed',
  },
  es: {
    toolName: 'Agente de seguimiento de leads con IA',
    toolDescription:
      'Gestiona leads y genera correos de seguimiento personalizados automáticamente. Rastrea el estado, programa seguimientos y crea plantillas profesionales sin usar APIs externas.',
    howToUse: [
      { label: 'Añade un lead:', text: 'Haz clic en "Añadir lead" e ingresa nombre, correo, empresa, origen y notas' },
      { label: 'Selecciona un lead:', text: 'Elige un lead de la lista para generar un correo de seguimiento' },
      { label: 'Genera el correo:', text: 'Haz clic en "Generar correo de seguimiento" para crear un mensaje personalizado' },
      { label: 'Revisa y personaliza:', text: 'Edita el correo generado según necesites' },
      { label: 'Copia o envía:', text: 'Copia el correo a tu cliente de correo o envíalo directamente' },
      { label: 'Rastrea el estado:', text: 'Actualiza el estado del lead a medida que avanzas en tu embudo de ventas' },
    ],
    title: 'Agente de seguimiento de leads con IA',
    subtitle: 'Gestiona leads y genera mensajes de seguimiento personalizados. Funciona al instante sin configuración.',
    whatYouGetTitle: 'Lo que obtienes directamente de ToolMarket365',
    whatYouGetIntro: 'Esta herramienta funciona al instante sin configuración. Esto es lo que puedes hacer ahora mismo:',
    featureLeadManagement: 'Gestión de leads:',
    featureLeadManagementText: 'Añade y organiza todos tus leads (marcas, clientes, colaboradores) en un solo lugar',
    featureFollowUpGenerator: 'Generador inteligente de seguimientos:',
    featureFollowUpGeneratorText: 'Genera al instante correos de seguimiento personalizados según la info del lead, el origen y la etapa de la conversación',
    featureTones: 'Varios tonos:',
    featureTonesText: 'Elige estilos de mensaje profesional, amigable o casual',
    featureTracking: 'Seguimiento de contactos:',
    featureTrackingText: 'Rastrea qué leads necesitan seguimiento, cuándo los contactaste por última vez y el estado de la conversación',
    featureCopySend: 'Copiar y enviar:',
    featureCopySendText: 'Copia los mensajes generados y pégalos en Gmail, DMs de Instagram, DMs de Twitter o cualquier plataforma que uses',
    featureZeroCost: 'Sin costo:',
    featureZeroCostText: 'Sin uso de API, sin tarifas de configuración, sin servicios externos',
    howItWorksTitle: 'Cómo funciona esta herramienta',
    howItWorksBody1:
      'Todas las herramientas de ToolMarket365 están basadas en plantillas y funcionan al instante sin costo para ti ni para nosotros. Sin llamadas a APIs externas, sin tarifas de configuración, sin cargos por uso.',
    howItWorksBody2Prefix: 'Mejora opcional:',
    howItWorksBody2:
      'Puedes conectar tus propios servicios externos (Twilio, OpenAI, Gmail, etc.) para añadir automatización avanzada, pero pagas esos proveedores directamente: ToolMarket365 nunca cobra por uso de API.',
    optionalIntegrationsTitle: 'Opcional: potencia con tus propias integraciones',
    optionalIntegrationsIntro:
      'Si quieres automatización completa, puedes conectar tus propios servicios. Pagas su uso, no a nosotros. Esto es lo que se vuelve posible:',
    emailAutomationTitle: 'Automatización de correo',
    emailAutomationText:
      'Conecta tu cuenta de Gmail u Outlook para enviar correos de seguimiento automáticamente según un horario. Pagas los costos de tu proveedor de correo.',
    smsFollowUpsTitle: 'Seguimientos por SMS',
    smsFollowUpsText: 'Conecta tu cuenta de Twilio para enviar SMS de seguimiento automáticamente. Pagas las tarifas de SMS de Twilio directamente.',
    aiResponsesTitle: 'Respuestas con IA',
    aiResponsesText:
      'Conecta tu propia clave API de OpenAI o Anthropic para generar respuestas dinámicas y contextuales. Pagas al proveedor de IA directamente.',
    scheduledSequencesTitle: 'Secuencias programadas',
    scheduledSequencesText:
      'Configura secuencias de seguimiento de varios pasos que se ejecutan automáticamente (ej. Día 1, Día 3, Día 7) usando tus servicios conectados.',
    integrationNotePrefix: 'Nota:',
    integrationNote:
      'La configuración de integraciones es opcional y llegará pronto. Por ahora, usa la herramienta tal cual para gestionar leads y generar mensajes que puedes copiar y enviar manualmente.',
    yourNameLabel: 'Tu nombre (para firmas de correo)',
    yourNamePlaceholder: 'Ingresa tu nombre',
    leadsNeedFollowUp: (n: number) => `¡${n} lead(s) necesitan seguimiento hoy!`,
    yourLeads: (n: number) => `Tus leads (${n})`,
    addLead: 'Añadir lead',
    namePlaceholder: 'Nombre *',
    emailPlaceholder: 'Correo *',
    companyPlaceholder: 'Empresa (opcional)',
    sourcePlaceholder: 'Origen (ej., colaboración con marca)',
    notesPlaceholder: 'Notas (opcional)',
    cancel: 'Cancelar',
    noLeadsYet: 'Aún no hay leads. ¡Añade tu primer lead para empezar!',
    followUpDue: 'Seguimiento pendiente',
    followUpCount: (n: number) => `${n} seguimiento${n > 1 ? 's' : ''}`,
    generateFollowUpTitle: 'Generar correo de seguimiento',
    followUpTypeLabel: 'Tipo de seguimiento',
    firstFollowUp: 'Primer seguimiento',
    secondFollowUp: 'Segundo seguimiento',
    finalFollowUp: 'Seguimiento final',
    toneLabel: 'Tono',
    toneProfessional: 'Profesional',
    toneFriendly: 'Amigable',
    toneCasual: 'Casual',
    customMessageLabel: 'Mensaje personalizado (opcional)',
    customMessagePlaceholder: 'Añade una nota personal que se incluirá como P.D.',
    generateFollowUpButton: 'Generar correo de seguimiento',
    generatedEmail: 'Correo generado',
    copy: 'Copiar',
    markAsContacted: 'Marcar como contactado',
    toLabel: 'Para:',
    subjectLabel: 'Asunto:',
    subjectFollowUp: 'Seguimiento:',
    leadDetails: 'Detalles del lead',
    sourceLabel: 'Origen:',
    statusLabel: 'Estado:',
    lastContactedLabel: 'Último contacto:',
    nextFollowUpLabel: 'Próximo seguimiento:',
    notesLabel: 'Notas:',
    selectLeadTitle: 'Selecciona un lead',
    selectLeadBody: 'Elige un lead de la lista para generar un correo de seguimiento personalizado',
    alertNameEmail: 'Ingresa al menos nombre y correo',
    confirmDelete: '¿Seguro que quieres eliminar este lead?',
    alertSelectLead: 'Selecciona un lead primero',
    defaultYourName: 'Tu nombre',
    generalInquiry: 'Consulta general',
    alertEmailCopied: '¡Correo copiado al portapapeles!',
    statusNew: 'nuevo',
    statusContacted: 'contactado',
    statusFollowedUp: 'seguimiento enviado',
    statusResponded: 'respondió',
    statusClosed: 'cerrado',
  },
}

interface Lead {
  id: string
  name: string
  email: string
  company?: string
  source: string
  status: 'new' | 'contacted' | 'followed-up' | 'responded' | 'closed'
  notes: string
  createdAt: string
  lastContacted?: string
  followUpDate?: string
  followUpCount: number
}

const followUpTemplates = {
  'first-follow-up': {
    professional: [
      `Hi {name},

I wanted to follow up on my previous message about {source}. I know you're busy, but I believe this could be a great opportunity for both of us.

Would you be open to a quick 15-minute call this week to discuss?

Best regards,
{yourName}`,
      `Hello {name},

Just checking in on my message from last week regarding {source}. I'd love to hear your thoughts when you have a moment.

Looking forward to connecting!

{yourName}`,
      `Hi {name},

I hope this message finds you well. I wanted to follow up on {source} - I think there's real potential here for collaboration.

Are you available for a brief conversation this week?

Thanks,
{yourName}`
    ],
    friendly: [
      `Hey {name}!

Just wanted to circle back on {source} - I'm really excited about the possibility of working together!

Let me know if you'd like to chat. I'm flexible with timing.

Talk soon!
{yourName}`,
      `Hi {name},

Hope you're having a great week! I wanted to follow up on {source} - still very interested in exploring this opportunity.

Would love to hear your thoughts when you get a chance.

Best,
{yourName}`
    ],
    casual: [
      `Hey {name},

Quick follow-up on {source} - still interested? Let me know!

{yourName}`,
      `Hi {name},

Just checking in on {source}. What do you think?

{yourName}`
    ]
  },
  'second-follow-up': {
    professional: [
      `Hi {name},

I understand you're likely swamped, but I wanted to touch base one more time about {source}. 

If the timing isn't right now, I completely understand. Just let me know if you'd like me to reach out again in the future.

Best,
{yourName}`,
      `Hello {name},

I know you're busy, so I'll keep this brief. I wanted to follow up one more time on {source}.

If this isn't the right time, no worries at all. Feel free to reach out when you're ready.

Thanks,
{yourName}`
    ],
    friendly: [
      `Hey {name},

I know you're probably super busy, but wanted to check in one more time on {source}.

If now's not a good time, totally get it! Just let me know if you want to revisit this later.

{yourName}`,
      `Hi {name},

Last follow-up on {source} - I promise! 😊

If the timing isn't right, no pressure at all. Just wanted to make sure you saw this.

{yourName}`
    ],
    casual: [
      `Hey {name},

One last check-in on {source}. If you're not interested, no worries - just let me know!

{yourName}`
    ]
  },
  'final-follow-up': {
    professional: [
      `Hi {name},

This will be my last message about {source}. I wanted to make sure you had all the information you need.

If you're interested in the future, I'm always here. Otherwise, I'll respect your time and won't follow up again.

Best of luck with everything!

{yourName}`,
      `Hello {name},

Final follow-up on {source}. I understand if the timing isn't right, and I won't reach out again unless you reach out first.

Wishing you all the best!

{yourName}`
    ],
    friendly: [
      `Hey {name},

Last message on {source} - I promise! I know you're busy, so I'll leave you alone after this.

If you ever want to revisit this, just let me know. Otherwise, wishing you all the best!

{yourName}`,
      `Hi {name},

Final check-in on {source}. If you're not interested, totally cool - I won't bug you again!

Take care,
{yourName}`
    ],
    casual: [
      `Hey {name},

Last message on {source}. If you're interested, great! If not, no worries - I'll stop here.

{yourName}`
    ]
  }
}

function AILeadFollowUpAgentContent({ c }: { c: typeof copy.en }) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [showAddLead, setShowAddLead] = useState(false)
  const [generatedEmail, setGeneratedEmail] = useState('')
  const [tone, setTone] = useState<'professional' | 'friendly' | 'casual'>('professional')
  const [followUpType, setFollowUpType] = useState<'first-follow-up' | 'second-follow-up' | 'final-follow-up'>('first-follow-up')
  const [yourName, setYourName] = useState('')
  const [customMessage, setCustomMessage] = useState('')

  // Form fields for new lead
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    company: '',
    source: '',
    notes: ''
  })

  useEffect(() => {
    // Load leads from localStorage
    const savedLeads = localStorage.getItem('leadFollowUpLeads')
    if (savedLeads) {
      setLeads(JSON.parse(savedLeads))
    }
    
    // Load your name
    const savedName = localStorage.getItem('leadFollowUpYourName')
    if (savedName) {
      setYourName(savedName)
    }
  }, [])

  useEffect(() => {
    // Save leads to localStorage
    if (leads.length > 0) {
      localStorage.setItem('leadFollowUpLeads', JSON.stringify(leads))
    }
  }, [leads])

  useEffect(() => {
    // Save your name
    if (yourName) {
      localStorage.setItem('leadFollowUpYourName', yourName)
    }
  }, [yourName])

  const statusLabel = (status: Lead['status']) => {
    switch (status) {
      case 'new': return c.statusNew
      case 'contacted': return c.statusContacted
      case 'followed-up': return c.statusFollowedUp
      case 'responded': return c.statusResponded
      case 'closed': return c.statusClosed
      default: return status
    }
  }

  const addLead = () => {
    if (!newLead.name || !newLead.email) {
      alert(c.alertNameEmail)
      return
    }

    const lead: Lead = {
      id: Date.now().toString(),
      name: newLead.name,
      email: newLead.email,
      company: newLead.company || undefined,
      source: newLead.source || c.generalInquiry,
      status: 'new',
      notes: newLead.notes,
      createdAt: new Date().toISOString(),
      followUpCount: 0
    }

    setLeads([...leads, lead])
    setNewLead({ name: '', email: '', company: '', source: '', notes: '' })
    setShowAddLead(false)
  }

  const deleteLead = (id: string) => {
    if (confirm(c.confirmDelete)) {
      setLeads(leads.filter(lead => lead.id !== id))
      if (selectedLead?.id === id) {
        setSelectedLead(null)
        setGeneratedEmail('')
      }
    }
  }

  const generateFollowUp = () => {
    if (!selectedLead) {
      alert(c.alertSelectLead)
      return
    }

    const templates = followUpTemplates[followUpType][tone]
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)]
    
    let email = randomTemplate
      .replace(/{name}/g, selectedLead.name)
      .replace(/{source}/g, selectedLead.source)
      .replace(/{yourName}/g, yourName || c.defaultYourName)

    if (customMessage) {
      email += `\n\nP.S. ${customMessage}`
    }

    setGeneratedEmail(email)
  }

  const copyEmail = () => {
    if (generatedEmail) {
      navigator.clipboard.writeText(generatedEmail)
      alert(c.alertEmailCopied)
    }
  }

  const markAsContacted = () => {
    if (!selectedLead) return

    const updatedLeads = leads.map(lead => 
      lead.id === selectedLead.id
        ? {
            ...lead,
            status: lead.status === 'new' ? 'contacted' : 'followed-up',
            lastContacted: new Date().toISOString(),
            followUpCount: lead.followUpCount + 1,
            followUpDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days from now
          }
        : lead
    )

    setLeads(updatedLeads as Lead[])
    setSelectedLead(updatedLeads.find(l => l.id === selectedLead.id) as Lead | null)
    setGeneratedEmail('')
  }

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'contacted': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'followed-up': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'responded': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLeadsNeedingFollowUp = () => {
    const now = new Date()
    return leads.filter(lead => {
      if (lead.followUpDate) {
        const followUpDate = new Date(lead.followUpDate)
        return followUpDate <= now && lead.status !== 'responded' && lead.status !== 'closed'
      }
      return false
    })
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Sparkles className="h-8 w-8 text-accent-600" />
            <h1 className="text-4xl font-bold text-mono-950 dark:text-mono-50">
              {c.title}
            </h1>
          </div>
          <p className="text-lg text-mono-600 dark:text-mono-400 mb-6">
            {c.subtitle}
          </p>

          {/* What This Tool Does - Out of the Box */}
          <div className="bg-gradient-to-r from-accent-50 to-blue-50 dark:from-accent-900/20 dark:to-blue-900/20 rounded-lg p-6 mb-6 border-2 border-accent-200 dark:border-accent-800">
            <div className="flex items-start space-x-3 mb-4">
              <CheckCircle2 className="h-6 w-6 text-accent-600 dark:text-accent-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-2">
                  {c.whatYouGetTitle}
                </h2>
                <p className="text-mono-700 dark:text-mono-300 mb-4">
                  {c.whatYouGetIntro}
                </p>
                <ul className="space-y-2 text-mono-700 dark:text-mono-300">
                  <li className="flex items-start space-x-2">
                    <span className="text-accent-600 dark:text-accent-400 font-bold">•</span>
                    <span><strong>{c.featureLeadManagement}</strong> {c.featureLeadManagementText}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-accent-600 dark:text-accent-400 font-bold">•</span>
                    <span><strong>{c.featureFollowUpGenerator}</strong> {c.featureFollowUpGeneratorText}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-accent-600 dark:text-accent-400 font-bold">•</span>
                    <span><strong>{c.featureTones}</strong> {c.featureTonesText}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-accent-600 dark:text-accent-400 font-bold">•</span>
                    <span><strong>{c.featureTracking}</strong> {c.featureTrackingText}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-accent-600 dark:text-accent-400 font-bold">•</span>
                    <span><strong>{c.featureCopySend}</strong> {c.featureCopySendText}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-accent-600 dark:text-accent-400 font-bold">•</span>
                    <span><strong>{c.featureZeroCost}</strong> {c.featureZeroCostText}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* How It Works - Template-Based */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-400 dark:border-blue-600 rounded-lg p-6 mb-6">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-blue-900 dark:text-blue-200 mb-2">
                  {c.howItWorksTitle}
                </h2>
                <p className="text-blue-800 dark:text-blue-300 mb-3">
                  <strong>{c.howItWorksBody1}</strong>
                </p>
                <p className="text-blue-800 dark:text-blue-300">
                  <strong>{c.howItWorksBody2Prefix}</strong> {c.howItWorksBody2}
                </p>
              </div>
            </div>
          </div>

          {/* Optional Advanced Setup */}
          <div className="bg-mono-100 dark:bg-mono-800 rounded-lg p-6 mb-6 border border-mono-300 dark:border-mono-700">
            <div className="flex items-start space-x-3">
              <Zap className="h-6 w-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-2">
                  {c.optionalIntegrationsTitle}
                </h2>
                <p className="text-mono-700 dark:text-mono-300 mb-4">
                  {c.optionalIntegrationsIntro}
                </p>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white dark:bg-mono-900 rounded-lg p-4 border border-mono-200 dark:border-mono-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-mono-950 dark:text-mono-50">{c.emailAutomationTitle}</h3>
                    </div>
                    <p className="text-sm text-mono-600 dark:text-mono-400">
                      {c.emailAutomationText}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-mono-900 rounded-lg p-4 border border-mono-200 dark:border-mono-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-mono-950 dark:text-mono-50">{c.smsFollowUpsTitle}</h3>
                    </div>
                    <p className="text-sm text-mono-600 dark:text-mono-400">
                      {c.smsFollowUpsText}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-mono-900 rounded-lg p-4 border border-mono-200 dark:border-mono-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                      <h3 className="font-semibold text-mono-950 dark:text-mono-50">{c.aiResponsesTitle}</h3>
                    </div>
                    <p className="text-sm text-mono-600 dark:text-mono-400">
                      {c.aiResponsesText}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-mono-900 rounded-lg p-4 border border-mono-200 dark:border-mono-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <Settings className="h-5 w-5 text-orange-600" />
                      <h3 className="font-semibold text-mono-950 dark:text-mono-50">{c.scheduledSequencesTitle}</h3>
                    </div>
                    <p className="text-sm text-mono-600 dark:text-mono-400">
                      {c.scheduledSequencesText}
                    </p>
                  </div>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg p-3">
                  <p className="text-sm text-yellow-900 dark:text-yellow-200">
                    <strong>{c.integrationNotePrefix}</strong> {c.integrationNote}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Your Name Setting */}
        <div className="bg-white dark:bg-mono-900 rounded-lg p-4 mb-6 border border-mono-200 dark:border-mono-700">
          <label className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">
            {c.yourNameLabel}
          </label>
          <input
            type="text"
            value={yourName}
            onChange={(e) => setYourName(e.target.value)}
            placeholder={c.yourNamePlaceholder}
            className="w-full max-w-md px-4 py-2 border border-mono-300 dark:border-mono-600 rounded-lg bg-white dark:bg-mono-800 text-mono-900 dark:text-mono-50"
          />
        </div>

        {/* Leads Needing Follow-Up Alert */}
        {getLeadsNeedingFollowUp().length > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <p className="font-semibold text-yellow-900 dark:text-yellow-200">
                {c.leadsNeedFollowUp(getLeadsNeedingFollowUp().length)}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leads List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50">
                  {c.yourLeads(leads.length)}
                </h2>
                <button
                  onClick={() => setShowAddLead(!showAddLead)}
                  className="flex items-center space-x-2 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>{c.addLead}</span>
                </button>
              </div>

              {showAddLead && (
                <div className="mb-4 p-4 bg-mono-50 dark:bg-mono-800 rounded-lg border border-mono-200 dark:border-mono-700">
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder={c.namePlaceholder}
                      value={newLead.name}
                      onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                      className="w-full px-3 py-2 border border-mono-300 dark:border-mono-600 rounded-lg bg-white dark:bg-mono-900 text-mono-900 dark:text-mono-50 text-sm"
                    />
                    <input
                      type="email"
                      placeholder={c.emailPlaceholder}
                      value={newLead.email}
                      onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                      className="w-full px-3 py-2 border border-mono-300 dark:border-mono-600 rounded-lg bg-white dark:bg-mono-900 text-mono-900 dark:text-mono-50 text-sm"
                    />
                    <input
                      type="text"
                      placeholder={c.companyPlaceholder}
                      value={newLead.company}
                      onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                      className="w-full px-3 py-2 border border-mono-300 dark:border-mono-600 rounded-lg bg-white dark:bg-mono-900 text-mono-900 dark:text-mono-50 text-sm"
                    />
                    <input
                      type="text"
                      placeholder={c.sourcePlaceholder}
                      value={newLead.source}
                      onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                      className="w-full px-3 py-2 border border-mono-300 dark:border-mono-600 rounded-lg bg-white dark:bg-mono-900 text-mono-900 dark:text-mono-50 text-sm"
                    />
                    <textarea
                      placeholder={c.notesPlaceholder}
                      value={newLead.notes}
                      onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-mono-300 dark:border-mono-600 rounded-lg bg-white dark:bg-mono-900 text-mono-900 dark:text-mono-50 text-sm"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={addLead}
                        className="flex-1 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors text-sm"
                      >
                        {c.addLead}
                      </button>
                      <button
                        onClick={() => setShowAddLead(false)}
                        className="px-4 py-2 bg-mono-200 dark:bg-mono-700 text-mono-900 dark:text-mono-50 rounded-lg hover:bg-mono-300 dark:hover:bg-mono-600 transition-colors text-sm"
                      >
                        {c.cancel}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {leads.length === 0 ? (
                  <p className="text-mono-500 dark:text-mono-500 text-sm text-center py-8">
                    {c.noLeadsYet}
                  </p>
                ) : (
                  leads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedLead?.id === lead.id
                          ? 'border-accent-500 bg-accent-50 dark:bg-accent-900/20'
                          : 'border-mono-200 dark:border-mono-700 hover:border-accent-300 dark:hover:border-accent-700'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <User className="h-4 w-4 text-mono-500" />
                            <h3 className="font-semibold text-mono-950 dark:text-mono-50">
                              {lead.name}
                            </h3>
                          </div>
                          {lead.company && (
                            <div className="flex items-center space-x-2 mb-1">
                              <Building2 className="h-3 w-3 text-mono-500" />
                              <span className="text-sm text-mono-600 dark:text-mono-400">
                                {lead.company}
                              </span>
                            </div>
                          )}
                          <p className="text-xs text-mono-500 dark:text-mono-500 mb-2">
                            {lead.email}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteLead(lead.id)
                          }}
                          className="p-1 text-red-600 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded ${getStatusColor(lead.status)}`}>
                          {statusLabel(lead.status)}
                        </span>
                        {lead.followUpCount > 0 && (
                          <span className="text-xs text-mono-500">
                            {c.followUpCount(lead.followUpCount)}
                          </span>
                        )}
                      </div>
                      {lead.followUpDate && new Date(lead.followUpDate) <= new Date() && lead.status !== 'responded' && (
                        <div className="mt-2 flex items-center space-x-1 text-xs text-yellow-600 dark:text-yellow-400">
                          <Clock className="h-3 w-3" />
                          <span>{c.followUpDue}</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Email Generator */}
          <div className="lg:col-span-2">
            {selectedLead ? (
              <div className="space-y-6">
                <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6">
                  <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">
                    {c.generateFollowUpTitle}
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">
                        {c.followUpTypeLabel}
                      </label>
                      <select
                        value={followUpType}
                        onChange={(e) => setFollowUpType(e.target.value as any)}
                        className="w-full px-4 py-2 border border-mono-300 dark:border-mono-600 rounded-lg bg-white dark:bg-mono-800 text-mono-900 dark:text-mono-50"
                      >
                        <option value="first-follow-up">{c.firstFollowUp}</option>
                        <option value="second-follow-up">{c.secondFollowUp}</option>
                        <option value="final-follow-up">{c.finalFollowUp}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">
                        {c.toneLabel}
                      </label>
                      <select
                        value={tone}
                        onChange={(e) => setTone(e.target.value as any)}
                        className="w-full px-4 py-2 border border-mono-300 dark:border-mono-600 rounded-lg bg-white dark:bg-mono-800 text-mono-900 dark:text-mono-50"
                      >
                        <option value="professional">{c.toneProfessional}</option>
                        <option value="friendly">{c.toneFriendly}</option>
                        <option value="casual">{c.toneCasual}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-2">
                        {c.customMessageLabel}
                      </label>
                      <textarea
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        placeholder={c.customMessagePlaceholder}
                        rows={3}
                        className="w-full px-4 py-2 border border-mono-300 dark:border-mono-600 rounded-lg bg-white dark:bg-mono-800 text-mono-900 dark:text-mono-50"
                      />
                    </div>

                    <button
                      onClick={generateFollowUp}
                      className="w-full px-6 py-3 bg-accent-600 text-white font-semibold rounded-lg hover:bg-accent-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Mail className="h-5 w-5" />
                      <span>{c.generateFollowUpButton}</span>
                    </button>
                  </div>
                </div>

                {generatedEmail && (
                  <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-mono-950 dark:text-mono-50">
                        {c.generatedEmail}
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={copyEmail}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Copy className="h-4 w-4" />
                          <span>{c.copy}</span>
                        </button>
                        <button
                          onClick={markAsContacted}
                          className="flex items-center space-x-2 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
                        >
                          <Check className="h-4 w-4" />
                          <span>{c.markAsContacted}</span>
                        </button>
                      </div>
                    </div>
                    <div className="bg-mono-50 dark:bg-mono-800 rounded-lg p-4 border border-mono-200 dark:border-mono-700">
                      <pre className="whitespace-pre-wrap text-sm text-mono-800 dark:text-mono-200 font-sans">
                        {c.toLabel} {selectedLead.email}
                        {'\n'}{c.subjectLabel} {c.subjectFollowUp} {selectedLead.source}
                        {'\n\n'}
                        {generatedEmail}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Lead Details */}
                <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-6">
                  <h3 className="text-lg font-semibold text-mono-950 dark:text-mono-50 mb-4">
                    {c.leadDetails}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-mono-700 dark:text-mono-300">{c.sourceLabel}</span>{' '}
                      <span className="text-mono-600 dark:text-mono-400">{selectedLead.source}</span>
                    </div>
                    <div>
                      <span className="font-medium text-mono-700 dark:text-mono-300">{c.statusLabel}</span>{' '}
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(selectedLead.status)}`}>
                        {statusLabel(selectedLead.status)}
                      </span>
                    </div>
                    {selectedLead.lastContacted && (
                      <div>
                        <span className="font-medium text-mono-700 dark:text-mono-300">{c.lastContactedLabel}</span>{' '}
                        <span className="text-mono-600 dark:text-mono-400">
                          {new Date(selectedLead.lastContacted).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {selectedLead.followUpDate && (
                      <div>
                        <span className="font-medium text-mono-700 dark:text-mono-300">{c.nextFollowUpLabel}</span>{' '}
                        <span className="text-mono-600 dark:text-mono-400">
                          {new Date(selectedLead.followUpDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {selectedLead.notes && (
                      <div>
                        <span className="font-medium text-mono-700 dark:text-mono-300">{c.notesLabel}</span>
                        <p className="text-mono-600 dark:text-mono-400 mt-1">{selectedLead.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 p-12 text-center">
                <Mail className="h-16 w-16 text-mono-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-mono-950 dark:text-mono-50 mb-2">
                  {c.selectLeadTitle}
                </h3>
                <p className="text-mono-600 dark:text-mono-400">
                  {c.selectLeadBody}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AILeadFollowUpAgent() {
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
      toolSlug="ai-lead-follow-up-agent"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <AILeadFollowUpAgentContent c={c} />
    </ToolAccessGate>
  )
}
