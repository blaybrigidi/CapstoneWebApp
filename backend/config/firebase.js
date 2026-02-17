const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Firebase Admin
// Ideally, use a service account key file for full backend privileges
// For now, we'll try to use the environment variables or a path to the key

try {
    let serviceAccount;
    if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
        serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
    } else if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        // Fallback or development mock instructions
        console.warn("⚠️ No FIREBASE_SERVICE_ACCOUNT_PATH or GOOGLE_APPLICATION_CREDENTIALS found in .env. using default app credentials if available, or this may fail.");
    }

    if (!admin.apps.length) {
        admin.initializeApp({
            credential: serviceAccount ? admin.credential.cert(serviceAccount) : admin.credential.applicationDefault(),
            // databaseURL: "https://your-project-id.firebaseio.com" // Only needed for Realtime DB
        });
    }
} catch (error) {
    console.error("Firebase Admin Initialization Error:", error);
}

const db = admin.firestore();
// const rtdb = admin.database(); // Removed as it requires databaseURL

module.exports = { admin, db };
