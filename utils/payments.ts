
import { Platform } from 'react-native';
import * as InAppPurchases from 'expo-in-app-purchases';
import { initStripe, presentPaymentSheet } from '@stripe/stripe-react-native';

const STRIPE_PUBLISHABLE_KEY = 'pk_test_51OoJDASHG5JIxxLCBWUfxSrF5v4Y9fYD8ZQ7tLNX3Z9XJsJKL2Q3M'; // Replace with your actual Stripe key
const IOS_PREMIUM_PLAN_ID = 'com.yourapp.premium'; // Replace with your actual iOS product ID

export const initializePayments = async () => {
  if (Platform.OS === 'ios') {
    try {
      await InAppPurchases.connectAsync();
    } catch (error) {
      console.error('Failed to connect to App Store:', error);
    }
  } else {
    try {
      await initStripe({ publishableKey: STRIPE_PUBLISHABLE_KEY });
    } catch (error) {
      console.error('Failed to initialize Stripe:', error);
    }
  }
};

export const purchasePremium = async () => {
  if (Platform.OS === 'ios') {
    try {
      const { responseCode, results } = await InAppPurchases.getProductsAsync([IOS_PREMIUM_PLAN_ID]);
      if (responseCode === InAppPurchases.IAPResponseCode.OK) {
        const purchase = await InAppPurchases.purchaseItemAsync(IOS_PREMIUM_PLAN_ID);
        return purchase.responseCode === InAppPurchases.IAPResponseCode.OK;
      }
      return false;
    } catch (error) {
      console.error('iOS purchase failed:', error);
      return false;
    }
  } else {
    try {
      // Fetch payment intent from your backend
      const response = await fetch('https://your-replit-backend.repl.co/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 999, currency: 'usd' }) // $9.99
      });
      const { clientSecret } = await response.json();
      
      const { error } = await presentPaymentSheet({ clientSecret });
      return !error;
    } catch (error) {
      console.error('Android purchase failed:', error);
      return false;
    }
  }
};
