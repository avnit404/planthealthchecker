
import { stripe } from '../config/stripe';

export async function createCheckoutSession(priceId: string, userId: string) {
  try {
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

    return { sessionId: session.id };
  } catch (error: any) {
    throw new Error(error.message);
  }
}
