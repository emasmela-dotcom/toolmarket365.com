// Tool Credit Costs Mapping
// This file maps tool slugs to their credit costs per use

export const TOOL_CREDIT_COSTS: Record<string, number> = {
  // High-value tools (15 credits)
  'competitor-analyzer': 15,
  
  // Medium-high tools (10-12 credits)
  'viral-content-predictor': 10,
  'rate-calculator': 10,
  'content-gap-analyzer': 10,
  'trend-tracker': 12,
  
  // Medium tools (8 credits)
  'advanced-analytics': 8,
  'revenue-tracker': 8,
  'cross-platform-analytics': 8,
  'brand-mention-tracker': 8,
  'sentiment-analyzer': 8,
  'follower-growth-tracker': 8,
  
  // Low-medium tools (5 credits)
  'brand-kit-manager': 5,
}

// Get credit cost for a tool
export function getToolCreditCost(toolSlug: string): number | null {
  return TOOL_CREDIT_COSTS[toolSlug] || null
}

// Check if tool requires credits (is premium)
export function requiresCredits(toolSlug: string): boolean {
  return toolSlug in TOOL_CREDIT_COSTS
}

// Get explanation of what "per use" means for a tool
export function getToolUseExplanation(toolSlug: string): string {
  const explanations: Record<string, string> = {
    'viral-content-predictor': '1 use = Analyze 1 piece of content. You cannot analyze multiple pieces in one use.',
    'competitor-analyzer': '1 use = Analyze 1 competitor. You cannot analyze multiple competitors in one use.',
    'advanced-analytics': '1 use = Generate analytics report for 1 time period. Each report is a separate use.',
    'revenue-tracker': '1 use = Track revenue for 1 time period. Each tracking period is a separate use.',
    'rate-calculator': '1 use = Calculate rates for 1 scenario. Each calculation is a separate use.',
    'content-gap-analyzer': '1 use = Analyze content gaps for 1 competitor comparison. Each comparison is a separate use.',
    'trend-tracker': '1 use = Track trends for 1 topic/category. Each topic is a separate use.',
    'brand-kit-manager': '1 use = Create or update 1 brand kit. Each brand kit is a separate use.',
  }
  
  return explanations[toolSlug] || '1 use = Complete one action with this tool. Each action is a separate use.'
}
