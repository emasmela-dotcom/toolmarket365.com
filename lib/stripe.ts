import Stripe from 'stripe'

/** Server-side Stripe client. Only set when STRIPE_SECRET_KEY is defined. */
export const stripe: Stripe | null = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { typescript: true })
  : null
