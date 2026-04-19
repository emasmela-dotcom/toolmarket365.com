export type CritiqueInput = {
  headline: string;
  subheadline?: string;
  body?: string;
  cta: string;
  audience?: string;
};

export type CritiqueOutput = {
  score: number;
  breakdown: {
    clarity: number;
    value: number;
    urgency: number;
    trust: number;
    conversion: number;
  };
  issues: string[];
  suggestions: string[];
  improvedVersion: {
    headline: string;
    subheadline: string;
    cta: string;
  };
};

export function critiqueLandingPage(input: CritiqueInput): CritiqueOutput {
  let score = 0;

  const breakdown = {
    clarity: 0,
    value: 0,
    urgency: 0,
    trust: 0,
    conversion: 0,
  };

  const issues: string[] = [];
  const suggestions: string[] = [];

  // --- CLARITY ---
  if (input.headline.length < 6) {
    issues.push("Headline is too short or vague.");
  } else {
    breakdown.clarity += 20;
  }

  if (!input.headline.toLowerCase().includes("you")) {
    suggestions.push("Make the headline more customer-focused (use 'you').");
  } else {
    breakdown.clarity += 10;
  }

  // --- VALUE ---
  if (!input.headline.match(/(save|grow|get|build|increase|automate)/i)) {
    issues.push("Headline lacks a clear benefit.");
  } else {
    breakdown.value += 20;
  }

  // --- URGENCY ---
  if (!input.cta.match(/(now|today|instant|start)/i)) {
    suggestions.push("Add urgency to your CTA.");
  } else {
    breakdown.urgency += 20;
  }

  // --- TRUST ---
  if (!input.body || input.body.length < 50) {
    issues.push("Not enough supporting content to build trust.");
  } else {
    breakdown.trust += 20;
  }

  // --- CONVERSION ---
  if (input.cta.length < 3) {
    issues.push("CTA is too weak.");
  } else {
    breakdown.conversion += 20;
  }

  // --- FINAL SCORE ---
  score =
    breakdown.clarity +
    breakdown.value +
    breakdown.urgency +
    breakdown.trust +
    breakdown.conversion;

  // --- IMPROVED VERSION ---
  const improvedHeadline = `Get better results faster without the usual struggle`;
  const improvedSubheadline = `Designed for ${input.audience || "people like you"} who want real outcomes`;
  const improvedCTA = `Start Now`;

  suggestions.push("Use a stronger benefit-driven headline.");
  suggestions.push("Make your CTA action-oriented and specific.");
  suggestions.push("Add social proof (testimonials, numbers, logos).");

  return {
    score,
    breakdown,
    issues,
    suggestions,
    improvedVersion: {
      headline: improvedHeadline,
      subheadline: improvedSubheadline,
      cta: improvedCTA,
    },
  };
}
