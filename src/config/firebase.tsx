import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getDatabase } from "firebase/database";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
  databaseURL: string;
}

export const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyCFRuD2fTRy-yWvTCQpskBiuuI4s3cD970",
  authDomain: "cmuexplore.firebaseapp.com",
  projectId: "cmuexplore",
  storageBucket: "cmuexplore.appspot.com",
  messagingSenderId: "932189639366",
  appId: "1:932189639366:web:f1f61602cf620f68037dc7",
  measurementId: "G-5ZVBDTSZ68",
  
  databaseURL:"https://cmuexplore-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

const app: FirebaseApp = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const db = getDatabase(app);
