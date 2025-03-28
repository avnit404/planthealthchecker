
import Stripe from 'stripe';

const stripeSecretKey = process.env.EXPO_PUBLIC_STRIPE_SECRET_KEY!;

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16',
  typescript: true,
  maxNetworkRetries: 3,
});

export { stripe };

export const SUBSCRIPTION_PRICES = {
  PREMIUM: process.env.EXPO_PUBLIC_STRIPE_PREMIUM_PRICE_ID as string,
};
