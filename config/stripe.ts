
import Stripe from 'stripe';

const stripeSecretKey = process.env.EXPO_PUBLIC_STRIPE_SECRET_KEY as string;

const stripeOptions = {
  apiVersion: '2023-10-16',
  typescript: true,
  appInfo: {
    name: 'Plant Identifier',
    version: '1.0.0',
  },
};

export const stripe = new Stripe(stripeSecretKey, stripeOptions);

export const SUBSCRIPTION_PRICES = {
  PREMIUM: process.env.EXPO_PUBLIC_STRIPE_PREMIUM_PRICE_ID as string,
};
