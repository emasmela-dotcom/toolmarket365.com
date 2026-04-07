'use client'

import { useState } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { Play, Plus, Trash2, ArrowRight, Zap } from 'lucide-react'

interface WorkflowStep {
  id: string
  tool: string
  action: string
  config?: Record<string, any>
}

function WorkflowAutomationContent() {
  const [workflows, setWorkflows] = useState<Array<{ id: string; name: string; steps: WorkflowStep[] }>>([])
  const [currentWorkflow, setCurrentWorkflow] = useState<{ name: string; steps: WorkflowStep[] }>({ name: '', steps: [] })
  const [showCreateModal, setShowCreateModal] = useState(false)

  const availableTools = [
    { id: 'content-idea', name: 'Content Idea Generator', icon: '💡' },
    { id: 'caption', name: 'AI Caption Generator', icon: '✍️' },
    { id: 'hashtag', name: 'Hashtag Research', icon: '#' },
    { id: 'viral', name: 'Viral Content Predictor', icon: '⭐' },
    { id: 'schedule', name: 'Post Scheduler', icon: '📅' },
    { id: 'repurpose', name: 'Content Repurposer', icon: '🔄' },
    { id: 'analytics', name: 'Analytics Dashboard', icon: '📊' }
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
      alert('Please add a name and at least one step')
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
    
    // Save to localStorage (template-based, no API)
    const stored = localStorage.getItem('workflows')
    const workflowsList = stored ? JSON.parse(stored) : []
    workflowsList.push(newWorkflow)
    localStorage.setItem('workflows', JSON.stringify(workflowsList))
  }

  const executeWorkflow = (workflowId: string) => {
    const workflow = workflows.find(w => w.id === workflowId)
    if (!workflow) return

    // Template-based execution (no API calls)
    alert(`Workflow "${workflow.name}" would execute:\n${workflow.steps.map((s, i) => `${i + 1}. ${availableTools.find(t => t.id === s.tool)?.name || s.tool}`).join('\n')}\n\n(Workflow automation - template-based, no external API usage)`)
  }

  const deleteWorkflow = (workflowId: string) => {
    if (confirm('Delete this workflow?')) {
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
        {/* Documentation */}
        <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-6 mb-6 border border-mono-200 dark:border-mono-700">
          <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">How to Use Workflow Automation</h2>
          <div className="space-y-4 text-sm text-mono-700 dark:text-mono-300">
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">What It Does</h3>
              <p>Create automated workflows that chain multiple tools together. One click executes your entire content creation process.</p>
            </div>
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">How to Use</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li><strong>Create workflow:</strong> Click "Create Workflow" and give it a name</li>
                <li><strong>Add steps:</strong> Click tools to add them to your workflow in order</li>
                <li><strong>Save workflow:</strong> Click "Save" to store your workflow</li>
                <li><strong>Execute:</strong> Click "Run" to execute the entire workflow with one click</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">Example Workflow</h3>
              <p>Content Idea → Caption Generator → Hashtag Research → Viral Predictor → Schedule Post</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">Workflow Automation</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Workflow
          </button>
        </div>

        {/* Existing Workflows */}
        {workflows.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {workflows.map(workflow => (
              <div key={workflow.id} className="bg-white dark:bg-mono-900 rounded-lg p-4 border border-mono-200 dark:border-mono-700">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-mono-950 dark:text-mono-50">{workflow.name}</h3>
                  <button
                    onClick={() => deleteWorkflow(workflow.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-2 mb-3">
                  {workflow.steps.map((step, idx) => {
                    const tool = availableTools.find(t => t.id === step.tool)
                    return (
                      <div key={step.id} className="flex items-center gap-2 text-sm">
                        <span className="text-mono-500">{idx + 1}.</span>
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
                  Run Workflow
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Create Workflow Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowCreateModal(false)}>
            <div className="bg-white dark:bg-mono-900 rounded-lg p-6 w-full max-w-2xl border border-mono-200 dark:border-mono-700" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">Create Workflow</h3>
              
              <input
                type="text"
                value={currentWorkflow.name}
                onChange={(e) => setCurrentWorkflow({ ...currentWorkflow, name: e.target.value })}
                placeholder="Workflow name (e.g., Daily Content Creation)"
                className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded mb-4 bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
              />

              <div className="mb-4">
                <h4 className="font-semibold text-mono-950 dark:text-mono-50 mb-2">Add Tools to Workflow</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {availableTools.map(tool => (
                    <button
                      key={tool.id}
                      onClick={() => addStep(tool.id)}
                      className="px-3 py-2 border border-mono-300 dark:border-mono-700 rounded hover:bg-accent-50 dark:hover:bg-accent-900/20 text-sm flex items-center gap-2"
                    >
                      <span>{tool.icon}</span>
                      <span className="text-xs">{tool.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {currentWorkflow.steps.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-mono-950 dark:text-mono-50 mb-2">Workflow Steps</h4>
                  <div className="space-y-2">
                    {currentWorkflow.steps.map((step, idx) => {
                      const tool = availableTools.find(t => t.id === step.tool)
                      return (
                        <div key={step.id} className="flex items-center justify-between p-2 bg-mono-50 dark:bg-mono-800 rounded">
                          <div className="flex items-center gap-2">
                            <span className="text-mono-500">{idx + 1}.</span>
                            <span>{tool?.icon}</span>
                            <span>{tool?.name || step.tool}</span>
                          </div>
                          <button
                            onClick={() => removeStep(step.id)}
                            className="text-red-600 hover:text-red-700"
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
                  Save Workflow
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    setCurrentWorkflow({ name: '', steps: [] })
                  }}
                  className="px-4 py-2 bg-mono-100 dark:bg-mono-800 text-mono-700 dark:text-mono-300 rounded hover:bg-mono-200 dark:hover:bg-mono-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {workflows.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700">
            <Zap className="h-12 w-12 text-mono-400 mx-auto mb-4" />
            <p className="text-mono-600 dark:text-mono-400">No workflows yet. Create your first workflow to automate your content creation process!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function WorkflowAutomation() {
  const toolDescription = "Create automated workflows that chain multiple tools together. One click executes your entire content creation process from idea to scheduling."
  const howToUse = (
    <div>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        <li><strong>Create workflow:</strong> Click "Create Workflow" and give it a name</li>
        <li><strong>Add steps:</strong> Click tools to add them to your workflow in order</li>
        <li><strong>Save workflow:</strong> Click "Save" to store your workflow</li>
        <li><strong>Execute:</strong> Click "Run" to execute the entire workflow with one click</li>
      </ol>
    </div>
  )

  return (
    <ToolAccessGate
      toolSlug="workflow-automation"
      toolName="Workflow Automation"
      toolDescription={toolDescription}
      howToUse={howToUse}
    >
      <WorkflowAutomationContent />
    </ToolAccessGate>
  )
}
