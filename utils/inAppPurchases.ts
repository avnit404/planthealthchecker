import { Platform, Alert } from 'react-native';

let InAppPurchases: any;

const showSetupAlert = () => {
  Alert.alert(
    "Setup Required",
    "In-app purchases require proper configuration in App Store/Play Store. Please ensure you have set up the necessary credentials.",
    [{ text: "OK" }]
  );
};

// For web, mock the implementation
const webMock = {
  connectAsync: async () => false,
  getProductsAsync: async () => [],
  purchaseItemAsync: async () => null,
};

// Dynamically import expo-in-app-purchases only on native platforms
async function getInAppPurchases() {
  if (Platform.OS === 'web') {
    return webMock;
  }
  if (!InAppPurchases) {
    InAppPurchases = (await import('expo-in-app-purchases')).default;
  }
  return InAppPurchases;
}

export async function initializePurchases() {
  try {
    const iap = await getInAppPurchases();
    if (Platform.OS === 'web') {
      console.log('In-app purchases are not supported on web');
      return false;
    }
    await iap.connectAsync();
    return true;
  } catch (error) {
    console.log('Failed to initialize in-app purchases:', error);
    return false;
  }
}

export async function getProducts() {
  try {
    const iap = await getInAppPurchases();
    // Replace these IDs with your actual product IDs from App Store/Play Store
    const PRODUCT_IDS = {
      ios: 'YOUR_IOS_PRODUCT_ID',
      android: 'YOUR_ANDROID_PRODUCT_ID'
    };

    const productId = Platform.select({
      ios: PRODUCT_IDS.ios,
      android: PRODUCT_IDS.android,
      default: 'premium_subscription'
    });

    const products = await iap.getProductsAsync([productId]);
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

    const iap = await getInAppPurchases();
    // Replace these IDs with your actual product IDs from App Store/Play Store
    const PRODUCT_IDS = {
      ios: 'YOUR_IOS_PRODUCT_ID',
      android: 'YOUR_ANDROID_PRODUCT_ID'
    };

    const productId = Platform.select({
      ios: PRODUCT_IDS.ios,
      android: PRODUCT_IDS.android,
      default: 'premium_subscription'
    });

    const products = await iap.getProductsAsync([productId]);

    if (!products || products.length === 0) {
      showSetupAlert();
      return null;
    }

    const result = await iap.purchaseItemAsync(productId);
    return result;
  } catch (error) {
    console.log('Purchase failed:', error);
    showSetupAlert();
    return null;
  }
}