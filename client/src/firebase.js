// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "urbannest-62f48.firebaseapp.com",
    projectId: "urbannest-62f48",
    storageBucket: "urbannest-62f48.firebasestorage.app",
    messagingSenderId: "933209603659",
    appId: "1:933209603659:web:fa521e052255f6e66797ce"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);