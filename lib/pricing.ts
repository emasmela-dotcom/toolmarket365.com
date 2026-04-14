export type PricingInput = {
  cost: number;
  desiredMargin: number;
  competitorPrices: number[];
  perceivedValue: number;
  demandMultiplier?: number;
};

export type PricingResult = {
  costBasedPrice: number;
  competitorAvg: number;
  competitorAdjustedPrice: number;
  valueBasedPrice: number;
  finalSuggestedPrice: number;
};

export function calculateOptimalPrice(input: PricingInput): PricingResult {
  const {
    cost,
    desiredMargin,
    competitorPrices,
    perceivedValue,
    demandMultiplier = 1,
  } = input;

  const costBasedPrice = cost / (1 - desiredMargin);

  const competitorAvg =
    competitorPrices.length > 0
      ? competitorPrices.reduce((a, b) => a + b, 0) / competitorPrices.length
      : costBasedPrice;

  const competitorAdjustedPrice = competitorAvg * (1 + (demandMultiplier - 1) * 0.3);

  const valueBasedPrice = perceivedValue * demandMultiplier;

  const finalSuggestedPrice =
    costBasedPrice * 0.3 +
    competitorAdjustedPrice * 0.3 +
    valueBasedPrice * 0.4;

  return {
    costBasedPrice: round(costBasedPrice),
    competitorAvg: round(competitorAvg),
    competitorAdjustedPrice: round(competitorAdjustedPrice),
    valueBasedPrice: round(valueBasedPrice),
    finalSuggestedPrice: round(finalSuggestedPrice),
  };
}

function round(num: number) {
  return Math.round(num * 100) / 100;
}
