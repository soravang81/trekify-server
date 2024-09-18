import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
import admin from 'firebase-admin';
import serviceAccount from './firebaseadmin.json';

const firebaseConfig = {
  apiKey: "AIzaSyCHyfEhJ7449jY4bX-lyXXJuf5h5zuB1Mk",
  authDomain: "travelwebsite-22879.firebaseapp.com",
  projectId: "travelwebsite-22879",
  storageBucket: "travelwebsite-22879.appspot.com",
  messagingSenderId: "1094696849263",
  appId: "1:1094696849263:web:9b13eb093a851632cd229a",
  measurementId: "G-S9NCWDPLF1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export const adminAuth = admin.auth();
// console.log("adminAuth", admin.auth())
  
