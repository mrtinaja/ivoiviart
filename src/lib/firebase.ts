// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FB_PROJECT_ID,
  // OJO: el bucket va aparte, no en firebaseConfig
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);

// Forzamos el bucket real (*.appspot.com), NO el dominio *.firebasestorage.app
const bucket =
  import.meta.env.VITE_FB_STORAGE_BUCKET ||
  `${import.meta.env.VITE_FB_PROJECT_ID}.appspot.com`;

export const storage = getStorage(app, `gs://${bucket}`);
