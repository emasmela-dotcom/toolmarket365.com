export type DmLead = {
  name: string;
  email: string | null;
  message: string;
  createdAt: string;
};

const leads: DmLead[] = [];

export function extractLeadInfo(message: string): DmLead {
  const emailMatch = message.match(
    /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi
  );

  const nameMatch = message.match(/my name is (\w+)/i);

  return {
    name: nameMatch ? nameMatch[1] : "Unknown",
    email: emailMatch ? emailMatch[0] : null,
    message,
    createdAt: new Date().toISOString(),
  };
}

export function captureLeadFromDm(message: string): DmLead {
  const lead = extractLeadInfo(message);
  leads.push(lead);
  return lead;
}

export function getDmLeads(): DmLead[] {
  return leads.map((l) => ({ ...l }));
}

export function buildAutoReply(lead: DmLead): string {
  return lead.email
    ? `Thanks ${lead.name}! We'll contact you soon.`
    : "Thanks! Can you share your email so we can follow up?";
}
