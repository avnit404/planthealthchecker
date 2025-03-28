
import * as InAppPurchases from 'expo-in-app-purchases';

// Product IDs from App Store Connect
const PREMIUM_PLAN_ID = 'YOUR_PRODUCT_ID';

export async function initializePurchases() {
  try {
    await InAppPurchases.connectAsync();
  } catch (error) {
    console.error('Failed to connect to the store:', error);
  }
}

export async function getProducts() {
  try {
    const { responseCode, results } = await InAppPurchases.getProductsAsync([PREMIUM_PLAN_ID]);
    if (responseCode === InAppPurchases.IAPResponseCode.OK) {
      return results;
    }
    return [];
  } catch (error) {
    console.error('Failed to get products:', error);
    return [];
  }
}

export async function purchasePremium() {
  try {
    const { responseCode, results } = await InAppPurchases.purchaseItemAsync(PREMIUM_PLAN_ID);
    if (responseCode === InAppPurchases.IAPResponseCode.OK) {
      return results[0];
    }
    return null;
  } catch (error) {
    console.error('Purchase failed:', error);
    return null;
  }
}
