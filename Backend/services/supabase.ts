import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_f9SwUswhUK36ig_D9L26vQFTv_iCp5s",
  authDomain: "agrox-aae2a.firebaseapp.com",
  databaseURL: "https://agrox-aae2a-default-rtdb.firebaseio.com",
  projectId: "agrox-aae2a",
  storageBucket: "agrox-aae2a.firebasestorage.app",
  messagingSenderId: "266693709737",
  appId: "1:266693709737:web:8e83f002ef6621ad8d3eb8",
  measurementId: "G-T23JCN5CVE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
