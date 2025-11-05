
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Configuración de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBnTNgYhcV2kNXM7twL6iTN5q0iDNdzKWk",
  authDomain: "pf2025iig1munozjoan-olmoskevin.firebaseapp.com",
  projectId: "pf2025iig1munozjoan-olmoskevin",
  storageBucket: "pf2025iig1munozjoan-olmoskevin.appspot.com",
  messagingSenderId: "527089688559",
  appId: "1:527089688559:web:fcc2e213b79b8a8370601a",
};

// Inicializamos la app
const app = initializeApp(firebaseConfig);

// Exportamos las instancias principales
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
export default app;
