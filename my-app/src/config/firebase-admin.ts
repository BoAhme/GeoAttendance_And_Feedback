import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth }      from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage }   from 'firebase-admin/storage';
import { readFileSync }  from 'fs';
import { resolve }       from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

function buildCredential() {
  // Option A: load from JSON key file
  const filePath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (filePath) {
    return JSON.parse(readFileSync(resolve(filePath), 'utf-8'));
  }

  // Option B: individual env vars
  const projectId   = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey  = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Firebase credentials not found. Set FIREBASE_SERVICE_ACCOUNT_PATH or ' +
      'FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY in .env'
    );
  }

  return { projectId, clientEmail, privateKey };
}

const app = initializeApp({ credential: cert(buildCredential()) });

export const adminAuth    = getAuth(app);
export const adminDb      = getFirestore(app);
export const adminStorage = getStorage(app);

export default app;
