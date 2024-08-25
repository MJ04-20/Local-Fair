import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDQinzR7M7z7TlX39-dX8HGdD1yoejyn0E",
  authDomain: "fire-860d4.firebaseapp.com",
  projectId: "fire-860d4",
  storageBucket: "fire-860d4.appspot.com",
  messagingSenderId: "800085582989",
  appId: "1:800085582989:web:b80b45ada42e3132b62ec4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);


