import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

// Attempt to initialize Firebase Admin
try {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

    if (serviceAccountPath) {
        // Option 1: Provide path to serviceAccountKey.json
        const fullPath = path.resolve(process.cwd(), serviceAccountPath);
        admin.initializeApp({
            credential: admin.credential.cert(fullPath)
        });
        console.log('[Firebase Admin] Initialized via service account file.');
    } else if (process.env.FIREBASE_PROJECT_ID) {
        // Option 2: Provide specific credentials via ENV vars
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                // Handle newlines in the private key appropriately
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            })
        });
        console.log('[Firebase Admin] Initialized via environment variables.');
    } else {
        // Fallback for local development if the developer hasn't set it up yet,
        // although calls to verify token will fail.
        console.warn('[Firebase Admin] No credentials provided. Token verification will fail.');
        admin.initializeApp();
    }
} catch (error) {
    console.error('[Firebase Admin] Initialization error:', error);
}

export const firebaseAdmin = admin;
