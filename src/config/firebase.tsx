import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBiEUMvAU19_HOyDYslbR40npTa10SX9lg",
  authDomain: "seniorproject-610c9.firebaseapp.com",
  projectId: "seniorproject-610c9",
  storageBucket: "seniorproject-610c9.appspot.com",
  messagingSenderId: "872436042169",
  appId: "1:872436042169:web:4716ec629782a588748e68"
};

const app: FirebaseApp = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const db = getDatabase(app);
export const dbFireStore = getFirestore(app);
export const storage = getStorage(app);
