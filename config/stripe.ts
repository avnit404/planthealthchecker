
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.EXPO_PUBLIC_STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
});

export const SUBSCRIPTION_PRICES = {
  PREMIUM: process.env.EXPO_PUBLIC_STRIPE_PREMIUM_PRICE_ID as string,
};
