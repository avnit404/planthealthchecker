
import { Platform } from 'react-native';
import * as InAppPurchases from 'expo-in-app-purchases';

// Product IDs from App Store Connect
const PREMIUM_PLAN_ID = 'YOUR_PRODUCT_ID';

// Mock implementation for web platform
const mockInAppPurchases = {
  connectAsync: async () => true,
  getProductsAsync: async () => [],
  purchaseItemAsync: async () => null,
};

const purchases = Platform.select({
  web: mockInAppPurchases,
  default: InAppPurchases,
});

export async function initializePurchases() {
  try {
    if (Platform.OS === 'web') {
      console.log('In-app purchases are not available on web');
      return true;
    }
    await purchases.connectAsync();
    return true;
  } catch (error) {
    console.log('Failed to initialize in-app purchases:', error);
    return false;
  }
}

export async function getProducts() {
  try {
    if (Platform.OS === 'web') {
      return [];
    }
    const { responseCode, results } = await purchases.getProductsAsync([PREMIUM_PLAN_ID]);
    if (responseCode === InAppPurchases.IAPResponseCode.OK) {
      return results;
    }
    return [];
  } catch (error) {
    console.log('Failed to get products:', error);
    return [];
  }
}

export async function purchasePremium() {
  try {
    if (Platform.OS === 'web') {
      console.log('In-app purchases are not available on web');
      return null;
    }
    const { responseCode, results } = await purchases.purchaseItemAsync(PREMIUM_PLAN_ID);
    if (responseCode === InAppPurchases.IAPResponseCode.OK) {
      return results[0];
    }
    return null;
  } catch (error) {
    console.log('Purchase failed:', error);
    return null;
  }
}
