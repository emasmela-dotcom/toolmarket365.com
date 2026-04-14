export type LandingInput = {
  product: string;
  audience: string;
  problem: string;
  benefit: string;
  tone?: "casual" | "professional" | "bold";
};

export function generateLandingCopy(input: LandingInput) {
  const { product, audience, problem, benefit, tone = "bold" } = input;

  const toneMap = {
    casual: {
      hook: "Finally, something that actually helps you",
      cta: "Give it a try",
    },
    professional: {
      hook: "A better way to",
      cta: "Get started today",
    },
    bold: {
      hook: "Stop struggling with",
      cta: "Start now",
    },
  };

  const t = toneMap[tone];

  const headline = `${t.hook} ${problem}`;
  const subheadline = `Built for ${audience} who want to ${benefit} using ${product}.`;

  const valueProps = [
    `Eliminate ${problem} without extra effort`,
    `Designed specifically for ${audience}`,
    `Get results faster and more efficiently`,
  ];

  const features = [
    `${product} automation tools`,
    `Simple and clean interface`,
    `Fast setup — no tech skills needed`,
    `Optimized for real-world results`,
  ];

  const testimonials = [
    `"This completely changed how I handle ${problem}."`,
    `"I started seeing results within days."`,
    `"Best tool I've used as a ${audience}."`,
  ];

  const faq = [
    {
      q: `How does ${product} work?`,
      a: `It helps ${audience} solve ${problem} and achieve ${benefit} quickly.`,
    },
    {
      q: "Is it beginner friendly?",
      a: "Yes, it's designed to be simple and easy to use.",
    },
    {
      q: "How fast will I see results?",
      a: "Most users notice improvements almost immediately.",
    },
  ];

  return {
    headline,
    subheadline,
    valueProps,
    features,
    cta: t.cta,
    testimonials,
    faq,
  };
}
