
import { stripe } from '../../config/stripe';
import { NextResponse } from 'next/server';

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
      success_url: `${process.env.EXPO_PUBLIC_APP_URL}/(tabs)/profile?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.EXPO_PUBLIC_APP_URL}/(tabs)/profile`,
      client_reference_id: userId,
      metadata: {
        userId: userId,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
