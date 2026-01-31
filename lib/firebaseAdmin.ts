import admin from 'firebase-admin';

// Initialize Firebase Admin SDK (server-side only)
if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

// Get Firestore instance (for server-side operations)
const adminDb = admin.firestore();

// Get Auth instance (for server-side operations)
const adminAuth = admin.auth();

export { admin, adminDb, adminAuth };
