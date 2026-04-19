import { sendEmail } from "@/lib/latePaymentMailer";

export type Lead = {
  id: string;
  name: string;
  email: string;
  createdAt: number;
  sentEmails: string[];
};

const leads: Lead[] = [];

const emailSequence = [
  {
    delay: 0,
    subject: "Welcome",
    message: (name: string) => `Hey ${name}, thanks for signing up!`,
  },
  {
    delay: 1,
    subject: "Day 1 Value",
    message: (name: string) => `Hey ${name}, here's something useful for you...`,
  },
  {
    delay: 3,
    subject: "Final Follow-Up",
    message: (name: string) => `Hey ${name}, just checking in!`,
  },
];

export async function processLeadSequences(): Promise<void> {
  const now = new Date();

  for (const lead of leads) {
    for (const step of emailSequence) {
      const sendTime = new Date(lead.createdAt);
      sendTime.setDate(sendTime.getDate() + step.delay);

      const alreadySent = lead.sentEmails.includes(step.subject);

      if (now >= sendTime && !alreadySent) {
        try {
          await sendEmail(
            lead.email,
            step.subject,
            step.message(lead.name)
          );
          lead.sentEmails.push(step.subject);
        } catch (err) {
          console.error("[lead-email-sequence]", err);
        }
      }
    }
  }
}

export function ensureLeadSequenceWorker(): void {
  const g = globalThis as typeof globalThis & {
    __leadSequenceWorkerStarted?: boolean;
  };
  if (g.__leadSequenceWorkerStarted) return;
  g.__leadSequenceWorkerStarted = true;

  const HOUR_MS = 60 * 60 * 1000;
  setInterval(() => {
    void processLeadSequences();
  }, HOUR_MS);
}

export function captureLead(name: string, email: string): Lead {
  const lead: Lead = {
    id: crypto.randomUUID(),
    name,
    email,
    createdAt: Date.now(),
    sentEmails: [],
  };
  leads.push(lead);
  return lead;
}

export function getLeadsSnapshot(): Lead[] {
  return leads.map((l) => ({ ...l, sentEmails: [...l.sentEmails] }));
}
