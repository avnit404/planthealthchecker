
import { initializeApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';

const firebaseConfig = {
  // Add your Firebase config here from Firebase Console
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
