/** MVP shape — swap store for Prisma `FollowUp` when you wire the DB. */
export type FollowUpRecord = {
  id: string;
  userEmail: string;
  title: string;
  message: string;
  dueAt: string; // ISO
  isSent: boolean;
  createdAt: string;
};
