import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Replace with your Firebase project config
// Go to https://console.firebase.google.com → your project → Project Settings → Your apps → Web app → Config
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

export const isFirebaseConfigured = !!firebaseConfig.apiKey;

const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null!;
export const db = isFirebaseConfigured ? getFirestore(app) : null!;
export const storage = isFirebaseConfigured ? getStorage(app) : null!;
