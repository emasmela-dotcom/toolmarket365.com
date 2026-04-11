export type HookInput = {
    niche: string;
    audience: string;
    painPoint: string;
    desire: string;
  };
  
  const powerWords = [
    "brutal",
    "shocking",
    "hidden",
    "little-known",
    "proven",
    "dangerous",
    "weird",
    "unexpected",
    "simple",
    "fast",
  ];
  
  const hookTemplates = [
    "Nobody tells you that {painPoint} is why you can't {desire}.",
    "If you're a {audience}, this will change how you think about {niche}.",
    "I tried fixing {painPoint} for 30 days... here's what happened.",
    "You're making this mistake with {niche} (and it's costing you).",
    "This is why most {audience} fail at {desire}.",
    "Stop doing this if you want to {desire}.",
    "The {powerWord} truth about {niche} nobody wants to admit.",
    "I wish I knew this before struggling with {painPoint}.",
    "This one shift will help you finally {desire}.",
    "99% of people get this wrong about {niche}.",
    "Here's the {powerWord} truth about {painPoint}.",
    "Doing this daily will completely change your {desire}.",
    "You're not lazy... you're just doing {niche} wrong.",
    "The hidden reason your {desire} isn't happening.",
    "What nobody tells {audience} about {niche}.",
    "How I went from {painPoint} to {desire} in 7 days.",
    "The #1 mistake {audience} make with {niche}.",
  ];
  
  function getRandomItem(arr: string[]) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  
  export function generateHooks(input: HookInput, count = 5) {
    const results = new Set<string>();
  
    while (results.size < count && results.size < hookTemplates.length) {
      const template = getRandomItem(hookTemplates);
      const powerWord = getRandomItem(powerWords);
  
      const hook = template
        .replace(/{niche}/g, input.niche)
        .replace(/{audience}/g, input.audience)
        .replace(/{painPoint}/g, input.painPoint)
        .replace(/{desire}/g, input.desire)
        .replace(/{powerWord}/g, powerWord);
  
      results.add(hook);
    }
  
    return Array.from(results);
  }