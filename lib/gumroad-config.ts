// Gumroad Product Links Configuration
// Replace these placeholder URLs with your actual Gumroad product links
// after creating products in your Gumroad account

export const GUMROAD_LINKS = {
  // Subscription Plans
  subscriptions: {
    starter: process.env.NEXT_PUBLIC_GUMROAD_STARTER || '#',
    essential: process.env.NEXT_PUBLIC_GUMROAD_ESSENTIAL || '#',
    creator: process.env.NEXT_PUBLIC_GUMROAD_CREATOR || '#',
    professional: process.env.NEXT_PUBLIC_GUMROAD_PROFESSIONAL || '#',
    business: process.env.NEXT_PUBLIC_GUMROAD_BUSINESS || '#',
  },
  // Credit Bundles
  credits: {
    bundle50: process.env.NEXT_PUBLIC_GUMROAD_CREDITS_50 || '#',
    bundle100: process.env.NEXT_PUBLIC_GUMROAD_CREDITS_100 || '#',
    bundle250: process.env.NEXT_PUBLIC_GUMROAD_CREDITS_250 || '#',
  },
}

// Helper function to get Gumroad button props
export function getGumroadButtonProps(link: string) {
  return {
    href: link,
    className: 'gumroad-button',
    'data-gumroad-single-product': 'true',
  }
}
