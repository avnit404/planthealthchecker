
import { stripe } from '../../config/stripe';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { priceId, userId } = req.body;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      success_url: `${process.env.EXPO_PUBLIC_APP_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.EXPO_PUBLIC_APP_URL}/payment-cancelled`,
      client_reference_id: userId,
    });

    res.json({ sessionId: session.id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
