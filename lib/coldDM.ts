export type ColdDMInput = {
  niche: string;
  target: string;
  platform: "twitter" | "instagram" | "linkedin" | "email";
  tone?: "casual" | "professional" | "friendly" | "direct";
  goal: string; // e.g. "book a call", "get reply", "offer service"
};

const openers = [
  "Quick one —",
  "Random but relevant —",
  "Hey, saw your content on {niche} —",
  "Noticed you're into {niche} —",
  "This might be out of the blue, but —",
];

const personalizationHooks = [
  "your recent post about {niche} stood out",
  "I like how you're approaching {niche}",
  "you seem deep in the {niche} space",
  "your audience ({target}) is exactly who I work with",
];

const valueProps = [
  "I help {target} solve {niche}-related problems",
  "I've been working with people in {niche}",
  "I recently helped someone in a similar space",
  "I build tools/solutions around {niche}",
];

const softCTAs = [
  "open to hearing more?",
  "worth a quick chat?",
  "should I send over something?",
  "curious if this is relevant?",
  "want me to share more?",
];

function format(template: string, data: Record<string, string>) {
  return template.replace(/{(\w+)}/g, (_, key: string) => data[key] || "");
}

function pick(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export function generateColdDMs(input: ColdDMInput): string[] {
  const { niche, target, tone = "friendly", goal: _goal } = input;

  const messages: string[] = [];

  for (let i = 0; i < 5; i++) {
    const opener = format(pick(openers), { niche });
    const hook = format(pick(personalizationHooks), { niche, target });
    const value = format(pick(valueProps), { niche, target });
    const cta = pick(softCTAs);

    let toneAdjust = "";

    if (tone === "casual") toneAdjust = "keeping this super casual — ";
    if (tone === "professional") toneAdjust = "I'll keep this brief — ";
    if (tone === "direct") toneAdjust = "straight to it — ";

    const message = `${opener} ${toneAdjust}${hook}. ${value}. ${cta}`;

    messages.push(message);
  }

  return messages;
}
