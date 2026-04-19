export type AutoFollowUp = {
  id: string;
  email: string;
  name: string;
  message: string;
  sendAt: number;
};

const queue: AutoFollowUp[] = [];

export function personalize(
  template: string,
  data: Record<string, string>
): string {
  return template.replace(/{{(.*?)}}/g, (_, key) => data[key.trim()] || "");
}

async function sendEmail(to: string, content: string) {
  console.log(`Sending email to ${to}:`);
  console.log(content);
}

async function processDue() {
  const now = Date.now();
  const ready = queue.filter((item) => item.sendAt <= now);
  const remaining = queue.filter((item) => item.sendAt > now);
  queue.length = 0;
  queue.push(...remaining);

  for (const item of ready) {
    const content = personalize(item.message, {
      name: item.name,
    });
    await sendEmail(item.email, content);
  }
}

export function ensureAutoFollowUpWorker(): void {
  const g = globalThis as typeof globalThis & {
    __autoFollowUpWorkerStarted?: boolean;
  };
  if (g.__autoFollowUpWorkerStarted) return;
  g.__autoFollowUpWorkerStarted = true;

  setInterval(() => {
    void processDue();
  }, 10_000);
}

export function scheduleAutoFollowUp(input: {
  email: string;
  name: string;
  message: string;
  delayMs: number;
}): AutoFollowUp {
  const followUp: AutoFollowUp = {
    id: crypto.randomUUID(),
    email: input.email,
    name: input.name,
    message: input.message,
    sendAt: Date.now() + input.delayMs,
  };
  queue.push(followUp);
  return followUp;
}
