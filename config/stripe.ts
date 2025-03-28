
import Stripe from 'stripe';

const isClient = typeof window !== 'undefined';
const stripeOptions: Stripe.StripeConfig = {
  apiVersion: '2023-10-16',
  typescript: true,
  appInfo: {
    name: 'Plant Identifier',
    version: '1.0.0',
  },
};

if (!isClient) {
  stripeOptions.httpClient = Stripe.createFetchHttpClient();
}

export const stripe = new Stripe(process.env.EXPO_PUBLIC_STRIPE_SECRET_KEY!, stripeOptions);

export const SUBSCRIPTION_PRICES = {
  PREMIUM: process.env.EXPO_PUBLIC_STRIPE_PREMIUM_PRICE_ID as string,
};
