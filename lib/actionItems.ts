export type ActionItem = {
  task: string;
  owner?: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
};

export type ActionItemsResult = {
  summary: string;
  actionItems: ActionItem[];
};

function parseJsonFromModelContent(content: string): unknown {
  let s = content.trim();
  if (s.startsWith("```")) {
    s = s.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  }
  return JSON.parse(s);
}

export async function extractActionItems(
  meetingText: string
): Promise<ActionItemsResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set. Add it in env or use Integrations for your key when wired."
    );
  }

  const prompt = `
You are an AI that extracts action items from meeting notes.

Return ONLY valid JSON in this format:
{
  "summary": "short meeting summary",
  "actionItems": [
    {
      "task": "...",
      "owner": "... or null",
      "dueDate": "... or null",
      "priority": "low | medium | high"
    }
  ]
}

Meeting Notes:
${meetingText}
`.trim();

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
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

  try {
    const parsed = parseJsonFromModelContent(content) as ActionItemsResult;
    if (!parsed || typeof parsed.summary !== "string" || !Array.isArray(parsed.actionItems)) {
      throw new Error("Invalid JSON shape");
    }
    return parsed;
  } catch {
    throw new Error("Failed to parse AI response");
  }
}
