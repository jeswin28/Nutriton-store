import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, User as FirebaseAuthUser } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { UserProfile } from './firebaseTypes';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

// Helper function to represent a full user (Auth + Profile)
export type AppUser = {
    auth: FirebaseAuthUser;
    profile: UserProfile;
} | null;

// The types are now centralized in firebaseTypes.ts
export * from './firebaseTypes';