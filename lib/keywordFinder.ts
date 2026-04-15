export type KeywordInput = {
  seed: string;
};

export type KeywordResult = {
  keyword: string;
  intentScore: number;
  competitionScore: number;
  opportunityScore: number;
};

const modifiers = [
  "best",
  "top",
  "cheap",
  "affordable",
  "for beginners",
  "near me",
  "online",
  "tools",
  "software",
  "services",
  "2026",
  "guide",
  "how to",
  "fast",
];

function getIntentScore(keyword: string): number {
  const k = keyword.toLowerCase();
  const buyerWords = ["buy", "best", "cheap", "service", "tool", "software"];
  const infoWords = ["how", "guide", "tips"];

  let score = 50;

  if (buyerWords.some((w) => k.includes(w))) score += 30;
  if (infoWords.some((w) => k.includes(w))) score += 10;

  return Math.min(score, 100);
}

function getCompetitionScore(keyword: string): number {
  // Simulated: shorter keywords = higher competition
  const lengthFactor = keyword.trim().split(/\s+/).filter(Boolean).length;

  if (lengthFactor <= 2) return 80;
  if (lengthFactor === 3) return 60;
  if (lengthFactor === 4) return 40;

  return 20;
}

function calculateOpportunity(intent: number, competition: number): number {
  return Math.round(intent * 0.7 + (100 - competition) * 0.3);
}

export function findKeywordOpportunities(input: KeywordInput): KeywordResult[] {
  const seed = input.seed.trim();
  if (!seed) return [];

  const variations = modifiers.map((mod) => `${mod} ${seed}`);

  const results: KeywordResult[] = variations.map((keyword) => {
    const intentScore = getIntentScore(keyword);
    const competitionScore = getCompetitionScore(keyword);
    const opportunityScore = calculateOpportunity(intentScore, competitionScore);

    return {
      keyword,
      intentScore,
      competitionScore,
      opportunityScore,
    };
  });

  return results.sort((a, b) => b.opportunityScore - a.opportunityScore);
}
