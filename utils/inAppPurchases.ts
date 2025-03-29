import { Platform } from 'react-native';
import * as InAppPurchases from 'expo-in-app-purchases';

export async function initializePurchases() {
  try {
    if (Platform.OS === 'web') {
      console.log('In-app purchases are not supported on web');
      return false;
    }
    await InAppPurchases.connectAsync();
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
    const products = await InAppPurchases.getProductsAsync(['premium_subscription']);
    return products;
  } catch (error) {
    console.log('Failed to get products:', error);
    return [];
  }
}

export async function purchasePremium() {
  try {
    if (Platform.OS === 'web') {
      return null;
    }
    const result = await InAppPurchases.purchaseItemAsync('premium_subscription');
    return result;
  } catch (error) {
    console.log('Purchase failed:', error);
    return null;
  }
}