export type HookInput = {
  niche: string;
  audience: string;
  painPoint: string;
  desire: string;
};

const hookTemplates = [
  "Nobody tells you that {painPoint} is why you can't {desire}.",
  "If you're a {audience}, this will change how you think about {niche}.",
  "I tried fixing {painPoint} for 30 days… here's what happened.",
  "You're making this mistake with {niche} (and it's costing you).",
  "This is why most {audience} fail at {desire}.",
  "Stop doing this if you want to {desire}.",
  "The truth about {niche} nobody wants to admit.",
  "I wish I knew this before struggling with {painPoint}.",
  "This one shift will help you finally {desire}.",
  "99% of people get this wrong about {niche}.",
  "Here's the brutal truth about {painPoint}.",
  "Doing this daily will completely change your {desire}.",
  "You're not lazy… you're just doing {niche} wrong.",
  "The hidden reason your {desire} isn't happening.",
  "What nobody tells {audience} about {niche}.",
];

function applyVars(template: string, input: HookInput) {
  return template
    .replaceAll("{niche}", input.niche)
    .replaceAll("{audience}", input.audience)
    .replaceAll("{painPoint}", input.painPoint)
    .replaceAll("{desire}", input.desire);
}

export function generateHooks(input: HookInput, count = 5) {
  const shuffled = [...hookTemplates].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, count).map((template) => applyVars(template, input));
}
