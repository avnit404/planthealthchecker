import { stripe } from '../../config/stripe';

export async function POST(req: Request) {
  try {
    const { priceId, userId } = await req.json();

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      success_url: `${process.env.EXPO_PUBLIC_APP_URL}/profile?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.EXPO_PUBLIC_APP_URL}/profile`,
      metadata: {
        userId,
      },
    });

    return Response.json({ sessionId: session.id });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}