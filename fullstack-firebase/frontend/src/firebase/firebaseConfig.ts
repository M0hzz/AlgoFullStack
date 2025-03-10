import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-app.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-app.appspot.com",
    messagingSenderId: "your-messaging-id",
    appId: "your-app-id",
};

// ✅ Initialize Firebase
export const initializeFirebase = () => {
    initializeApp(firebaseConfig);
};
