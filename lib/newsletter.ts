export type NewsletterInput = {
  niche: string;
  audience: string;
  goal?: string;
};

const topicTemplates = [
  "The {niche} trend nobody is talking about (but should be)",
  "How {audience} can finally master {niche}",
  "The biggest mistake in {niche} right now",
  "What I wish I knew about {niche} earlier",
  "The future of {niche}: What’s coming next",
  "How to get better results in {niche} without more effort",
  "Why most {audience} fail at {niche}",
  "A simple framework to win at {niche}",
  "What separates successful {audience} in {niche}",
  "The truth about {niche} nobody tells you",
  "Beginner to advanced: mastering {niche}",
  "3 unconventional ways to improve your {niche}",
  "The hidden opportunities in {niche} right now",
  "Case study: How someone succeeded in {niche}",
  "Stop doing this if you want to succeed in {niche}",
];

function fillTemplate(template: string, input: NewsletterInput) {
  return template
    .replace(/{niche}/g, input.niche)
    .replace(/{audience}/g, input.audience)
    .replace(/{goal}/g, input.goal || "");
}

export function generateNewsletterTopics(input: NewsletterInput) {
  const shuffled = [...topicTemplates].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, 8).map((template) => ({
    title: fillTemplate(template, input),
  }));
}
