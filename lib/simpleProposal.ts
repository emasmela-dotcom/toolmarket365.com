export type ProposalInput = {
  client: string;
  project: string;
  scope: string;
  price: string;
  notes: string;
};

export function buildProposalText(input: ProposalInput): string {
  const date = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const priceLine = input.price.trim()
    ? `$${input.price.trim()}`
    : "To be discussed";

  const notesBlock = input.notes.trim() ? input.notes.trim() : "—";

  return `PROPOSAL

Prepared for: ${input.client.trim() || "[Client name]"}
Date: ${date}

Project: ${input.project.trim() || "[Project title]"}

────────────────────────────────
SCOPE OF WORK
────────────────────────────────

${input.scope.trim() || "[Scope of work]"}

────────────────────────────────
INVESTMENT
────────────────────────────────

${priceLine}

────────────────────────────────
ADDITIONAL NOTES
────────────────────────────────

${notesBlock}

────────────────────────────────
Thank you for considering this proposal.
`;
}
