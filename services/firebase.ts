import * as firebaseAppModule from 'firebase/app';
import { getAuth, Auth, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { FIREBASE_CONFIG } from '../constants';

// Cast module to any to avoid TypeScript errors regarding missing exported members
const firebaseApp = firebaseAppModule as any;

let app: any | undefined;
let db: Firestore | null = null;
let auth: Auth | null = null;

if (FIREBASE_CONFIG) {
  try {
    const apps = firebaseApp.getApps ? firebaseApp.getApps() : [];
    if (apps.length === 0) {
        app = firebaseApp.initializeApp(FIREBASE_CONFIG);
    } else {
        app = firebaseApp.getApp ? firebaseApp.getApp() : apps[0];
    }
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (error) {
    console.warn("Firebase initialization failed:", error);
  }
} else {
  console.warn("No Firebase config provided. Running in offline/demo mode.");
}

export { db, auth, app };

export const initAuth = async () => {
  if (!auth) return;
  try {
    if (typeof (window as any).__initial_auth_token !== 'undefined' && (window as any).__initial_auth_token) {
      await signInWithCustomToken(auth, (window as any).__initial_auth_token);
    } else {
      await signInAnonymously(auth);
    }
  } catch (e) {
    console.error("Auth Init Failed", e);
  }
};