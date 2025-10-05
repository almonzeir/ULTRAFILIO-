import { getApp, getApps, initializeApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage'; // Import getStorage and FirebaseStorage
import { firebaseConfig } from './config';

import { FirebaseProvider } from './provider';
import { useCollection } from './firestore/use-collection';
import { useDoc } from './firestore/use-doc';
import { useUser } from './auth/use-user';

let db: Firestore;
let storage: FirebaseStorage;
let auth: Auth;

export function initializeFirebase(): {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  storage: FirebaseStorage;
} {
  const firebaseApp = !getApps().length
    ? initializeApp(firebaseConfig)
    : getApp();
  db = getFirestore(firebaseApp);
  auth = getAuth(firebaseApp);
  storage = getStorage(firebaseApp); // Initialize Firebase Storage

  return { firebaseApp, firestore: db, auth, storage };
}

// Export db, storage, and auth directly
export { db, storage, auth };

export * from './provider';
export { FirebaseProvider, useCollection, useDoc, useUser };
