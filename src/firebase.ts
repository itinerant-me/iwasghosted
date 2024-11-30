import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBEpTI5LNUoX-9WbtrVwNiXZqI_5Agdq0",
  authDomain: "quotafits.firebaseapp.com",
  projectId: "quotafits",
  storageBucket: "quotafits.firebasestorage.app",
  messagingSenderId: "48123041541",
  appId: "1:48123041541:web:041f64a99521f76bd5c96c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
