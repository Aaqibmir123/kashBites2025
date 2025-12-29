import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBuPyGWKw8vfw-mAX6RuFipIIzfzXzm3Jw",
  authDomain: "authentication-food-delivery.firebaseapp.com",
  projectId: "authentication-food-delivery",
  storageBucket: "authentication-food-delivery.firebasestorage.app",
  messagingSenderId: "339557457208",
  appId: "1:339557457208:web:69f4d055e61a5bcac475cd",
};

const app = initializeApp(firebaseConfig);

// ✅ AUTH EXPORT (OTP ke liye)
export const auth = getAuth(app);
