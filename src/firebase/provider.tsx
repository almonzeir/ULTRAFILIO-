'use client';

import { createContext, useContext } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';
import type { Auth } from 'firebase/auth';
// Import the singleton instances to provide them if needed, though direct import is now preferred.
import { firebaseApp, firestore, auth as singletonAuth } from '@/firebase';


interface FirebaseContextValue {
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
}

const FirebaseContext = createContext<FirebaseContextValue>({
  firebaseApp: firebaseApp,
  firestore: firestore,
  auth: singletonAuth,
});

export function FirebaseProvider({
  children,
  ...value
}: {
  children: React.ReactNode;
} & Partial<FirebaseContextValue>) {
  // The provider now simply passes through the singleton instances.
  // This makes it mostly obsolete but provides backward compatibility.
  const contextValue = {
    firebaseApp: value.firebaseApp || firebaseApp,
    firestore: value.firestore || firestore,
    auth: value.auth || singletonAuth,
  }
  return (
    <FirebaseContext.Provider value={contextValue}>{children}</FirebaseContext.Provider>
  );
}

// These hooks will now return the stable, singleton instances.
export const useFirebase = () => useContext(FirebaseContext);
export const useFirebaseApp = () => useContext(FirebaseContext).firebaseApp;
export const useFirestore = () => useContext(FirebaseContext).firestore;
export const useAuth = () => useContext(FirebaseContext).auth;
