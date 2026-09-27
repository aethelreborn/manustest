export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? "AIzaSyA7ziBxrGx4hwaCkARTV_eMfJs-d_uQbS8",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "aethelreborn-de93f.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? "aethelreborn-de93f",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "aethelreborn-de93f.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "706233355279",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? "1:706233355279:web:0fc3e65a809173e0eda77a",
};

export const firebaseGoogleWebClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? "706233355279-8td5rshrerup0vcse6u6qs69021pv0r2.apps.googleusercontent.com";
export const firebaseServerProjectId = process.env.FIREBASE_PROJECT_ID ?? firebaseConfig.projectId;
