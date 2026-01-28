// Gumroad Product Links Configuration
// Replace these placeholder URLs with your actual Gumroad product links
// after creating products in your Gumroad account

export const GUMROAD_LINKS = {
  // Subscription Plans
  subscriptions: {
    starter: process.env.NEXT_PUBLIC_GUMROAD_STARTER || 'https://masela.gumroad.com/l/creatorflow365-starter',
    essential: process.env.NEXT_PUBLIC_GUMROAD_ESSENTIAL || 'https://masela.gumroad.com/l/creatorflow365-essential',
    creator: process.env.NEXT_PUBLIC_GUMROAD_CREATOR || 'https://masela.gumroad.com/l/creatorflow365-creator', // $49 plan (was Professional)
    professional: process.env.NEXT_PUBLIC_GUMROAD_PROFESSIONAL || 'https://masela.gumroad.com/l/creatorflow365-professional', // $79 plan (was Creator)
    business: process.env.NEXT_PUBLIC_GUMROAD_BUSINESS || 'https://masela.gumroad.com/l/creatorflow365-business',
  },
  // Credit Bundles
  credits: {
    bundle50: process.env.NEXT_PUBLIC_GUMROAD_CREDITS_50 || 'https://masela.gumroad.com/l/credits-50',
    bundle100: process.env.NEXT_PUBLIC_GUMROAD_CREDITS_100 || 'https://masela.gumroad.com/l/credits-100',
    bundle250: process.env.NEXT_PUBLIC_GUMROAD_CREDITS_250 || 'https://masela.gumroad.com/l/credits-250',
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
