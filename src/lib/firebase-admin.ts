import * as admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : null;

if (!getApps().length) {
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  } else {
    console.warn('Firebase Admin SDK not initialized: Missing service account key. Server-side Firebase features will not work.');
  }
}

export const adminDb = admin.firestore();
export const adminStorage = admin.storage();
