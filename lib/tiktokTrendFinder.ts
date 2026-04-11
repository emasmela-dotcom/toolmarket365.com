export type TikTokTrendInput = {
  niche: string;
  focus?: "sounds" | "hashtags" | "formats" | "all";
};

export type TikTokTrend = {
  label: string;
  description: string;
  hashtags: string[];
  suggestedFormat: string;
  momentum: "rising" | "hot" | "steady";
};

const momenta: TikTokTrend["momentum"][] = ["rising", "hot", "steady"];

const soundAngles = [
  "Voiceover + hard cuts; hook in first 1.2s with a bold claim about {niche}.",
  "Trending sped-up audio; on-screen bullets listing {niche} mistakes → one fix.",
  "Silent hook (text) → beat drop → quick demo or proof for {niche}.",
  "Stitch-friendly cold open: 'Stop scrolling if you care about {niche}…'",
];

const formatAngles = [
  "Green-screen reaction + headline stat or myth about {niche}.",
  "'Day in the life' micro-vlog framed around one {niche} lesson.",
  "Listicle pacing: 3–5 rapid tips; end with CTA to save the video.",
  "Before/after or expectation vs reality for {niche} workflows.",
];

const hashtagAngles = [
  "Rotate 2 broad tags (#fyp, #foryou) + 2 intent tags + one niche anchor for {niche}.",
  "Pair a challenge tag with a problem hashtag stack so {niche} searches find you.",
  "Use 3–5 tags max; swap the 4th tag weekly to test discovery for {niche}.",
  "Pin a comment with your keyword phrase; captions echo {niche} in first line.",
];

const hashtagPools = [
  ["#fyp", "#foryou", "#viral"],
  ["#learnontiktok", "#tips", "#creator"],
  ["#storytime", "#relatable", "#growth"],
  ["#trending", "#2026", "#shorts"],
];

function nicheTag(niche: string): string {
  const t = niche.trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
  return (t || "creator").slice(0, 24);
}

function random<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function replaceNiche(s: string, niche: string): string {
  return s.replace(/\{niche\}/g, niche.trim() || "your niche");
}

export function generateTikTokTrends(
  input: TikTokTrendInput,
  count = 6
): TikTokTrend[] {
  const niche = input.niche?.trim() || "creators";
  const tag = nicheTag(niche);
  const focus = input.focus ?? "all";

  const labels = shuffle([
    `Things nobody tells you about ${niche}`,
    `POV: you finally fixed your ${niche} workflow`,
    `Hot take: ${niche} advice that aged badly`,
    `The ${niche} angle that’s quietly blowing up`,
    `Stop doing this on TikTok if you sell ${niche}`,
    `Unpopular ${niche} opinion (watch the saves)`,
    `Ranking ${niche} mistakes from “meh” to “ouch”`,
    `If you’re into ${niche}, you need this hook`,
  ]);

  let pool: string[];
  if (focus === "sounds") pool = [...soundAngles];
  else if (focus === "formats") pool = [...formatAngles];
  else if (focus === "hashtags") pool = [...hashtagAngles];
  else pool = shuffle([...soundAngles, ...formatAngles, ...hashtagAngles]);

  const lines = shuffle(pool);
  const out: TikTokTrend[] = [];

  for (let i = 0; i < count; i++) {
    const label = labels[i % labels.length]!;
    const rawLine = lines[i % lines.length]!;
    const description = replaceNiche(rawLine, niche);
    const suggestedFormat =
      focus === "hashtags"
        ? replaceNiche(
            "3s text hook → rapid list → pinned comment with CTA for {niche}.",
            niche
          )
        : description;

    const baseTags = [...random(hashtagPools), `#${tag}`];
    const hashtags = [...new Set(baseTags)].slice(0, 5);

    out.push({
      label,
      description,
      hashtags,
      suggestedFormat,
      momentum: random(momenta),
    });
  }

  return out;
}
