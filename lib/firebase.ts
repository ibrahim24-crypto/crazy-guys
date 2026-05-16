import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;

function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = initializeApp(firebaseConfig);
  }
  return app;
}

export function getAuthInstance(): Auth {
  return getAuth(getFirebaseApp());
}

export function getDbInstance(): Firestore {
  return getFirestore(getFirebaseApp());
}

export function getStorageInstance(): FirebaseStorage {
  return getStorage(getFirebaseApp());
}

// Legacy exports for backward compatibility — only work on client side
export const auth = typeof window !== 'undefined' ? getAuthInstance() : undefined as unknown as Auth;
export const db = typeof window !== 'undefined' ? getDbInstance() : undefined as unknown as Firestore;
export const storage = typeof window !== 'undefined' ? getStorageInstance() : undefined as unknown as FirebaseStorage;

export default app;
