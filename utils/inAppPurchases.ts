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
  return true;
}

export async function getProducts() {
  return [];
}

export async function purchasePremium() {
  Alert.alert(
    "Coming Soon",
    "Payment integration will be added in future updates.",
    [{ text: "OK" }]
  );
  return null;
}