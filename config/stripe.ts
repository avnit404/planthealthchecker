
import Stripe from 'stripe';

const isServer = typeof window === 'undefined';
const stripeSecretKey = process.env.EXPO_PUBLIC_STRIPE_SECRET_KEY as string;

export const stripe = isServer ? new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16',
}) : null;

export const SUBSCRIPTION_PRICES = {
  PREMIUM: process.env.EXPO_PUBLIC_STRIPE_PREMIUM_PRICE_ID as string,
};
