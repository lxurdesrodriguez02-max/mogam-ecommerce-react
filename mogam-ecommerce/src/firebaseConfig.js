import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA8ZAC0b4Vmx3Vzq_E0-3v9LgKBZL8kfHw",
  authDomain: "mogam-ecommerce.firebaseapp.com",
  projectId: "mogam-ecommerce",
  storageBucket: "mogam-ecommerce.firebasestorage.app",
  messagingSenderId: "197709149929",
  appId: "1:197709149929:web:7ca1a8ba180f6dd18d2278",
  measurementId: "G-F24T7T83DD"
};

export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);

setPersistence(auth, browserSessionPersistence)
  .catch((error) => {
    console.error("Error al configurar la persistencia de sesión:", error);
  });