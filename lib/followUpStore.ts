import type { FollowUpRecord } from "@/types/followUp";

let followUps: FollowUpRecord[] = [];

export function createFollowUp(input: {
  userEmail: string;
  title: string;
  message: string;
  dueAt: string;
}): FollowUpRecord {
  const rec: FollowUpRecord = {
    id: crypto.randomUUID(),
    userEmail: input.userEmail.trim(),
    title: input.title.trim(),
    message: input.message.trim(),
    dueAt: new Date(input.dueAt).toISOString(),
    isSent: false,
    createdAt: new Date().toISOString(),
  };
  followUps.push(rec);
  return rec;
}

export function getFollowUps(): FollowUpRecord[] {
  return followUps;
}

export function getDueUnsentFollowUps(now: Date = new Date()): FollowUpRecord[] {
  const t = now.getTime();
  return followUps.filter(
    (f) => !f.isSent && !Number.isNaN(new Date(f.dueAt).getTime()) && new Date(f.dueAt).getTime() <= t
  );
}

export function markFollowUpSent(id: string): boolean {
  const idx = followUps.findIndex((f) => f.id === id);
  if (idx === -1) return false;
  followUps[idx] = { ...followUps[idx], isSent: true };
  return true;
}
