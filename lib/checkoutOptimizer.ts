export type CheckoutInput = {
  productName: string;
  price: number;
  billingType: "one-time" | "subscription";
  ctaText: string;
  trustSignals: string[];
  frictionPoints: string[];
  features: string[];
};

export type CheckoutOutput = {
  score: number;
  issues: string[];
  suggestions: string[];
  optimizedCTA: string;
  optimizedCopy: string;
};

export function optimizeCheckout(input: CheckoutInput): CheckoutOutput {
  let score = 100;
  const issues: string[] = [];
  const suggestions: string[] = [];

  if (
    !input.ctaText.toLowerCase().includes("get") &&
    !input.ctaText.toLowerCase().includes("start")
  ) {
    score -= 10;
    issues.push("CTA lacks action-driven language");
    suggestions.push(
      "Use action-based CTA like 'Get Instant Access' or 'Start Now'"
    );
  }

  if (input.trustSignals.length === 0) {
    score -= 20;
    issues.push("No trust signals present");
    suggestions.push("Add testimonials, guarantees, or security badges");
  }

  if (input.frictionPoints.length > 2) {
    score -= 15;
    issues.push("Too many friction points in checkout");
    suggestions.push("Reduce form fields and remove unnecessary steps");
  }

  if (input.price > 100 && input.billingType === "one-time") {
    suggestions.push(
      "Consider adding payment plans or breaking price into smaller chunks"
    );
  }

  if (input.features.length < 3) {
    score -= 10;
    issues.push("Not enough value communicated");
    suggestions.push("Add more clear benefits/features");
  }

  const optimizedCTA = `Get Instant Access to ${input.productName}`;

  const optimizedCopy = `Unlock everything you need with ${
    input.productName
  }.\n\n✔ ${input.features.join("\n✔ ")}\n\n💰 Only $${
    input.price
  } (${input.billingType})\n🔒 Secure checkout\n⚡ Instant access after purchase${
    input.trustSignals.length > 0 ? `\n⭐ ${input.trustSignals[0]}` : ""
  }`;

  return {
    score,
    issues,
    suggestions,
    optimizedCTA,
    optimizedCopy,
  };
}
