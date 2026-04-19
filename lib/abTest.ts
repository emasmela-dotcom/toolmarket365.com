export function getVariant(): "A" | "B" {
  let variant = localStorage.getItem("ab_variant");

  if (!variant) {
    variant = Math.random() < 0.5 ? "A" : "B";
    localStorage.setItem("ab_variant", variant);
  }

  return variant as "A" | "B";
}
