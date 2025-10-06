'use client';

// This file is now deprecated and no longer needed due to the new singleton pattern.
// Its functionality is handled by the direct imports in `src/firebase/index.ts`.
// You may remove this file from your project.
import { firebaseApp, firestore, auth } from '.';
import { FirebaseProvider } from './provider';

/**
 * @deprecated This provider is no longer necessary. Firebase is initialized via a singleton in src/firebase/index.ts.
 */
export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseProvider
      firebaseApp={firebaseApp}
      firestore={firestore}
      auth={auth}
    >
      {children}
    </FirebaseProvider>
  );
}
