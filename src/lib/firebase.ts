import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,                  // opcional
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, // opcional
};

// Falla temprano si falta algo importante
(["apiKey","authDomain","projectId","storageBucket"] as const).forEach((k) => {
  // @ts-ignore
  if (!cfg[k]) throw new Error(`[Firebase config] Falta ${k}. Revisá .env.local`);
});

const app = getApps().length ? getApps()[0] : initializeApp(cfg);
export const db = getFirestore(app);
export const storage = getStorage(app);
