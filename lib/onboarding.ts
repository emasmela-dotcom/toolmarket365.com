export type OnboardingInput = {
  businessType: string;
  service: string;
  clientType: string;
};

export type ChecklistItem = {
  section: string;
  tasks: string[];
};

export function generateChecklist({
  businessType,
  service,
  clientType,
}: OnboardingInput): ChecklistItem[] {
  return [
    {
      section: "Welcome & Introduction",
      tasks: [
        `Send welcome email to new ${clientType}`,
        `Introduce your ${businessType} and how the ${service} works`,
        "Provide timeline and expectations",
      ],
    },
    {
      section: "Account Setup",
      tasks: [
        "Collect client contact details",
        "Create client account / workspace",
        "Share login credentials or access links",
      ],
    },
    {
      section: "Requirements Gathering",
      tasks: [
        `Understand goals for ${service}`,
        "Collect necessary documents/files",
        "Define success metrics",
      ],
    },
    {
      section: "Payment & Agreement",
      tasks: [
        "Send agreement for signing",
        "Confirm payment or deposit",
        "Store signed contract securely",
      ],
    },
    {
      section: "Project Kickoff",
      tasks: [
        "Schedule kickoff call",
        "Review scope and deliverables",
        "Align on communication channels",
      ],
    },
    {
      section: "Execution Setup",
      tasks: [
        "Set up internal workflows",
        "Assign team or responsibilities",
        "Prepare tools/resources needed",
      ],
    },
    {
      section: "Client Communication",
      tasks: [
        "Share progress update schedule",
        "Provide point of contact",
        "Set response time expectations",
      ],
    },
  ];
}
