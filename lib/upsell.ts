export type UpsellInput = {
  product: string;
  audience: string;
  goal?: string;
};

const upsellTemplates = [
  "Add {product} Pro for advanced features tailored to {audience}.",
  "Upgrade your {product} with premium tools designed to help {audience} achieve {goal}.",
  "Get faster results with {product} Plus — built specifically for {audience}.",
  "Unlock exclusive bonuses when you upgrade {product} today.",
  "Take your {product} experience further with this premium add-on for {audience}.",
  "Serious about results? Upgrade {product} to the next level.",
  "Boost your success with {product} Elite — optimized for {audience}.",
  "Don’t just use {product} — maximize it with this powerful upgrade.",
];

function fillTemplate(template: string, input: UpsellInput) {
  return template
    .replace(/{product}/g, input.product)
    .replace(/{audience}/g, input.audience)
    .replace(/{goal}/g, input.goal || "better results");
}

export function generateUpsells(input: UpsellInput): string[] {
  return upsellTemplates.map((template) => fillTemplate(template, input));
}
