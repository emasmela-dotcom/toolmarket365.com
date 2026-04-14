export type AgreementStatus = "pending" | "agreed";

export type AgreementRecord = {
  id: string;
  title: string;
  description: string;
  amount: string;
  dueAt: string;
  status: AgreementStatus;
  createdAt: number;
  agreedAt?: number;
};

const agreements = new Map<string, AgreementRecord>();

export function createAgreementRecord(input: {
  title: string;
  description: string;
  amount: string;
  dueAt: string;
}): AgreementRecord {
  const id = crypto.randomUUID();
  const rec: AgreementRecord = {
    id,
    title: input.title.trim(),
    description: input.description.trim(),
    amount: input.amount.trim(),
    dueAt: input.dueAt.trim(),
    status: "pending",
    createdAt: Date.now(),
  };
  agreements.set(id, rec);
  return rec;
}

export function getAgreementRecord(id: string): AgreementRecord | undefined {
  return agreements.get(id);
}

export function markAgreementAgreed(id: string): boolean {
  const a = agreements.get(id);
  if (!a || a.status !== "pending") return false;
  a.status = "agreed";
  a.agreedAt = Date.now();
  return true;
}
