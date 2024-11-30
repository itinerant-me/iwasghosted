import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCBEpTI5LNUoX-9WbtrVwNiXZqI_5Agdq0",
  authDomain: "quotafits.firebaseapp.com",
  projectId: "quotafits",
  storageBucket: "quotafits.firebasestorage.app",
  messagingSenderId: "48123041541",
  appId: "1:48123041541:web:041f64a99521f76bd5c96c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();