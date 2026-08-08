// Firebase project setup
// 1. Go to https://console.firebase.google.com -> Create project
// 2. Add a Web App, copy the config values below
// 3. Enable: Authentication (Email/Password), Firestore Database, Storage
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDep4hEiaDKl2eu20SCwt43Zt06HpmxLoE",
  authDomain: "school-manager-c02c4.firebaseapp.com",
  projectId: "school-manager-c02c4",
  storageBucket: "school-manager-c02c4.firebasestorage.app",
  messagingSenderId: "565249198743",
  appId: "1:565249198743:web:ed87f0f799f7499875b7d2",
  measurementId: "G-XST5CRL7G8",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
