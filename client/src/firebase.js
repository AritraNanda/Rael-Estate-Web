// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-4a1e8.firebaseapp.com",
  projectId: "real-estate-4a1e8",
  storageBucket: "real-estate-4a1e8.firebasestorage.app",
  messagingSenderId: "805055671204",
  appId: "1:805055671204:web:86d9425b1865290c176f31"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);