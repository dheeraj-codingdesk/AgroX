import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "API",
  authDomain: "auth domain",
  databaseURL: "database url",
  projectId: "agrox-aae2a",
  storageBucket: "agrox-aae2a.firebasestorage.app",
  messagingSenderId: "266693709737",
  appId: "appid",
  measurementId: "G-T23JCN5CVE  "
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
