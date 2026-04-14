export type BundleProduct = {
  id: string;
  name: string;
  price: number;
  category: string;
};

export type BundleResult = {
  products: BundleProduct[];
  originalPrice: number;
  discount: number;
  finalPrice: number;
  savings: number;
};

export function buildBundle(products: BundleProduct[]): BundleResult {
  const originalPrice = products.reduce((sum, item) => sum + item.price, 0);
  const itemCount = products.length;

  let discount = 0;
  if (itemCount >= 5) discount = 0.25;
  else if (itemCount >= 3) discount = 0.15;
  else if (itemCount >= 2) discount = 0.1;

  const sameCategory = new Set(products.map((p) => p.category.toLowerCase())).size === 1;
  if (sameCategory && itemCount >= 2) {
    discount += 0.05;
  }

  if (discount > 0.4) discount = 0.4;

  const savings = originalPrice * discount;
  const finalPrice = originalPrice - savings;

  return {
    products,
    originalPrice,
    discount,
    finalPrice,
    savings,
  };
}
