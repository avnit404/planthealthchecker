
import { stripe } from '../../../config/stripe';

// Default export for Expo Router
export default function Page() {
  return null;
}

// API route handler
export async function POST(req: Request) {
  try {
    const { priceId, userId } = await req.json();

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      success_url: `${process.env.EXPO_PUBLIC_APP_URL}/payment-success`,
      cancel_url: `${process.env.EXPO_PUBLIC_APP_URL}/payment-cancelled`,
      metadata: {
        userId,
      },
    });

    return Response.json({ url: session.url });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
