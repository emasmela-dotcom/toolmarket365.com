export type RewriteOptions = {
  tone?: "casual" | "neutral" | "curious";
  /** how aggressive rewrite is (1–3) */
  intensity?: number;
};

const synonymMap: Record<string, string[]> = {
  important: ["key", "crucial", "essential"],
  problem: ["issue", "challenge", "struggle"],
  improve: ["enhance", "boost", "level up"],
  help: ["assist", "support", "make easier"],
  easy: ["simple", "straightforward", "quick"],
  best: ["solid", "great", "reliable"],
  idea: ["approach", "concept", "thought"],
};

function randomPick(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function rewriteWords(text: string, intensity = 2) {
  const words = text.split(" ");

  return words
    .map((word) => {
      const clean = word.toLowerCase().replace(/[^\w]/g, "");
      if (synonymMap[clean] && Math.random() < 0.3 * intensity) {
        return randomPick(synonymMap[clean]);
      }
      return word;
    })
    .join(" ");
}

function restructureSentence(text: string) {
  const sentences = text.split(". ");
  return sentences
    .map((s) => {
      if (Math.random() > 0.5) {
        return s;
      }
      const parts = s.split(",");
      return parts.reverse().join(",");
    })
    .join(". ");
}

function humanizeTone(text: string, tone: NonNullable<RewriteOptions["tone"]>) {
  if (tone === "casual") {
    return text
      .replace(/do not/g, "don't")
      .replace(/cannot/g, "can't")
      .replace(/I am/g, "I'm");
  }

  if (tone === "curious") {
    return text + "\n\nCurious if anyone else has tried something similar?";
  }

  return text;
}

export function rewriteRedditPost(input: string, options: RewriteOptions = {}) {
  const { tone = "casual", intensity = 2 } = options;

  let output = input;

  output = rewriteWords(output, intensity);
  output = restructureSentence(output);
  output = humanizeTone(output, tone);

  return output;
}

const tones = ["casual", "neutral", "curious"] as const;

export function generateVariations(input: string, count = 3) {
  return Array.from({ length: count }, () =>
    rewriteRedditPost(input, {
      tone: tones[Math.floor(Math.random() * tones.length)]!,
      intensity: Math.floor(Math.random() * 3) + 1,
    })
  );
}
