export type TitleInput = {
  topic: string;
  audience?: string;
  keyword?: string;
  tone?: "viral" | "educational" | "curiosity" | "authority";
};

const powerWords = [
  "Ultimate",
  "Proven",
  "Secret",
  "Insane",
  "Effortless",
  "Fast",
  "Beginner-Friendly",
  "Advanced",
  "Step-by-Step",
  "Million-Dollar",
];

const curiosityHooks = [
  "Nobody Talks About This",
  "This Changed Everything",
  "You're Doing This Wrong",
  "I Wish I Knew This Sooner",
  "This Actually Works",
];

const formats = [
  "How to {topic}",
  "How to {topic} in 2026",
  "{topic}: Step-by-Step Guide",
  "{topic} for {audience}",
  "The Truth About {topic}",
];

function random(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function optimizeTitle(input: TitleInput) {
  const { topic, audience, keyword, tone = "viral" } = input;

  const baseFormat = random(formats);
  const power = random(powerWords);
  const hook = random(curiosityHooks);

  let title = baseFormat
    .replace("{topic}", topic)
    .replace("{audience}", audience || "beginners");

  switch (tone) {
    case "viral":
      title = `${hook}: ${power} ${title}`;
      break;
    case "educational":
      title = `${power} Guide: ${title}`;
      break;
    case "curiosity":
      title = `${hook} – ${title}`;
      break;
    case "authority":
      title = `${power} Strategy for ${title}`;
      break;
  }

  if (keyword) {
    title += ` (${keyword})`;
  }

  return title;
}

export function generateTitles(input: TitleInput, count = 5) {
  return Array.from({ length: count }, () => optimizeTitle(input));
}
