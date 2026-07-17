'use client'

import { useState } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { Play, Plus, Trash2, ArrowRight, Zap } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface WorkflowStep {
  id: string
  tool: string
  action: string
  config?: Record<string, any>
}

const copy = {
  en: {
    toolName: 'Workflow Automation',
    toolDescription:
      'Create automated workflows that chain multiple tools together. One click executes your entire content creation process from idea to scheduling.',
    howToUse: [
      { label: 'Create workflow:', text: 'Click "Create Workflow" and give it a name' },
      { label: 'Add steps:', text: 'Click tools to add them to your workflow in order' },
      { label: 'Save workflow:', text: 'Click "Save" to store your workflow' },
      { label: 'Execute:', text: 'Click "Run" to execute the entire workflow with one click' },
    ],
    docTitle: 'How to Use Workflow Automation',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      'Create automated workflows that chain multiple tools together. One click executes your entire content creation process.',
    howToUseInner: 'How to Use',
    howToUseSteps: [
      { label: 'Create workflow:', text: 'Click "Create Workflow" and give it a name' },
      { label: 'Add steps:', text: 'Click tools to add them to your workflow in order' },
      { label: 'Save workflow:', text: 'Click "Save" to store your workflow' },
      { label: 'Execute:', text: 'Click "Run" to execute the entire workflow with one click' },
    ],
    exampleWorkflow: 'Example Workflow',
    exampleFlow: 'Content Idea → Caption Generator → Hashtag Research → Viral Predictor → Schedule Post',
    title: 'Workflow Automation',
    createWorkflow: 'Create Workflow',
    runWorkflow: 'Run Workflow',
    createModalTitle: 'Create Workflow',
    namePlaceholder: 'Workflow name (e.g., Daily Content Creation)',
    addTools: 'Add Tools to Workflow',
    workflowSteps: 'Workflow Steps',
    saveWorkflow: 'Save Workflow',
    cancel: 'Cancel',
    emptyState: 'No workflows yet. Create your first workflow to automate your content creation process!',
    alertNameAndStep: 'Please add a name and at least one step',
    confirmDelete: 'Delete this workflow?',
    executeIntro: (name: string) => `Workflow "${name}" would execute:`,
    executeFooter: '(Workflow automation - template-based, no external API usage)',
    tools: {
      'content-idea': 'Content Idea Generator',
      caption: 'AI Caption Generator',
      hashtag: 'Hashtag Research',
      viral: 'Viral Content Predictor',
      schedule: 'Post Scheduler',
      repurpose: 'Content Repurposer',
      analytics: 'Analytics Dashboard',
    },
  },
  es: {
    toolName: 'Automatización de flujos de trabajo',
    toolDescription:
      'Crea flujos automatizados que encadenan varias herramientas. Un clic ejecuta todo tu proceso de creación de contenido, de la idea a la programación.',
    howToUse: [
      { label: 'Crear flujo:', text: 'Haz clic en "Crear flujo" y ponle un nombre' },
      { label: 'Añadir pasos:', text: 'Haz clic en las herramientas para añadirlas a tu flujo en orden' },
      { label: 'Guardar flujo:', text: 'Haz clic en "Guardar" para almacenar tu flujo' },
      { label: 'Ejecutar:', text: 'Haz clic en "Ejecutar" para lanzar todo el flujo con un clic' },
    ],
    docTitle: 'Cómo usar la automatización de flujos',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Crea flujos automatizados que encadenan varias herramientas. Un clic ejecuta todo tu proceso de creación de contenido.',
    howToUseInner: 'Cómo usar',
    howToUseSteps: [
      { label: 'Crear flujo:', text: 'Haz clic en "Crear flujo" y ponle un nombre' },
      { label: 'Añadir pasos:', text: 'Haz clic en las herramientas para añadirlas a tu flujo en orden' },
      { label: 'Guardar flujo:', text: 'Haz clic en "Guardar" para almacenar tu flujo' },
      { label: 'Ejecutar:', text: 'Haz clic en "Ejecutar" para lanzar todo el flujo con un clic' },
    ],
    exampleWorkflow: 'Ejemplo de flujo',
    exampleFlow: 'Idea de contenido → Generador de pies de foto → Investigación de hashtags → Predictor viral → Programar publicación',
    title: 'Automatización de flujos de trabajo',
    createWorkflow: 'Crear flujo',
    runWorkflow: 'Ejecutar flujo',
    createModalTitle: 'Crear flujo',
    namePlaceholder: 'Nombre del flujo (p. ej., Creación diaria de contenido)',
    addTools: 'Añadir herramientas al flujo',
    workflowSteps: 'Pasos del flujo',
    saveWorkflow: 'Guardar flujo',
    cancel: 'Cancelar',
    emptyState: 'Aún no hay flujos. ¡Crea tu primer flujo para automatizar tu proceso de creación de contenido!',
    alertNameAndStep: 'Por favor añade un nombre y al menos un paso',
    confirmDelete: '¿Eliminar este flujo?',
    executeIntro: (name: string) => `El flujo "${name}" ejecutaría:`,
    executeFooter: '(Automatización de flujos — basada en plantillas, sin uso de API externa)',
    tools: {
      'content-idea': 'Generador de ideas de contenido',
      caption: 'Generador de pies de foto con IA',
      hashtag: 'Investigación de hashtags',
      viral: 'Predictor de contenido viral',
      schedule: 'Programador de publicaciones',
      repurpose: 'Reutilizador de contenido',
      analytics: 'Panel de analíticas',
    },
  },
}

function WorkflowAutomationContent({ c }: { c: typeof copy.en }) {
  const [workflows, setWorkflows] = useState<Array<{ id: string; name: string; steps: WorkflowStep[] }>>([])
  const [currentWorkflow, setCurrentWorkflow] = useState<{ name: string; steps: WorkflowStep[] }>({ name: '', steps: [] })
  const [showCreateModal, setShowCreateModal] = useState(false)

  const availableTools = [
    { id: 'content-idea', name: c.tools['content-idea'], icon: '💡' },
    { id: 'caption', name: c.tools.caption, icon: '✍️' },
    { id: 'hashtag', name: c.tools.hashtag, icon: '#' },
    { id: 'viral', name: c.tools.viral, icon: '⭐' },
    { id: 'schedule', name: c.tools.schedule, icon: '📅' },
    { id: 'repurpose', name: c.tools.repurpose, icon: '🔄' },
    { id: 'analytics', name: c.tools.analytics, icon: '📊' }
  ]

  const addStep = (toolId: string) => {
    const tool = availableTools.find(t => t.id === toolId)
    if (!tool) return

    const newStep: WorkflowStep = {
      id: Date.now().toString(),
      tool: toolId,
      action: 'generate',
      config: {}
    }

    setCurrentWorkflow({
      ...currentWorkflow,
      steps: [...currentWorkflow.steps, newStep]
    })
  }

  const removeStep = (stepId: string) => {
    setCurrentWorkflow({
      ...currentWorkflow,
      steps: currentWorkflow.steps.filter(s => s.id !== stepId)
    })
  }

  const saveWorkflow = () => {
    if (!currentWorkflow.name.trim() || currentWorkflow.steps.length === 0) {
      alert(c.alertNameAndStep)
      return
    }

    const newWorkflow = {
      id: Date.now().toString(),
      name: currentWorkflow.name,
      steps: currentWorkflow.steps
    }

    setWorkflows([...workflows, newWorkflow])
    setCurrentWorkflow({ name: '', steps: [] })
    setShowCreateModal(false)

    const stored = localStorage.getItem('workflows')
    const workflowsList = stored ? JSON.parse(stored) : []
    workflowsList.push(newWorkflow)
    localStorage.setItem('workflows', JSON.stringify(workflowsList))
  }

  const executeWorkflow = (workflowId: string) => {
    const workflow = workflows.find(w => w.id === workflowId)
    if (!workflow) return

    alert(`${c.executeIntro(workflow.name)}\n${workflow.steps.map((s, i) => `${i + 1}. ${availableTools.find(t => t.id === s.tool)?.name || s.tool}`).join('\n')}\n\n${c.executeFooter}`)
  }

  const deleteWorkflow = (workflowId: string) => {
    if (confirm(c.confirmDelete)) {
      setWorkflows(workflows.filter(w => w.id !== workflowId))
      const stored = localStorage.getItem('workflows')
      if (stored) {
        const workflowsList = JSON.parse(stored).filter((w: any) => w.id !== workflowId)
        localStorage.setItem('workflows', JSON.stringify(workflowsList))
      }
    }
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-6 mb-6 border border-mono-200 dark:border-mono-700">
          <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">{c.docTitle}</h2>
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
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">{c.exampleWorkflow}</h3>
              <p>{c.exampleFlow}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">{c.title}</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {c.createWorkflow}
          </button>
        </div>

        {workflows.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {workflows.map(workflow => (
              <div key={workflow.id} className="bg-white dark:bg-mono-900 rounded-lg p-4 border border-mono-200 dark:border-mono-700">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-mono-950 dark:text-mono-50">{workflow.name}</h3>
                  <button
                    onClick={() => deleteWorkflow(workflow.id)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-2 mb-3">
                  {workflow.steps.map((step, idx) => {
                    const tool = availableTools.find(t => t.id === step.tool)
                    return (
                      <div key={step.id} className="flex items-center gap-2 text-sm">
                        <span className="text-mono-500 dark:text-mono-400">{idx + 1}.</span>
                        <span>{tool?.icon}</span>
                        <span className="text-mono-700 dark:text-mono-300">{tool?.name || step.tool}</span>
                        {idx < workflow.steps.length - 1 && <ArrowRight className="h-3 w-3 text-mono-400" />}
                      </div>
                    )
                  })}
                </div>
                <button
                  onClick={() => executeWorkflow(workflow.id)}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  {c.runWorkflow}
                </button>
              </div>
            ))}
          </div>
        )}

        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowCreateModal(false)}>
            <div className="bg-white dark:bg-mono-900 rounded-lg p-6 w-full max-w-2xl border border-mono-200 dark:border-mono-700" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">{c.createModalTitle}</h3>

              <input
                type="text"
                value={currentWorkflow.name}
                onChange={(e) => setCurrentWorkflow({ ...currentWorkflow, name: e.target.value })}
                placeholder={c.namePlaceholder}
                className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded mb-4 bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
              />

              <div className="mb-4">
                <h4 className="font-semibold text-mono-950 dark:text-mono-50 mb-2">{c.addTools}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {availableTools.map(tool => (
                    <button
                      key={tool.id}
                      onClick={() => addStep(tool.id)}
                      className="px-3 py-2 border border-mono-300 dark:border-mono-700 rounded hover:bg-accent-50 dark:hover:bg-accent-900/20 text-sm flex items-center gap-2 text-mono-700 dark:text-mono-300"
                    >
                      <span>{tool.icon}</span>
                      <span className="text-xs">{tool.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {currentWorkflow.steps.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-mono-950 dark:text-mono-50 mb-2">{c.workflowSteps}</h4>
                  <div className="space-y-2">
                    {currentWorkflow.steps.map((step, idx) => {
                      const tool = availableTools.find(t => t.id === step.tool)
                      return (
                        <div key={step.id} className="flex items-center justify-between p-2 bg-mono-50 dark:bg-mono-800 rounded">
                          <div className="flex items-center gap-2 text-mono-700 dark:text-mono-300">
                            <span className="text-mono-500 dark:text-mono-400">{idx + 1}.</span>
                            <span>{tool?.icon}</span>
                            <span>{tool?.name || step.tool}</span>
                          </div>
                          <button
                            onClick={() => removeStep(step.id)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={saveWorkflow}
                  className="flex-1 px-4 py-2 bg-accent-600 text-white rounded hover:bg-accent-700"
                >
                  {c.saveWorkflow}
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    setCurrentWorkflow({ name: '', steps: [] })
                  }}
                  className="px-4 py-2 bg-mono-100 dark:bg-mono-800 text-mono-700 dark:text-mono-300 rounded hover:bg-mono-200 dark:hover:bg-mono-700"
                >
                  {c.cancel}
                </button>
              </div>
            </div>
          </div>
        )}

        {workflows.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700">
            <Zap className="h-12 w-12 text-mono-400 mx-auto mb-4" />
            <p className="text-mono-600 dark:text-mono-400">{c.emptyState}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function WorkflowAutomation() {
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
      toolSlug="workflow-automation"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <WorkflowAutomationContent c={c} />
    </ToolAccessGate>
  )
}
