export type ContentIdeaInput = {
  niche: string;
};

const ideaBuckets = {
  viral: [
    "Unpopular opinion about {niche} that will trigger people",
    "Why most people fail at {niche}",
    "Stop doing this in {niche} immediately",
    "The truth about {niche} nobody talks about",
  ],
  educational: [
    "Beginner guide to {niche}",
    "Everything you need to know about {niche} in 60 seconds",
    "3 mistakes beginners make in {niche}",
    "Step-by-step system to improve at {niche}",
  ],
  reels: [
    "POV: You just discovered this about {niche}",
    "Day in the life of someone in {niche}",
    "Before vs After results in {niche}",
    "Quick tip that instantly improves {niche}",
  ],
  authority: [
    "What 99% of people misunderstand about {niche}",
    "My experience after 100 days of {niche}",
    "What I'd do if I had to restart in {niche}",
    "Advanced strategies in {niche}",
  ],
  monetization: [
    "How to make money with {niche}",
    "Top 3 ways to monetize {niche} skills",
    "How I'd turn {niche} into a business",
    "Digital products you can sell in {niche}",
  ],
};

function fillTemplate(template: string, niche: string) {
  return template.replaceAll("{niche}", niche);
}

export function generateContentIdeas(input: ContentIdeaInput) {
  const { niche } = input;

  const result: Record<string, string[]> = {};

  for (const category in ideaBuckets) {
    result[category] = ideaBuckets[category as keyof typeof ideaBuckets].map(
      (template) => fillTemplate(template, niche)
    );
  }

  return result;
}
