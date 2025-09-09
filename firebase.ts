import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCYTFLFDrG5XVJTZ3Df-T7GMs-2cvKeCNY",
  authDomain: "scan-genie-app.firebaseapp.com",
  projectId: "scan-genie-app",
  storageBucket: "scan-genie-app.firebasestorage.app",
  messagingSenderId: "802460040576",
  appId: "1:802460040576:web:fc2747a74b79e98ed71565"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
