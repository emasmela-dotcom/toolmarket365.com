export type PainInput = {
  text: string;
};

export type PainPoint = {
  phrase: string;
  category: string;
  severity: number;
};

const painKeywords = [
  "hate",
  "annoying",
  "frustrating",
  "expensive",
  "slow",
  "hard",
  "difficult",
  "confusing",
  "problem",
  "issue",
  "waste",
  "broken",
  "bug",
  "doesn't work",
  "too much",
  "lack",
  "missing",
  "overpriced",
  "time-consuming",
];

const categoryMap: Record<string, string> = {
  expensive: "Pricing",
  overpriced: "Pricing",
  slow: "Performance",
  bug: "Technical",
  broken: "Technical",
  confusing: "UX",
  hard: "UX",
  difficult: "UX",
  time: "Time",
  waste: "Time",
  missing: "Features",
  lack: "Features",
};

function categoryForSentence(sentence: string): string {
  for (const key of Object.keys(categoryMap)) {
    if (sentence.includes(key)) {
      return categoryMap[key]!;
    }
  }
  return "General";
}

export function extractPainPoints(input: PainInput): PainPoint[] {
  const sentences = input.text
    .toLowerCase()
    .split(/[.!?\n]/)
    .map((s) => s.trim())
    .filter(Boolean);

  const results: Record<string, PainPoint> = {};

  for (const sentence of sentences) {
    for (const keyword of painKeywords) {
      if (sentence.includes(keyword)) {
        const category = categoryForSentence(sentence);

        if (!results[sentence]) {
          results[sentence] = {
            phrase: sentence,
            category,
            severity: 1,
          };
        } else {
          results[sentence].severity++;
        }
      }
    }
  }

  return Object.values(results).sort((a, b) => b.severity - a.severity);
}
