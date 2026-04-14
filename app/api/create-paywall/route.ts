import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "STRIPE_SECRET_KEY not configured" }, { status: 500 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { typescript: true });
    const { title, price, redirectUrl } = await req.json();

    const product = await stripe.products.create({
      name: title,
    });

    const priceObj = await stripe.prices.create({
      unit_amount: price * 100,
      currency: "usd",
      product: product.id,
    });

    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: priceObj.id,
          quantity: 1,
        },
      ],
      after_completion: {
        type: "redirect",
        redirect: {
          url: redirectUrl,
        },
      },
    });

    return NextResponse.json({ url: paymentLink.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create paywall" }, { status: 500 });
  }
}
