import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import path from 'path';
import fs from 'fs';

if (getApps().length === 0) {
  try {
    const keyPath = path.join(process.cwd(), 'firebase-service-account.json');
    if (fs.existsSync(keyPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
      initializeApp({
        credential: cert(serviceAccount)
      });
      console.log('Firebase Admin initialized locally using service account file.');
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      initializeApp({
        credential: cert(serviceAccount)
      });
      console.log('Firebase Admin initialized using environment variable.');
    } else {
      initializeApp();
      console.log('Firebase Admin initialized using default credentials.');
    }
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export const db = getFirestore();
export const auth = getAuth();
