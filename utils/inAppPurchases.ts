
import * as InAppPurchases from 'expo-in-app-purchases';

// Product IDs from App Store Connect
const PREMIUM_PLAN_ID = 'YOUR_PRODUCT_ID';

export async function initializePurchases() {
  try {
    if (!InAppPurchases) {
      console.log('InAppPurchases module not available');
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
