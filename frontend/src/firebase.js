import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBDHfPOfteZjFA4pGAVBuwmj956Gj1ewaI",
  authDomain: "codesync-c3320.firebaseapp.com",
  projectId: "codesync-c3320",
  storageBucket: "codesync-c3320.firebasestorage.app",
  messagingSenderId: "627774499797",
  appId: "1:627774499797:web:f7d45ba6fef17f1ebb6b5c",
  measurementId: "G-3CY60578P4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);
export { auth };
