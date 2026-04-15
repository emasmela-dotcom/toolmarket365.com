export type TrendInput = {
  trend: string;
};

export async function explainTrend({ trend }: TrendInput): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set. Add it in env for this tool to run."
    );
  }

  const prompt = `
You are a trend analyst.

A topic is currently trending:
"${trend}"

Break it down into:

1. Why it's trending right now
2. Who is driving the trend (audience or group)
3. Platforms where it's blowing up (TikTok, Twitter, YouTube, etc.)
4. The psychology behind it (fear, hype, curiosity, controversy, etc.)
5. How creators or businesses can capitalize on it

Keep it concise, insightful, and actionable.
`.trim();

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  });

  const data = (await res.json()) as {
    error?: { message?: string };
    choices?: { message?: { content?: string } }[];
  };

  if (!res.ok) {
    throw new Error(data.error?.message || `OpenAI request failed (${res.status})`);
  }

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Empty response from model");
  }

  return content;
}
