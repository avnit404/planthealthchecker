
import { stripe } from '../../config/stripe';
import { Response } from 'express';

export default async function handler(req: Request) {
  try {
    const { priceId, userId } = await req.json();

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      success_url: `${process.env.EXPO_PUBLIC_APP_URL}/(tabs)/profile?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.EXPO_PUBLIC_APP_URL}/(tabs)/profile`,
      client_reference_id: userId,
      metadata: {
        userId: userId,
      },
    });

    return new Response(JSON.stringify({ sessionId: session.id }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
