import admin from "firebase-admin";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Parse the service account JSON from the `.env` file
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
});

console.log("🔥 Firebase Admin Initialized!");

export default admin;
