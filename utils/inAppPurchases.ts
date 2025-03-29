
import { Platform } from 'react-native';
import * as InAppPurchases from 'expo-in-app-purchases';

const PREMIUM_PLAN_ID = 'YOUR_PRODUCT_ID';

const isNativePlatform = Platform.OS === 'ios' || Platform.OS === 'android';

export async function initializePurchases() {
  try {
    if (!isNativePlatform) {
      console.log('In-app purchases are only available on iOS and Android');
      return false;
    }
    
    if (Platform.OS === 'ios') {
      // iOS-specific initialization
      await InAppPurchases.connectAsync();
    } else if (Platform.OS === 'android') {
      // Android-specific initialization using Stripe
      await InAppPurchases.connectAsync();
    }
    return true;
  } catch (error) {
    console.log('Failed to initialize in-app purchases:', error);
    return false;
  }
}

export async function getProducts() {
  try {
    if (!isNativePlatform) {
      return [];
    }
    const { responseCode, results } = await InAppPurchases.getProductsAsync([PREMIUM_PLAN_ID]);
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
    if (!isNativePlatform) {
      console.log('In-app purchases are only available on iOS and Android');
      return null;
    }
    const { responseCode, results } = await InAppPurchases.purchaseItemAsync(PREMIUM_PLAN_ID);
    if (responseCode === InAppPurchases.IAPResponseCode.OK) {
      return results[0];
    }
    return null;
  } catch (error) {
    console.log('Purchase failed:', error);
    return null;
  }
}
