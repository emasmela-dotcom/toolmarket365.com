export type CompetitorInput = {
  niche: string;
  competitors: string[]; // URLs or names
};

export type CompetitorScanResult = {
  name: string;
  offer: string[];
  pricing: string[];
  strengths: string[];
  weaknesses: string[];
  gaps: string[];
};

export function analyzeCompetitors({
  niche,
  competitors,
}: CompetitorInput): CompetitorScanResult[] {
  return competitors.map((comp) => ({
    name: comp,

    offer: [
      `Primary service in ${niche}`,
      "Subscription or one-time product",
    ],

    pricing: [
      "Freemium or tiered pricing",
      "$10–$50/month typical range",
    ],

    strengths: [
      "Strong branding",
      "Clear landing page messaging",
      "Good onboarding UX",
    ],

    weaknesses: [
      "Generic features",
      "Lack of personalization",
      "Weak differentiation",
    ],

    gaps: [
      `No tool focused on ${niche} beginners`,
      "No automation or AI layer",
      "No community or engagement loop",
    ],
  }));
}
