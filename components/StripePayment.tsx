import { useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { loadStripe } from '@stripe/stripe-js';
import { ThemedText } from './ThemedText';
import { auth } from '../config/firebase';
import { SUBSCRIPTION_PRICES } from '../config/stripe';

const stripePromise = loadStripe(process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

export const StripePayment = () => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!auth.currentUser) {
      alert('Please login first');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: SUBSCRIPTION_PRICES.PREMIUM,
          userId: auth.currentUser.uid,
        }),
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      alert('Payment failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity 
      onPress={handlePayment}
      disabled={loading}
      style={{
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
      }}
    >
      {loading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <ThemedText style={{ color: '#ffffff', fontSize: 16 }}>
          Upgrade to Premium
        </ThemedText>
      )}
    </TouchableOpacity>
  );
};