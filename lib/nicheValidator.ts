export type NicheInput = {
  niche: string;
  audience: string;
};

export type NicheResult = {
  score: number;
  verdict: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  monetizationIdeas: string[];
};

const painKeywords = [
  "lose",
  "fix",
  "help",
  "grow",
  "scale",
  "make money",
  "save time",
  "burn fat",
  "get clients",
  "improve",
];

const buyerKeywords = [
  "business",
  "agency",
  "creator",
  "freelancer",
  "coach",
  "entrepreneur",
  "marketer",
];

export function validateNiche(input: NicheInput): NicheResult {
  let score = 0;

  const { niche, audience } = input;
  const lower = niche.toLowerCase();

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestions: string[] = [];

  // 1. Pain detection
  const hasPain = painKeywords.some((word) => lower.includes(word));
  if (hasPain) {
    score += 30;
    strengths.push("Clear problem/pain point detected");
  } else {
    weaknesses.push("No strong pain point detected");
    suggestions.push("Add a clear problem (e.g. 'get clients', 'lose weight')");
  }

  // 2. Buying audience
  const isBuyer = buyerKeywords.some((word) =>
    audience.toLowerCase().includes(word)
  );
  if (isBuyer) {
    score += 25;
    strengths.push("Audience is likely to spend money");
  } else {
    weaknesses.push("Audience may not be strong buyers");
    suggestions.push("Target people who make money or need ROI");
  }

  // 3. Specificity
  if (niche.length > 20) {
    score += 20;
    strengths.push("Niche is specific enough");
  } else {
    weaknesses.push("Niche is too broad");
    suggestions.push("Make it more specific (who + result)");
  }

  // 4. Outcome clarity
  if (lower.includes("how") || hasPain) {
    score += 15;
    strengths.push("Outcome/result is somewhat clear");
  } else {
    weaknesses.push("Outcome unclear");
    suggestions.push("Define a clear transformation");
  }

  // 5. Trend / opportunity bonus
  if (
    lower.includes("ai") ||
    lower.includes("automation") ||
    lower.includes("content")
  ) {
    score += 10;
    strengths.push("Aligned with growing trends");
  }

  // Final verdict
  let verdict = "Weak";
  if (score >= 70) verdict = "Strong 💰";
  else if (score >= 50) verdict = "Decent 👍";
  else verdict = "Needs Work ⚠️";

  // Monetization ideas
  const monetizationIdeas = [
    "Sell a digital product (course, templates)",
    "Offer a done-for-you service",
    "Create a subscription tool (micro SaaS)",
    "Affiliate products/tools in this niche",
    "Consulting or coaching",
  ];

  return {
    score,
    verdict,
    strengths,
    weaknesses,
    suggestions,
    monetizationIdeas,
  };
}
