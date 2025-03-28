
import Stripe from 'stripe';

const stripeOptions = {
  apiVersion: '2023-10-16',
  httpClient: typeof window !== 'undefined' ? undefined : Stripe.createNodeHttpClient(),
};

export const stripe = new Stripe(process.env.EXPO_PUBLIC_STRIPE_SECRET_KEY as string, stripeOptions);

export const SUBSCRIPTION_PRICES = {
  PREMIUM: process.env.EXPO_PUBLIC_STRIPE_PREMIUM_PRICE_ID as string,
};
