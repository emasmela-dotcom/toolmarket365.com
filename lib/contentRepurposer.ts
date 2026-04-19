export type RepurposeInput = {
  content: string;
};

export async function repurposeContent({ content }: RepurposeInput): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set. Add it in env for this tool to run."
    );
  }

  const prompt = `
You are a content repurposing assistant.

Take the following content and turn it into:

1. Twitter thread (5 tweets)
2. LinkedIn post (professional, engaging)
3. Instagram caption (short + hashtags)
4. Email newsletter (friendly tone)

CONTENT:
"${content}"
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

  const out = data.choices?.[0]?.message?.content;
  if (!out) {
    throw new Error("Empty response from model");
  }

  return out;
}
